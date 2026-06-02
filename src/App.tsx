import { useState } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import SidebarMenu from './components/SidebarMenu';
import DashboardPage from './pages/DashboardPage';
import SalonesPage from './pages/SalonesPage';
import MateriasPage from './pages/MateriasPage';
import DocentesPage from './pages/DocentesPage';
import ReservasPage from './pages/ReservasPage';
import AlertasPage from './pages/AlertasPage';

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  function renderContent() {
    switch (page) {
      case 'dashboard':  return <DashboardPage />;
      case 'salones':    return <SalonesPage />;
      case 'materias':   return <MateriasPage />;
      case 'docentes':   return <DocentesPage />;
      case 'reservas':   return <ReservasPage />;
      case 'alertas':    return <AlertasPage />;
      default:           return <DashboardPage />;
    }
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <SidebarMenu current={page} onChange={setPage} />
      <div className="mt-auto border-t pt-4 space-y-2">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs font-medium text-blue-800">{user?.fullName}</p>
          <p className="text-xs text-blue-600 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-sm text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <MainLayout
      sidebar={sidebar}
      content={renderContent()}
    />
  );
}

export default App;
