import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Zap, 
  Target, 
  Users,
  BarChart3,
  Filter
} from 'lucide-react';

const SprintBoard = () => {
  const [currentSprint] = useState({
    name: 'Sprint 2025-01',
    startDate: '2025-01-01',
    endDate: '2025-01-14',
    goal: 'Implementar sistema de autenticación y mejoras de rendimiento',
    progress: 65
  });

  const tasks = [
    { 
      id: 1, 
      title: 'Implementar autenticación JWT', 
      status: 'in_progress',
      assignee: 'Tu',
      priority: 'high',
      storyPoints: 8
    },
    { 
      id: 2, 
      title: 'Corregir bug en validación', 
      status: 'todo',
      assignee: 'Tu',
      priority: 'medium',
      storyPoints: 3
    },
    { 
      id: 3, 
      title: 'Optimizar consultas DB', 
      status: 'done',
      assignee: 'Tu',
      priority: 'low',
      storyPoints: 5
    },
    { 
      id: 4, 
      title: 'Tests unitarios', 
      status: 'in_progress',
      assignee: 'Tu',
      priority: 'high',
      storyPoints: 13
    },
    { 
      id: 5, 
      title: 'Diseño de componentes', 
      status: 'todo',
      assignee: 'Ana García',
      priority: 'medium',
      storyPoints: 5
    },
    { 
      id: 6, 
      title: 'Integración API externa', 
      status: 'in_progress',
      assignee: 'Carlos López',
      priority: 'high',
      storyPoints: 8
    },
    { 
      id: 7, 
      title: 'Documentación técnica', 
      status: 'done',
      assignee: 'María Rodríguez',
      priority: 'low',
      storyPoints: 3
    }
  ];

  const columns = [
    { id: 'todo', title: 'Por Hacer', status: 'todo', color: 'border-gray-300 bg-gray-50' },
    { id: 'in_progress', title: 'En Progreso', status: 'in_progress', color: 'border-yellow-300 bg-yellow-50' },
    { id: 'done', title: 'Completado', status: 'done', color: 'border-green-300 bg-green-50' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusIcon = (status) => {
    const icons = {
      todo: Clock,
      in_progress: Zap,
      done: CheckCircle
    };
    return icons[status] || Clock;
  };

  const totalPoints = tasks.reduce((sum, task) => sum + task.storyPoints, 0);
  const completedPoints = tasks.filter(t => t.status === 'done').reduce((sum, task) => sum + task.storyPoints, 0);
  const sprintProgress = (completedPoints / totalPoints) * 100;

  return (
    <div className="space-y-6">
      {/* Sprint Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentSprint.name}</h1>
              <p className="text-gray-600">{currentSprint.goal}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{new Date(currentSprint.startDate).toLocaleDateString()} - {new Date(currentSprint.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
              <div className="text-xs text-gray-600">Story Points</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedPoints}</div>
              <div className="text-xs text-gray-600">Completados</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'in_progress').length}</div>
              <div className="text-xs text-gray-600">En Progreso</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{tasks.filter(t => t.status === 'todo').length}</div>
              <div className="text-xs text-gray-600">Pendientes</div>
            </div>
          </div>
        </div>

        {/* Sprint Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso del Sprint</span>
            <span>{Math.round(sprintProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${sprintProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => {
          const StatusIcon = getStatusIcon(column.status);
          const columnTasks = getTasksByStatus(column.status);
          
          return (
            <div key={column.id} className={`bg-white rounded-xl border-2 ${column.color} min-h-96`}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {columnTasks.map((task) => (
                  <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span className={task.assignee === 'Tu' ? 'font-medium text-blue-600' : ''}>
                          {task.assignee}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span>{task.storyPoints} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <StatusIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay tareas en esta columna</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Performance Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-gray-600" />
          Resumen del Equipo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{Math.round(sprintProgress)}%</div>
            <div className="text-sm text-gray-600">Progreso General</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{new Set(tasks.map(t => t.assignee)).size}</div>
            <div className="text-sm text-gray-600">Miembros Activos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{Math.ceil((new Date(currentSprint.endDate) - new Date()) / (1000 * 60 * 60 * 24))}</div>
            <div className="text-sm text-gray-600">Días Restantes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintBoard;
