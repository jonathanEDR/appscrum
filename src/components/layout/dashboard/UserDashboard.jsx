import React from 'react';
import { useRole } from '../../../context/RoleContext.jsx';
import { useDashboardData } from '../../../hooks/useDashboardData.js';
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  User,
  TrendingUp,
  Clock,
  Target,
  BarChart3
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

// Componente para mostrar proyectos
const MyProjects = () => {
  const projects = [
    {
      id: 1,
      name: 'Sistema de Gestión CRM',
      status: 'active',
      progress: 75,
      dueDate: '2025-08-15',
      team: 'Equipo Alpha'
    },
    {
      id: 2,
      name: 'App Mobile E-commerce',
      status: 'planning',
      progress: 25,
      dueDate: '2025-09-30',
      team: 'Equipo Beta'
    },
    {
      id: 3,
      name: 'Portal de Reportes',
      status: 'completed',
      progress: 100,
      dueDate: '2025-06-30',
      team: 'Equipo Gamma'
    }
  ];

  const getStatusInfo = (status) => {
    const statusConfig = {
      active: { label: 'Activo', color: 'bg-green-100 text-green-800' },
      planning: { label: 'Planificación', color: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Completado', color: 'bg-blue-100 text-blue-800' },
      paused: { label: 'Pausado', color: 'bg-gray-100 text-gray-800' }
    };
    return statusConfig[status] || statusConfig.active;
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Briefcase className="h-5 w-5 mr-2" />
          Mis Proyectos
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {projects.map((project) => {
            const statusInfo = getStatusInfo(project.status);
            
            return (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-500">{project.team}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Entrega: {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Dashboard específico para User
const UserDashboard = () => {
  const { loading, error } = useDashboardData('user');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de usuario...</p>
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
      title: 'Mis Proyectos',
      value: '3',
      icon: Briefcase,
      color: 'blue'
    },
    // Eliminado: Notas Creadas
    {
      title: 'Tareas Pendientes',
      value: '5',
      icon: Target,
      color: 'yellow'
    },
    {
      title: 'Horas Trabajadas',
      value: '32',
      icon: Clock,
      color: 'purple',
      trend: { positive: true, value: 'Esta semana' }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-lg text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Panel de Usuario</h1>
        <p className="text-indigo-100">
          Gestiona tus proyectos y mantente al día con tus tareas
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
        {/* Mis proyectos */}
        <div className="lg:col-span-2">
          <MyProjects />
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              <Briefcase className="h-5 w-5 mr-2" />
              Ver Proyectos
            </button>
            
            {/* Eliminado: Crear Nota */}

            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Calendar className="h-5 w-5 mr-2" />
              Ver Calendario
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <User className="h-5 w-5 mr-2" />
              Mi Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
