import React from 'react';
import { useRole } from '../../../context/RoleContext.jsx';
import { useDashboardData } from '../../../hooks/useDashboardData.js';
import { 
  Code, 
  Target, 
  CheckCircle, 
  Clock,
  TrendingUp,
  GitBranch,
  Bug,
  Zap
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

// Componente para mostrar tareas del sprint
const MyTasks = () => {
  const tasks = [
    { 
      id: 1, 
      title: 'Implementar autenticación JWT', 
      status: 'in_progress', 
      priority: 'high',
      estimatedHours: 8,
      spentHours: 5
    },
    { 
      id: 2, 
      title: 'Corregir bug en validación de formularios', 
      status: 'todo', 
      priority: 'medium',
      estimatedHours: 4,
      spentHours: 0
    },
    { 
      id: 3, 
      title: 'Optimizar consultas de base de datos', 
      status: 'done', 
      priority: 'low',
      estimatedHours: 6,
      spentHours: 6
    },
    { 
      id: 4, 
      title: 'Implementar tests unitarios', 
      status: 'in_progress', 
      priority: 'high',
      estimatedHours: 12,
      spentHours: 3
    }
  ];

  const getStatusInfo = (status) => {
    const statusConfig = {
      todo: { label: 'Por Hacer', color: 'bg-gray-100 text-gray-800', icon: Clock },
      in_progress: { label: 'En Progreso', color: 'bg-yellow-100 text-yellow-800', icon: Zap },
      done: { label: 'Completado', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };
    return statusConfig[status] || statusConfig.todo;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-red-500',
      medium: 'border-yellow-500',
      low: 'border-green-500'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Mis Tareas del Sprint
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {tasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div 
                key={task.id} 
                className={`border-l-4 ${getPriorityColor(task.priority)} bg-gray-50 p-4 rounded-r-lg`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} flex items-center`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {task.spentHours}h / {task.estimatedHours}h
                      </span>
                    </div>
                  </div>
                </div>
                {task.status === 'in_progress' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(task.spentHours / task.estimatedHours) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Dashboard específico para Developers
const DevelopersDashboard = () => {
  const { loading, error } = useDashboardData('developers');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de desarrollador...</p>
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
      title: 'Tareas Asignadas',
      value: '4',
      icon: Target,
      color: 'blue'
    },
    {
      title: 'Completadas Hoy',
      value: '1',
      icon: CheckCircle,
      color: 'green',
      trend: { positive: true, value: '+1 desde ayer' }
    },
    {
      title: 'Bugs Resueltos',
      value: '3',
      icon: Bug,
      color: 'red',
      trend: { positive: true, value: 'Esta semana' }
    },
    {
      title: 'Commits',
      value: '12',
      icon: GitBranch,
      color: 'purple',
      trend: { positive: true, value: 'Esta semana' }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Panel Desarrollador</h1>
        <p className="text-blue-100">
          Gestiona tus tareas y contribuye al éxito del sprint
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
        {/* Mis tareas */}
        <div className="lg:col-span-2">
          <MyTasks />
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              <Target className="h-5 w-5 mr-2" />
              Ver Mis Tareas
            </button>
            
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Code className="h-5 w-5 mr-2" />
              Sprint Actual
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <GitBranch className="h-5 w-5 mr-2" />
              Pull Requests
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Bug className="h-5 w-5 mr-2" />
              Reportar Bug
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopersDashboard;
