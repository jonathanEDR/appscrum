import React from 'react';
import { 
  Bug, 
  User, 
  Calendar, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Paperclip
} from 'lucide-react';

const BugReportCard = ({ bug, onClick }) => {
  // Mapeo de prioridades a colores
  const priorityConfig = {
    low: {
      color: 'bg-gray-100 text-gray-700 border-gray-300',
      icon: '🟢',
      label: 'Baja'
    },
    medium: {
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      icon: '🔵',
      label: 'Media'
    },
    high: {
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      icon: '🟡',
      label: 'Alta'
    },
    critical: {
      color: 'bg-red-100 text-red-700 border-red-300',
      icon: '🔴',
      label: 'Crítica'
    }
  };

  // Mapeo de estados a colores
  const statusConfig = {
    open: {
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      icon: AlertCircle,
      label: 'Abierto'
    },
    in_progress: {
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      icon: Clock,
      label: 'En Progreso'
    },
    resolved: {
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      icon: CheckCircle,
      label: 'Resuelto'
    },
    closed: {
      color: 'bg-gray-500',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
      icon: XCircle,
      label: 'Cerrado'
    }
  };

  const priority = priorityConfig[bug.priority] || priorityConfig.medium;
  const status = statusConfig[bug.status] || statusConfig.open;
  const StatusIcon = status.icon;

  // Formatear fecha
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `hace ${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `hace ${diffHours}h`;
    } else if (diffDays === 1) {
      return 'hace 1 día';
    } else if (diffDays < 7) {
      return `hace ${diffDays} días`;
    } else {
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    }
  };

  return (
    <div
      onClick={() => onClick(bug)}
      className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      {/* Header con prioridad */}
      <div className={`px-4 py-2 flex items-center justify-between ${status.bgColor}`}>
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-4 w-4 ${status.textColor}`} />
          <span className={`text-sm font-semibold ${status.textColor}`}>
            {status.label}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priority.color}`}>
          {priority.icon} {priority.label}
        </span>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Título */}
        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {bug.title}
        </h3>

        {/* Descripción */}
        {bug.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {bug.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
          {/* Reporter */}
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>
              {bug.reportedBy?.firstName || bug.reportedBy?.nombre_negocio || 'Usuario'}
            </span>
          </div>

          {/* Fecha */}
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(bug.createdAt)}</span>
          </div>

          {/* Attachments */}
          {bug.attachments && bug.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="h-3.5 w-3.5" />
              <span>{bug.attachments.length} archivo{bug.attachments.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Footer con asignado */}
        {bug.assignedTo && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                {bug.assignedTo.firstName?.charAt(0) || 'A'}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Asignado a:</p>
                <p className="text-sm font-medium text-gray-900">
                  {bug.assignedTo.firstName} {bug.assignedTo.lastName}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Indicador de hover */}
      <div className={`h-1 ${status.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
    </div>
  );
};

export default BugReportCard;
