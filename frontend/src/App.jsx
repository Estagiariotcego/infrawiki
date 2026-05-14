import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AtivosIrrigacao from './pages/AtivosIrrigacao';

const RotaProtegida = ({ children }) => {
  const auth = localStorage.getItem('token');
  return auth ? children : <Navigate to="/login" />;
};

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [nomeUsuario, setNomeUsuario] = useState('Gestor Técnico');
  const [iniciais, setIniciais] = useState('GT');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userLogado = localStorage.getItem('usuarioLogado') || 'Gestão';
    setNomeUsuario(userLogado);
    setIniciais(userLogado.substring(0, 2).toUpperCase());

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fazerLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-emerald-500 selection:text-white">
      
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-20 flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-none tracking-tight">FM-Dash</span>
              <span className="text-emerald-500 text-[10px] font-mono uppercase tracking-widest">TCE-GO</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Monitoramento</div>
          
          <Link to="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/') ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 hover:text-white'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Visão Geral
          </Link>

          <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Sistemas Prediais</div>
          
          <Link to="/irrigacao/ativos" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/irrigacao/ativos') ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800 hover:text-white'}`}>
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            Rede de Irrigação
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
            Painel de Controle
          </h1>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-full transition-colors pr-4 border border-transparent hover:border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                {iniciais}
              </div>
              <span className="text-sm font-medium text-slate-600 capitalize">{nomeUsuario}</span>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50">
                <button onClick={fazerLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">
                  Encerrar Sessão
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
            <DashboardLayout>
              <div className="p-8 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400">
                Conteúdo da Home (Em construção)
              </div>
            </DashboardLayout>
        } />

        <Route path="/irrigacao/ativos" element={
            <DashboardLayout>
              <AtivosIrrigacao />
            </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;