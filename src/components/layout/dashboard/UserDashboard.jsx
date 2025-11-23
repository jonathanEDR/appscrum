import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useRole } from '../../../context/RoleContext.jsx';
import { apiService } from '../../../services/apiService';
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  User,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Eye,
  ChevronRight
} from 'lucide-react';

// Tarjeta de estadística para el Panel de Usuario
const StatCard = ({ title, value, icon: Icon, color = 'blue', trend = null }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  const iconBackgroundColors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500', 
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-6 flex items-center hover:shadow-xl transition-all duration-300">
      <div className={`${iconBackgroundColors[color]} rounded-lg p-3 mr-4 shadow-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        {trend && (
          <p className={`text-xs ${trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center mt-1 font-medium`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend.value}
          </p>
        )}
      </div>
    </div>
  );
};

// Componente para mostrar proyectos del usuario
const MyProjects = ({ projects = [], loading = false }) => {
  const getStatusInfo = (status) => {
    const statusConfig = {
      activo: { label: 'Activo', color: 'bg-green-100 text-green-800' },
      inactivo: { label: 'Planificación', color: 'bg-yellow-100 text-yellow-800' },
      completado: { label: 'Completado', color: 'bg-blue-100 text-blue-800' },
      pausado: { label: 'Pausado', color: 'bg-gray-100 text-gray-800' }
    };
    return statusConfig[status] || statusConfig.activo;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Mis Proyectos
          </h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Cargando proyectos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Briefcase className="h-5 w-5 mr-2" />
          Mis Proyectos
        </h3>
      </div>
      <div className="p-6">
        {projects && projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => {
              const statusInfo = getStatusInfo(project.estado);
              
              return (
                <div key={project._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">{project.nombre}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{project.equipo || 'Equipo Alpha'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Progreso</span>
                      <span>{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      Entrega: {formatDate(project.fecha_fin)}
                    </span>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center">
                      Ver detalles
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No tienes proyectos asignados</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard específico para User (Panel de Usuario)
const UserDashboard = () => {
  const navigate = useNavigate();
  const { userId, getToken } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiService.getUserDashboard(userId, getToken);
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Error al cargar los datos del dashboard');
        
        // Datos de fallback para desarrollo
        setDashboardData({
          user: { nombre_negocio: 'Usuario', email: 'usuario@example.com' },
          metrics: {
            totalProjects: 3,
            pendingTasks: 5,
            weeklyHours: 32,
            hoursVariation: 5,
            isIncrease: true
          },
          projects: [
            {
              _id: '1',
              nombre: 'Sistema de Gestión CRM',
              estado: 'activo',
              progress: 75,
              fecha_fin: '2025-08-14',
              equipo: 'Equipo Alpha'
            },
            {
              _id: '2',
              nombre: 'App Mobile E-commerce',
              estado: 'inactivo',
              progress: 25,
              fecha_fin: '2025-09-29',
              equipo: 'Equipo Beta'
            },
            {
              _id: '3',
              nombre: 'Portal de Reportes',
              estado: 'completado',
              progress: 100,
              fecha_fin: '2025-06-30',
              equipo: 'Equipo Gamma'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId, getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando panel de usuario...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error al cargar datos</h3>
        <p className="text-red-600 dark:text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const { metrics = {}, projects = [] } = dashboardData || {};

  const stats = [
    {
      title: 'Mis Proyectos',
      value: metrics.totalProjects || 0,
      icon: Briefcase,
      color: 'blue'
    },
    {
      title: 'Tareas Pendientes',
      value: metrics.pendingTasks || 0,
      icon: Target,
      color: 'yellow'
    },
    {
      title: 'Horas Trabajadas',
      value: metrics.weeklyHours || 0,
      icon: Clock,
      color: 'purple',
      trend: metrics.hoursVariation !== undefined ? { 
        positive: metrics.isIncrease, 
        value: 'Esta semana' 
      } : null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header del Panel de Usuario */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-xl text-white p-8">
        <h1 className="text-3xl font-bold mb-2">Panel de Usuario</h1>
        <p className="text-indigo-100 text-lg">
          Gestiona tus proyectos y mantén al día con tus tareas
        </p>
        {error && (
          <div className="mt-3 bg-yellow-100 text-yellow-800 px-3 py-2 rounded text-sm">
            ⚠️ Mostrando datos de ejemplo - {error}
          </div>
        )}
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mis proyectos - Ocupa 2 columnas en pantallas grandes */}
        <div className="lg:col-span-2">
          <MyProjects projects={projects} loading={false} />
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Acciones Rápidas</h3>
          </div>
          <div className="p-6 space-y-4">
            <button 
              onClick={() => navigate('/user/proyectos')}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:shadow-xl"
            >
              <Eye className="h-5 w-5 mr-2" />
              Ver Proyectos
            </button>
            
            <button 
              onClick={() => navigate('/user/calendario')}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:shadow-xl"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Ver Calendario
            </button>

            <button 
              onClick={() => navigate('/user/perfil')}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:shadow-xl"
            >
              <User className="h-5 w-5 mr-2" />
              Mi Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
