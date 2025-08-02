import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  BarChart3,
  Calendar,
  Target,
  Timer,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { useDeveloperTasks } from '../../hooks/useDeveloperTasks';

const TimeTracking = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  const { 
    entries, 
    activeTimer, 
    stats,
    loading: timeLoading, 
    error: timeError,
    startTimer,
    stopTimer,
    refresh,
    isTimerRunning,
    formattedTimerTime
  } = useTimeTracking();
  
  const { 
    tasks, 
    loading: tasksLoading, 
    error: tasksError,
    refresh: refreshTasks
  } = useDeveloperTasks();

  useEffect(() => {
    // refresh();
    refreshTasks();
  }, [refreshTasks]);

  const loading = timeLoading || tasksLoading;
  const error = timeError || tasksError;

  const formatTime = (minutes) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleStartTracking = async (taskId) => {
    try {
      await startTimer(taskId);
    } catch (error) {
      console.error('Error iniciando tracking:', error);
    }
  };

  const handleStopTracking = async () => {
    try {
      await stopTimer();
    } catch (error) {
      console.error('Error deteniendo tracking:', error);
    }
  };

  const getTaskTimeData = (taskId) => {
    const taskSessions = entries.filter(entry => entry.task && entry.task._id === taskId);
    const totalTime = taskSessions.reduce((total, session) => total + (session.duration || 0), 0);
    
    const today = new Date().toDateString();
    const todayTime = taskSessions
      .filter(session => new Date(session.date).toDateString() === today)
      .reduce((total, session) => total + (session.duration || 0), 0);
    
    return { totalTime, todayTime };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <RefreshCw className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando datos de time tracking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => {
              refresh();
              refreshTasks();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Clock className="h-6 w-6 mr-3 text-blue-600" />
              Time Tracking
            </h1>
            <p className="text-gray-600 mt-1">Controla y registra el tiempo dedicado a tus tareas</p>
          </div>
          
          {/* Timer actual */}
          {isTimerRunning && activeTimer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 rounded-full p-2">
                  <Timer className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-900">
                    {tasks.find(t => t._id === activeTimer.task?._id)?.title || activeTimer.task?.title || 'Tarea desconocida'}
                  </div>
                  <div className="text-xs text-blue-700">
                    Tiempo transcurrido: {formattedTimerTime}
                  </div>
                </div>
                <button 
                  onClick={handleStopTracking}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                >
                  <Square className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(stats?.todayMinutes || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Esta Semana</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(stats?.weekMinutes || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Promedio Diario</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(stats?.averageDailyMinutes || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Sesiones Activas</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeSessions || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Time Tracking */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Tareas Activas</h3>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Hoy</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas disponibles</h3>
              <p className="text-gray-600">No tienes tareas asignadas para hacer tracking de tiempo.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                const { totalTime, todayTime } = getTaskTimeData(task._id);
                const isTaskTracking = isTimerRunning && activeTimer?.task?._id === task._id;
                
                return (
                  <div key={task._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Total: {formatTime(totalTime)}</span>
                        <span>•</span>
                        <span>Hoy: {formatTime(todayTime)}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'done' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status === 'in_progress' ? 'En Progreso' :
                           task.status === 'done' ? 'Completada' : 'Por Hacer'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isTaskTracking && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full animate-pulse">
                          Activa
                        </span>
                      )}
                      
                      {!isTimerRunning ? (
                        <button
                          onClick={() => handleStartTracking(task._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                          title="Iniciar tracking"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      ) : isTaskTracking ? (
                        <button
                          onClick={handleStopTracking}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                          title="Detener tracking"
                        >
                          <Square className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-500 p-2 rounded-lg cursor-not-allowed"
                          title="Otra tarea está siendo trackeada"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-gray-600" />
          Resumen Semanal
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.round((stats?.weekMinutes || 0) / 60 * 10) / 10}h
            </div>
            <div className="text-sm text-gray-600">Total de Horas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {Math.round((stats?.averageDailyMinutes || 0) / 60 * 10) / 10}h
            </div>
            <div className="text-sm text-gray-600">Promedio Diario</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {entries.length}
            </div>
            <div className="text-sm text-gray-600">Sesiones Totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {stats?.activeSessions || 0}
            </div>
            <div className="text-sm text-gray-600">Sesiones Activas</div>
          </div>
        </div>

        {/* Weekly Chart Placeholder */}
        <div className="mt-6 bg-gray-50 rounded-lg p-8 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Gráfico de productividad semanal</p>
          <p className="text-sm text-gray-500 mt-1">Próximamente disponible</p>
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;
