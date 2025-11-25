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
import { useTheme } from '../../context/ThemeContext';

const TimeTracking = () => {
  const { theme } = useTheme();
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
    formattedTimerTime,
    timerSeconds
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
    if (!minutes) return '0s';
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.round((minutes % 1) * 60);
    
    if (hours > 0) {
      if (mins > 0) return `${hours}h ${mins}m`;
      return `${hours}h`;
    }
    if (mins > 0) {
      if (secs > 0) return `${mins}m ${secs}s`;
      return `${mins}m`;
    }
    return `${secs}s`;
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
      // Refrescar tareas para actualizar los tiempos
      await refresh();
    } catch (error) {
      console.error('Error deteniendo tracking:', error);
    }
  };

  const getTaskTimeData = (taskId) => {
    const taskSessions = entries.filter(entry => entry.task && entry.task._id === taskId);
    // duration viene en segundos desde el backend, convertimos a minutos con decimales
    const totalMinutes = taskSessions.reduce((total, session) => {
      const seconds = session.duration || 0;
      return total + (seconds / 60);
    }, 0);
    
    const today = new Date().toDateString();
    const todayMinutes = taskSessions
      .filter(session => new Date(session.date).toDateString() === today)
      .reduce((total, session) => {
        const seconds = session.duration || 0;
        return total + (seconds / 60);
      }, 0);
    
    // Si el timer está activo para esta tarea, agregar el tiempo actual
    let adjustedTodayTime = todayMinutes;
    let adjustedTotalTime = totalMinutes;
    
    if (isTimerRunning && activeTimer?.task?._id === taskId) {
      const currentMinutes = timerSeconds / 60;
      adjustedTodayTime += currentMinutes;
      adjustedTotalTime += currentMinutes;
    }
    
    return { 
      totalTime: adjustedTotalTime, 
      todayTime: adjustedTodayTime 
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className={`rounded-xl shadow-sm border p-12 text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <RefreshCw className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Cargando datos de time tracking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className={`rounded-xl shadow-sm border p-12 text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Error al cargar datos</h3>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
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
      <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <Clock className="h-6 w-6 mr-3 text-blue-600" />
              Time Tracking
            </h1>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Controla y registra el tiempo dedicado a tus tareas</p>
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
                    {activeTimer.task?.titulo || activeTimer.task?.title || 'Tarea desconocida'}
                  </div>
                  <div className="text-xs text-blue-700">
                    Tiempo transcurrido: {formattedTimerTime}
                  </div>
                </div>
                <button 
                  onClick={handleStopTracking}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                  title="Detener timer"
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
        <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Hoy</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatTime(stats?.todayMinutes || 0)}</p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Esta Semana</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatTime(stats?.weekMinutes || 0)}</p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Promedio Diario</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatTime(stats?.averageDailyMinutes || 0)}</p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sesiones Activas</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats?.activeSessions || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Time Tracking */}
      <div className={`rounded-xl shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Tareas Activas</h3>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className={`px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900'
              }`}
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
              <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No hay tareas disponibles</h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No tienes tareas asignadas para hacer tracking de tiempo.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                const { totalTime, todayTime } = getTaskTimeData(task._id);
                const isTaskTracking = isTimerRunning && activeTimer?.task?._id === task._id;
                
                return (
                  <div 
                    key={task._id} 
                    className={`relative border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                      isTaskTracking 
                        ? 'border-blue-500 bg-blue-50 shadow-lg' 
                        : theme === 'dark'
                          ? 'border-gray-700 bg-gray-700 hover:border-gray-600 hover:shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {/* Barra superior con estado y badge activo */}
                    <div className={`px-4 py-2 flex items-center justify-between ${
                      isTaskTracking ? 'bg-blue-100' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        task.estado === 'en_progreso' || task.status === 'in_progress' ? 'bg-blue-500 text-white' :
                        task.estado === 'completada' || task.status === 'done' ? 'bg-green-500 text-white' :
                        'bg-gray-400 text-white'
                      }`}>
                        {task.estado === 'en_progreso' || task.status === 'in_progress' ? '🚀 En Progreso' :
                         task.estado === 'completada' || task.status === 'done' ? '✅ Completada' : '📋 Por Hacer'}
                      </span>
                      
                      {isTaskTracking && (
                        <span className="flex items-center gap-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-pulse font-semibold">
                          <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                          ACTIVA
                        </span>
                      )}
                    </div>

                    {/* Contenido principal */}
                    <div className="p-4">
                      {/* Título de la tarea */}
                      <h4 className={`font-semibold text-lg mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{task.titulo || task.title}</h4>
                      
                      {/* Grid de tiempos */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {/* Total */}
                        <div className={`rounded-lg p-3 border ${
                          theme === 'dark' 
                            ? 'bg-purple-900/30 border-purple-800' 
                            : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-purple-600" />
                            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>Total</span>
                          </div>
                          <p className={`text-lg font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-900'}`}>{formatTime(totalTime)}</p>
                        </div>

                        {/* Hoy */}
                        <div className={`rounded-lg p-3 border ${
                          theme === 'dark' 
                            ? 'bg-blue-900/30 border-blue-800' 
                            : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>Hoy</span>
                          </div>
                          <p className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>{formatTime(todayTime)}</p>
                        </div>

                        {/* Tiempo en progreso (solo si está activa) */}
                        {isTaskTracking ? (
                          <div className={`rounded-lg p-3 border ${
                            theme === 'dark' 
                              ? 'bg-green-900/30 border-green-800' 
                              : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-green-600" />
                              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>En Curso</span>
                            </div>
                            <p className={`text-lg font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-900'}`}>{formattedTimerTime}</p>
                          </div>
                        ) : (
                          <div className={`rounded-lg p-3 border ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600' 
                              : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sesión</span>
                            </div>
                            <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>--</p>
                          </div>
                        )}
                      </div>

                      {/* Botones de acción */}
                      <div className="flex justify-end">
                        {!isTimerRunning ? (
                          <button
                            onClick={() => handleStartTracking(task._id)}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                            title="Iniciar tracking"
                          >
                            <Play className="h-4 w-4" />
                            Iniciar Timer
                          </button>
                        ) : isTaskTracking ? (
                          <button
                            onClick={handleStopTracking}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                            title="Detener tracking"
                          >
                            <Square className="h-4 w-4" />
                            Detener Timer
                          </button>
                        ) : (
                          <button
                            disabled
                            className="flex items-center gap-2 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed font-medium"
                            title="Otra tarea está siendo trackeada"
                          >
                            <Play className="h-4 w-4" />
                            Timer en Uso
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Overview */}
      <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <BarChart3 className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          Resumen Semanal
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.round((stats?.weekMinutes || 0) / 60 * 10) / 10}h
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total de Horas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {Math.round((stats?.averageDailyMinutes || 0) / 60 * 10) / 10}h
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Promedio Diario</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {entries.length}
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sesiones Totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {stats?.activeSessions || 0}
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sesiones Activas</div>
          </div>
        </div>

        {/* Weekly Chart Placeholder */}
        <div className={`mt-6 rounded-lg p-8 text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Gráfico de productividad semanal</p>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Próximamente disponible</p>
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;
