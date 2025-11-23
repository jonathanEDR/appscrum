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
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-950 flex items-center justify-center">
    <div className="text-center animate-fadeIn">
      <div className="spinner-galaxy w-16 h-16 mx-auto animate-galaxy-pulse bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full"></div>
      <p className="mt-6 text-slate-700 dark:text-slate-300 font-medium animate-float">{message}</p>
      <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-300 via-purple-500 to-blue-300 dark:from-blue-600 dark:via-purple-600 dark:to-blue-600 rounded-full mx-auto animate-pulse"></div>
    </div>
  </div>
);

// Componente de error premium con diseño galaxia mejorado
const ErrorDisplay = ({ error, onRetry, onReload }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-950 flex items-center justify-center p-6">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-xl dark:shadow-2xl animate-fadeIn border border-gray-200 dark:border-gray-700">
      {/* Icono de error con gradiente mejorado */}
      <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 dark:from-red-500 dark:to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 dark:from-slate-300 dark:to-blue-400 bg-clip-text text-transparent mb-3 text-center animate-float">¡Oops! Algo salió mal</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-center leading-relaxed">{error}</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={onRetry} 
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
        >
          Reintentar
        </button>
        <button 
          onClick={onReload} 
          className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 dark:from-slate-600 dark:to-slate-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
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
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <div className="relative max-w-7xl mx-auto p-6">
        {renderDashboard()}
      </div>
    </div>
  );
}

export default Dashboard;