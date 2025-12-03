/**
 * DelegationRow Component
 * Fila individual de una delegación con información y acciones
 */

import { 
  Bot, Shield, Clock, TrendingUp, Pause, Play, XCircle, 
  Eye, Calendar, Globe, Package, Layers, AlertTriangle 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const DelegationRow = ({ 
  delegation, 
  onSuspend, 
  onReactivate, 
  onRevoke, 
  onViewDetails 
}) => {
  const { theme } = useTheme();

  // Configuración de estados
  const statusConfig = {
    active: {
      label: 'Activo',
      icon: Shield,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-300 dark:border-green-700'
    },
    suspended: {
      label: 'Suspendido',
      icon: Pause,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      border: 'border-yellow-300 dark:border-yellow-700'
    },
    revoked: {
      label: 'Revocado',
      icon: XCircle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-300 dark:border-red-700'
    },
    expired: {
      label: 'Expirado',
      icon: Clock,
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-100 dark:bg-gray-900/30',
      border: 'border-gray-300 dark:border-gray-700'
    }
  };

  const status = statusConfig[delegation.status] || statusConfig.active;
  const StatusIcon = status.icon;

  // Colores por tipo de agente
  const agentTypeColors = {
    'product-owner': 'bg-purple-500',
    'scrum-master': 'bg-blue-500',
    'developer': 'bg-green-500',
    'orchestrator': 'bg-orange-500'
  };

  const agentColor = agentTypeColors[delegation.agentType] || 'bg-gray-500';

  // Formatear alcance
  const getScopeDisplay = () => {
    if (!delegation.scope) return { icon: Globe, text: 'Global', color: 'text-blue-600 dark:text-blue-400' };
    
    switch (delegation.scope.type) {
      case 'product':
        return { 
          icon: Package, 
          text: delegation.scope.productId?.name || 'Producto específico',
          color: 'text-purple-600 dark:text-purple-400'
        };
      case 'sprint':
        return { 
          icon: Layers, 
          text: delegation.scope.sprintId?.name || 'Sprint específico',
          color: 'text-green-600 dark:text-green-400'
        };
      default:
        return { icon: Globe, text: 'Global', color: 'text-blue-600 dark:text-blue-400' };
    }
  };

  const scope = getScopeDisplay();
  const ScopeIcon = scope.icon;

  // Calcular uso vs límite
  const usagePercentage = delegation.limits?.maxActions 
    ? Math.min((delegation.usage?.actionsPerformed || 0) / delegation.limits.maxActions * 100, 100)
    : 0;

  const getUsageColor = () => {
    if (usagePercentage >= 90) return 'bg-red-500';
    if (usagePercentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Formatear fecha
  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verificar si puede realizar acciones
  const canSuspend = delegation.status === 'active';
  const canReactivate = delegation.status === 'suspended';
  const canRevoke = delegation.status === 'active' || delegation.status === 'suspended';

  return (
    <tr className={`
      border-b transition-colors
      ${theme === 'dark' 
        ? 'border-gray-700 hover:bg-gray-700/50' 
        : 'border-gray-200 hover:bg-gray-50'}
    `}>
      {/* Agente */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className={`${agentColor} p-2 rounded-lg`}>
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {delegation.agentType
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {delegation.permissions?.length || 0} permisos
            </div>
          </div>
        </div>
      </td>

      {/* Alcance */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <ScopeIcon className={`w-4 h-4 ${scope.color}`} />
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {scope.text}
          </span>
        </div>
      </td>

      {/* Estado */}
      <td className="px-6 py-4">
        <div className={`
          inline-flex items-center space-x-2 px-3 py-1 rounded-full border
          ${status.bg} ${status.border}
        `}>
          <StatusIcon className={`w-3 h-3 ${status.color}`} />
          <span className={`text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      </td>

      {/* Uso */}
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {delegation.usage?.actionsPerformed || 0} / {delegation.limits?.maxActions || 0}
            </span>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {usagePercentage.toFixed(0)}%
            </span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className={`h-full transition-all ${getUsageColor()}`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
      </td>

      {/* Fecha Creación */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Calendar className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatDate(delegation.createdAt)}
            </div>
            {delegation.expiresAt && (
              <div className={`text-xs flex items-center space-x-1 ${
                new Date(delegation.expiresAt) < new Date() 
                  ? 'text-red-500' 
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Clock className="w-3 h-3" />
                <span>Expira: {formatDate(delegation.expiresAt)}</span>
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Acciones */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          {/* Ver Detalles */}
          <button
            onClick={() => onViewDetails(delegation)}
            className={`
              p-2 rounded-lg transition-colors
              ${theme === 'dark'
                ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}
            `}
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Suspender */}
          {canSuspend && (
            <button
              onClick={() => onSuspend(delegation._id)}
              className={`
                p-2 rounded-lg transition-colors
                ${theme === 'dark'
                  ? 'hover:bg-yellow-900/30 text-yellow-400 hover:text-yellow-300'
                  : 'hover:bg-yellow-50 text-yellow-600 hover:text-yellow-700'}
              `}
              title="Suspender"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

          {/* Reactivar */}
          {canReactivate && (
            <button
              onClick={() => onReactivate(delegation._id)}
              className={`
                p-2 rounded-lg transition-colors
                ${theme === 'dark'
                  ? 'hover:bg-green-900/30 text-green-400 hover:text-green-300'
                  : 'hover:bg-green-50 text-green-600 hover:text-green-700'}
              `}
              title="Reactivar"
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          {/* Revocar */}
          {canRevoke && (
            <button
              onClick={() => onRevoke(delegation._id)}
              className={`
                p-2 rounded-lg transition-colors
                ${theme === 'dark'
                  ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
                  : 'hover:bg-red-50 text-red-600 hover:text-red-700'}
              `}
              title="Revocar"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
