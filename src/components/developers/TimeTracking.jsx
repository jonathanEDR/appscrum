import React, { useState } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  BarChart3,
  Calendar,
  Target,
  Timer,
  TrendingUp
} from 'lucide-react';

const TimeTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [timeFilter, setTimeFilter] = useState('today');

  const tasks = [
    { 
      id: 1, 
      title: 'Implementar autenticación JWT', 
      totalTime: 320, // minutos
      todayTime: 180,
      isActive: true,
      sessions: [
        { start: '09:00', end: '11:00', duration: 120 },
        { start: '14:00', end: '15:00', duration: 60 }
      ]
    },
    { 
      id: 2, 
      title: 'Corregir bug en validación', 
      totalTime: 0,
      todayTime: 0,
      isActive: false,
      sessions: []
    },
    { 
      id: 3, 
      title: 'Optimizar consultas DB', 
      totalTime: 360,
      todayTime: 0,
      isActive: false,
      sessions: [
        { start: '10:00', end: '16:00', duration: 360, date: '2025-01-07' }
      ]
    },
    { 
      id: 4, 
      title: 'Tests unitarios', 
      totalTime: 180,
      todayTime: 90,
      isActive: false,
      sessions: [
        { start: '16:00', end: '17:30', duration: 90 }
      ]
    }
  ];

  const weeklyStats = {
    totalHours: 15.5,
    dailyAverage: 3.1,
    mostProductiveDay: 'Miércoles',
    tasksCompleted: 2
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const startTracking = (task) => {
    setCurrentTask(task);
    setIsTracking(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setCurrentTask(null);
  };

  const getTodayTotal = () => {
    return tasks.reduce((total, task) => total + task.todayTime, 0);
  };

  const getWeekTotal = () => {
    return tasks.reduce((total, task) => total + task.totalTime, 0);
  };

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
          {isTracking && currentTask && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 rounded-full p-2">
                  <Timer className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-900">{currentTask.title}</div>
                  <div className="text-xs text-blue-700">Tiempo activo: 0h 23m</div>
                </div>
                <button 
                  onClick={stopTracking}
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
              <p className="text-2xl font-bold text-gray-900">{formatTime(getTodayTotal())}</p>
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
              <p className="text-2xl font-bold text-gray-900">{formatTime(getWeekTotal())}</p>
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
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.dailyAverage}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Tareas Completadas</p>
              <p className="text-2xl font-bold text-gray-900">{weeklyStats.tasksCompleted}</p>
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
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>Total: {formatTime(task.totalTime)}</span>
                    <span>•</span>
                    <span>Hoy: {formatTime(task.todayTime)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {task.isActive && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Activa
                    </span>
                  )}
                  
                  {!isTracking ? (
                    <button
                      onClick={() => startTracking(task)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  ) : currentTask?.id === task.id ? (
                    <button
                      onClick={stopTracking}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Square className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-300 text-gray-500 p-2 rounded-lg cursor-not-allowed"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
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
            <div className="text-2xl font-bold text-blue-600 mb-1">{weeklyStats.totalHours}h</div>
            <div className="text-sm text-gray-600">Total de Horas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{weeklyStats.dailyAverage}h</div>
            <div className="text-sm text-gray-600">Promedio Diario</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{weeklyStats.mostProductiveDay}</div>
            <div className="text-sm text-gray-600">Día Más Productivo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{weeklyStats.tasksCompleted}</div>
            <div className="text-sm text-gray-600">Tareas Completadas</div>
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
