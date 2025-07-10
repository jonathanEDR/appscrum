import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import sprintService from '../../services/sprintService';
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
  User
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

const SprintProgressCard = ({ title, value, total, icon: Icon, color = 'blue' }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600',
    green: 'bg-green-500 text-green-600',
    yellow: 'bg-yellow-500 text-yellow-600',
    red: 'bg-red-500 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${colorClasses[color].split(' ')[0]} bg-opacity-10 rounded-lg`}>
            <Icon className={`h-5 w-5 ${colorClasses[color].split(' ')[1]}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-700">{percentage.toFixed(0)}%</p>
          <p className="text-xs text-gray-500">de {total}</p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${colorClasses[color].split(' ')[0]} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
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
  const [sprintData, setSprintData] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSprint, setActiveSprint] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchSprints();
  }, []);

  const fetchSprints = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = await getToken();
      const sprints = await sprintService.getSprints(token);
      
      console.log('Sprints obtenidos:', sprints);
      setSprints(sprints);
      
      // Buscar sprint activo
      const active = await sprintService.getActiveSprint(token);
      
      if (active) {
        setActiveSprint(active);
        await fetchSprintDetails(active._id);
      } else if (sprints.length > 0) {
        // Si no hay sprint activo, tomar el más reciente
        const latest = sprints[0];
        setActiveSprint(latest);
        await fetchSprintDetails(latest._id);
      } else {
        setError('No hay sprints disponibles. Mostrando datos de demostración.');
        setSprintData(mockSprintData);
      }
    } catch (error) {
      console.error('Error fetching sprints:', error);
      setError('Error al conectar con el servidor. Mostrando datos de demostración.');
      setSprintData(mockSprintData);
    } finally {
      setLoading(false);
    }
  };

  const fetchSprintDetails = async (sprintId) => {
    try {
      const token = await getToken();
      const metrics = await sprintService.getSprintMetrics(token, sprintId);
      
      // Obtener también las historias del backlog
      const backlogItems = await sprintService.getSprintBacklogItems(token, sprintId);
      
      // Agregar las historias al objeto de métricas
      const enhancedMetrics = {
        ...metrics,
        backlogItems: backlogItems || []
      };
      
      setSprintData(enhancedMetrics);
    } catch (error) {
      console.error('Error fetching sprint details:', error);
      setSprintData(mockSprintData);
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
          {/* Header del Sprint */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-lg text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{sprintData.name}</h1>
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
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold mb-1">{progress.toFixed(0)}%</div>
            <div className="text-orange-100">Progreso</div>
            <div className="flex gap-2 mt-4">
              {sprintData.status === 'active' && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detalles del Sprint Backlog */}
      <SprintBacklogDetails
        sprintData={sprintData}
        onToggleStory={handleToggleStory}
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails(!showDetails)}
      />

      {/* Métricas del Sprint */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SprintProgressCard
          title="Completado"
          value={sprintData.completed}
          total={sprintData.planned}
          icon={CheckCircle}
          color="green"
        />
        <SprintProgressCard
          title="En Progreso"
          value={sprintData.inProgress}
          total={sprintData.planned}
          icon={Clock}
          color="yellow"
        />
        <SprintProgressCard
          title="Restante"
          value={sprintData.remaining}
          total={sprintData.planned}
          icon={AlertTriangle}
          color="red"
        />
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Velocidad</p>
              <p className="text-2xl font-bold text-gray-900">{sprintData.velocity}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600">
              +{((sprintData.velocity - sprintData.previousVelocity) / sprintData.previousVelocity * 100).toFixed(0)}%
            </span>
            <span className="text-gray-500 ml-1">vs sprint anterior</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Burndown Chart */}
        <div className="lg:col-span-2">
          <BurndownChart data={sprintData.burndownData} />
        </div>

        {/* Alertas y estado */}
        <div className="space-y-6">
          {/* Estado del sprint */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
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

          {/* Acciones rápidas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleQuickAction('daily')}
                className="w-full flex items-center gap-2 px-4 py-3 text-left border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Daily Standup</span>
              </button>
              <button 
                onClick={() => handleQuickAction('metrics')}
                className="w-full flex items-center gap-2 px-4 py-3 text-left border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Actualizar métricas</span>
              </button>
              <button 
                onClick={() => handleQuickAction('review')}
                className="w-full flex items-center gap-2 px-4 py-3 text-left border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Target className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Review del sprint</span>
              </button>
            </div>
          </div>
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

      {/* Detalles del Backlog del Sprint */}
      <SprintBacklogDetails 
        sprintData={sprintData} 
        onToggleStory={() => {}} 
        showDetails={showDetails} 
        onToggleDetails={() => setShowDetails(prev => !prev)} 
      />
        </>
      )}
    </div>
  );
};

export default SprintManagement;
