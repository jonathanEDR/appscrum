import React from 'react';
import { useRole } from '../../../context/RoleContext.jsx';
import { useDashboardData } from '../../../hooks/useDashboardData.js';
import { 
  Users, 
  FileText, 
  Shield, 
  BarChart3,
  Settings,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';

// Tarjeta de estadística
const StatCard = ({ title, value, icon: Icon, color = 'blue', trend = null }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${colorClasses[color]} rounded-lg p-3`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <p className={`text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend.value}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de actividad reciente
const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Actividad Reciente
        </h3>
      </div>
      <div className="p-6">
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
        )}
      </div>
    </div>
  );
};

// Dashboard específico para Super Admin
const SuperAdminDashboard = () => {
  const { users, loading, error } = useDashboardData('super_admin');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar datos</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Usuarios',
      value: users.length,
      icon: Users,
      color: 'blue',
      trend: { positive: true, value: '+5% este mes' }
    },
    // Eliminado: Total Notas
    {
      title: 'Sistemas Activos',
      value: '5',
      icon: Shield,
      color: 'purple'
    },
    {
      title: 'Rendimiento',
      value: '98.5%',
      icon: BarChart3,
      color: 'yellow'
    }
  ];

  const recentActivities = [
    { description: 'Nuevo usuario registrado: john@example.com', timestamp: 'Hace 5 minutos' },
    { description: 'Sistema de backup completado exitosamente', timestamp: 'Hace 15 minutos' },
    { description: 'Configuración de seguridad actualizada', timestamp: 'Hace 1 hora' },
    { description: 'Reporte mensual generado', timestamp: 'Hace 2 horas' }
  ];

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Panel Super Administrador</h1>
        <p className="text-purple-100">
          Control total del sistema y gestión de usuarios
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad reciente */}
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivities} />
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors">
              <Users className="h-5 w-5 mr-2" />
              Gestionar Usuarios
            </button>
            
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Settings className="h-5 w-5 mr-2" />
              Configuración del Sistema
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <BarChart3 className="h-5 w-5 mr-2" />
              Ver Reportes
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Shield className="h-5 w-5 mr-2" />
              Panel de Seguridad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
