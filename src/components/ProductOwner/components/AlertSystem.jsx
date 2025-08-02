import React from 'react';
import { AlertTriangle, Clock, CheckCircle, X } from 'lucide-react';

const AlertSystem = ({ releases = [], sprints = [], alerts = [] }) => {
  const getSystemAlerts = () => {
    const systemAlerts = [];
    const today = new Date();
    
    // Solo procesar si hay datos
    if (!releases || !sprints) return [];
    
    // Alertas de releases retrasados
    releases.forEach(release => {
      if (!release.fecha_objetivo) return;
      
      const fechaObjetivo = new Date(release.fecha_objetivo);
      const diasRestantes = Math.ceil((fechaObjetivo - today) / (1000 * 60 * 60 * 24));
      
      if (diasRestantes < 30 && diasRestantes > 0 && release.estado !== 'lanzado') {
        systemAlerts.push({
          type: 'warning',
          message: `Release "${release.nombre}" vence en ${diasRestantes} días`,
          item: release,
          priority: diasRestantes < 7 ? 'alta' : 'media'
        });
      }
      
      if (diasRestantes < 0 && release.estado !== 'lanzado') {
        systemAlerts.push({
          type: 'danger',
          message: `Release "${release.nombre}" está retrasado ${Math.abs(diasRestantes)} días`,
          item: release,
          priority: 'critica'
        });
      }
      
      if ((release.progreso || 0) < 50 && diasRestantes < 14 && release.estado !== 'lanzado') {
        systemAlerts.push({
          type: 'danger',
          message: `Release "${release.nombre}" con bajo progreso (${release.progreso || 0}%)`,
          item: release,
          priority: 'critica'
        });
      }
    });
    
    // Alertas de sprints
    sprints.forEach(sprint => {
      if (!sprint.fecha_fin) return;
      
      const fechaFin = new Date(sprint.fecha_fin);
      const diasRestantes = Math.ceil((fechaFin - today) / (1000 * 60 * 60 * 24));
      
      if (sprint.estado === 'activo' && diasRestantes < 3 && diasRestantes > 0) {
        systemAlerts.push({
          type: 'info',
          message: `Sprint "${sprint.nombre}" termina en ${diasRestantes} días`,
          item: sprint,
          priority: 'media'
        });
      }
      
      if (sprint.estado === 'activo' && diasRestantes < 0) {
        systemAlerts.push({
          type: 'warning',
          message: `Sprint "${sprint.nombre}" está retrasado ${Math.abs(diasRestantes)} días`,
          item: sprint,
          priority: 'alta'
        });
      }
    });
    
    return systemAlerts.sort((a, b) => {
      const priorityOrder = { 'critica': 3, 'alta': 2, 'media': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const systemAlerts = getSystemAlerts();
  const allAlerts = [...alerts, ...systemAlerts];

  if (allAlerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {/* Alertas de usuario (success, error, etc.) */}
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center justify-between p-3 rounded-lg border ${
            alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <span className="text-sm font-medium">{alert.message}</span>
        </div>
      ))}

      {/* Alertas del sistema */}
      {systemAlerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Alertas del Roadmap</h3>
          </div>
          
          <div className="space-y-2">
            {systemAlerts.slice(0, 3).map((alert, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 rounded ${
                  alert.type === 'danger' ? 'bg-red-100 text-red-800' :
                  alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}
              >
                {alert.type === 'danger' ? <AlertTriangle size={16} /> :
                 alert.type === 'warning' ? <Clock size={16} /> :
                 <CheckCircle size={16} />}
                <span className="text-sm">{alert.message}</span>
              </div>
            ))}
            
            {systemAlerts.length > 3 && (
              <p className="text-sm text-yellow-700">
                +{systemAlerts.length - 3} alertas adicionales
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSystem;
