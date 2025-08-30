import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import sprintService from '../../services/sprintService';
import { useScrumMasterDashboard } from '../../hooks/useScrumMasterDashboard';
import { MetricCard, SprintProgressCard, CriticalAlertsCard } from './MetricCards';
import SprintTechnicalItems from './SprintTechnicalItems';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Calendar, 
  BarChart3,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  Square,
  RefreshCw,
  Eye,
  Edit,
  User,
  ExternalLink,
  ArrowRight,
  Code,
  Bug,
  Settings,
  CheckSquare
} from 'lucide-react';

// Datos mock para el sprint actual
const mockSprintData = {
  id: 23,
  name: 'Sprint 23',
  goal: 'Implementar sistema de reportes y optimizar rendimiento',
  startDate: '2025-01-01',
  endDate: '2025-01-14',
  status: 'active',
  capacity: 120,
  planned: 95,
  completed: 71,
  inProgress: 18,
  remaining: 6,
  velocity: 38,
  previousVelocity: 34,
  burndownData: [
    { day: 1, planned: 95, actual: 95 },
    { day: 2, planned: 88, actual: 90 },
    { day: 3, planned: 81, actual: 85 },
    { day: 4, planned: 74, actual: 78 },
    { day: 5, planned: 67, actual: 71 },
    { day: 6, planned: 60, actual: 65 },
    { day: 7, planned: 53, actual: 58 }
  ],
  teamMembers: [
    { name: 'Ana García', role: 'Frontend', completed: 18, planned: 24, availability: 'available' },
    { name: 'Carlos López', role: 'Backend', completed: 22, planned: 28, availability: 'busy' },
    { name: 'María Rodríguez', role: 'UX/UI', completed: 16, planned: 20, availability: 'available' },
    { name: 'David Chen', role: 'DevOps', completed: 15, planned: 23, availability: 'off' }
  ]
};

// Componente mejorado para navegación rápida
const QuickActionsPanel = ({ onNavigateToSprint, onNavigateToBacklog, sprintData, onQuickAction }) => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'sprint-planning',
      title: 'Sprint Planning',
      description: 'Asignar historias al sprint',
      icon: Target,
      color: 'bg-orange-500',
      onClick: onNavigateToSprint,
      external: true
    },
    {
      id: 'backlog-tecnico',
      title: 'Items Técnicos',
      description: 'Gestionar tareas y bugs',
      icon: Code,
      color: 'bg-purple-500',
      onClick: onNavigateToBacklog,
      external: true
    },
    {
      id: 'daily',
      title: 'Daily Standup',
      description: 'Reunión diaria del equipo',
      icon: Users,
      color: 'bg-blue-500',
      onClick: () => onQuickAction('daily')
    },
    {
      id: 'metrics',
      title: 'Actualizar Métricas',
      description: 'Refrescar datos del sprint',
      icon: BarChart3,
      color: 'bg-green-500',
      onClick: () => onQuickAction('metrics')
    }
  ];

  return (
    <div className="glass-card shadow-galaxy-enhanced">
      <div className="px-6 py-4 border-b border-primary-200/50">
        <h3 className="text-lg font-semibold text-primary-800">Acciones Rápidas</h3>
      </div>
      <div className="p-6 space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className="w-full flex items-center justify-between p-4 border border-primary-200/50 rounded-xl hover:border-primary-300 hover:bg-primary-50/50 transition-all group glass-card hover-lift"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 ${action.color} rounded-xl text-white shadow-medium`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-primary-800">{action.title}</div>
                  <div className="text-sm text-primary-600">{action.description}</div>
                </div>
              </div>
              {action.external ? (
                <ExternalLink className="h-4 w-4 text-primary-400 group-hover:text-primary-600" />
              ) : (
                <ArrowRight className="h-4 w-4 text-primary-400 group-hover:text-primary-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Componente mejorado para métricas técnicas
const TechnicalItemsMetrics = ({ sprintData, onNavigateToBacklog }) => {
  const technicalItems = sprintData?.technicalItems || [];
  const totalTechnical = technicalItems.length;
  const completedTechnical = technicalItems.filter(item => 
    item.estado === 'completado' || item.status === 'completed'
  ).length;
  const pendingTasks = technicalItems.filter(item => 
    item.tipo === 'tarea' && item.estado !== 'completado'
  ).length;
  const criticalBugs = technicalItems.filter(item => 
    item.tipo === 'bug' && ['muy_alta', 'alta'].includes(item.prioridad)
  ).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Items Técnicos</h3>
          <button
            onClick={onNavigateToBacklog}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Gestionar →
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalTechnical}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedTechnical}</div>
            <div className="text-sm text-gray-600">Completados</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Tareas pendientes</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{pendingTasks}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-red-600" />
              <span className="text-sm text-gray-600">Bugs críticos</span>
            </div>
            <span className="text-sm font-medium text-red-600">{criticalBugs}</span>
          </div>
        </div>

        {totalTechnical > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progreso</span>
              <span>{completedTechnical}/{totalTechnical}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalTechnical > 0 ? (completedTechnical / totalTechnical) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TeamMemberCard = ({ member }) => {
  const getAvailabilityColor = (availability) => {
    const colors = {
      available: 'bg-green-500',
      busy: 'bg-yellow-500',
      off: 'bg-gray-500'
    };
    return colors[availability] || colors.off;
  };

  const getAvailabilityText = (availability) => {
    const texts = {
      available: 'Disponible',
      busy: 'Ocupado',
      off: 'No disponible'
    };
    return texts[availability] || availability;
  };

  const completionPercentage = member.planned > 0 ? (member.completed / member.planned) * 100 : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-gray-900">{member.name}</p>
            <p className="text-sm text-gray-600">{member.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(member.availability)}`}></div>
          <span className="text-xs text-gray-500">{getAvailabilityText(member.availability)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progreso</span>
          <span className="font-medium">{member.completed}/{member.planned} pts</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(completionPercentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">{completionPercentage.toFixed(0)}% completado</p>
      </div>
    </div>
  );
};

const BurndownChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.planned, d.actual)));
  const chartHeight = 200;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Burndown Chart</h3>
      
      <div className="relative" style={{ height: chartHeight }}>
        <svg width="100%" height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(percent => {
            const y = (chartHeight * percent) / 100;
            return (
              <g key={percent}>
                <line
                  x1="0"
                  y1={y}
                  x2="100%"
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x="-10"
                  y={y + 4}
                  fontSize="12"
                  fill="#6b7280"
                  textAnchor="end"
                >
                  {maxValue - (maxValue * percent) / 100}
                </text>
              </g>
            );
          })}

          {/* Planned line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
            points={data.map((d, i) => 
              `${(i * 100) / (data.length - 1)},${((maxValue - d.planned) / maxValue) * chartHeight}`
            ).join(' ')}
          />

          {/* Actual line */}
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            points={data.map((d, i) => 
              `${(i * 100) / (data.length - 1)},${((maxValue - d.actual) / maxValue) * chartHeight}`
            ).join(' ')}
          />

          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={`${(i * 100) / (data.length - 1)}%`}
              cy={((maxValue - d.actual) / maxValue) * chartHeight}
              r="4"
              fill="#f59e0b"
            />
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute top-4 right-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500 border-dashed border-blue-500" style={{borderWidth: '1px'}}></div>
            <span className="text-xs text-gray-600">Planificado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-yellow-500"></div>
            <span className="text-xs text-gray-600">Real</span>
          </div>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.map((d, i) => (
          <span key={i}>Día {d.day}</span>
        ))}
      </div>
    </div>
  );
};

// Componente placeholder para Sprint Planning
const SprintPlanningTab = ({ sprintData, onRefresh }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center py-12">
        <Target className="h-16 w-16 text-orange-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Sprint Planning</h3>
        <p className="text-gray-600 mb-6">
          Aquí podrás asignar historias del Product Backlog a este sprint.
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sprintData?.backlogItems?.length || 0}</div>
              <div className="text-sm text-blue-800">Historias Asignadas</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{sprintData?.totalStoryPoints || 0}</div>
              <div className="text-sm text-green-800">Story Points Total</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{sprintData?.capacity || 0}</div>
              <div className="text-sm text-purple-800">Capacidad del Sprint</div>
            </div>
          </div>
          
          <button
            onClick={() => window.open('/scrum_master/sprint-planning', '_blank')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Target className="h-5 w-5" />
            Abrir Sprint Planning Completo
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente placeholder para Backlog Técnico
const BacklogTecnicoTab = ({ sprintData, onRefresh }) => {
  const technicalItems = sprintData?.technicalItems || [];
  const tareas = technicalItems.filter(item => item.tipo === 'tarea');
  const bugs = technicalItems.filter(item => item.tipo === 'bug');
  const mejoras = technicalItems.filter(item => item.tipo === 'mejora');
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center py-8">
        <Code className="h-16 w-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Items Técnicos del Sprint</h3>
        <p className="text-gray-600 mb-6">
          Gestiona tareas técnicas, bugs y mejoras asociadas a este sprint.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckSquare className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{tareas.length}</span>
            </div>
            <div className="text-sm text-blue-800">Tareas</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bug className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{bugs.length}</span>
            </div>
            <div className="text-sm text-red-800">Bugs</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Settings className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{mejoras.length}</span>
            </div>
            <div className="text-sm text-green-800">Mejoras</div>
          </div>
        </div>

        <button
          onClick={() => window.open('/scrum_master/backlog-tecnico', '_blank')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Code className="h-5 w-5" />
          Abrir Backlog Técnico Completo
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Componente para navegación por pestañas
const SprintTabNavigation = ({ activeTab, onTabChange, sprintData }) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Vista General',
      icon: BarChart3,
      description: 'Métricas y estado del sprint',
      badge: null
    },
    {
      id: 'planning',
      label: 'Sprint Planning',
      icon: Target,
      description: 'Asignar historias al sprint',
      badge: sprintData?.backlogItems?.length || null
    },
    {
      id: 'backlog',
      label: 'Items Técnicos',
      icon: Code,
      description: 'Gestionar tareas y bugs',
      badge: sprintData?.technicalItems?.length || null
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent
                  className={`mr-2 h-5 w-5 ${
                    isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                <span className="mr-2">{tab.label}</span>
                {tab.badge !== null && tab.badge > 0 && (
                  <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                    isActive 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Descripción de la pestaña activa */}
      <div className="px-6 py-3 bg-gray-50">
        <p className="text-sm text-gray-600">
          {tabs.find(tab => tab.id === activeTab)?.description}
        </p>
      </div>
    </div>
  );
};

// Componente para seleccionar sprints
const SprintSelector = ({ sprints, activeSprint, onSelectSprint, loading }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold text-gray-900">Sprints Disponibles</h3>
      <button 
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        disabled={loading}
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Actualizar
      </button>
    </div>
    
    {sprints.length === 0 ? (
      <div className="text-center py-4 text-gray-500">
        <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p>No hay sprints disponibles</p>
        <p className="text-sm">Los sprints se crean desde el módulo Product Owner</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sprints.map(sprint => (
          <button
            key={sprint._id}
            onClick={() => onSelectSprint(sprint)}
            disabled={loading}
            className={`p-3 rounded-lg border-2 transition-colors text-left ${
              activeSprint?._id === sprint._id
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-medium text-gray-900">{sprint.nombre || sprint.name}</div>
            <div className={`text-sm capitalize ${
              (sprint.estado || sprint.status) === 'activo' || (sprint.estado || sprint.status) === 'active' 
                ? 'text-green-600' : 'text-gray-600'
            }`}>
              {sprint.estado || sprint.status}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(sprint.fecha_inicio || sprint.startDate).toLocaleDateString()} - 
              {new Date(sprint.fecha_fin || sprint.endDate).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>
    )}
  </div>
);

// Componente para mostrar historias del sprint
const SprintBacklogDetails = ({ sprintData, onToggleStory, showDetails, onToggleDetails }) => {
  if (!sprintData?.backlogItems) {
    return null;
  }

  const getStatusColor = (status) => {
    const colors = {
      'pendiente': 'bg-gray-100 text-gray-800',
      'en_progreso': 'bg-blue-100 text-blue-800',
      'completado': 'bg-green-100 text-green-800',
      'pending': 'bg-gray-100 text-gray-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'pendiente': 'Pendiente',
      'en_progreso': 'En Progreso',
      'completado': 'Completado',
      'pending': 'Pendiente',
      'in_progress': 'En Progreso',
      'completed': 'Completado'
    };
    return texts[status] || status;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onToggleDetails}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Historias del Sprint ({sprintData.backlogItems?.length || 0})
          </h3>
          <Eye className={`h-5 w-5 text-gray-500 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {showDetails && (
        <div className="p-4">
          {sprintData.backlogItems?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-medium text-gray-400 mb-2">No hay historias asignadas</h4>
              <p className="text-sm">Este sprint no tiene historias del backlog asignadas aún.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sprintData.backlogItems.map((story, index) => (
                <div
                  key={story._id || index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {story.titulo || story.title || `Historia ${index + 1}`}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(story.estado || story.status)}`}>
                          {getStatusText(story.estado || story.status)}
                        </span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          {story.puntos_historia || story.storyPoints || 1} SP
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {story.descripcion || story.description || 'Sin descripción disponible'}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>
                            {story.asignado_a?.nombre_negocio || 
                             story.assignedTo?.name || 
                             story.asignado_a?.email ||
                             'Sin asignar'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{story.prioridad || story.priority || 'Media'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => onToggleStory(story)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onToggleStory(story)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Editar historia"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SprintManagement = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { data: dashboardData, loading: dashboardLoading } = useScrumMasterDashboard();
  
  const [sprintData, setSprintData] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSprint, setActiveSprint] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Nuevo estado para controlar las pestañas
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'planning', 'backlog'

  useEffect(() => {
    fetchSprints();
  }, []);

  // Integrar datos del dashboard cuando estén disponibles
  useEffect(() => {
    if (dashboardData && !dashboardLoading) {
      setSprints(dashboardData.sprints || []);
      if (dashboardData.activeSprint && !activeSprint) {
        setActiveSprint(dashboardData.activeSprint);
        // Evitar llamar a fetchSprintDetails si no tenemos un _id válido
        if (dashboardData.activeSprint._id) {
          fetchSprintDetails(dashboardData.activeSprint._id);
        } else {
          console.warn('SprintManagement: dashboardData.activeSprint has no _id, skipping fetchSprintDetails');
          // Configurar sprintData con fallback desde dashboard
          setSprintData({
            ...dashboardData.activeSprint,
            backlogItems: dashboardData.activeSprintItems || [],
            technicalItems: dashboardData.technicalItems || [],
            teamMembers: dashboardData.teamMembers || []
          });
        }
      }
    }
  }, [dashboardData, dashboardLoading]);

  const handleNavigateToSprint = () => {
    navigate('/scrum_master/sprint-planning');
  };

  const handleNavigateToBacklog = () => {
    navigate('/scrum_master/backlog-tecnico');
  };

  // Nueva función para manejar cambio de pestañas
  const handleTabChange = (tabId) => {
    if (tabId === 'planning') {
      navigate('/scrum_master/sprint-planning');
    } else if (tabId === 'backlog') {
      navigate('/scrum_master/backlog-tecnico');
    } else {
      setActiveTab(tabId);
    }
  };

  const fetchSprints = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Primero intentar usar datos del dashboard si están disponibles
      if (dashboardData?.sprints?.length > 0) {
        setSprints(dashboardData.sprints);
        
        // Buscar sprint activo
        const active = dashboardData.activeSprint;
        if (active) {
          setActiveSprint(active);
          await fetchSprintDetails(active._id);
        } else if (dashboardData.sprints.length > 0) {
          const latest = dashboardData.sprints[0];
          setActiveSprint(latest);
          await fetchSprintDetails(latest._id);
        }
        return;
      }
      
      // Fallback: obtener desde API directamente
      const token = await getToken();
      const sprints = await sprintService.getSprints(token);
      
      console.log('Sprints obtenidos:', sprints);
      setSprints(sprints);
      
      // Buscar sprint activo
      const active = await sprintService.getActiveSprint(token);
      
      if (active) {
        setActiveSprint(active);
        if (active._id) {
          await fetchSprintDetails(active._id);
        } else {
          console.warn('SprintManagement: active sprint from API has no _id, skipping fetchSprintDetails');
          setSprintData({
            ...active,
            backlogItems: [],
            technicalItems: [],
            teamMembers: []
          });
        }
      } else if (sprints.length > 0) {
        // Si no hay sprint activo, tomar el más reciente
        const latest = sprints[0];
        setActiveSprint(latest);
        if (latest._id) {
          await fetchSprintDetails(latest._id);
        } else {
          console.warn('SprintManagement: latest sprint has no _id, skipping fetchSprintDetails');
          setSprintData({ ...latest, backlogItems: [], technicalItems: [], teamMembers: [] });
        }
      } else {
        setError('No hay sprints disponibles. Los sprints se crean desde el módulo Product Owner.');
      }
    } catch (error) {
      console.error('Error fetching sprints:', error);
      setError('Error al conectar con el servidor. Verifica tu conexión e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSprintDetails = async (sprintId) => {
    // Si sprintId no está definido, no intentar llamar al backend
    if (!sprintId) {
      console.warn('fetchSprintDetails called with falsy sprintId, returning fallback data');
      if (dashboardData?.activeSprint) {
        setSprintData({
          ...dashboardData.activeSprint,
          _id: sprintId,
          backlogItems: dashboardData.activeSprintItems || [],
          technicalItems: dashboardData.technicalItems || [],
          teamMembers: dashboardData.teamMembers || []
        });
      } else {
        setSprintData({
          ...mockSprintData,
          _id: sprintId
        });
      }
      return;
    }

    try {
      const token = await getToken();

      // Obtener métricas del sprint, items del backlog, items técnicos y datos del equipo en paralelo
      const [metrics, backlogItems, technicalItemsData, teamMembers] = await Promise.all([
        sprintService.getSprintMetrics(token, sprintId),
        sprintService.getSprintBacklogItems(token, sprintId),
        fetchTechnicalItemsForSprint(token, sprintId),
        fetchTeamMembersWithSprintData(token, sprintId)
      ]);

      // Agregar las historias, miembros reales y items técnicos al objeto de métricas
      const enhancedMetrics = {
        ...metrics,
        _id: sprintId, // Asegurar que el ID del sprint esté incluido
        backlogItems: backlogItems || [],
        teamMembers: teamMembers || metrics.teamMembers || [],
        technicalItems: technicalItemsData || [],
        // Métricas mejoradas que incluyen items técnicos
        totalItems: (backlogItems?.length || 0) + (technicalItemsData?.length || 0),
        totalCompletedItems: (backlogItems?.filter(item => 
          item.estado === 'completado' || item.status === 'completed'
        ).length || 0) + (technicalItemsData?.filter(item => 
          item.estado === 'completado' || item.status === 'completed'
        ).length || 0)
      };

      setSprintData(enhancedMetrics);
    } catch (error) {
      console.error('Error fetching sprint details:', error);
      // Usar datos del dashboard como fallback si están disponibles
      if (dashboardData?.activeSprint) {
        setSprintData({
          ...dashboardData.activeSprint,
          _id: sprintId, // Asegurar que el ID del sprint esté incluido
          backlogItems: dashboardData.activeSprintItems || [],
          technicalItems: dashboardData.technicalItems || [],
          teamMembers: dashboardData.teamMembers || []
        });
      } else {
        setSprintData({
          ...mockSprintData,
          _id: sprintId // Asegurar que el ID del sprint esté incluido
        });
      }
    }
  };

  // Nueva función para obtener items técnicos específicos del sprint
  const fetchTechnicalItemsForSprint = async (token, sprintId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      
      // Obtener items técnicos del sprint específico
      const response = await fetch(
        `${API_URL}/backlog?tipo=tarea,bug,mejora&sprint=${sprintId}&limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        console.warn('Error al obtener items técnicos, usando fallback');
        return dashboardData?.technicalItems || [];
      }

      const data = await response.json();
      return data.items || [];
      
    } catch (error) {
      console.error('Error fetching technical items for sprint:', error);
      // Usar datos del dashboard como fallback
      return dashboardData?.technicalItems || [];
    }
  };

  // Nueva función para obtener miembros del equipo con datos del sprint
  const fetchTeamMembersWithSprintData = async (token, sprintId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      
      // Obtener miembros del equipo desde el endpoint dedicado
      const teamResponse = await fetch(`${API_URL}/team/members`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!teamResponse.ok) {
        throw new Error('Error al obtener miembros del equipo');
      }
      
      const teamData = await teamResponse.json();
      const teamMembers = teamData.members || teamData || [];
      
      // Obtener items del backlog del sprint para calcular workload real
      const backlogItems = await sprintService.getSprintBacklogItems(token, sprintId);
      
      // Mapear miembros del equipo con datos reales del sprint
      const enhancedTeamMembers = teamMembers.map(member => {
        // Encontrar items asignados a este miembro en el sprint actual
        const memberItems = backlogItems.filter(item => {
          const assignedUser = item.asignado_a || item.assignedTo;
          return assignedUser && (
            assignedUser._id === member._id ||
            assignedUser.email === member.user?.email ||
            assignedUser.id === member._id
          );
        });
        
        // Calcular métricas basadas en items asignados
        const completed = memberItems.filter(item => 
          item.estado === 'completado' || item.status === 'completed'
        ).length;
        
        const planned = memberItems.length;
        
        const completedPoints = memberItems
          .filter(item => item.estado === 'completado' || item.status === 'completed')
          .reduce((sum, item) => sum + (item.puntos_historia || item.storyPoints || 1), 0);
        
        const plannedPoints = memberItems
          .reduce((sum, item) => sum + (item.puntos_historia || item.storyPoints || 1), 0);

        return {
          id: member._id,
          name: member.user ? 
            `${member.user.firstName || ''} ${member.user.lastName || ''}`.trim() || 
            member.user.nombre_negocio || 
            member.user.email : 
            'Usuario Desconocido',
          role: member.role || 'Developer',
          completed: completedPoints,
          planned: plannedPoints > 0 ? plannedPoints : member.workload?.maxStoryPoints || 24,
          availability: member.status === 'active' ? 'available' : 
                       member.status === 'busy' ? 'busy' : 'off',
          email: member.user?.email || '',
          workload: {
            currentStoryPoints: plannedPoints,
            maxStoryPoints: member.workload?.maxStoryPoints || 24,
            completedPoints: completedPoints
          },
          sprintAssignment: {
            itemsCount: planned,
            completedCount: completed,
            storyPoints: plannedPoints,
            completedPoints: completedPoints
          }
        };
      });
      
      return enhancedTeamMembers;
      
    } catch (error) {
      console.error('Error fetching team members with sprint data:', error);
      // Fallback a datos generados por el sprint service
      return null;
    }
  };

  const handleSprintAction = async (action) => {
    if (!activeSprint) return;
    
    try {
      const token = await getToken();
      
      const actionMap = {
        'start': 'iniciar',
        'pause': 'pausar', 
        'end': 'finalizar'
      };
      
      const actionData = action === 'end' ? { velocidad_real: sprintData?.completed || 0 } : {};
      
      await sprintService.executeSprintAction(
        token, 
        activeSprint._id, 
        actionMap[action], 
        actionData
      );

      // Recargar datos después de la acción
      await fetchSprints();
    } catch (error) {
      console.error('Error in sprint action:', error);
      setError(`Error al ${action} sprint: ${error.message}`);
      
      // Actualizar localmente como fallback
      switch (action) {
        case 'start':
          setSprintData(prev => ({ ...prev, status: 'active' }));
          break;
        case 'pause':
          setSprintData(prev => ({ ...prev, status: 'paused' }));
          break;
        case 'end':
          setSprintData(prev => ({ ...prev, status: 'completed' }));
          break;
        default:
          break;
      }
    }
  };

  const handleSelectSprint = async (sprint) => {
    setActiveSprint(sprint);
    setLoading(true);
    await fetchSprintDetails(sprint._id);
    setLoading(false);
  };

  // Función para refrescar solo el componente de items técnicos
  const handleRefreshTechnicalItems = async () => {
    if (activeSprint) {
      await fetchSprintDetails(activeSprint._id);
    }
  };

  const handleToggleStory = (story) => {
    console.log('Ver/Editar historia:', story);
    // Aquí puedes implementar la lógica para abrir un modal de edición
    // o navegar a una página de detalles de la historia
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'daily':
        console.log('Navegando a Daily Standup...');
        // Navegar a la página de ceremonias o abrir modal de daily
        window.location.href = '/scrum-master/ceremonies?ceremony=daily';
        break;
      case 'metrics':
        console.log('Actualizando métricas...');
        // Refrescar datos del sprint
        if (activeSprint) {
          fetchSprintDetails(activeSprint._id);
        }
        break;
      case 'review':
        console.log('Navegando a Sprint Review...');
        // Navegar a la página de review o abrir modal
        window.location.href = '/scrum-master/ceremonies?ceremony=review';
        break;
      default:
        console.log('Acción no reconocida:', action);
    }
  };

  const getSprintProgress = () => {
    if (!sprintData) return 0;
    const totalPlanned = sprintData.planned;
    const totalCompleted = sprintData.completed;
    return totalPlanned > 0 ? (totalCompleted / totalPlanned) * 100 : 0;
  };

  const getSprintStatus = () => {
    if (!sprintData) return { totalDays: 0, daysElapsed: 0, daysRemaining: 0, isOverdue: false };
    
    const today = new Date();
    const endDate = new Date(sprintData.endDate);
    const startDate = new Date(sprintData.startDate);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays - daysElapsed);

    return {
      totalDays,
      daysElapsed: Math.max(0, daysElapsed),
      daysRemaining,
      isOverdue: today > endDate
    };
  };

  const sprintStatus = getSprintStatus();
  const progress = getSprintProgress();

  // Mostrar loading
  if (loading && !sprintData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector de Sprints */}
      <SprintSelector 
        sprints={sprints}
        activeSprint={activeSprint}
        onSelectSprint={handleSelectSprint}
        loading={loading}
      />

      {/* Mensaje de error/información */}
      {error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Información</h3>
              <p className="text-sm text-blue-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal solo si hay datos del sprint */}
      {sprintData && (
        <>
          {/* Header del Sprint mejorado */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl shadow-lg text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{sprintData.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    sprintData.status === 'active' ? 'bg-green-500' :
                    sprintData.status === 'completed' ? 'bg-gray-500' :
                    'bg-blue-500'
                  }`}>
                    {sprintData.status === 'active' ? 'Activo' :
                     sprintData.status === 'completed' ? 'Completado' :
                     'Planificado'}
                  </span>
                </div>
                <p className="text-orange-100 mb-4">{sprintData.goal}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(sprintData.startDate).toLocaleDateString()} - {new Date(sprintData.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{sprintStatus.daysRemaining} días restantes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>{sprintData.totalStoryPoints || 0} Story Points</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-4xl font-bold mb-1">{progress.toFixed(0)}%</div>
                  <div className="text-orange-100">Progreso</div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleNavigateToSprint}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'planning' 
                        ? 'bg-white bg-opacity-30' 
                        : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                    }`}
                  >
                    <Target className="h-4 w-4" />
                    Sprint Planning
                  </button>
                  
                  {sprintData.status === 'active' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSprintAction('pause')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors"
                      >
                        <Pause className="h-4 w-4" />
                        Pausar
                      </button>
                      <button
                        onClick={() => handleSprintAction('end')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors"
                      >
                        <Square className="h-4 w-4" />
                        Finalizar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navegación por Pestañas */}
          <SprintTabNavigation 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            sprintData={sprintData}
          />

          {/* Contenido según la pestaña activa */}
          {activeTab === 'overview' && (
            <>
              {/* Métricas del Sprint mejoradas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Completado"
                  value={sprintData.completed || 0}
                  subtitle={`${sprintData.totalStoryPoints || 0} Story Points`}
                  icon={CheckCircle}
                  color="green"
                  trend="up"
                  trendValue="+12%"
                />
                
                <MetricCard
                  title="En Progreso"
                  value={sprintData.inProgress || 0}
                  subtitle="Items activos"
                  icon={Clock}
                  color="blue"
                />
                
                <MetricCard
                  title="Items Técnicos"
                  value={sprintData.technicalItems?.length || 0}
                  subtitle="Tareas, bugs, mejoras"
                  icon={Code}
                  color="purple"
                  isClickable={true}
                  onClick={handleNavigateToBacklog}
                />
                
                <MetricCard
                  title="Velocidad"
                  value={sprintData.velocity || 0}
                  subtitle="Story Points"
                  icon={TrendingUp}
                  color="orange"
                  trend="up"
                  trendValue={sprintData.previousVelocity ? 
                    `+${((sprintData.velocity - sprintData.previousVelocity) / sprintData.previousVelocity * 100).toFixed(0)}%` : 
                    undefined
                  }
                />
              </div>

              {/* Contenido principal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Burndown Chart */}
                <div className="lg:col-span-2 space-y-6">
                  <BurndownChart data={sprintData.burndownData} />
                  
                  {/* Items Técnicos del Sprint - Ahora dentro del grid */}
                  <SprintTechnicalItems 
                    sprintData={sprintData}
                    onRefresh={handleRefreshTechnicalItems}
                  />
                </div>

                {/* Alertas y estado */}
                <div className="space-y-6">
                  {/* Items técnicos */}
                  <TechnicalItemsMetrics 
                    sprintData={sprintData}
                    onNavigateToBacklog={handleNavigateToBacklog}
                  />

                  {/* Estado del sprint */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Estado del Sprint
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Días transcurridos</span>
                        <span className="font-medium">{sprintStatus.daysElapsed}/{sprintStatus.totalDays}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Puntos completados</span>
                        <span className="font-medium">{sprintData.completed}/{sprintData.planned}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Velocidad proyectada</span>
                        <span className="font-medium">{sprintData.velocity} pts</span>
                      </div>

                      {sprintStatus.isOverdue && (
                        <div className="p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">Sprint retrasado</span>
                          </div>
                        </div>
                      )}

                      {progress < 50 && sprintStatus.daysElapsed > sprintStatus.totalDays / 2 && (
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-2 text-yellow-700">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">Progreso por debajo de lo esperado</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones rápidas mejoradas */}
                  <QuickActionsPanel
                    onNavigateToSprint={handleNavigateToSprint}
                    onNavigateToBacklog={handleNavigateToBacklog}
                    sprintData={sprintData}
                    onQuickAction={handleQuickAction}
                  />
                </div>
              </div>

              {/* Equipo */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado del Equipo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sprintData.teamMembers.map((member, index) => (
                    <TeamMemberCard key={index} member={member} />
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SprintManagement;
