/**
 * BacklogCanvas - Canvas para mostrar el backlog de un producto
 * Usado por el agente Product Owner
 */

import { useState } from 'react';
import { 
  ListTodo, 
  GripVertical,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  Filter,
  ArrowUpDown
} from 'lucide-react';

const PRIORITY_CONFIG = {
  must: { color: 'bg-red-500', label: 'Must Have', textColor: 'text-red-600' },
  should: { color: 'bg-amber-500', label: 'Should Have', textColor: 'text-amber-600' },
  could: { color: 'bg-blue-500', label: 'Could Have', textColor: 'text-blue-600' },
  wont: { color: 'bg-gray-400', label: "Won't Have", textColor: 'text-gray-500' }
};

const STATUS_CONFIG = {
  pending: { icon: Circle, color: 'text-gray-400', label: 'Pendiente' },
  in_progress: { icon: Clock, color: 'text-blue-500', label: 'En Progreso' },
  blocked: { icon: AlertCircle, color: 'text-red-500', label: 'Bloqueado' },
  done: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Completado' }
};

export const BacklogCanvas = ({ data = [], metadata, isExpanded, onItemClick }) => {
  const [sortBy, setSortBy] = useState('priority');
  const [filterPriority, setFilterPriority] = useState('all');

  const sortedItems = [...data]
    .filter(item => filterPriority === 'all' || item.priority === filterPriority)
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { must: 0, should: 1, could: 2, wont: 3 };
        return (order[a.priority] || 4) - (order[b.priority] || 4);
      }
      if (sortBy === 'points') {
        return (b.story_points || 0) - (a.story_points || 0);
      }
      return 0;
    });

  const totalPoints = data.reduce((sum, item) => sum + (item.story_points || 0), 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <ListTodo className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Backlog vacío
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No hay items en el backlog
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-3 border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="flex items-center justify-between gap-2">
          {/* Filters */}
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-gray-400" />
            {['all', 'must', 'should', 'could'].map((priority) => (
              <button
                key={priority}
                onClick={() => setFilterPriority(priority)}
                className={`
                  px-2 py-1 rounded-md text-xs font-medium transition-all
                  ${filterPriority === priority
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                {priority === 'all' ? 'Todos' : PRIORITY_CONFIG[priority]?.label.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Sort */}
          <button
            onClick={() => setSortBy(sortBy === 'priority' ? 'points' : 'priority')}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowUpDown className="w-3 h-3" />
            {sortBy === 'priority' ? 'Prioridad' : 'Puntos'}
          </button>
        </div>
      </div>

      {/* Backlog Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sortedItems.map((item, index) => (
          <BacklogItem 
            key={item._id || item.id || index} 
            item={item}
            isExpanded={isExpanded}
            onItemClick={onItemClick}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="p-3 border-t border-gray-200/60 dark:border-gray-800/60 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{sortedItems.length} items</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Total:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{totalPoints} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BacklogItem = ({ item, isExpanded, onItemClick }) => {
  const priorityConfig = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.could;
  const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  const handleClick = () => {
    if (onItemClick) {
      onItemClick({
        ...item,
        type: 'backlog'
      });
    }
  };

  return (
    <div 
      className={`
        p-3 rounded-xl border border-gray-200 dark:border-gray-800 
        bg-white dark:bg-gray-900 
        hover:border-indigo-300 dark:hover:border-indigo-700 
        hover:shadow-md transition-all cursor-pointer
      `}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Priority indicator */}
        <div className={`w-1 h-12 rounded-full ${priorityConfig.color}`}></div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
              {item.titulo || item.title || 'Sin título'}
            </h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              {item.story_points && (
                <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-semibold">
                  {item.story_points} pts
                </span>
              )}
              <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
            {item.descripcion || item.description || 'Sin descripción'}
          </p>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-medium ${priorityConfig.textColor}`}>
              {priorityConfig.label}
            </span>
            {item.sprint && (
              <span className="text-[10px] text-gray-400">
                Sprint {item.sprint}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
