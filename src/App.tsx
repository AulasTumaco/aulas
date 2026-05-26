import { useState } from 'react';
import './App.css';
import MainLayout from './layouts/MainLayout';
import SidebarMenu from './components/SidebarMenu';
import DashboardPage from './pages/DashboardPage';
import SalonesPage from './pages/SalonesPage';
import MateriasPage from './pages/MateriasPage';
import DocentesPage from './pages/DocentesPage';
import ReservasPage from './pages/ReservasPage';
import AlertasPage from './pages/AlertasPage';

function App() {
  const [page, setPage] = useState('dashboard');

  function renderContent() {
    switch (page) {
      case 'dashboard': return <DashboardPage />;
      case 'salones': return <SalonesPage />;
      case 'materias': return <MateriasPage />;
      case 'docentes': return <DocentesPage />;
      case 'reservas': return <ReservasPage />;
      case 'alertas': return <AlertasPage />;
      default: return <DashboardPage />;
    }
  }

  return (
    <MainLayout
      sidebar={<SidebarMenu current={page} onChange={setPage} />}
      content={renderContent()}
    />
  );
}

export default App;