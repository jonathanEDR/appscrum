import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'blue',
  size = 'default',
  onClick,
  isClickable = false
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      value: 'text-blue-900',
      trend: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      value: 'text-green-900',
      trend: 'text-green-600'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      value: 'text-red-900',
      trend: 'text-red-600'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      value: 'text-orange-900',
      trend: 'text-orange-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      value: 'text-purple-900',
      trend: 'text-purple-600'
    },
    gray: {
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      value: 'text-gray-900',
      trend: 'text-gray-600'
    }
  };

  const sizeClasses = {
    small: 'p-4',
    default: 'p-6',
    large: 'p-8'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  const TrendIcon = getTrendIcon();
  const currentColor = colorClasses[color];

  return (
    <div 
      className={`
        bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200
        ${sizeClasses[size]}
        ${isClickable ? 'cursor-pointer hover:border-gray-300' : ''}
      `}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${currentColor.bg}`}>
              <Icon className={`h-5 w-5 ${currentColor.icon}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              {isClickable && (
                <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto" />
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className={`text-3xl font-bold ${currentColor.value}`}>
              {value}
            </div>
            
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
            
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-2">
                <TrendIcon className={`h-4 w-4 ${getTrendColor()}`} />
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {trendValue}
                </span>
                <span className="text-sm text-gray-500">vs anterior</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente especializado para progreso de sprint
const SprintProgressCard = ({ 
  activeSprint, 
  totalStoryPoints, 
  completedStoryPoints,
  onClick 
}) => {
  if (!activeSprint) {
    return (
      <MetricCard
        title="Sprint Activo"
        value="Sin Sprint"
        subtitle="No hay sprint activo"
        icon={Clock}
        color="gray"
      />
    );
  }

  const progressPercentage = totalStoryPoints > 0 
    ? Math.round((completedStoryPoints / totalStoryPoints) * 100) 
    : 0;

  const daysLeft = Math.max(0, Math.ceil(
    (new Date(activeSprint.fecha_fin) - new Date()) / (1000 * 60 * 60 * 24)
  ));

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6 cursor-pointer hover:border-gray-300"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50">
            <CheckCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Sprint Progreso</h3>
            <p className="text-xs text-gray-500">{activeSprint.nombre}</p>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-400" />
      </div>

      <div className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="text-3xl font-bold text-blue-900">
            {progressPercentage}%
          </div>
          <div className="text-sm text-gray-600 mb-1">
            completado
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{completedStoryPoints} de {totalStoryPoints} SP</span>
            <span>{daysLeft} días restantes</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para alertas críticas
const CriticalAlertsCard = ({ criticalBugs, activeImpediments, onClick }) => {
  const totalCritical = criticalBugs + activeImpediments;
  
  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6 cursor-pointer hover:border-gray-300"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${totalCritical > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
            <AlertCircle className={`h-5 w-5 ${totalCritical > 0 ? 'text-red-600' : 'text-green-600'}`} />
          </div>
          <h3 className="text-sm font-medium text-gray-600">Alertas Críticas</h3>
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-400" />
      </div>

      <div className="space-y-3">
        <div className={`text-3xl font-bold ${totalCritical > 0 ? 'text-red-900' : 'text-green-900'}`}>
          {totalCritical}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Bugs críticos</span>
            <span className="font-medium text-red-600">{criticalBugs}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Impedimentos</span>
            <span className="font-medium text-orange-600">{activeImpediments}</span>
          </div>
        </div>

        {totalCritical === 0 && (
          <p className="text-sm text-green-600">¡Todo bajo control!</p>
        )}
      </div>
    </div>
  );
};

export { MetricCard, SprintProgressCard, CriticalAlertsCard };
