import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Zap, 
  Target, 
  Users,
  BarChart3,
  Filter,
  Star,
  TrendingUp
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
    { id: 'todo', title: 'Por Hacer', status: 'todo', color: 'border-primary-300 bg-primary-50' },
    { id: 'in_progress', title: 'En Progreso', status: 'in_progress', color: 'border-warning-300 bg-warning-50' },
    { id: 'done', title: 'Completado', status: 'done', color: 'border-success-300 bg-success-50' }
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
      {/* Sprint Header Premium */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-galaxy border-0 p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-accent-500/5"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-xl shadow-large">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-900">{currentSprint.name}</h1>
                <p className="text-primary-600">{currentSprint.goal}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-primary-500">
                  <span className="bg-primary-50 px-3 py-1 rounded-full font-medium">{new Date(currentSprint.startDate).toLocaleDateString()} - {new Date(currentSprint.endDate).toLocaleDateString()}</span>
                </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-primary-50 p-3 rounded-xl">
              <div className="text-2xl font-bold text-primary-600">{totalPoints}</div>
              <div className="text-xs text-primary-600">Story Points</div>
            </div>
            <div className="bg-success-50 p-3 rounded-xl">
              <div className="text-2xl font-bold text-success-600">{completedPoints}</div>
              <div className="text-xs text-success-600">Completados</div>
            </div>
            <div className="bg-warning-50 p-3 rounded-xl">
              <div className="text-2xl font-bold text-warning-600">{tasks.filter(t => t.status === 'in_progress').length}</div>
              <div className="text-xs text-warning-600">En Progreso</div>
            </div>
            <div className="bg-accent-50 p-3 rounded-xl">
              <div className="text-2xl font-bold text-accent-600">{tasks.filter(t => t.status === 'todo').length}</div>
              <div className="text-xs text-accent-600">Pendientes</div>
            </div>
          </div>
        </div>

        {/* Sprint Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-primary-600 mb-2">
            <span>Progreso del Sprint</span>
            <span className="font-medium">{Math.round(sprintProgress)}%</span>
          </div>
          <div className="w-full bg-primary-100 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-success-500 via-success-400 to-success-500 h-3 rounded-full transition-all duration-500 shadow-medium relative overflow-hidden" 
              style={{ width: `${sprintProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Kanban Board Premium */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => {
          const StatusIcon = getStatusIcon(column.status);
          const columnTasks = getTasksByStatus(column.status);
          
          return (
            <div key={column.id} className={`bg-white/80 backdrop-blur-lg rounded-xl border-2 ${column.color} min-h-96 shadow-galaxy overflow-hidden`}>
              <div className="p-4 bg-gradient-to-r from-white/50 to-transparent border-b border-primary-200/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-5 w-5 text-primary-600" />
                    <h3 className="font-semibold text-primary-900">{column.title}</h3>
                    <span className="bg-primary-100 text-primary-600 text-xs px-2 py-1 rounded-full font-medium shadow-soft">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {columnTasks.map((task) => (
                  <div key={task.id} className="bg-white/90 backdrop-blur-sm border border-primary-200 rounded-xl p-4 hover:shadow-large transition-all duration-300 cursor-pointer group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-primary-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-primary-900 text-sm leading-tight group-hover:text-primary-700 transition-colors">{task.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium shadow-soft ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-primary-600">
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span className={task.assignee === 'Tu' ? 'font-medium text-accent-600 bg-accent-50 px-2 py-1 rounded-full' : 'bg-primary-50 px-2 py-1 rounded-full'}>
                            {task.assignee}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span className="bg-primary-50 px-2 py-1 rounded-full font-medium">{task.storyPoints} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="text-center text-primary-400 py-8">
                    <StatusIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay tareas en esta columna</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Performance Summary Premium */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-galaxy border-0 p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-accent-500/5"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary-600" />
            Resumen del Equipo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-xl shadow-soft group-hover:shadow-medium transition-shadow duration-300">
                <div className="text-3xl font-bold text-primary-600 mb-1">{Math.round(sprintProgress)}%</div>
                <div className="text-sm text-primary-600 font-medium">Progreso General</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-success-50 to-success-100 p-4 rounded-xl shadow-soft group-hover:shadow-medium transition-shadow duration-300">
                <div className="text-3xl font-bold text-success-600 mb-1">{new Set(tasks.map(t => t.assignee)).size}</div>
                <div className="text-sm text-success-600 font-medium">Miembros Activos</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-warning-50 to-warning-100 p-4 rounded-xl shadow-soft group-hover:shadow-medium transition-shadow duration-300">
                <div className="text-3xl font-bold text-warning-600 mb-1">{Math.ceil((new Date(currentSprint.endDate) - new Date()) / (1000 * 60 * 60 * 24))}</div>
                <div className="text-sm text-warning-600 font-medium">Días Restantes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintBoard;
