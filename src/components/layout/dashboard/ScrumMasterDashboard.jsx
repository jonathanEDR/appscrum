import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../../context/RoleContext.jsx';
import { useScrumMasterDashboard } from '../../../hooks/useScrumMasterDashboard.js';
import { MetricCard, SprintProgressCard, CriticalAlertsCard } from '../../ScrumMaster/MetricCards.jsx';
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
      available: 'bg-green-500',
      busy: 'bg-yellow-500',
      off: 'bg-gray-500'
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Estado del Equipo
          </h3>
        </div>
        <div className="p-6">
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
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Estado del Equipo
        </h3>
      </div>
      <div className="p-6">
        {teamMembers.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
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
      </div>
    </div>
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Items Técnicos Pendientes
          </h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gray-300 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center justify-between">
          <span className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Items Técnicos Pendientes
          </span>
          <span className="text-sm text-gray-500">{pendingItems.length} total</span>
        </h3>
      </div>
      <div className="p-6">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-4 text-gray-500">
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
        <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
          Gestionar items técnicos →
        </button>
      </div>
    </div>
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
    handleNavigateToSection('sprint-planning');
  };

  const handleNavigateToBacklog = () => {
    handleNavigateToSection('backlog-tecnico');
  };

  const handleNavigateToCritical = () => {
    handleNavigateToSection('impedimentos');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel Scrum Master...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar datos</h3>
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const { metrics, activeSprint, teamMembers, technicalItems } = data;

  return (
    <div className="space-y-6">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl shadow-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Panel Scrum Master</h1>
            <p className="text-orange-100">
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
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SprintProgressCard
          activeSprint={activeSprint}
          totalStoryPoints={metrics.totalStoryPoints}
          completedStoryPoints={metrics.completedStoryPoints}
          onClick={handleNavigateToSprint}
        />
        
        <MetricCard
          title="Team Velocity"
          value={metrics.teamVelocity}
          subtitle="Story Points"
          icon={Zap}
          color="orange"
          trend="up"
          trendValue="+12%"
        />

        <CriticalAlertsCard
          criticalBugs={metrics.criticalBugs}
          activeImpediments={metrics.activeImpediments}
          onClick={handleNavigateToCritical}
        />
        
        <MetricCard
          title="Items Técnicos"
          value={metrics.pendingTasks}
          subtitle="Pendientes"
          icon={Activity}
          color="purple"
          isClickable={true}
          onClick={handleNavigateToBacklog}
        />
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estado del equipo */}
        <div className="lg:col-span-2">
          <TeamOverview teamMembers={teamMembers} loading={loading} />
        </div>

        {/* Sidebar derecho */}
        <div className="space-y-6">
          {/* Items técnicos */}
          <TechnicalItemsOverview 
            technicalItems={technicalItems}
            loading={loading}
            onClick={handleNavigateToBacklog}
          />

          {/* Acciones rápidas mejoradas */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
            </div>
            <div className="p-6 space-y-3">
              <button 
                onClick={() => handleNavigateToSection('sprint-planning')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                <Target className="h-5 w-5 mr-2" />
                Sprint Planning
              </button>
              
              <button 
                onClick={() => handleNavigateToSection('backlog-tecnico')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Code className="h-5 w-5 mr-2" />
                Backlog Técnico
              </button>

              <button 
                onClick={() => handleNavigateToSection('ceremonias')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Daily Standup
              </button>

              <button 
                onClick={() => handleNavigateToSection('metricas')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Sprint Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrumMasterDashboard;
