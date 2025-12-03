/**
 * TasksCanvas - Canvas para mostrar tareas del sprint/proyecto
 */

import { useState } from 'react';
import { 
  CheckSquare, 
  Clock,
  AlertCircle,
  User,
  Filter,
  Search,
  Play,
  Pause,
  CheckCircle2,
  Circle,
  Code2,
  TestTube
} from 'lucide-react';

const STATUS_CONFIG = {
  todo: {
    icon: Circle,
    color: 'text-gray-500',
    bg: 'bg-gray-100 dark:bg-gray-800',
    label: 'Por hacer'
  },
  in_progress: {
    icon: Play,
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'En progreso'
  },
  code_review: {
    icon: Code2,
    color: 'text-purple-500',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    label: 'Code Review'
  },
  testing: {
    icon: TestTube,
    color: 'text-amber-500',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    label: 'Testing'
  },
  done: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    label: 'Completado'
  }
};

const PRIORITY_CONFIG = {
  critical: { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Crítica' },
  high: { color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30', label: 'Alta' },
  medium: { color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Media' },
  low: { color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Baja' }
};

const TYPE_CONFIG = {
  story: { icon: '📖', label: 'Historia' },
  bug: { icon: '🐛', label: 'Bug' },
  task: { icon: '✅', label: 'Tarea' },
  epic: { icon: '🏔️', label: 'Epic' },
  spike: { icon: '🔬', label: 'Spike' }
};

export const TasksCanvas = ({ data = [], metadata, isExpanded, onItemClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredTasks = data.filter(task => {
    const matchesSearch = (task.titulo || task.title)?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.estado === filterStatus || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.prioridad === filterPriority || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleTaskClick = (task) => {
    if (onItemClick) {
      onItemClick({
        ...task,
        type: 'task'
      });
    }
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sin tareas
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No hay tareas registradas en el sistema
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-3 border-b border-gray-200/60 dark:border-gray-800/60 space-y-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="all">Todos los estados</option>
            <option value="todo">Por hacer</option>
            <option value="in_progress">En progreso</option>
            <option value="code_review">Code Review</option>
            <option value="testing">Testing</option>
            <option value="done">Completado</option>
          </select>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="all">Todas las prioridades</option>
            <option value="critical">Crítica</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>

        {/* Stats */}
        {metadata && (
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <Circle className="w-3 h-3 text-gray-400" />
              {metadata.pendientes || 0} pendientes
            </span>
            <span className="flex items-center gap-1">
              <Play className="w-3 h-3 text-blue-500" />
              {metadata.en_progreso || 0} en progreso
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {metadata.completadas || 0} completadas
            </span>
          </div>
        )}
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredTasks.map((task) => {
          const status = task.estado || task.status || 'todo';
          const priority = task.prioridad || task.priority || 'medium';
          const tipo = task.tipo || task.type || 'task';
          const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.todo;
          const priorityConfig = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
          const typeConfig = TYPE_CONFIG[tipo] || TYPE_CONFIG.task;
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={task._id}
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-800/60 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleTaskClick(task)}
            >
              <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className={`mt-0.5 p-1.5 rounded-lg ${statusConfig.bg}`}>
                  <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{typeConfig.icon}</span>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.titulo || task.title}
                    </h4>
                  </div>

                  {task.descripcion || task.description ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                      {task.descripcion || task.description}
                    </p>
                  ) : null}

                  {/* Meta info */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Priority */}
                    <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${priorityConfig.bg} ${priorityConfig.color}`}>
                      {priorityConfig.label}
                    </span>

                    {/* Points */}
                    {(task.puntos || task.storyPoints) && (
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {task.puntos || task.storyPoints} pts
                      </span>
                    )}

                    {/* Assignee */}
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {task.asignado || 'Sin asignar'}
                    </span>

                    {/* Sprint */}
                    {task.sprint && (
                      <span className="text-[10px] text-indigo-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.sprint}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && data.length > 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No se encontraron tareas con los filtros aplicados</p>
          </div>
        )}
      </div>
    </div>
  );
};
