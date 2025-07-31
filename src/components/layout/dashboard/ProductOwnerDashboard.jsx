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

// Tarjeta de estadística mejorada con diseño premium
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
    <Card className="transition-all duration-300 hover:shadow-galaxy-hover hover:scale-[1.02] border-0 glass-card overflow-hidden group animate-fadeIn hover-lift">
      <div className="absolute inset-0 gradient-galaxy-enhanced opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`${colorClasses[color]} rounded-xl p-3 shadow-galaxy group-hover:scale-110 transition-transform duration-300 animate-galaxy-pulse`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-300">{title}</p>
              <p className="text-2xl font-bold text-white group-hover:animate-pulse transition-all">{value}</p>
              {trend && (
                <p className={`text-xs ${trend.positive ? 'text-emerald-400' : 'text-red-400'} flex items-center mt-1`}>
                  <TrendingUp className="h-3 w-3 mr-1 animate-float" />
                  {trend.value}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-20"></div>
    </Card>
  );
};

// Componente para mostrar el sprint actual mejorado con diseño premium
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
    <Panel title="Sprint Actual" className="glass-card backdrop-blur-lg border-azul-galaxia/20 shadow-galaxy"
           style={{
             background: 'rgba(100, 116, 139, 0.1)', // azul galaxia suave
             backdropFilter: 'blur(12px)',
             border: '1px solid rgba(100, 116, 139, 0.2)'
           }}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xl font-bold text-white">{sprintData.name}</h4>
          <span className="text-sm text-slate-300 bg-slate-700/50 px-3 py-1 rounded-full font-medium">
            {sprintData.startDate} - {sprintData.endDate}
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-slate-700/50 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-medium relative overflow-hidden" 
              style={{ width: `${sprintData.progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm text-slate-300 mt-2 font-medium">{sprintData.progress}% completado</p>
        </div>
      </div>

      <DashboardGrid columns={3} gap="gap-4">
        <div className="text-center group">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mx-auto mb-3 shadow-large group-hover:scale-110 transition-transform duration-300">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <p className="text-lg font-bold text-white">{sprintData.completedStories}</p>
          <p className="text-xs text-slate-300 font-medium">Completadas</p>
        </div>
        <div className="text-center group">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-3 shadow-large group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <p className="text-lg font-bold text-white">{sprintData.inProgressStories}</p>
          <p className="text-xs text-slate-300 font-medium">En Progreso</p>
        </div>
        <div className="text-center group">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-3 shadow-large group-hover:scale-110 transition-transform duration-300">
            <Target className="w-6 h-6 text-white" />
          </div>
          <p className="text-lg font-bold text-white">{sprintData.todoStories}</p>
          <p className="text-xs text-slate-300 font-medium">Por Hacer</p>
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
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto shadow-galaxy"></div>
              <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-br from-primary-500/20 to-transparent"></div>
            </div>
            <p className="mt-6 text-primary-700 font-medium">Cargando panel Product Owner...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Card className="bg-error-50/80 border-error-200 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-error-800 mb-2">Error al cargar datos</h3>
          <p className="text-error-600">{error}</p>
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
        <Card className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 text-white border-0 shadow-galaxy overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
          <div className="relative z-10 p-8">
            <h1 className="text-3xl font-bold mb-2">Panel Product Owner</h1>
            <p className="text-slate-200 text-lg">
              Gestiona el producto y maximiza el valor del negocio
            </p>
          </div>
          <div className="absolute -right-8 -top-8 opacity-20">
            <Target className="h-32 w-32 text-blue-400" />
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
            <Panel title="Acciones Rápidas" className="glass-card backdrop-blur-lg border-azul-galaxia/20 shadow-galaxy"
                   style={{
                     background: 'rgba(100, 116, 139, 0.1)', // azul galaxia suave
                     backdropFilter: 'blur(12px)',
                     border: '1px solid rgba(100, 116, 139, 0.2)'
                   }}>
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-medium shadow-medium hover:shadow-large transform hover:-translate-y-0.5 flex items-center justify-center">
                  <Target className="h-5 w-5 mr-2" />
                  Gestionar Backlog
                </button>
                
                <button className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-6 py-3 rounded-xl hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 font-medium shadow-medium hover:shadow-large transform hover:-translate-y-0.5 flex items-center justify-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Planificar Sprint
                </button>

                <button className="w-full bg-gradient-to-r from-accent-400 to-accent-500 text-white px-6 py-3 rounded-xl hover:from-accent-500 hover:to-accent-600 transition-all duration-300 font-medium shadow-medium hover:shadow-large transform hover:-translate-y-0.5 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Ver Métricas
                </button>

                <button className="w-full glass-card border-2 border-slate-600 text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300 font-medium shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 flex items-center justify-center"
                        style={{
                          background: 'rgba(30, 41, 59, 0.3)',
                          backdropFilter: 'blur(8px)',
                          color: '#e2e8f0'
                        }}>
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
