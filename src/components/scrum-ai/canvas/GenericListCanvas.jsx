/**
 * GenericListCanvas - Canvas genérico para listas de cualquier tipo
 */

import { List, ChevronRight } from 'lucide-react';

export const GenericListCanvas = ({ data = [], metadata, isExpanded, onItemClick }) => {
  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick({
        ...item,
        type: 'generic'
      });
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <List className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sin datos
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No hay elementos para mostrar
          </p>
        </div>
      </div>
    );
  }

  // Si data es un array de strings simples
  if (typeof data[0] === 'string') {
    return (
      <div className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-2">
          {data.map((item, index) => (
            <li 
              key={index}
              className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            >
              <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Si data es un array de objetos
  return (
    <div className="flex-1 overflow-y-auto p-3">
      <div className="space-y-2">
        {data.map((item, index) => (
          <div 
            key={item._id || item.id || index}
            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            {/* Title/Name */}
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {item.title || item.titulo || item.nombre || item.name || `Item ${index + 1}`}
            </h4>
            
            {/* Description */}
            {(item.description || item.descripcion) && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {item.description || item.descripcion}
              </p>
            )}

            {/* Other fields */}
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(item)
                .filter(([key]) => !['_id', 'id', 'title', 'titulo', 'nombre', 'name', 'description', 'descripcion'].includes(key))
                .slice(0, 3)
                .map(([key, value]) => (
                  <span 
                    key={key}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
