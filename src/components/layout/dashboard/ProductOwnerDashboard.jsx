import React from 'react';
import { useRole } from '../../../context/RoleContext.jsx';
import { useDashboardData } from '../../../hooks/useDashboardData.js';
import { 
  Target, 
  Calendar, 
  BarChart3, 
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

// Tarjeta de estadística
const StatCard = ({ title, value, icon: Icon, color = 'blue', trend = null }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
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

// Componente para mostrar el sprint actual
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
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Sprint Actual
        </h3>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xl font-semibold text-gray-900">{sprintData.name}</h4>
            <span className="text-sm text-gray-500">
              {sprintData.startDate} - {sprintData.endDate}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${sprintData.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{sprintData.progress}% completado</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">{sprintData.completedStories}</p>
            <p className="text-xs text-gray-500">Completadas</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full mx-auto mb-2">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">{sprintData.inProgressStories}</p>
            <p className="text-xs text-gray-500">En Progreso</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full mx-auto mb-2">
              <AlertTriangle className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">{sprintData.todoStories}</p>
            <p className="text-xs text-gray-500">Por Hacer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard específico para Product Owner
const ProductOwnerDashboard = () => {
  const { loading, error } = useDashboardData('product_owner');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel Product Owner...</p>
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
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Panel Product Owner</h1>
        <p className="text-green-100">
          Gestiona el producto y maximiza el valor del negocio
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
        {/* Sprint actual */}
        <div className="lg:col-span-2">
          <CurrentSprint />
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
              <Target className="h-5 w-5 mr-2" />
              Gestionar Backlog
            </button>
            
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Calendar className="h-5 w-5 mr-2" />
              Planificar Sprint
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <BarChart3 className="h-5 w-5 mr-2" />
              Ver Métricas
            </button>

            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Users className="h-5 w-5 mr-2" />
              Reunión con Stakeholders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOwnerDashboard;
