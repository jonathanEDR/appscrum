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

// Tarjeta de estadística con colores premium y efectos galaxia
const StatCard = ({ title, value, icon: Icon, color = 'primary', trend = null }) => {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-600',
    accent: 'bg-gradient-to-br from-accent-400 to-accent-500',
    success: 'bg-gradient-to-br from-success-500 to-success-600',
    warning: 'bg-gradient-to-br from-warning-400 to-warning-500',
    danger: 'bg-gradient-to-br from-error-500 to-error-600',
    info: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    purple: 'bg-gradient-to-br from-secondary-500 to-secondary-600'
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${colorClasses[color]} rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            {trend && (
              <p className={`text-xs ${trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center mt-1 font-medium`}>
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

// Componente para mostrar tareas del sprint con diseño premium
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
      todo: { label: 'Por Hacer', color: 'bg-primary-100 text-primary-800', icon: Clock },
      in_progress: { label: 'En Progreso', color: 'bg-warning-100 text-warning-800', icon: Zap },
      done: { label: 'Completado', color: 'bg-success-100 text-success-800', icon: CheckCircle }
    };
    return statusConfig[status] || statusConfig.todo;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-error-500 bg-error-50/50',
      medium: 'border-warning-500 bg-warning-50/50',
      low: 'border-success-500 bg-success-50/50'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Target className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
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
                className={`border-l-4 ${getPriorityColor(task.priority)} p-4 rounded-r-xl hover:shadow-lg transition-all duration-300 group bg-gray-50 dark:bg-gray-800`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{task.title}</h4>
                    <div className="flex items-center space-x-4 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} flex items-center shadow-soft`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {task.spentHours}h / {task.estimatedHours}h
                      </span>
                    </div>
                    {task.status === 'in_progress' && (
                      <div className="w-full">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                          <span className="font-medium">Progreso</span>
                          <span className="font-bold">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500 relative overflow-hidden" 
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                          </div>
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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-emerald-600 mx-auto"></div>
          <p className="mt-6 text-gray-700 dark:text-gray-300 font-medium">Cargando panel de desarrollador...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error al cargar datos</h3>
        <p className="text-red-600 dark:text-red-500">{error}</p>
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
        {/* Header con tema */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl shadow-xl text-white p-8 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Panel Desarrollador</h1>
              <p className="text-white/90 text-lg">
                Gestiona tus tareas y contribuye al éxito del sprint
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Code className="h-8 w-8 text-white" />
            </div>
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
          <div className="bg-white dark:bg-gray-950 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Acciones Rápidas</h3>
            </div>
            <div className="p-6 space-y-3">
              <button 
                onClick={() => navigate('/developers/tareas')}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <Eye className="h-5 w-5 mr-2" />
                Ver Mis Tareas
              </button>
              
              <button 
                onClick={() => navigate('/developers/sprint-board')}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <Code className="h-5 w-5 mr-2" />
                Sprint Actual
              </button>

              <button 
                onClick={() => setIsBugModalOpen(true)}
                className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
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
