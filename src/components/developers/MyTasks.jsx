import React, { useState } from 'react';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  Zap, 
  Play, 
  Pause, 
  MoreHorizontal,
  Filter,
  Search
} from 'lucide-react';

const MyTasks = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const tasks = [
    { 
      id: 1, 
      title: 'Implementar autenticación JWT', 
      status: 'in_progress', 
      priority: 'high',
      estimatedHours: 8,
      spentHours: 5,
      description: 'Configurar sistema de autenticación con JWT para la aplicación',
      assignedDate: '2025-01-05',
      dueDate: '2025-01-10'
    },
    { 
      id: 2, 
      title: 'Corregir bug en validación de formularios', 
      status: 'todo', 
      priority: 'medium',
      estimatedHours: 4,
      spentHours: 0,
      description: 'Revisar y corregir errores en la validación del formulario de registro',
      assignedDate: '2025-01-06',
      dueDate: '2025-01-08'
    },
    { 
      id: 3, 
      title: 'Optimizar consultas de base de datos', 
      status: 'done', 
      priority: 'low',
      estimatedHours: 6,
      spentHours: 6,
      description: 'Mejorar rendimiento de las consultas principales de la aplicación',
      assignedDate: '2025-01-02',
      dueDate: '2025-01-05'
    },
    { 
      id: 4, 
      title: 'Implementar tests unitarios', 
      status: 'in_progress', 
      priority: 'high',
      estimatedHours: 12,
      spentHours: 3,
      description: 'Crear suite de tests unitarios para los componentes principales',
      assignedDate: '2025-01-07',
      dueDate: '2025-01-12'
    },
    {
      id: 5,
      title: 'Refactorizar componente de dashboard',
      status: 'todo',
      priority: 'medium',
      estimatedHours: 6,
      spentHours: 0,
      description: 'Mejorar la estructura y rendimiento del componente dashboard',
      assignedDate: '2025-01-08',
      dueDate: '2025-01-15'
    }
  ];

  const getStatusInfo = (status) => {
    const statusConfig = {
      todo: { label: 'Por Hacer', color: 'bg-gray-100 text-gray-800', icon: Clock },
      in_progress: { label: 'En Progreso', color: 'bg-yellow-100 text-yellow-800', icon: Zap },
      done: { label: 'Completado', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };
    return statusConfig[status] || statusConfig.todo;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-red-500 bg-red-50',
      medium: 'border-yellow-500 bg-yellow-50',
      low: 'border-green-500 bg-green-50'
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return badges[priority] || badges.medium;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const taskCounts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Target className="h-6 w-6 mr-3 text-blue-600" />
              Mis Tareas
            </h1>
            <p className="text-gray-600 mt-1">Gestiona y da seguimiento a tus tareas asignadas</p>
          </div>
          
          {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas ({taskCounts.all})</option>
              <option value="todo">Por Hacer ({taskCounts.todo})</option>
              <option value="in_progress">En Progreso ({taskCounts.in_progress})</option>
              <option value="done">Completadas ({taskCounts.done})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Tareas */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'No se encontraron tareas que coincidan con los filtros.' 
                : 'No tienes tareas asignadas en este momento.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            const StatusIcon = statusInfo.icon;
            const progressPercentage = (task.spentHours / task.estimatedHours) * 100;
            
            return (
              <div 
                key={task.id} 
                className={`bg-white rounded-xl shadow-sm border-l-4 ${getPriorityColor(task.priority)} hover:shadow-md transition-all duration-200`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(task.priority)}`}>
                          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Asignada: {new Date(task.assignedDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Vence: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} flex items-center`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                      
                      <span className="text-sm text-gray-600 font-medium">
                        {task.spentHours}h / {task.estimatedHours}h
                      </span>
                    </div>

                    {task.status === 'in_progress' && (
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Pause className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                          <Play className="h-4 w-4 text-blue-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  {task.status === 'in_progress' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span>Progreso</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyTasks;
