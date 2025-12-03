/**
 * ProjectContextCard - Card con contexto del proyecto actual
 */

import { Package, GitBranch, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ProjectContextCard = () => {
  const [context, setContext] = useState({
    producto: 'Sin producto seleccionado',
    sprint: 'Sin sprint activo',
    estado: 'idle'
  });

  // TODO: Obtener contexto real del estado global o API
  useEffect(() => {
    // Placeholder - implementar lógica real
    setContext({
      producto: 'CRM System',
      sprint: 'Sprint 5',
      estado: 'En progreso'
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span>🎯</span>
        CONTEXTO ACTUAL
      </h3>

      <div className="space-y-3">
        {/* Producto */}
        <div className="flex items-start gap-2">
          <Package className="w-4 h-4 text-indigo-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">Producto</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {context.producto}
            </p>
          </div>
        </div>

        {/* Sprint */}
        <div className="flex items-start gap-2">
          <GitBranch className="w-4 h-4 text-purple-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">Sprint</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {context.sprint}
            </p>
          </div>
        </div>

        {/* Estado */}
        <div className="flex items-start gap-2">
          <Activity className="w-4 h-4 text-green-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">Estado</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {context.estado}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
