/**
 * QuickActionsGrid - Grid de acciones rápidas
 */

import { Plus, BarChart, Target, FileText } from 'lucide-react';

export const QuickActionsGrid = () => {
  const actions = [
    {
      id: 1,
      icon: Plus,
      label: 'Crear Historia',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => console.log('Crear historia')
    },
    {
      id: 2,
      icon: BarChart,
      label: 'Analizar Backlog',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('Analizar backlog')
    },
    {
      id: 3,
      icon: Target,
      label: 'Priorizar',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => console.log('Priorizar')
    },
    {
      id: 4,
      icon: FileText,
      label: 'Generar Reporte',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => console.log('Generar reporte')
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span>⚡</span>
        ACCIONES RÁPIDAS
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={`
              ${action.color}
              text-white
              rounded-lg p-3
              flex flex-col items-center justify-center gap-2
              transition-all
              hover:scale-105
              active:scale-95
              shadow-sm
            `}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-xs font-medium text-center leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
