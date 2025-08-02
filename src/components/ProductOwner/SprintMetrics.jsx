import React from 'react';

const SprintMetrics = ({ sprint, className = '' }) => {
  // Función para calcular burndown
  const calculateBurndown = (sprint) => {
    if (!sprint?.metricas?.burndown_data || sprint.metricas.burndown_data.length === 0) {
      return { percentage: sprint?.progreso || 0, trend: 'neutral' };
    }
    
    const data = sprint.metricas.burndown_data;
    const latest = data[data.length - 1];
    const total = latest.trabajo_restante + latest.trabajo_completado;
    
    if (total === 0) return { percentage: 0, trend: 'neutral' };
    
    const percentage = Math.round((latest.trabajo_completado / total) * 100);
    
    // Calcular tendencia
    let trend = 'neutral';
    if (data.length > 1) {
      const previous = data[data.length - 2];
      const prevTotal = previous.trabajo_restante + previous.trabajo_completado;
      const prevPercentage = prevTotal > 0 ? (previous.trabajo_completado / prevTotal) * 100 : 0;
      
      if (percentage > prevPercentage) trend = 'up';
      else if (percentage < prevPercentage) trend = 'down';
    }
    
    return { percentage, trend };
  };

  // Función para calcular velocity trend
  const calculateVelocityTrend = (sprint) => {
    if (!sprint?.metricas?.velocity_history || sprint.metricas.velocity_history.length === 0) {
      return { current: sprint?.velocidad_real || sprint?.velocidad_planificada || 0, trend: 'neutral' };
    }
    
    const history = sprint.metricas.velocity_history;
    const current = history[history.length - 1].velocity_achieved;
    
    let trend = 'neutral';
    if (history.length > 1) {
      const previous = history[history.length - 2].velocity_achieved;
      if (current > previous) trend = 'up';
      else if (current < previous) trend = 'down';
    }
    
    return { current, trend };
  };

  const burndownData = calculateBurndown(sprint);
  const velocityTrend = calculateVelocityTrend(sprint);

  // Función para obtener color basado en prioridad
  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener emoji de prioridad
  const getPriorityEmoji = (prioridad) => {
    switch (prioridad) {
      case 'critica': return '🔴';
      case 'alta': return '🟠';
      case 'media': return '🟡';
      case 'baja': return '🟢';
      default: return '⚪';
    }
  };

  // Función para obtener color de estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completado': return 'bg-green-100 text-green-800';
      case 'activo': return 'bg-blue-100 text-blue-800';
      case 'planificado': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!sprint) {
    return (
      <div className={`sprint-metrics p-4 bg-gray-50 rounded-lg ${className}`}>
        <p className="text-gray-500 text-center">No hay datos de sprint disponibles</p>
      </div>
    );
  }

  return (
    <div className={`sprint-metrics bg-white border rounded-lg p-4 shadow-sm ${className}`}>
      {/* Header con nombre y estado */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-gray-900">{sprint.nombre}</h4>
          <p className="text-sm text-gray-600">{sprint.objetivo}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(sprint.prioridad)}`}>
            {getPriorityEmoji(sprint.prioridad)} {sprint.prioridad?.charAt(0).toUpperCase() + sprint.prioridad?.slice(1)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(sprint.estado)}`}>
            {sprint.estado?.charAt(0).toUpperCase() + sprint.estado?.slice(1)}
          </span>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="metric text-center">
          <div className="text-2xl font-bold text-blue-600">
            {velocityTrend.current}
          </div>
          <div className="text-xs text-gray-500 flex items-center justify-center">
            Velocity
            {velocityTrend.trend === 'up' && <span className="ml-1 text-green-500">↗️</span>}
            {velocityTrend.trend === 'down' && <span className="ml-1 text-red-500">↘️</span>}
            {velocityTrend.trend === 'neutral' && <span className="ml-1 text-gray-400">→</span>}
          </div>
        </div>

        <div className="metric text-center">
          <div className="text-2xl font-bold text-green-600">
            {sprint.capacidad_equipo || 0}h
          </div>
          <div className="text-xs text-gray-500">Capacidad</div>
        </div>

        <div className="metric text-center">
          <div className="text-2xl font-bold text-purple-600">
            {burndownData.percentage}%
          </div>
          <div className="text-xs text-gray-500 flex items-center justify-center">
            Progreso
            {burndownData.trend === 'up' && <span className="ml-1 text-green-500">↗️</span>}
            {burndownData.trend === 'down' && <span className="ml-1 text-red-500">↘️</span>}
            {burndownData.trend === 'neutral' && <span className="ml-1 text-gray-400">→</span>}
          </div>
        </div>

        <div className="metric text-center">
          <div className="text-2xl font-bold text-orange-600">
            {sprint.velocidad_planificada || 0}
          </div>
          <div className="text-xs text-gray-500">Planificado</div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progreso del Sprint</span>
          <span>{burndownData.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${burndownData.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Inicio:</span>
          <span className="ml-2 font-medium">
            {sprint.fecha_inicio ? new Date(sprint.fecha_inicio).toLocaleDateString('es-ES') : 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Fin:</span>
          <span className="ml-2 font-medium">
            {sprint.fecha_fin ? new Date(sprint.fecha_fin).toLocaleDateString('es-ES') : 'N/A'}
          </span>
        </div>
      </div>

      {/* Release asociado si existe */}
      {sprint.release_id && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center text-sm">
            <span className="text-gray-500">🎯 Release:</span>
            <span className="ml-2 font-medium text-blue-600">
              {sprint.release_nombre || `Release ID: ${sprint.release_id}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintMetrics;
