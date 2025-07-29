import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../../context/RoleContext.jsx';
import { useDashboardData } from '../../../hooks/useDashboardData.js';
import BugReportModal from '../../developers/BugReportModal.jsx';
import { 
  Code, 
  Target, 
  CheckCircle, 
  Clock,
  TrendingUp,
  GitBranch,
  Bug,
  Zap,
  Eye,
  GitPullRequest,
  AlertTriangle
} from 'lucide-react';

// Tarjeta de estadística con colores mejorados
const StatCard = ({ title, value, icon: Icon, color = 'primary', trend = null }) => {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-600',
    accent: 'bg-gradient-to-br from-accent-500 to-accent-600',
    success: 'bg-gradient-to-br from-success-500 to-success-600',
    warning: 'bg-gradient-to-br from-yellow-500 to-amber-600',
    danger: 'bg-gradient-to-br from-red-500 to-red-600',
    info: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    purple: 'bg-gradient-to-br from-purple-500 to-violet-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 hover:shadow-medium transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${colorClasses[color]} rounded-xl p-3 shadow-sm group-hover:scale-105 transition-transform duration-200`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{value}</p>
            {trend && (
              <p className={`text-xs ${trend.positive ? 'text-success-600' : 'text-red-600'} flex items-center mt-1`}>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="h-5 w-5 mr-2 text-gray-600" />
          Mis Tareas del Sprint
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {tasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            const StatusIcon = statusInfo.icon;
            const progressPercentage = (task.spentHours / task.estimatedHours) * 100;
            
            return (
              <div 
                key={task.id} 
                className={`border-l-4 ${getPriorityColor(task.priority)} bg-gray-50 p-4 rounded-r-lg hover:bg-gray-100 transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">{task.title}</h4>
                    <div className="flex items-center space-x-4 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} flex items-center`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {task.spentHours}h / {task.estimatedHours}h
                      </span>
                    </div>
                    {task.status === 'in_progress' && (
                      <div className="w-full">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progreso</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
  const navigate = useNavigate();
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);

  const handleBugReport = (bugData) => {
    console.log('Bug reportado:', bugData);
    // Aquí enviarías los datos a tu API
    alert('Bug reportado exitosamente. Se ha notificado al equipo de desarrollo.');
  };

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
      color: 'primary'
    },
    {
      title: 'Completadas Hoy',
      value: '1',
      icon: CheckCircle,
      color: 'success',
      trend: { positive: true, value: '+1 desde ayer' }
    },
    {
      title: 'Bugs Resueltos',
      value: '3',
      icon: Bug,
      color: 'danger',
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
    <>
      <div className="space-y-6">
        {/* Header mejorado con gradiente equilibrado */}
        <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-accent-500 rounded-xl shadow-lg text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Panel Desarrollador</h1>
            <p className="text-white/90 text-lg">
              Gestiona tus tareas y contribuye al éxito del sprint
            </p>
          </div>
          <div className="absolute -right-4 -top-4 opacity-20">
            <Code className="h-24 w-24 text-white" />
          </div>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
            </div>
            <div className="p-6 space-y-3">
              <button 
                onClick={() => navigate('/developers/tareas')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-5 w-5 mr-2" />
                Ver Mis Tareas
              </button>
              
              <button 
                onClick={() => navigate('/developers/sprint-board')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Code className="h-5 w-5 mr-2" />
                Sprint Actual
              </button>

              <button 
                onClick={() => navigate('/developers/codigo')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <GitPullRequest className="h-5 w-5 mr-2" />
                Pull Requests
              </button>

              <button 
                onClick={() => setIsBugModalOpen(true)}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                Reportar Bug
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de reporte de bugs */}
      <BugReportModal
        isOpen={isBugModalOpen}
        onClose={() => setIsBugModalOpen(false)}
        onSubmit={handleBugReport}
      />
    </>
  );
};

export default DevelopersDashboard;
