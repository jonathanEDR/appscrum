import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../../context/RoleContext.jsx';
import { useDashboardData } from '../../../hooks/useDashboardData.js';
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
  Activity
} from 'lucide-react';

// Tarjeta de estadística
const StatCard = ({ title, value, icon: Icon, color = 'blue', trend = null }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${colorClasses[color]} rounded-lg p-3`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <p className={`text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend.value}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar el equipo
const TeamOverview = () => {
  const teamMembers = [
    { name: 'Ana García', role: 'Frontend Dev', status: 'available', avatar: 'AG' },
    { name: 'Carlos López', role: 'Backend Dev', status: 'busy', avatar: 'CL' },
    { name: 'María Rodríguez', role: 'UX Designer', status: 'available', avatar: 'MR' },
    { name: 'David Chen', role: 'DevOps', status: 'off', avatar: 'DC' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-500',
      busy: 'bg-yellow-500',
      off: 'bg-gray-500'
    };
    return colors[status] || colors.off;
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Estado del Equipo
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                  {member.avatar}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                <span className="ml-2 text-xs text-gray-500 capitalize">{member.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Dashboard específico para Scrum Master
const ScrumMasterDashboard = () => {
  const navigate = useNavigate();
  const { loading, error } = useDashboardData('scrum_master');

  const handleNavigateToSection = (section) => {
    navigate(`/scrum_master/${section}`);
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
        <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar datos</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Sprint Progress',
      value: '75%',
      icon: Target,
      color: 'blue',
      trend: { positive: true, value: 'En tiempo' }
    },
    {
      title: 'Team Velocity',
      value: '38',
      icon: Zap,
      color: 'orange',
      trend: { positive: true, value: '+12% vs anterior' }
    },
    {
      title: 'Impedimentos',
      value: '2',
      icon: Clock,
      color: 'red'
    },
    {
      title: 'Daily Standups',
      value: '15',
      icon: MessageSquare,
      color: 'green',
      trend: { positive: true, value: 'Este sprint' }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-lg text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Panel Scrum Master</h1>
        <p className="text-orange-100">
          Facilita el proceso Scrum y elimina impedimentos
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estado del equipo */}
        <div className="lg:col-span-2">
          <TeamOverview />
        </div>

        {/* Sidebar derecho */}
        <div className="space-y-6">
          {/* Alertas críticas */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Alertas Críticas
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">Impedimento crítico</p>
                    <p className="text-xs text-red-700">API externa no disponible desde hace 2 días</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">Sprint en riesgo</p>
                    <p className="text-xs text-yellow-700">Progreso 25% por debajo de lo esperado</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleNavigateToSection('impedimentos')}
                className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver todos los impedimentos →
              </button>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
            </div>
            <div className="p-6 space-y-4">
              <button 
                onClick={() => handleNavigateToSection('sprints')}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                <Target className="h-5 w-5 mr-2" />
                Sprint Planning
              </button>
              
              <button 
                onClick={() => handleNavigateToSection('ceremonias')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Daily Standup
              </button>

              <button 
                onClick={() => handleNavigateToSection('metricas')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Sprint Review
              </button>

              <button 
                onClick={() => handleNavigateToSection('ceremonias')}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Users className="h-5 w-5 mr-2" />
                Retrospectiva
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrumMasterDashboard;
