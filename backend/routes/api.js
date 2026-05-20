const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Estagiario, Usuario } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'chave_super_secreta_infrawiki';

router.post('/auth/registro', async (req, res) => {
  try {
    const { usuario, email, senha } = req.body;
    
    const usuarioExistente = await Usuario.findOne({ $or: [{ email }, { usuario }] });
    if (usuarioExistente) return res.status(400).json({ error: 'Email ou Usuário já cadastrado' });

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    
    const role = usuario === 'admin' ? 'admin' : 'user';

    const novoUsuario = new Usuario({ usuario, email, senha: senhaHash, role });
    await novoUsuario.save();

    const nomeFormatado = usuario.charAt(0).toUpperCase() + usuario.slice(1);

    const novoEstagiario = new Estagiario({
      usuarioId: novoUsuario._id.toString(),
      nome: nomeFormatado,
      area: 'Engenharia Civil',
      foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeFormatado)}&background=10B981&color=fff&size=256`,
      bio: "",
      projetos: []
    });
    await novoEstagiario.save();

    res.json({ message: 'Usuário criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const userDb = await Usuario.findOne({ usuario });
    if (!userDb) return res.status(400).json({ error: 'Credenciais inválidas' });

    const senhaValida = await bcrypt.compare(senha, userDb.senha);
    if (!senhaValida) return res.status(400).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: userDb._id, role: userDb.role }, JWT_SECRET, { expiresIn: '1d' });
    
    const perfil = await Estagiario.findOne({ usuarioId: userDb._id.toString() });
    const perfilId = perfil ? perfil._id : null;

    res.json({ token, usuario: { id: userDb._id, usuario: userDb.usuario, email: userDb.email, perfilId, role: userDb.role } });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

router.get('/estagiarios', async (req, res) => {
  try {
    const estagiarios = await Estagiario.find();
    res.json(estagiarios);
  } catch (err) { res.status(500).json({ error: 'Erro ao buscar dados' }); }
});

router.get('/estagiarios/:id', async (req, res) => {
  try {
    const est = await Estagiario.findById(req.params.id);
    res.json(est);
  } catch (err) { res.status(404).json({ error: 'Não encontrado' }); }
});

router.put('/estagiarios/:id', async (req, res) => {
  try {
    const { nome, area, bio, foto, capa } = req.body;
    const atualizacao = { nome, area, bio };
    if (foto) atualizacao.foto = foto;
    if (capa) atualizacao.capa = capa;
    const est = await Estagiario.findByIdAndUpdate(req.params.id, atualizacao, { new: true });
    res.json(est);
  } catch (err) { res.status(500).json({ error: 'Erro ao editar' }); }
});

router.delete('/estagiarios/:id', async (req, res) => {
  try {
    const est = await Estagiario.findById(req.params.id);
    if (est && est.usuarioId) {
      await Usuario.findByIdAndDelete(est.usuarioId);
    }
    await Estagiario.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removido completamente' });
  } catch (err) { res.status(500).json({ error: 'Erro ao excluir' }); }
});

router.post('/estagiarios/:id/projetos', async (req, res) => {
  try {
    const novoTrabalho = {
      id: Date.now().toString(),
      tipo: req.body.tipo,
      titulo: req.body.titulo,
      data: req.body.data,
      desc: req.body.desc,
      arquivo: req.body.arquivo,
      nomeArquivo: req.body.nomeArquivo,
      status: req.body.status || 'Em andamento',
      orientacoesProjeto: req.body.orientacoesProjeto || ''
    };
    const est = await Estagiario.findById(req.params.id);
    est.projetos.push(novoTrabalho);
    await est.save();
    res.json(est);
  } catch (err) { res.status(500).json({ error: 'Erro ao adicionar trabalho' }); }
});

router.put('/estagiarios/:id/projetos/:projetoId', async (req, res) => {
  try {
    const est = await Estagiario.findById(req.params.id);
    const idx = est.projetos.findIndex(p => p.id === req.params.projetoId);
    if (idx !== -1) {
      est.projetos[idx] = { ...est.projetos[idx], ...req.body };
      est.markModified('projetos');
      await est.save();
    }
    res.json(est);
  } catch (err) { res.status(500).json({ error: 'Erro ao editar trabalho' }); }
});

router.delete('/estagiarios/:id/projetos/:projetoId', async (req, res) => {
  try {
    const est = await Estagiario.findById(req.params.id);
    est.projetos = est.projetos.filter(p => p.id !== req.params.projetoId);
    await est.save();
    res.json(est);
  } catch (err) { res.status(500).json({ error: 'Erro ao excluir trabalho' }); }
});

// Buscar todos os ativos de irrigação
router.get('/ativos-irrigacao', async (req, res) => {
  try {
    const ativos = await AtivoIrrigacao.find().sort({ FM_Setor_Irrigacao: 1 });
    res.json(ativos);
  } catch (err) { 
    res.status(500).json({ error: 'Erro ao buscar ativos BIM' }); 
  }
});

// Criar um novo ativo (Será usado depois para importar do Revit)
router.post('/ativos-irrigacao', async (req, res) => {
  try {
    const novoAtivo = new AtivoIrrigacao(req.body);
    await novoAtivo.save();
    res.status(201).json(novoAtivo);
  } catch (err) { 
    if(err.code === 11000) return res.status(400).json({ error: 'Código de Ativo já existe!' });
    res.status(500).json({ error: 'Erro ao salvar ativo BIM' }); 
  }
});

const AtivoIrrigacao = require('../models/AtivoIrrigacao');

// Rota para BUSCAR os ativos (O que preenche a tabela)
router.get('/ativos-irrigacao', async (req, res) => {
  try {
    const ativos = await AtivoIrrigacao.find();
    res.json(ativos);
  } catch (error) {
    console.error("❌ Erro na cozinha ao BUSCAR ativos:", error);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

// Rota para INJETAR os ativos (O botão preto)
router.post('/ativos-irrigacao', async (req, res) => {
  try {
    const novoAtivo = new AtivoIrrigacao(req.body);
    await novoAtivo.save();
    res.status(201).json(novoAtivo);
  } catch (error) {
    console.error("❌ Erro na cozinha ao SALVAR ativo:", error);
    if (error.code === 11000) {
      return res.status(400).json({ mensagem: 'Este ID de ativo já existe no banco.' });
    }
    res.status(500).json({ mensagem: 'Erro interno no servidor', detalhes: error.message });
  }
});

// Rota para ATUALIZAR o status via Python (O Cérebro IoT)
router.put('/ativos-irrigacao/:codigo', async (req, res) => {
  try {
    // Busca o ativo pelo ID (ex: IRR-VLV-S43-01) e atualiza com os dados que o Python mandou
    const ativoAtualizado = await AtivoIrrigacao.findOneAndUpdate(
      { FM_Codigo_Ativo: req.params.codigo },
      { $set: req.body },
      { new: true }
    );

    if (!ativoAtualizado) {
      return res.status(404).json({ mensagem: 'Ativo não encontrado no banco.' });
    }

    res.json(ativoAtualizado);
  } catch (error) {
    console.error("❌ Erro na cozinha ao ATUALIZAR ativo:", error);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

// PUT - Atualiza o status de um ativo (Usado pelo simulador IoT em Python)
router.put('/ativos-irrigacao/:codigo', async (req, res) => {
  try {
    const ativoAtualizado = await AtivoIrrigacao.findOneAndUpdate(
      { FM_Codigo_Ativo: req.params.codigo },
      { $set: req.body },
      { returnDocument: 'after' } // <--- A MUDANÇA É SÓ NESSA LINHA!
    );

    if (!ativoAtualizado) {
      return res.status(404).json({ mensagem: 'Ativo não encontrado no banco.' });
    }

    res.json(ativoAtualizado);
  } catch (error) {
    console.error("❌ Erro ao atualizar ativo:", error);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

module.exports = router;