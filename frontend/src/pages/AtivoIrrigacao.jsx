import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AtivosIrrigacao() {
  const [ativos, setAtivos] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://infrawiki-api.onrender.com/api/ativos-irrigacao')
      .then(res => {
        setAtivos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const ativosFiltrados = ativos.filter((ativo) =>
    ativo.componente.toLowerCase().includes(busca.toLowerCase()) ||
    ativo.sigla.toLowerCase().includes(busca.toLowerCase()) ||
    ativo.FM_Codigo_Ativo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Mapeamento de Ativos (BIM/IoT)</h2>
          <p className="text-sm text-slate-500 mt-1">Gerenciamento do Sistema de Irrigação</p>
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
                <td colSpan="5" className="p-8 text-center text-slate-500">Carregando banco de dados...</td>
              </tr>
            ) : ativosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">Nenhum ativo encontrado no sistema.</td>
              </tr>
            ) : (
              ativosFiltrados.map((ativo) => (
                <tr key={ativo._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-xs font-bold text-slate-900">{ativo.FM_Codigo_Ativo}</td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold tracking-wider">
                      S{ativo.FM_Setor_Irrigacao}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{ativo.componente}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{ativo.sigla}</div>
                  </td>
                  <td className="p-4 text-slate-500 text-xs">{ativo.categoria_revit}</td>
                  <td className="p-4 text-right">
                    {ativo.IoT_IP_Dispositivo ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
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
    </div>
  );
}