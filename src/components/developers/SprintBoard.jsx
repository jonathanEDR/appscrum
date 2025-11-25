import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Zap, 
  Target, 
  Users,
  BarChart3,
  Filter,
  Star,
  TrendingUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useSprintBoard } from '../../hooks/useSprintBoard';
import SprintSelector from './SprintSelector';
import { useTheme } from '../../context/ThemeContext';

const SprintBoard = () => {
  const { theme } = useTheme();
  const {
    sprintData,
    loading,
    error,
    selectedSprintId,
    filterMode,
    updateTaskStatus,
    changeSprintFilter,
    getTasksByStatus,
    getPriorityColor,
    getStatusColor,
    isActive,
    daysRemaining,
    refresh
  } = useSprintBoard();

  const [draggedTask, setDraggedTask] = useState(null);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-primary-600'}>Cargando Sprint Board...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-red-600 font-medium">Error al cargar el Sprint Board</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
          <button 
            onClick={refresh}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // No sprint data
  if (!sprintData?.sprint) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4 text-center">
          <Calendar className="h-12 w-12 text-gray-400" />
          <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>No hay sprint activo</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Contacta al Scrum Master para iniciar un sprint</p>
        </div>
      </div>
    );
  }

  const { sprint, metrics, tasks } = sprintData;

  const columns = [
    { id: 'todo', title: 'Por Hacer', status: 'todo', color: 'border-gray-300 bg-gray-50' },
    { id: 'in_progress', title: 'En Progreso', status: 'in_progress', color: 'border-blue-300 bg-blue-50' },
    { id: 'code_review', title: 'Code Review', status: 'code_review', color: 'border-purple-300 bg-purple-50' },
    { id: 'testing', title: 'Testing', status: 'testing', color: 'border-yellow-300 bg-yellow-50' },
    { id: 'done', title: 'Completado', status: 'done', color: 'border-green-300 bg-green-50' }
  ];

  // Función para manejar drag & drop
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      await updateTaskStatus(draggedTask._id, newStatus);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    } finally {
      setDraggedTask(null);
    }
  };

  const getPriorityColorLocal = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
      critical: 'bg-red-200 text-red-900 border-red-300'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusIcon = (status) => {
    const icons = {
      todo: Clock,
      in_progress: Zap,
      code_review: Filter,
      testing: Target,
      done: CheckCircle
    };
    return icons[status] || Clock;
  };

  const formatPriorityText = (priority) => {
    const priorityTexts = {
      low: 'Baja',
      medium: 'Media', 
      high: 'Alta',
      critical: 'Crítica'
    };
    return priorityTexts[priority] || 'Media';
  };

  const formatAssigneeName = (assignee) => {
    if (!assignee) return 'Sin asignar';
    if (typeof assignee === 'string') return assignee;
    return assignee.firstName ? `${assignee.firstName} ${assignee.lastName}` : assignee.email;
  };

  return (
    <div className="space-y-6">
      {/* Sprint Header Premium */}
      <div className={`rounded-xl shadow-galaxy border-0 p-6 overflow-hidden relative ${
        theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/80 backdrop-blur-lg'
      }`}>
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20' : 'bg-gradient-to-r from-primary-500/5 via-transparent to-accent-500/5'}`}></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-xl shadow-large">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-primary-900'}`}>{sprint.name}</h1>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-primary-600'}>
                  {filterMode === 'all' ? 'Todas mis tareas asignadas' : (sprint.goal || 'Sprint en progreso')}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-primary-50 text-primary-500'
                  }`}>
                    {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                  </span>
                  {isActive && (
                    <span className={`px-3 py-1 rounded-full font-medium ${
                      theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-600'
                    }`}>
                      Activo
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} 
                    {filterMode === 'all' ? ' asignada' : ' del sprint'}{tasks.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Sprint Selector */}
            <div className="flex items-center gap-3">
              <SprintSelector
                selectedSprintId={selectedSprintId}
                onSprintChange={(sprintId) => changeSprintFilter(sprintId, 'sprint')}
                filterMode={filterMode}
                onFilterModeChange={(mode) => changeSprintFilter(selectedSprintId, mode)}
                className="flex-shrink-0"
              />
              <button
                onClick={refresh}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-primary-50 hover:bg-primary-100 text-primary-700'
                }`}
                title="Actualizar datos"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center mt-6">
            <div className={`p-3 rounded-xl ${
              theme === 'dark' ? 'bg-blue-900/30' : 'bg-primary-50'
            }`}>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-blue-300' : 'text-primary-600'
              }`}>{metrics.totalPoints || 0}</div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-blue-400' : 'text-primary-600'
              }`}>Story Points</div>
            </div>
            <div className={`p-3 rounded-xl ${
              theme === 'dark' ? 'bg-green-900/30' : 'bg-success-50'
            }`}>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-green-300' : 'text-success-600'
              }`}>{metrics.completedPoints || 0}</div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-green-400' : 'text-success-600'
              }`}>Completados</div>
            </div>
            <div className={`p-3 rounded-xl ${
              theme === 'dark' ? 'bg-yellow-900/30' : 'bg-warning-50'
            }`}>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-yellow-300' : 'text-warning-600'
              }`}>{metrics.inProgressTasks || 0}</div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-yellow-400' : 'text-warning-600'
              }`}>En Progreso</div>
            </div>
            <div className={`p-3 rounded-xl ${
              theme === 'dark' ? 'bg-purple-900/30' : 'bg-accent-50'
            }`}>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-purple-300' : 'text-accent-600'
              }`}>{metrics.todoTasks || 0}</div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-purple-400' : 'text-accent-600'
              }`}>Pendientes</div>
            </div>
            <div className={`p-3 rounded-xl ${
              theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
            }`}>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
              }`}>{daysRemaining}</div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>Días Restantes</div>
            </div>
          </div>
        </div>

        {/* Sprint Progress */}
        <div className="mt-6">
          <div className={`flex justify-between text-sm mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-primary-600'
          }`}>
            <span>Progreso del Sprint</span>
            <span className="font-medium">{Math.round(metrics.sprintProgress || 0)}%</span>
          </div>
          <div className={`w-full rounded-full h-3 shadow-inner ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-primary-100'
          }`}>
            <div 
              className="bg-gradient-to-r from-success-500 via-success-400 to-success-500 h-3 rounded-full transition-all duration-500 shadow-medium relative overflow-hidden" 
              style={{ width: `${metrics.sprintProgress || 0}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Premium */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {columns.map((column) => {
          const StatusIcon = getStatusIcon(column.status);
          const columnTasks = getTasksByStatus(column.status);
          
          return (
            <div 
              key={column.id} 
              className={`rounded-xl border-2 ${column.color} min-h-96 shadow-galaxy overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/80 backdrop-blur-lg'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className={`p-4 border-b ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-gray-700/50 to-transparent border-gray-700' 
                  : 'bg-gradient-to-r from-white/50 to-transparent border-primary-200/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-primary-600'}`} />
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-primary-900'}`}>{column.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium shadow-soft ${
                      theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-primary-100 text-primary-600'
                    }`}>
                      {columnTasks.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {columnTasks.map((task) => (
                  <div 
                    key={task._id} 
                    className={`border rounded-xl p-4 hover:shadow-large transition-all duration-300 cursor-move group overflow-hidden relative ${
                      theme === 'dark' ? 'bg-gray-700/90 border-gray-600' : 'bg-white/90 backdrop-blur-sm border-primary-200'
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-blue-900/30 via-transparent to-purple-900/30'
                        : 'bg-gradient-to-br from-white/50 via-transparent to-primary-50/30'
                    }`}></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className={`font-medium text-sm leading-tight group-hover:text-primary-700 transition-colors ${
                          theme === 'dark' ? 'text-white' : 'text-primary-900'
                        }`}>
                          {task.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium shadow-soft ${getPriorityColorLocal(task.priority)}`}>
                          {formatPriorityText(task.priority)}
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className={`text-xs mb-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {task.description}
                        </p>
                      )}
                      
                      <div className={`flex items-center justify-between text-xs ${
                        theme === 'dark' ? 'text-gray-300' : 'text-primary-600'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span className={`px-2 py-1 rounded-full ${
                            theme === 'dark' ? 'bg-gray-600 text-gray-200' : 'bg-primary-50 text-primary-700'
                          }`}>
                            {formatAssigneeName(task.assignee)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span className={`px-2 py-1 rounded-full font-medium ${
                            theme === 'dark' ? 'bg-gray-600 text-gray-200' : 'bg-primary-50 text-primary-700'
                          }`}>
                            {task.storyPoints || 0} pts
                          </span>
                        </div>
                      </div>

                      {task.dueDate && (
                        <div className="flex items-center gap-1 mt-2 text-xs">
                          <Clock className={`h-3 w-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`${
                            new Date(task.dueDate) < new Date() && task.status !== 'done' 
                              ? 'text-red-600' 
                              : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-primary-400'}`}>
                    <StatusIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay tareas en esta columna</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Performance Summary Premium */}
      <div className={`rounded-xl shadow-galaxy border-0 p-6 overflow-hidden relative ${
        theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/80 backdrop-blur-lg'
      }`}>
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20' : 'bg-gradient-to-r from-primary-500/5 via-transparent to-accent-500/5'}`}></div>
        <div className="relative z-10">
          <h3 className={`text-lg font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-primary-900'}`}>
            <BarChart3 className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-primary-600'}`} />
            Resumen del Equipo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center group">
              <div className={`p-4 rounded-xl shadow-soft group-hover:shadow-medium transition-shadow duration-300 ${
                theme === 'dark' ? 'bg-blue-900/30' : 'bg-gradient-to-br from-primary-50 to-primary-100'
              }`}>
                <div className={`text-3xl font-bold mb-1 ${
                  theme === 'dark' ? 'text-blue-300' : 'text-primary-600'
                }`}>{Math.round(metrics.sprintProgress || 0)}%</div>
                <div className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-blue-400' : 'text-primary-600'
                }`}>Progreso General</div>
              </div>
            </div>
            <div className="text-center group">
              <div className={`p-4 rounded-xl shadow-soft group-hover:shadow-medium transition-shadow duration-300 ${
                theme === 'dark' ? 'bg-green-900/30' : 'bg-gradient-to-br from-success-50 to-success-100'
              }`}>
                <div className={`text-3xl font-bold mb-1 ${
                  theme === 'dark' ? 'text-green-300' : 'text-success-600'
                }`}>
                  {new Set(tasks.filter(t => t.assignee).map(t => formatAssigneeName(t.assignee))).size}
                </div>
                <div className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-green-400' : 'text-success-600'
                }`}>Miembros Activos</div>
              </div>
            </div>
            <div className="text-center group">
              <div className={`p-4 rounded-xl shadow-soft group-hover:shadow-medium transition-shadow duration-300 ${
                theme === 'dark' ? 'bg-yellow-900/30' : 'bg-gradient-to-br from-warning-50 to-warning-100'
              }`}>
                <div className={`text-3xl font-bold mb-1 ${
                  theme === 'dark' ? 'text-yellow-300' : 'text-warning-600'
                }`}>{daysRemaining}</div>
                <div className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-warning-600'
                }`}>Días Restantes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintBoard;
