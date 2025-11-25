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
import { useTheme } from '../../context/ThemeContext';

const BugReportCard = ({ bug, onClick }) => {
  const { theme } = useTheme();
  
  // Mapeo de prioridades a colores
  const priorityConfig = {
    low: {
      color: theme === 'dark' ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300',
      icon: '🟢',
      label: 'Baja'
    },
    medium: {
      color: theme === 'dark' ? 'bg-blue-900/40 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-300',
      icon: '🔵',
      label: 'Media'
    },
    high: {
      color: theme === 'dark' ? 'bg-orange-900/40 text-orange-300 border-orange-700' : 'bg-orange-100 text-orange-700 border-orange-300',
      icon: '🟡',
      label: 'Alta'
    },
    critical: {
      color: theme === 'dark' ? 'bg-red-900/40 text-red-300 border-red-700' : 'bg-red-100 text-red-700 border-red-300',
      icon: '🔴',
      label: 'Crítica'
    }
  };

  // Mapeo de estados a colores
  const statusConfig = {
    open: {
      color: 'bg-red-500',
      textColor: theme === 'dark' ? 'text-red-400' : 'text-red-700',
      bgColor: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50',
      icon: AlertCircle,
      label: 'Abierto'
    },
    in_progress: {
      color: 'bg-blue-500',
      textColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-700',
      bgColor: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50',
      icon: Clock,
      label: 'En Progreso'
    },
    resolved: {
      color: 'bg-green-500',
      textColor: theme === 'dark' ? 'text-green-400' : 'text-green-700',
      bgColor: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50',
      icon: CheckCircle,
      label: 'Resuelto'
    },
    closed: {
      color: 'bg-gray-500',
      textColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-700',
      bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50',
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
      className={`rounded-xl border-2 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
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
        <h3 className={`font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {bug.title}
        </h3>

        {/* Descripción */}
        {bug.description && (
          <p className={`text-sm mb-3 line-clamp-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {bug.description}
          </p>
        )}

        {/* Metadata */}
        <div className={`flex flex-wrap gap-3 text-xs mb-3 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
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
          <div className={`pt-3 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                {bug.assignedTo.firstName?.charAt(0) || 'A'}
              </div>
              <div className="flex-1">
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Asignado a:</p>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
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
