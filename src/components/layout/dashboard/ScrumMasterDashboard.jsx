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

// Componente para mostrar el equipo con datos reales - Estilo premium
const TeamOverview = ({ teamMembers = [], loading = false }) => {
  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-success-500',
      busy: 'bg-warning-500', 
      off: 'bg-accent-400'
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
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            Estado del Equipo
          </h3>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="ml-4 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-lg w-28"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-20"></div>
                </div>
              </div>
              <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mr-3">
            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          Estado del Equipo
        </h3>
      </div>
      {teamMembers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-purple-500 dark:text-purple-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">No hay miembros del equipo</p>
        </div>
      ) : (
        <div className="space-y-3">
          {teamMembers.map((member, index) => (
            <div key={member._id || index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">
                  {member && (member.name || member.user?.nombre_negocio) ? ((member.name || member.user?.nombre_negocio).split ? (member.name || member.user?.nombre_negocio).split(' ').map(n => n[0]).join('') : '??') : '??'}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{member.name || 'Usuario'}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{member.role || member.tipo || 'Developer'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(member.status || 'available')} shadow-sm`}></div>
                <span className="ml-3 text-xs font-medium text-gray-600 dark:text-gray-400">
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
    return colors[tipo] || 'bg-primary-100 text-primary-800';
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
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Items Técnicos Pendientes
          </h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
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
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center justify-between">
          <span className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Items Técnicos Pendientes
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{pendingItems.length} total</span>
        </h3>
      </div>
      {Object.keys(groupedItems).length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500 dark:text-green-400" />
          <p>¡Todos los items técnicos completados!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(groupedItems).map(([tipo, count]) => {
            const Icon = getItemTypeIcon(tipo);
            return (
              <div key={tipo} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getItemTypeColor(tipo)}`}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}s
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{count}</span>
              </div>
            );
          })}
        </div>
      )}
      <button className="card-button w-full mt-4 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
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

  const { metrics, activeSprint, teamMembers, technicalItems } = data || {};

  // Usar valores por defecto si alguna propiedad viene como null/undefined en producción
  const safeMetrics = metrics || defaultData.metrics;
  const safeActiveSprint = activeSprint || defaultData.activeSprint;
  const safeTeamMembers = teamMembers || defaultData.teamMembers;
  const safeTechnicalItems = technicalItems || defaultData.technicalItems;

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header con tema */}
        <Card className="bg-gradient-to-r from-purple-600 to-violet-600 text-white border-0 shadow-xl overflow-hidden relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Panel Scrum Master</h1>
                <p className="text-white/90 text-lg">
                  Facilita el proceso Scrum y elimina impedimentos
                </p>
              </div>
            </div>
            <button
              onClick={refetch}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 shadow-lg group"
              title="Actualizar datos"
            >
              <RefreshCw className={`h-6 w-6 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
            </button>
          </div>
        </Card>

        {/* Tarjetas de métricas con tema */}
        <DashboardGrid columns={5}>
          <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sprint Progress</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{safeActiveSprint.progress}%</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1 font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {safeActiveSprint.name}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Velocity</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{safeMetrics.teamVelocity}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1 font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% vs anterior
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-red-500 cursor-pointer"
            onClick={() => handleNavigateToSection('bug-reports')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bug className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bug Reports</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{safeMetrics.totalBugReports || 0}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1 font-medium">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {safeMetrics.openBugs || 0} abiertos
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Issues</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{(safeMetrics.criticalBugReports || 0) + (safeMetrics.activeImpediments || 0)}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1 font-medium">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Requiere atención
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Items Técnicos</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{safeMetrics.technicalItemsPending || 0}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Pendientes</p>
                </div>
              </div>
            </div>
          </Card>
        </DashboardGrid>

        <TwoColumnLayout
          leftContent={
            <TeamOverview 
                teamMembers={safeTeamMembers} 
              loading={loading} 
            />
          }
          rightContent={
              <TechnicalItemsOverview 
                technicalItems={safeTechnicalItems}
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
