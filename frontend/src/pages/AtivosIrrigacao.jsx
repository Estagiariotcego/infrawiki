import React, { useState, useEffect } from 'react';

export default function AtivosIrrigacao() {
  const [ativos, setAtivos] = useState([]);
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 50;

 // Busca os dados e cria um "Auto-Refresh" forçando o navegador a não usar o cache
  useEffect(() => {
    const fetchAtivos = () => {
      // Adicionamos um timestamp no final da URL para o navegador achar que é um link novo toda vez
      const urlSemCache = `http://localhost:5000/api/ativos-irrigacao?t=${new Date().getTime()}`;
      
      fetch(urlSemCache)
        .then(res => res.json())
        .then(data => setAtivos(data))
        .catch(err => console.error("Erro ao buscar ativos:", err));
    };

    fetchAtivos(); // Busca na primeira vez que abre a tela
    const interval = setInterval(fetchAtivos, 5000); // Fica atualizando sozinho

    return () => clearInterval(interval); // Limpa o intervalo
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);

  const ativosFiltrados = ativos.filter(ativo => {
    const termo = busca.toLowerCase();
    return (
      (ativo.FM_Codigo_Ativo && ativo.FM_Codigo_Ativo.toLowerCase().includes(termo)) ||
      (ativo.FM_Setor_Irrigacao && ativo.FM_Setor_Irrigacao.toLowerCase().includes(termo)) ||
      (ativo.componente && ativo.componente.toLowerCase().includes(termo)) ||
      (ativo.categoria_revit && ativo.categoria_revit.toLowerCase().includes(termo))
    );
  });

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const ativosPaginados = ativosFiltrados.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(ativosFiltrados.length / itensPorPagina);

  return (
    <div className="p-6">
      {/* Título e subtítulo removidos daqui para um visual mais limpo */}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-700">Banco de Dados de Ativos (Asset Mapping)</h2>
          <div className="w-1/3">
            <input 
              type="text" 
              placeholder="Buscar por ID, setor ou componente..." 
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase tracking-wider">
                <th className="p-4 font-medium">ID do Ativo</th>
                <th className="p-4 font-medium">Setor</th>
                <th className="p-4 font-medium">Componente</th>
                <th className="p-4 font-medium">Fabricante / Modelo</th>
                <th className="p-4 font-medium">Endereço IoT</th>
                <th className="p-4 font-medium text-center">Status (IoT)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {ativosPaginados.length > 0 ? (
                ativosPaginados.map((ativo) => (
                  <tr key={ativo._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">{ativo.FM_Codigo_Ativo}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md">
                        {ativo.FM_Setor_Irrigacao}
                      </span>
                    </td>
                    <td className="p-4">{ativo.componente}</td>
                    <td className="p-4 text-sm">
                      {ativo.fabricante} {ativo.modelo && `- ${ativo.modelo}`}
                    </td>
                    <td className="p-4">
                      {ativo.Endereco_IoT ? (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-md border border-gray-200">
                          {ativo.Endereco_IoT}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm italic">N/A</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border shadow-sm ${
                        ativo.status?.includes('Regando') ? 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse' :
                        ativo.status?.includes('Offline') ? 'bg-red-100 text-red-800 border-red-300' :
                        ativo.status?.includes('Online') ? 'bg-green-100 text-green-800 border-green-300' :
                        ativo.status?.includes('Standby') ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                        'bg-gray-100 text-gray-600 border-gray-300'
                      }`}>
                        {ativo.status || 'Desligado'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    Nenhum ativo encontrado para essa busca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPaginas > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <span className="text-sm text-gray-600">
              Mostrando <span className="font-semibold">{indexPrimeiroItem + 1}</span> a <span className="font-semibold">{Math.min(indexUltimoItem, ativosFiltrados.length)}</span> de <span className="font-semibold">{ativosFiltrados.length}</span> ativos
            </span>
            <div className="space-x-2">
              <button 
                onClick={() => setPaginaAtual(paginaAtual - 1)} 
                disabled={paginaAtual === 1}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  paginaAtual === 1 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 shadow-sm'
                }`}
              >
                Anterior
              </button>
              
              <span className="text-sm font-medium text-gray-700 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
                {paginaAtual} / {totalPaginas}
              </span>
              
              <button 
                onClick={() => setPaginaAtual(paginaAtual + 1)} 
                disabled={paginaAtual === totalPaginas}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  paginaAtual === totalPaginas 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 shadow-sm'
                }`}
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}