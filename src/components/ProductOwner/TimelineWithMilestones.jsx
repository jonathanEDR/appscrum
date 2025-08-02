import React from 'react';
import { Calendar, CheckCircle, Edit, Trash2, Users, Target, Clock } from 'lucide-react';
import SprintMetrics from './SprintMetrics';

const TimelineWithMilestones = ({ 
  releases, 
  sprints,
  onEditRelease, 
  onDeleteRelease,
  onEditSprint,
  onSprintAction,
  getEstadoColor, 
  formatearFecha,
  calcularProgresoReal,
  milestones = []
}) => {
  
  // Función para determinar los milestones del año
  const generateMilestones = () => {
    const currentYear = new Date().getFullYear();
    return [
      { date: `${currentYear}-03-31`, label: 'Q1 2025', icon: '🎯', type: 'quarter' },
      { date: `${currentYear}-06-30`, label: 'Q2 2025', icon: '📈', type: 'quarter' },
      { date: `${currentYear}-09-30`, label: 'Q3 2025', icon: '🚀', type: 'quarter' },
      { date: `${currentYear}-12-31`, label: 'Q4 2025', icon: '🎉', type: 'quarter' },
      ...milestones
    ];
  };

  // Organizar sprints por release
  const sprintsByRelease = sprints.reduce((acc, sprint) => {
    const releaseId = sprint.release_id || 'independent';
    if (!acc[releaseId]) acc[releaseId] = [];
    acc[releaseId].push(sprint);
    return acc;
  }, {});

  // Sprints independientes
  const independentSprints = sprintsByRelease.independent || [];

  // Calcular alertas para timeline
  const calculateTimelineAlerts = () => {
    const alerts = [];
    const today = new Date();
    
    releases.forEach(release => {
      const fechaObjetivo = new Date(release.fecha_objetivo);
      const diasRestantes = Math.ceil((fechaObjetivo - today) / (1000 * 60 * 60 * 24));
      const progreso = calcularProgresoReal(release);
      
      // Release en riesgo
      if (diasRestantes < 30 && progreso < 80 && release.estado !== 'lanzado') {
        alerts.push({
          id: `risk-${release._id}`,
          type: 'warning',
          message: `Release ${release.nombre} en riesgo: ${progreso}% completado, ${diasRestantes} días restantes`
        });
      }
      
      // Release retrasado
      if (diasRestantes < 0 && release.estado !== 'lanzado') {
        alerts.push({
          id: `delayed-${release._id}`,
          type: 'error',
          message: `Release ${release.nombre} retrasado por ${Math.abs(diasRestantes)} días`
        });
      }
    });

    // Sprints sin release cerca de fechas importantes
    independentSprints.forEach(sprint => {
      const fechaFin = new Date(sprint.fecha_fin);
      releases.forEach(release => {
        const fechaObjetivo = new Date(release.fecha_objetivo);
        const diferenciaDias = Math.abs((fechaFin - fechaObjetivo) / (1000 * 60 * 60 * 24));
        
        if (diferenciaDias < 14) {
          alerts.push({
            id: `orphan-${sprint._id}`,
            type: 'info',
            message: `Sprint "${sprint.nombre}" termina cerca del Release ${release.nombre} - ¿Debería asociarse?`
          });
        }
      });
    });

    return alerts;
  };

  const timelineAlerts = calculateTimelineAlerts();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Vista Timeline Avanzada</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Target size={16} />
          <span>{releases.length} Releases • {sprints.length} Sprints</span>
        </div>
      </div>

      {/* Alertas de Timeline */}
      {timelineAlerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {timelineAlerts.map(alert => (
            <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
              alert.type === 'error' ? 'bg-red-50 border-red-400 text-red-700' :
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' :
              'bg-blue-50 border-blue-400 text-blue-700'
            }`}>
              <p className="text-sm">{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Milestones */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-700 mb-4">Milestones 2025</h4>
        <div className="flex flex-wrap gap-4">
          {generateMilestones().map((milestone, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-lg">{milestone.icon}</span>
              <div>
                <span className="text-sm font-medium text-purple-700">{milestone.label}</span>
                <div className="text-xs text-purple-600">{formatearFecha(milestone.date)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Releases con sus sprints asociados */}
        {releases.map(release => {
          const releaseSprintList = sprintsByRelease[release._id] || [];
          const progreso = calcularProgresoReal(release);
          
          return (
            <div key={release._id} className="border-l-4 border-purple-200 pl-6 relative">
              {/* Línea temporal */}
              <div className="absolute left-0 top-0 w-4 h-4 bg-purple-600 rounded-full -translate-x-2 border-2 border-white shadow-md"></div>
              
              {/* Contenido del release */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-5 mb-4 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-bold text-gray-900">🎯 {release.nombre}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(release.estado)}`}>
                      {release.estado.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-purple-600 font-semibold">v{release.version}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditRelease(release)}
                      className="p-2 text-gray-600 hover:text-blue-600 bg-white rounded-lg shadow-sm"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteRelease(release._id)}
                      className="p-2 text-gray-600 hover:text-red-600 bg-white rounded-lg shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{release.descripcion}</p>
                
                {/* Métricas del release */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>Objetivo: {formatearFecha(release.fecha_objetivo)}</span>
                    </div>
                  </div>
                  
                  {release.fecha_lanzamiento && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={16} />
                        <span>Lanzado: {formatearFecha(release.fecha_lanzamiento)}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} />
                      <span>{releaseSprintList.length} Sprint{releaseSprintList.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                
                {/* Barra de progreso del release */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-700 mb-2">
                    <span>Progreso del Release</span>
                    <span className="font-semibold">{progreso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        progreso >= 100 ? 'bg-green-500' :
                        progreso >= 75 ? 'bg-blue-500' :
                        progreso >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${progreso}%` }}
                    ></div>
                  </div>
                </div>

                {/* Sprints asociados al release */}
                {releaseSprintList.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Sprints Asociados:</h5>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {releaseSprintList
                        .sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio))
                        .map(sprint => (
                          <SprintMetrics 
                            key={sprint._id} 
                            sprint={{...sprint, release_nombre: release.nombre}} 
                            className="bg-white"
                          />
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Sprints Independientes */}
        {independentSprints.length > 0 && (
          <div className="border-l-4 border-gray-300 pl-6 relative">
            <div className="absolute left-0 top-0 w-4 h-4 bg-gray-400 rounded-full -translate-x-2 border-2 border-white shadow-md"></div>
            
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <h4 className="text-xl font-bold text-gray-900">🔄 Sprints Independientes</h4>
                <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                  {independentSprints.length} Sprint{independentSprints.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">
                Sprints no asociados a ningún release específico
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {independentSprints
                  .sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio))
                  .map(sprint => (
                    <SprintMetrics 
                      key={sprint._id} 
                      sprint={sprint} 
                      className="bg-white"
                    />
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineWithMilestones;
