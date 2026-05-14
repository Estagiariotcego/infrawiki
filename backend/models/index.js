const mongoose = require('mongoose');

// Tabelas Legadas (Mantidas para Autenticação)
const UsuarioSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  role: { type: String, default: 'user' }
});

const EstagiarioSchema = new mongoose.Schema({
  usuarioId: String,
  nome: String,
  area: String,
  foto: String
});

// 🔥 NOVA TABELA: FM-Dashboard (BIM & IoT)
const AtivoIrrigacaoSchema = new mongoose.Schema({
  FM_Codigo_Ativo: { type: String, required: true, unique: true }, // ex: IRR-VLV-S43-01
  FM_Setor_Irrigacao: { type: String, required: true }, // ex: 43
  categoria_revit: { type: String, required: true },
  componente: { type: String, required: true },
  sigla: { type: String, required: true },
  parametrosInstancia: { type: String }, // Documentação
  parametrosTipo: { type: String }, // Documentação
  IoT_IP_Dispositivo: { type: String, default: '' },
  IoT_Vazao_Projeto: { type: Number, default: 0 },
  MAN_Data_Instalacao: { type: Date },
  MAN_Frequencia_Revisao_Dias: { type: Number, default: 180 }
}, { timestamps: true });

const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Estagiario = mongoose.model('Estagiario', EstagiarioSchema);
const AtivoIrrigacao = mongoose.model('AtivoIrrigacao', AtivoIrrigacaoSchema);

module.exports = { Usuario, Estagiario, AtivoIrrigacao };