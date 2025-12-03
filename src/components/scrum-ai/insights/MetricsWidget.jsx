/**
 * MetricsWidget - Widget de métricas rápidas
 */

import { TrendingUp, ListTodo, AlertCircle } from 'lucide-react';

export const MetricsWidget = () => {
  // TODO: Obtener métricas reales de la API
  const metrics = {
    backlog: 45,
    sprint: 12,
    impedimentos: 2
  };

  const MetricCard = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span>📊</span>
        MÉTRICAS RÁPIDAS
      </h3>

      <div className="space-y-3">
        <MetricCard
          icon={ListTodo}
          label="Backlog"
          value={`${metrics.backlog} items`}
          color="bg-blue-500"
        />
        <MetricCard
          icon={TrendingUp}
          label="Sprint Actual"
          value={`${metrics.sprint} tareas`}
          color="bg-green-500"
        />
        <MetricCard
          icon={AlertCircle}
          label="Impedimentos"
          value={metrics.impedimentos}
          color="bg-orange-500"
        />
      </div>
    </div>
  );
};
