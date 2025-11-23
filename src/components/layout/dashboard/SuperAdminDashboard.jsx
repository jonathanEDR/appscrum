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
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-800 p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${colorClasses[color]} dark:opacity-90 rounded-lg p-3 shadow-md`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
            {trend && (
              <p className={`text-xs ${trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center mt-1`}>
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
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-800 transition-colors">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
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
                  <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100">{activity.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No hay actividad reciente</p>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error al cargar datos</h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 rounded-lg shadow-xl text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Panel Super Administrador</h1>
        <p className="text-purple-100 dark:text-purple-200">
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
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-800 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Acciones Rápidas</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors">
              <Users className="h-5 w-5 mr-2" />
              Gestionar Usuarios
            </button>
            
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Settings className="h-5 w-5 mr-2" />
              Configuración del Sistema
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <BarChart3 className="h-5 w-5 mr-2" />
              Ver Reportes
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
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
