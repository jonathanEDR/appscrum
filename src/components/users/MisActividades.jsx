import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { FiClock, FiCalendar, FiActivity, FiTarget, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { apiService } from '../../services/apiService';

const MisActividades = () => {
  const { userId, getToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchActivities = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiService.getUserActivities(userId, getToken, currentPage, itemsPerPage);
        setActivities(data.activities || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Error al cargar las actividades');
        
        // Datos de fallback para desarrollo
        setActivities([
          {
            _id: '1',
            task: {
              title: 'Implementar autenticación',
              type: 'story'
            },
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            duration: 120,
            description: 'Trabajando en el sistema de login',
            category: 'development',
            productivity: 'high'
          },
          {
            _id: '2',
            task: {
              title: 'Revisar código del dashboard',
              type: 'task'
            },
            startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
            duration: 60,
            description: 'Code review del componente dashboard',
            category: 'review',
            productivity: 'medium'
          }
        ]);
        setTotal(2);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId, getToken, currentPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0 min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
    }
    return `${mins}m`;
  };

  const getProductivityBadge = (productivity) => {
    const badges = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };
    const labels = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    };
    
    return {
      className: badges[productivity] || badges.medium,
      label: labels[productivity] || 'Media'
    };
  };

  const getCategoryBadge = (category) => {
    const badges = {
      development: 'bg-blue-100 text-blue-800',
      testing: 'bg-purple-100 text-purple-800',
      review: 'bg-orange-100 text-orange-800',
      debugging: 'bg-red-100 text-red-800',
      documentation: 'bg-primary-100 text-primary-800',
      meeting: 'bg-indigo-100 text-indigo-800',
      research: 'bg-teal-100 text-teal-800'
    };
    const labels = {
      development: 'Desarrollo',
      testing: 'Testing',
      review: 'Revisión',
      debugging: 'Debugging',
      documentation: 'Documentación',
      meeting: 'Reunión',
      research: 'Investigación'
    };
    
    return {
      className: badges[category] || badges.development,
      label: labels[category] || category
    };
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-primary-600">Cargando actividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FiActivity className="w-6 h-6 mr-2 text-blue-600" />
            Mis Actividades
          </h1>
          <p className="text-gray-600 mt-2">
            Historial de tiempo trabajado y actividades registradas
          </p>
          {error && (
            <div className="mt-3 bg-yellow-100 text-yellow-800 px-3 py-2 rounded text-sm">
              ⚠️ Mostrando datos de ejemplo - {error}
            </div>
          )}
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiActivity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Actividades</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiClock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tiempo Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(activities.reduce((total, activity) => total + (activity.duration || 0), 0))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiTarget className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tareas Trabajadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(activities.map(a => a.task?._id).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Actividades */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Historial de Actividades</h2>
          </div>

          <div className="overflow-x-auto">
            {activities && activities.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarea
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duración
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Productividad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((activity) => {
                    const productivityBadge = getProductivityBadge(activity.productivity);
                    const categoryBadge = getCategoryBadge(activity.category);
                    
                    return (
                      <tr key={activity._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {activity.task?.title || 'Sin tarea'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {activity.task?.type || 'task'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <FiCalendar className="w-4 h-4 mr-1" />
                            {formatDate(activity.startTime)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatTime(activity.startTime)} - {activity.endTime ? formatTime(activity.endTime) : 'En progreso'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            <FiClock className="w-4 h-4 mr-1" />
                            {formatDuration(activity.duration)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryBadge.className}`}>
                            {categoryBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${productivityBadge.className}`}>
                            {productivityBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {activity.description || 'Sin descripción'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <FiActivity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No hay actividades registradas</p>
                <p className="text-gray-400 text-sm">Las actividades aparecerán cuando empieces a trabajar en tareas</p>
              </div>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{' '}
                    <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span>
                    {' '}a{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, total)}
                    </span>
                    {' '}de{' '}
                    <span className="font-medium">{total}</span>
                    {' '}resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FiChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <FiChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisActividades;
