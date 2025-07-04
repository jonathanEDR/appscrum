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

// Componente de loading
const LoadingSpinner = ({ message = "Cargando dashboard..." }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  </div>
);

// Componente de error
const ErrorDisplay = ({ error, onRetry, onReload }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
      <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
      <p className="text-red-600 mb-4">{error}</p>
      <div className="flex gap-2">
        <button 
          onClick={onRetry} 
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
        <button 
          onClick={onReload} 
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        {renderDashboard()}
      </div>
    </div>
  );
}

export default Dashboard;