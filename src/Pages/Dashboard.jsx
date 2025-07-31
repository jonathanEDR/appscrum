import React, { useEffect } from 'react';
import { useSession } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext.jsx';
import { useDashboardData } from '../hooks/useDashboardData';

// Importar componentes de dashboard
import { 
  SuperAdminDashboard, 
  ProductOwnerDashboard, 
  ScrumMasterDashboard, 
  DevelopersDashboard, 
  UserDashboard 
} from '../components/layout';

// Componente de loading premium con efecto galaxia mejorado
const LoadingSpinner = ({ message = "Cargando dashboard..." }) => (
  <div className="min-h-screen bg-gradient-galaxy flex items-center justify-center">
    <div className="text-center animate-fadeIn">
      <div className="spinner-galaxy w-16 h-16 mx-auto animate-galaxy-pulse"></div>
      <p className="mt-6 text-gradient-galaxy font-medium animate-float">{message}</p>
      <div className="mt-2 w-24 h-1 bg-gradient-to-r from-primary-300 via-primary-500 to-primary-300 rounded-full mx-auto animate-pulse"></div>
    </div>
  </div>
);

// Componente de error premium con diseño galaxia mejorado
const ErrorDisplay = ({ error, onRetry, onReload }) => (
  <div className="min-h-screen bg-gradient-galaxy flex items-center justify-center p-6">
    <div className="glass-card p-8 max-w-md w-full shadow-galaxy-enhanced animate-fadeIn hover-lift">
      {/* Icono de error con gradiente mejorado */}
      <div className="w-16 h-16 bg-gradient-to-br from-error-400 to-error-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-galaxy animate-galaxy-pulse">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-gradient-galaxy mb-3 text-center animate-float">¡Oops! Algo salió mal</h2>
      <p className="text-primary-600 mb-6 text-center leading-relaxed opacity-80">{error}</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={onRetry} 
          className="btn-galaxy flex-1"
        >
          Reintentar
        </button>
        <button 
          onClick={onReload} 
          className="btn-galaxy flex-1"
        >
          Recargar página
        </button>
      </div>
    </div>
  </div>
);

function Dashboard() {
  const { session, isLoaded } = useSession();
  const { role, isLoaded: isRoleLoaded } = useRole();
  const navigate = useNavigate();

  // Hook personalizado para manejar datos del dashboard
  const {
    loading,
    error,
    notes,
    users,
    isServerConnected,
    createNote,
    deleteNote,
    updateNote,
    updateUserRole,
    refreshData,
    setNotesData
  } = useDashboardData(role);

  // Redirigir si no hay sesión
  useEffect(() => {
    if (isLoaded && !session) {
      navigate('/sign-in');
    }
  }, [isLoaded, session, navigate]);

  // Mostrar loading mientras se cargan los datos básicos
  if (!isLoaded || !isRoleLoaded) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }

  // Verificar si la sesión existe
  if (!session) {
    return null; // Se está redirigiendo
  }

  // Mostrar loading mientras se cargan los datos del dashboard
  if (loading) {
    return (
      <LoadingSpinner 
        message={
          !isServerConnected 
            ? "Conectando con el servidor..." 
            : "Cargando datos del dashboard..."
        } 
      />
    );
  }

  // Mostrar error si algo falla
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refreshData}
        onReload={() => window.location.reload()}
      />
    );
  }

  // Props comunes para todos los dashboards
  const dashboardProps = {
    userRole: role,
    initialNotes: notes,
    notes,
    users,
    isServerConnected,
    onNotesUpdate: setNotesData,
    onCreateNote: createNote,
    onDeleteNote: deleteNote,
    onUpdateNote: updateNote,
    onUpdateUserRole: updateUserRole,
    onRefreshData: refreshData
  };

  // Renderizar el dashboard según el rol
  const renderDashboard = () => {
    switch (role) {
      case 'super_admin':
        return <SuperAdminDashboard {...dashboardProps} />;
      
      case 'product_owner':
        return <ProductOwnerDashboard {...dashboardProps} />;
      
      case 'scrum_master':
        return <ScrumMasterDashboard {...dashboardProps} />;
      
      case 'developers':
        return <DevelopersDashboard {...dashboardProps} />;
      
      case 'user':
      default:
        return <UserDashboard {...dashboardProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-galaxy">
      {/* Overlay sutil para profundidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-primary-900/5 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto p-6">
        {renderDashboard()}
      </div>
    </div>
  );
}

export default Dashboard;