/**
 * SprintsCanvas - Canvas para mostrar sprints
 */

import { 
  Calendar, 
  Target,
  CheckCircle2,
  Clock,
  PlayCircle,
  PauseCircle
} from 'lucide-react';

const STATUS_CONFIG = {
  planning: { icon: Calendar, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', label: 'Planificación' },
  active: { icon: PlayCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/20', label: 'Activo' },
  completed: { icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20', label: 'Completado' },
  cancelled: { icon: PauseCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20', label: 'Cancelado' }
};

export const SprintsCanvas = ({ data = [], metadata, isExpanded, onItemClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const calculateProgress = (sprint) => {
    if (!sprint.total_points || sprint.total_points === 0) return sprint.progreso || 0;
    return Math.round((sprint.completed_points || 0) / sprint.total_points * 100);
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sin sprints
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No hay sprints registrados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {data.map((sprint, index) => {
          const statusConfig = STATUS_CONFIG[sprint.estado] || STATUS_CONFIG.planning;
          const StatusIcon = statusConfig.icon;
          const progress = calculateProgress(sprint);

          return (
            <div 
              key={sprint._id || sprint.id || index}
              onClick={() => onItemClick?.(sprint)}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {sprint.nombre || `Sprint ${sprint.numero || index + 1}`}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(sprint.fecha_inicio)} - {formatDate(sprint.fecha_fin)}
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${statusConfig.bg}`}>
                  <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
                  <span className={`text-[10px] font-medium ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Progreso</span>
                  <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {sprint.total_items || 0}
                  </p>
                  <p className="text-[10px] text-gray-500">Items</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {sprint.total_points || 0}
                  </p>
                  <p className="text-[10px] text-gray-500">Puntos</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {sprint.completed_points || 0}
                  </p>
                  <p className="text-[10px] text-gray-500">Completados</p>
                </div>
              </div>

              {/* Goal */}
              {sprint.objetivo && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-[10px] font-medium text-gray-500 mb-1">Objetivo:</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{sprint.objetivo}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
