import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Zap, 
  Filter, 
  Target, 
  CheckCircle,
  Users,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

/**
 * Componente para mostrar resumen de tareas de un sprint en el Roadmap
 * Muestra contadores por estado y permite expandir para ver lista detallada
 * 
 * @param {Object} props
 * @param {string} props.sprintId - ID del sprint
 * @param {string} props.sprintName - Nombre del sprint
 * @param {Object} props.tasksByStatus - Tareas agrupadas por estado
 * @param {Object} props.metrics - Métricas calculadas del sprint
 * @param {boolean} props.compact - Vista compacta (solo contadores)
 */
const SprintTasksSummary = ({ 
  sprintId, 
  sprintName,
  tasksByStatus = {
    todo: [],
    in_progress: [],
    code_review: [],
    testing: [],
    done: []
  },
  metrics = {
    total: 0,
    totalPoints: 0,
    completedPoints: 0,
    progress: 0
  },
  compact = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', 'todo', 'in_progress', etc.

  // Configuración de estados
  const statusConfig = {
    todo: {
      label: 'Por Hacer',
      icon: Clock,
      color: 'bg-gray-100 text-gray-700 border-gray-300',
      badgeColor: 'bg-gray-500',
      tasks: tasksByStatus.todo || []
    },
    in_progress: {
      label: 'En Progreso',
      icon: Zap,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      badgeColor: 'bg-blue-500',
      tasks: tasksByStatus.in_progress || []
    },
    code_review: {
      label: 'Code Review',
      icon: Filter,
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      badgeColor: 'bg-purple-500',
      tasks: tasksByStatus.code_review || []
    },
    testing: {
      label: 'Testing',
      icon: Target,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      badgeColor: 'bg-yellow-500',
      tasks: tasksByStatus.testing || []
    },
    done: {
      label: 'Completado',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700 border-green-300',
      badgeColor: 'bg-green-500',
      tasks: tasksByStatus.done || []
    }
  };

  // Calcular total de tareas
  const totalTasks = Object.values(statusConfig).reduce((sum, config) => sum + config.tasks.length, 0);

  // Obtener prioridad color
  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[priority] || colors.medium;
  };

  // Formatear nombre de assignee
  const formatAssigneeName = (assignee) => {
    if (!assignee) return 'Sin asignar';
    if (assignee.firstName && assignee.lastName) {
      return `${assignee.firstName} ${assignee.lastName}`;
    }
    return assignee.email || 'Sin asignar';
  };

  // Si no hay tareas, mostrar mensaje
  if (totalTasks === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <AlertCircle size={16} />
          <span>No hay tareas asignadas a este sprint</span>
        </div>
      </div>
    );
  }

  // Vista compacta: solo badges de contadores
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          const count = config.tasks.length;
          
          if (count === 0) return null;
          
          return (
            <div 
              key={status}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
              title={`${config.label}: ${count} tarea${count !== 1 ? 's' : ''}`}
            >
              <Icon size={12} />
              <span>{count}</span>
            </div>
          );
        })}
        
        {/* Badge de progreso */}
        {metrics.progress > 0 && (
          <div 
            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-300"
            title={`Progreso: ${metrics.progress}%`}
          >
            <TrendingUp size={12} />
            <span>{metrics.progress}%</span>
          </div>
        )}
      </div>
    );
  }

  // Vista expandible con detalle
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header colapsable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronDown size={18} className="text-gray-600" /> : <ChevronRight size={18} className="text-gray-600" />}
          <span className="font-medium text-gray-900">📋 Tareas del Sprint</span>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
            {totalTasks} tarea{totalTasks !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Badges de estado */}
        <div className="flex items-center gap-2">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = config.tasks.length;
            if (count === 0) return null;
            
            return (
              <div 
                key={status}
                className={`w-6 h-6 ${config.badgeColor} text-white rounded-full flex items-center justify-center text-xs font-bold`}
                title={config.label}
              >
                {count}
              </div>
            );
          })}
        </div>
      </button>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Barra de progreso */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span className="font-medium">Progreso del Sprint</span>
              <span className="font-bold">{metrics.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  metrics.progress >= 75 ? 'bg-green-500' :
                  metrics.progress >= 50 ? 'bg-blue-500' :
                  metrics.progress >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${metrics.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>{metrics.completedPoints} / {metrics.totalPoints} puntos completados</span>
            </div>
          </div>

          {/* Filtros de estado */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({totalTasks})
            </button>
            
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon;
              const count = config.tasks.length;
              
              if (count === 0) return null;
              
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedStatus === status 
                      ? config.color.replace('100', '600').replace('700', 'white') 
                      : `${config.color} hover:opacity-80`
                  }`}
                >
                  <Icon size={14} />
                  <span>{config.label}</span>
                  <span className="ml-1">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Lista de tareas filtradas */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {Object.entries(statusConfig)
              .filter(([status]) => selectedStatus === 'all' || selectedStatus === status)
              .map(([status, config]) => {
                const tasks = config.tasks;
                
                if (tasks.length === 0) return null;
                
                return (
                  <div key={status} className="space-y-2">
                    {/* Header de estado (solo si 'all' está seleccionado) */}
                    {selectedStatus === 'all' && (
                      <div className="flex items-center gap-2 mt-3 mb-2">
                        {React.createElement(config.icon, { size: 16, className: 'text-gray-600' })}
                        <span className="text-sm font-semibold text-gray-700">{config.label}</span>
                        <div className={`w-px h-4 ${config.badgeColor}`}></div>
                      </div>
                    )}
                    
                    {/* Tareas */}
                    {tasks.map((task) => (
                      <div 
                        key={task._id} 
                        className={`p-3 rounded-lg border ${config.color} hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {task.title}
                            </h4>
                            
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              {/* Assignee */}
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Users size={12} />
                                <span className="truncate max-w-32">
                                  {formatAssigneeName(task.assignee)}
                                </span>
                              </div>
                              
                              {/* Story Points */}
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Target size={12} />
                                <span>{task.storyPoints || 0} pts</span>
                              </div>
                              
                              {/* Tipo de tarea */}
                              {task.isBacklogItem && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                  {task.type || 'tarea'}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Badge de prioridad */}
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority || 'medium'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintTasksSummary;
