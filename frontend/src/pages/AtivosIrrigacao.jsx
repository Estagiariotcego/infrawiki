import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AtivosIrrigacao() {
  const [ativos, setAtivos] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  // DICA: Se estiver rodando o servidor backend no seu PC em vez do Render, mude a URL para 'http://localhost:5000/api'
  const API_URL = 'https://infrawiki-api.onrender.com/api'; 

  const buscarDados = () => {
    setLoading(true);
    axios.get(`${API_URL}/ativos-irrigacao`)
      .then(res => {
        setAtivos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    buscarDados();
  }, []);

  const ativosFiltrados = ativos.filter((ativo) =>
    ativo.componente.toLowerCase().includes(busca.toLowerCase()) ||
    ativo.sigla.toLowerCase().includes(busca.toLowerCase()) ||
    ativo.FM_Codigo_Ativo.toLowerCase().includes(busca.toLowerCase())
  );

  // Função para injetar nossos dados de escopo direto no MongoDB
  const injetarDadosTeste = async () => {
    const dadosMock = [
      {
        FM_Codigo_Ativo: "IRR-CTR-GER-01",
        FM_Setor_Irrigacao: "GER",
        categoria_revit: "Equipamento Mecânico",
        componente: "Painel Controlador",
        sigla: "CTR",
        parametrosInstancia: "FM_Codigo_Ativo, FM_Setor_Irrigacao, IoT_IP_Dispositivo",
        parametrosTipo: "Fabricante, Modelo, Voltagem",
        IoT_IP_Dispositivo: "192.168.1.100"
      },
      {
        FM_Codigo_Ativo: "IRR-VLV-S43-01",
        FM_Setor_Irrigacao: "43",
        categoria_revit: "Acessório de Tubulação",
        componente: "Válvula Solenoide",
        sigla: "VLV",
        parametrosInstancia: "FM_Codigo_Ativo, FM_Setor_Irrigacao",
        parametrosTipo: "Diâmetro_Nominal, Pressão_Trabalho",
        IoT_IP_Dispositivo: ""
      },
      {
        FM_Codigo_Ativo: "IRR-SEN-S43-01",
        FM_Setor_Irrigacao: "43",
        categoria_revit: "Dispositivo de Dados",
        componente: "Sensor de Umidade",
        sigla: "SEN",
        parametrosInstancia: "FM_Codigo_Ativo, FM_Setor_Irrigacao, IoT_IP_Dispositivo",
        parametrosTipo: "Tipo_Sensor, Protocolo",
        IoT_IP_Dispositivo: "192.168.1.105"
      }
    ];

    try {
      for (const item of dadosMock) {
        await axios.post(`${API_URL}/ativos-irrigacao`, item);
      }
      alert('✅ Dados BIM/IoT injetados com sucesso no banco de dados!');
      buscarDados(); // Recarrega a tabela automaticamente
    } catch (error) {
      alert('Erro ao injetar dados. Eles já podem existir no banco ou o servidor backend está offline.');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. ÁREA DE DOCUMENTAÇÃO (TEXTO DO ESCOPO) */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <header className="mb-6 border-b border-slate-100 pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Escopo de Dados: Sistema de Irrigação</h1>
            <p className="text-slate-500 mt-1">Padrão de Nomenclatura BIM e IoT para integração predial.</p>
          </div>
          
          {/* BOTÃO MÁGICO DE INJEÇÃO */}
          <button 
            onClick={injetarDadosTeste}
            className="bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            Injetar Ativos (Dev)
          </button>
        </header>

        <div className="prose prose-slate max-w-none text-sm text-slate-700">
          <p>
            A regra de formação da Chave Primária (ID) é estrita para garantir a leitura pelas nossas APIs em Python e integração com sensores de campo.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-4 font-mono text-slate-800 text-center text-base">
            [SISTEMA] - [CATEGORIA] - [SETOR] - [SEQUENCIAL]
            <br />
            <span className="text-emerald-600 font-bold mt-2 block">Exemplo: IRR-VLV-S43-01</span>
          </div>
          <ul className="list-disc pl-5 space-y-2 mt-4 text-slate-600">
            <li>O setor deve sempre ser prefixado com <strong>S</strong> (ex: S42, S19).</li>
            <li>Equipamentos gerais que não pertencem a uma zona recebem a tag <strong>GER</strong>.</li>
            <li>Ativos sem endereço de IP definido aparecerão com status de rede <em>Offline</em>.</li>
          </ul>
        </div>
      </section>

      {/* 2. ÁREA DA TABELA INTERATIVA */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Banco de Dados de Ativos (Asset Mapping)</h2>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              type="text"
              placeholder="Buscar por ID, componente ou sigla..."
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-72 transition-all"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50 text-slate-600 text-sm">
                <th className="p-4 font-semibold border-b border-slate-200">ID do Ativo</th>
                <th className="p-4 font-semibold border-b border-slate-200">Setor</th>
                <th className="p-4 font-semibold border-b border-slate-200">Componente</th>
                <th className="p-4 font-semibold border-b border-slate-200">Categoria BIM</th>
                <th className="p-4 font-semibold border-b border-slate-200 text-right">Status IoT</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">Buscando informações no servidor...</td>
                </tr>
              ) : ativosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">Nenhum ativo encontrado no sistema. Clique em "Injetar Ativos".</td>
                </tr>
              ) : (
                ativosFiltrados.map((ativo) => (
                  <tr key={ativo._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-xs font-bold text-slate-900">{ativo.FM_Codigo_Ativo}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold tracking-wider">
                        {ativo.FM_Setor_Irrigacao === 'GER' ? 'GERAL' : `S${ativo.FM_Setor_Irrigacao}`}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{ativo.componente}</div>
                      <div className="text-xs text-slate-500 mt-0.5 font-mono bg-slate-100 inline-block px-1 rounded">{ativo.sigla}</div>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">{ativo.categoria_revit}</td>
                    <td className="p-4 text-right">
                      {ativo.IoT_IP_Dispositivo ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Offline
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}