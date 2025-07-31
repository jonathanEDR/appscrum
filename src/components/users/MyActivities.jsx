import React, { useState } from 'react';
import { 
  Activity, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Users,
  Filter,
  Search
} from 'lucide-react';

const MyActivities = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de actividades de ejemplo
  const activities = [
    {
      id: 1,
      type: 'task_completed',
      title: 'Tarea completada: Diseño de interfaz',
      description: 'Se completó el diseño de la interfaz principal del módulo de usuarios',
      project: 'Sistema de Gestión CRM',
      timestamp: '2025-07-09T10:30:00',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Reunión de seguimiento',
      description: 'Participación en reunión semanal del equipo Alpha',
      project: 'Sistema de Gestión CRM',
      timestamp: '2025-07-08T14:00:00',
      icon: Users,
      color: 'blue'
    },
    {
      id: 3,
      type: 'task_assigned',
      title: 'Nueva tarea asignada',
      description: 'Se asignó la tarea: Implementar validaciones de formulario',
      project: 'App Mobile E-commerce',
      timestamp: '2025-07-08T09:15:00',
      icon: AlertCircle,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'document_created',
      title: 'Documento creado',
      description: 'Se creó la documentación técnica del módulo de autenticación',
      project: 'Portal de Reportes',
      timestamp: '2025-07-07T16:45:00',
      icon: FileText,
      color: 'purple'
    },
    {
      id: 5,
      type: 'task_started',
      title: 'Tarea iniciada',
      description: 'Se inició el trabajo en: Optimización de consultas de base de datos',
      project: 'Sistema de Gestión CRM',
      timestamp: '2025-07-07T11:20:00',
      icon: Clock,
      color: 'orange'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'Todas las actividades' },
    { value: 'task_completed', label: 'Tareas completadas' },
    { value: 'task_assigned', label: 'Tareas asignadas' },
    { value: 'meeting', label: 'Reuniones' },
    { value: 'document_created', label: 'Documentos' }
  ];

  const getActivityColor = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else if (diffMinutes > 0) {
      return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
    } else {
      return 'Hace unos momentos';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch = searchTerm === '' || 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-primary-100 p-6">
        <h1 className="text-2xl font-bold text-primary-900 mb-2 flex items-center">
          <Activity className="h-6 w-6 mr-2 text-indigo-600" />
          Mis Actividades
        </h1>
        <p className="text-primary-600">
          Historial completo de todas tus actividades en los proyectos
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-primary-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtro por tipo */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-primary-700 mb-2">
              <Filter className="h-4 w-4 inline mr-1" />
              Filtrar por tipo
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border border-primary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Búsqueda */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-primary-700 mb-2">
              <Search className="h-4 w-4 inline mr-1" />
              Buscar actividades
            </label>
            <input
              type="text"
              placeholder="Buscar por título, descripción o proyecto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-primary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Lista de actividades */}
      <div className="bg-white rounded-lg shadow-sm border border-primary-100">
        <div className="px-6 py-4 border-b border-primary-200">
          <h3 className="text-lg font-medium text-primary-900">
            Actividades recientes ({filteredActivities.length})
          </h3>
        </div>
        
        <div className="p-6">
          {filteredActivities.length > 0 ? (
            <div className="space-y-4">
              {filteredActivities.map((activity) => {
                const Icon = activity.icon;
                const colorClass = getActivityColor(activity.color);
                
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className={`rounded-full p-2 ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-primary-900 mb-1">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-primary-600 mb-2">
                            {activity.description}
                          </p>
                          <div className="flex items-center text-xs text-primary-500">
                            <span className="font-medium">{activity.project}</span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimestamp(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-primary-900 mb-2">
                No se encontraron actividades
              </h3>
              <p className="text-primary-500">
                {searchTerm || filter !== 'all' 
                  ? 'Intenta cambiar los filtros de búsqueda'
                  : 'Aún no tienes actividades registradas'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-primary-100 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-primary-600">Tareas Completadas</p>
              <p className="text-2xl font-bold text-primary-900">
                {activities.filter(a => a.type === 'task_completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-primary-100 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-primary-600">Reuniones</p>
              <p className="text-2xl font-bold text-primary-900">
                {activities.filter(a => a.type === 'meeting').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-primary-100 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3 mr-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-primary-600">Documentos</p>
              <p className="text-2xl font-bold text-primary-900">
                {activities.filter(a => a.type === 'document_created').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyActivities;
