import React, { useState, useCallback } from 'react';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  Zap, 
  Play, 
  Pause, 
  MoreHorizontal,
  Filter,
  Search,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useDeveloperTasks } from '../../hooks/useDeveloperTasks';
import { useTimeTracking } from '../../hooks/useTimeTracking';

const MyTasks = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  // Hooks para datos
  const {
    tasks,
    loading,
    error,
    pagination,
    updateTaskStatus,
    applyFilters,
    changePage,
    refresh,
    setError: setTaskError
  } = useDeveloperTasks();

  const {
    startTimer,
    stopTimer,
    activeTimer,
    isTimerRunning,
    formattedTimerTime,
    setError: setTimerError
  } = useTimeTracking();

  // Manejar cambio de filtro de estado
  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
    applyFilters({
      status: newFilter === 'all' ? undefined : newFilter,
      priority: selectedPriority || undefined,
      search: searchTerm || undefined
    });
  }, [applyFilters, selectedPriority, searchTerm]);

  // Manejar cambio de prioridad
  const handlePriorityChange = useCallback((newPriority) => {
    setSelectedPriority(newPriority);
    applyFilters({
      status: filter === 'all' ? undefined : filter,
      priority: newPriority || undefined,
      search: searchTerm || undefined
    });
  }, [applyFilters, filter, searchTerm]);

  // Manejar búsqueda
  const handleSearch = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    applyFilters({
      status: filter === 'all' ? undefined : filter,
      priority: selectedPriority || undefined,
      search: newSearchTerm || undefined
    });
  }, [applyFilters, filter, selectedPriority]);

  // Manejar actualización de estado de tarea
  const handleStatusUpdate = useCallback(async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  }, [updateTaskStatus]);

  // Manejar inicio/parada de timer
  const handleTimerToggle = useCallback(async (taskId) => {
    try {
      if (isTimerRunning && activeTimer?.task?._id === taskId) {
        // Detener timer actual
        await stopTimer('Trabajo en progreso');
      } else if (isTimerRunning) {
        // Cambiar a otra tarea
        await stopTimer('Cambio de tarea');
        await startTimer(taskId);
      } else {
        // Iniciar timer
        await startTimer(taskId);
      }
    } catch (error) {
      console.error('Error con el timer:', error);
      setTimerError(error.message);
    }
  }, [isTimerRunning, activeTimer, startTimer, stopTimer, setTimerError]);

  // Obtener información de estado
  const getStatusInfo = (status) => {
    const statusConfig = {
      todo: { label: 'Por Hacer', color: 'bg-gray-100 text-gray-800', icon: Clock },
      in_progress: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800', icon: Zap },
      code_review: { label: 'Code Review', color: 'bg-purple-100 text-purple-800', icon: Target },
      testing: { label: 'Testing', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      done: { label: 'Completado', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };
    return statusConfig[status] || statusConfig.todo;
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'border-green-500 bg-green-50/50',
      medium: 'border-yellow-500 bg-yellow-50/50',
      high: 'border-orange-500 bg-orange-50/50',
      critical: 'border-red-500 bg-red-50/50'
    };
    return colors[priority] || colors.medium;
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Componente de loading
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Tareas</h1>
              <p className="text-gray-600">Gestiona tus tareas asignadas</p>
            </div>
          </div>
        </div>

        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Tareas</h1>
            <p className="text-gray-600">
              {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} asignada{tasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Actualizar
        </button>
      </div>

      {/* Timer activo */}
      {isTimerRunning && activeTimer && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-blue-900">Timer activo</p>
                <p className="text-sm text-blue-700">{activeTimer.task?.title}</p>
              </div>
            </div>
            <div className="text-xl font-mono font-bold text-blue-900">
              {formattedTimerTime}
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap gap-4">
          {/* Filtro de estado */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Todos los estados</option>
              <option value="todo">Por Hacer</option>
              <option value="in_progress">En Progreso</option>
              <option value="code_review">Code Review</option>
              <option value="testing">Testing</option>
              <option value="done">Completado</option>
            </select>
          </div>

          {/* Filtro de prioridad */}
          <select
            value={selectedPriority}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Todas las prioridades</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>

          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar tareas..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Lista de tareas */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'No tienes tareas asignadas en este momento'
                : `No hay tareas con el filtro "${filter}"`}
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            const StatusIcon = statusInfo.icon;
            const isActiveTimer = activeTimer?.task?._id === task._id;
            
            return (
              <div 
                key={task._id} 
                className={`border-l-4 ${getPriorityColor(task.priority)} p-6 rounded-r-xl bg-white hover:shadow-md transition-all duration-300 group`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {/* Timer Button */}
                        <button
                          onClick={() => handleTimerToggle(task._id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isActiveTimer 
                              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={isActiveTimer ? 'Detener timer' : 'Iniciar timer'}
                        >
                          {isActiveTimer ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                        
                        {/* More options */}
                        <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-gray-600 mb-3 text-sm">{task.description}</p>
                    )}

                    <div className="flex items-center flex-wrap gap-3 mb-4">
                      {/* Estado */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} flex items-center shadow-sm`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>

                      {/* Story Points */}
                      {task.storyPoints && (
                        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                          {task.storyPoints} SP
                        </span>
                      )}

                      {/* Sprint */}
                      {task.sprint && (
                        <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {task.sprint.name || task.sprint.nombre}
                        </span>
                      )}

                      {/* Tiempo trabajado */}
                      {task.spentHours > 0 && (
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          {task.spentHours}h trabajadas
                        </span>
                      )}
                    </div>

                    {/* Fechas */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {task.createdAt && (
                        <span>Creada: {formatDate(task.createdAt)}</span>
                      )}
                      {task.dueDate && (
                        <span>Vence: {formatDate(task.dueDate)}</span>
                      )}
                      {task.updatedAt && (
                        <span>Actualizada: {formatDate(task.updatedAt)}</span>
                      )}
                    </div>

                    {/* Acciones de estado */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-sm text-gray-600">Cambiar estado:</span>
                      <div className="flex gap-1">
                        {['todo', 'in_progress', 'code_review', 'testing', 'done'].map((status) => {
                          if (status === task.status) return null;
                          const statusInfo = getStatusInfo(status);
                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusUpdate(task._id, status)}
                              className={`px-2 py-1 text-xs rounded ${statusInfo.color} hover:opacity-80 transition-opacity`}
                              title={`Cambiar a ${statusInfo.label}`}
                            >
                              {statusInfo.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Paginación */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => changePage(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          
          <span className="px-3 py-2 text-sm text-gray-600">
            Página {pagination.current} de {pagination.pages}
          </span>
          
          <button
            onClick={() => changePage(pagination.current + 1)}
            disabled={pagination.current === pagination.pages}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
