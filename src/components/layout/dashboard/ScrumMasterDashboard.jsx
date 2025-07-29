import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../../context/RoleContext.jsx';
import { useScrumMasterDashboard } from '../../../hooks/useScrumMasterDashboard.js';
import { MetricCard, SprintProgressCard, CriticalAlertsCard } from '../../ScrumMaster/MetricCards.jsx';
import { 
  PageContainer, 
  DashboardGrid, 
  Card, 
  TwoColumnLayout,
  LoadingSpinner
} from '../LayoutComponents.jsx';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  MessageSquare,
  Zap,
  AlertTriangle,
  Activity,
  Code,
  Bug,
  Settings,
  RefreshCw
} from 'lucide-react';

// Componente para mostrar el equipo con datos reales
const TeamOverview = ({ teamMembers = [], loading = false }) => {
  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-success-500',
      busy: 'bg-accent-500',
      off: 'bg-secondary-500'
    };
    return colors[status] || colors.off;
  };

  const getStatusText = (status) => {
    const texts = {
      available: 'Disponible',
      busy: 'Ocupado',
      off: 'Ausente'
    };
    return texts[status] || 'Desconocido';
  };

  if (loading) {
    return (
      <Card>
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Estado del Equipo
          </h3>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="ml-3 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Estado del Equipo
        </h3>
      </div>
      {teamMembers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No hay miembros del equipo</p>
        </div>
      ) : (
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div key={member._id || index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                  {member.name ? member.name.split(' ').map(n => n[0]).join('') : '??'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{member.name || 'Usuario'}</p>
                  <p className="text-xs text-gray-500">{member.role || member.tipo || 'Developer'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status || 'available')}`}></div>
                <span className="ml-2 text-xs text-gray-500">
                  {getStatusText(member.status || 'available')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

// Componente para items técnicos pendientes
const TechnicalItemsOverview = ({ technicalItems = [], loading = false, onClick }) => {
  const getItemTypeColor = (tipo) => {
    const colors = {
      tarea: 'bg-blue-100 text-blue-800',
      bug: 'bg-red-100 text-red-800',
      mejora: 'bg-purple-100 text-purple-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getItemTypeIcon = (tipo) => {
    const icons = { tarea: Code, bug: Bug, mejora: Settings };
    return icons[tipo] || Code;
  };

  const pendingItems = technicalItems.filter(item => item.estado !== 'completado');
  const groupedItems = pendingItems.reduce((acc, item) => {
    acc[item.tipo] = (acc[item.tipo] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <Card>
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Items Técnicos Pendientes
          </h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-300 rounded w-8"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center justify-between">
          <span className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Items Técnicos Pendientes
          </span>
          <span className="text-sm text-gray-500">{pendingItems.length} total</span>
        </h3>
      </div>
      {Object.keys(groupedItems).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
          <p>¡Todos los items técnicos completados!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(groupedItems).map(([tipo, count]) => {
            const Icon = getItemTypeIcon(tipo);
            return (
              <div key={tipo} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-600" />
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getItemTypeColor(tipo)}`}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}s
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            );
          })}
        </div>
      )}
      <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
        Gestionar items técnicos 
      </button>
    </Card>
  );
};

// Dashboard específico para Scrum Master con datos reales
const ScrumMasterDashboard = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useScrumMasterDashboard();

  const handleNavigateToSection = (section) => {
    navigate(`/scrum_master/${section}`);
  };

  const handleNavigateToSprint = () => {
    handleNavigateToSection('sprints');
  };

  const handleNavigateToBacklog = () => {
    handleNavigateToSection('backlog-tecnico');
  };

  const handleNavigateToCritical = () => {
    handleNavigateToSection('impedimentos');
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar datos</h3>
              <p className="text-red-600">{error}</p>
            </div>
            <button
              onClick={refetch}
              className="ml-4 px-4 py-2 btn-accent rounded flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  // Datos por defecto si no hay datos
  const defaultData = {
    metrics: {
      totalStoryPoints: 45,
      completedStoryPoints: 28,
      teamVelocity: 42,
      criticalBugs: 2,
      activeImpediments: 1,
      technicalItemsPending: 5
    },
    activeSprint: {
      name: 'Sprint 15',
      progress: 62,
      daysRemaining: 3
    },
    teamMembers: [
      { _id: '1', name: 'Ana García', role: 'Frontend Developer', status: 'available' },
      { _id: '2', name: 'Carlos López', role: 'Backend Developer', status: 'busy' },
      { _id: '3', name: 'María Rodríguez', role: 'QA Engineer', status: 'available' },
      { _id: '4', name: 'Juan Martínez', role: 'DevOps', status: 'off' }
    ],
    technicalItems: [
      { _id: '1', tipo: 'bug', estado: 'pendiente' },
      { _id: '2', tipo: 'tarea', estado: 'pendiente' },
      { _id: '3', tipo: 'mejora', estado: 'pendiente' },
      { _id: '4', tipo: 'bug', estado: 'pendiente' },
      { _id: '5', tipo: 'tarea', estado: 'pendiente' }
    ]
  };

  const { metrics, activeSprint, teamMembers, technicalItems } = data || defaultData;

  return (
    <PageContainer>
      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-secondary-600 via-primary-600 to-accent-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Panel Scrum Master</h1>
              <p className="text-secondary-100">
                Facilita el proceso Scrum y elimina impedimentos
              </p>
            </div>
            <button
              onClick={refetch}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Actualizar datos"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </Card>

        <DashboardGrid columns={4}>
          <Card className="transition-shadow hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-lg p-3">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sprint Progress</p>
                  <p className="text-2xl font-semibold text-gray-900">{activeSprint.progress}%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {activeSprint.name}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="transition-shadow hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-orange-500 rounded-lg p-3">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Team Velocity</p>
                  <p className="text-2xl font-semibold text-gray-900">{metrics.teamVelocity}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% vs anterior
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-red-500 rounded-lg p-3">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                  <p className="text-2xl font-semibold text-gray-900">{metrics.criticalBugs + metrics.activeImpediments}</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Requiere atención
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-purple-500 rounded-lg p-3">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Items Técnicos</p>
                  <p className="text-2xl font-semibold text-gray-900">{metrics.technicalItemsPending}</p>
                  <p className="text-xs text-gray-500">Pendientes</p>
                </div>
              </div>
            </div>
          </Card>
        </DashboardGrid>

        <TwoColumnLayout
          leftContent={
            <TeamOverview 
              teamMembers={teamMembers} 
              loading={loading} 
            />
          }
          rightContent={
            <TechnicalItemsOverview 
              technicalItems={technicalItems}
              loading={loading}
              onClick={handleNavigateToBacklog}
            />
          }
        />
      </div>
    </PageContainer>
  );
};

export default ScrumMasterDashboard;
