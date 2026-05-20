import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AtivosIrrigacao from './pages/AtivosIrrigacao';

const RotaProtegida = ({ children }) => {
  const auth = localStorage.getItem('token');
  return auth ? children : <Navigate to="/login" />;
};

function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Barra lateral e cabeçalho foram removidos daqui */}
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* A área principal agora ocupa a tela toda */}
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