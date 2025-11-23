import React from 'react';
import { useRole } from '../../../context/RoleContext.jsx';
import { useDashboardData } from '../../../hooks/useDashboardData.js';
import { 
  PageContainer, 
  DashboardGrid, 
  Card, 
  Panel,
  LoadingSpinner
} from '../LayoutComponents.jsx';
import { 
  Target, 
  Calendar, 
  BarChart3, 
  Users,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';

// Tarjeta de estadística mejorada con diseño premium y tema adaptable
const StatCard = ({ title, value, icon: Icon, color = 'primary', trend = null }) => {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-600',
    secondary: 'bg-gradient-to-br from-secondary-500 to-secondary-600',
    accent: 'bg-gradient-to-br from-accent-400 to-accent-500',
    success: 'bg-gradient-to-br from-success-500 to-success-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    green: 'bg-gradient-to-br from-success-500 to-success-600'
  };

  return (
    <Card className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/50 hover:scale-[1.02] overflow-hidden group">
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`${colorClasses[color]} rounded-xl p-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white transition-all">{value}</p>
              {trend && (
                <p className={`text-xs ${trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} flex items-center mt-1`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {trend.value}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Componente para mostrar el sprint actual mejorado con tema adaptable
const CurrentSprint = () => {
  const sprintData = {
    name: 'Sprint 15',
    startDate: '2025-06-28',
    endDate: '2025-07-11',
    progress: 65,
    totalStories: 12,
    completedStories: 8,
    inProgressStories: 3,
    todoStories: 1
  };

  return (
    <Panel title="Sprint Actual" className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{sprintData.name}</h4>
          <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-medium">
            {sprintData.startDate} - {sprintData.endDate}
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-md relative overflow-hidden" 
              style={{ width: `${sprintData.progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 font-medium">{sprintData.progress}% completado</p>
        </div>
      </div>

      <DashboardGrid columns={3} gap="gap-4">
        <div className="text-center group">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{sprintData.completedStories}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Completadas</p>
        </div>
        <div className="text-center group">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{sprintData.inProgressStories}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">En Progreso</p>
        </div>
        <div className="text-center group">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
            <Target className="w-6 h-6 text-white" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{sprintData.todoStories}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Por Hacer</p>
        </div>
      </DashboardGrid>
    </Panel>
  );
};

// Dashboard específico para Product Owner mejorado
const ProductOwnerDashboard = () => {
  const { loading, error } = useDashboardData('product_owner');

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 mx-auto shadow-lg"></div>
              <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-br from-blue-500/20 to-transparent"></div>
            </div>
            <p className="mt-6 text-gray-700 dark:text-gray-300 font-medium">Cargando panel Product Owner...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Error al cargar datos</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card>
      </PageContainer>
    );
  }

  const stats = [
    {
      title: 'Product Backlog',
      value: '24',
      icon: Target,
      color: 'blue',
      trend: { positive: true, value: '+3 nuevas historias' }
    },
    {
      title: 'Sprint Activo',
      value: '1',
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Velocity Promedio',
      value: '42',
      icon: BarChart3,
      color: 'purple',
      trend: { positive: true, value: '+8% vs anterior' }
    },
    {
      title: 'Stakeholders',
      value: '7',
      icon: Users,
      color: 'accent'
    }
  ];

  return (
    <PageContainer>
      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700 text-white border-0 shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/20"></div>
          <div className="relative z-10 p-8">
            <h1 className="text-3xl font-bold mb-2">Panel Product Owner</h1>
            <p className="text-blue-100 dark:text-cyan-100 text-lg">
              Gestiona el producto y maximiza el valor del negocio
            </p>
          </div>
          <div className="absolute -right-8 -top-8 opacity-20">
            <Target className="h-32 w-32 text-white" />
          </div>
        </Card>

        <DashboardGrid columns={4}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </DashboardGrid>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CurrentSprint />
          </div>
          <div className="lg:col-span-1">
            <Panel title="Acciones Rápidas" className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center">
                  <Target className="h-5 w-5 mr-2" />
                  Gestionar Backlog
                </button>
                
                <button className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-6 py-3 rounded-xl hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Planificar Sprint
                </button>

                <button className="w-full bg-gradient-to-r from-accent-400 to-accent-500 text-white px-6 py-3 rounded-xl hover:from-accent-500 hover:to-accent-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Ver Métricas
                </button>

                <button className="w-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center">
                  <Users className="h-5 w-5 mr-2" />
                  Reunión con Stakeholders
                </button>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProductOwnerDashboard;
