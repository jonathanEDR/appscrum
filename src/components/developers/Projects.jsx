import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  Briefcase, 
  Target, 
  Clock, 
  AlertCircle, 
  Bug, 
  Wrench,
  Search, 
  Filter,
  RefreshCw,
  Plus,
  CheckCircle,
  User,
  Calendar,
  ArrowRight
} from 'lucide-react';
import AssignTaskModal from './AssignTaskModal';
import ProjectFilters from './ProjectFilters';

const Projects = () => {
  const { getToken } = useAuth();
  const [projects, setProjects] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myAssignedTasks, setMyAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState('all');
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    project: 'all',
    type: 'all',
    priority: 'all',
    status: 'available',
    search: ''
  });

  // Estados para UI
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'assigned'
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados para modales
  const [assignModal, setAssignModal] = useState({
    isOpen: false,
    task: null
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Recargar cuando cambian los filtros
  useEffect(() => {
    if (!loading) {
      loadAvailableTasks();
    }
  }, [filters]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        loadProjects(),
        loadAvailableTasks(),
        loadMyAssignedTasks()
      ]);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const token = await getToken();
      const API_URL = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.products || data || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadAvailableTasks = async () => {
    try {
      const token = await getToken();
      const API_URL = import.meta.env.VITE_API_URL;
      
      // Construir query parameters
      const params = new URLSearchParams();
      
      // Solo tareas técnicas (excluir historias)
      params.append('tipo', 'tarea,bug,mejora');
      
      // Solo tareas disponibles (no asignadas)
      params.append('available_only', 'true');
      
      if (filters.project !== 'all') params.append('producto', filters.project);
      if (filters.type !== 'all') params.append('tipo', filters.type);
      if (filters.priority !== 'all') params.append('prioridad', filters.priority);
      if (filters.search) params.append('search', filters.search);
      
      const response = await fetch(`${API_URL}/backlog?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Filtrar solo items DISPONIBLES (sin asignar) y que sean tareas técnicas
        const available = (data.items || []).filter(item => {
          // 1. Debe ser una tarea técnica (no historia)
          const isTechnicalTask = ['tarea', 'bug', 'mejora'].includes(item.tipo);
          
          // 2. NO debe estar asignada a nadie
          const isUnassigned = !item.asignado_a;
          
          // 3. Debe estar en estado pendiente o sin estado
          const isPending = item.estado === 'pendiente' || !item.estado;
          
          return isTechnicalTask && isUnassigned && isPending;
        });
        
        setAvailableTasks(available);
        console.log('Tareas técnicas disponibles (sin asignar) cargadas:', available.length);
      }
    } catch (error) {
      console.error('Error loading available tasks:', error);
    }
  };

  const loadMyAssignedTasks = async () => {
    try {
      const token = await getToken();
      const API_URL = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${API_URL}/developers/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMyAssignedTasks(data.data?.tasks || []);
      }
    } catch (error) {
      console.error('Error loading my assigned tasks:', error);
    }
  };

  const handleTakeTask = (task) => {
    setAssignModal({
      isOpen: true,
      task
    });
  };

  const handleAssignSuccess = async (result) => {
    console.log('Tarea asignada exitosamente:', result);
    
    // Recargar datos después de asignar tarea
    await Promise.all([
      loadAvailableTasks(),
      loadMyAssignedTasks()
    ]);
    
    setAssignModal({ isOpen: false, task: null });
    
    // Mostrar mensaje de éxito
    if (result.data?.task) {
      console.log('Task creada automáticamente para "Mis Tareas":', result.data.task._id);
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'bug':
        return <Bug className="h-4 w-4" />;
      case 'tarea':
        return <Target className="h-4 w-4" />;
      case 'mejora':
        return <Wrench className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getTaskColor = (type) => {
    switch (type) {
      case 'bug':
        return 'text-red-600 bg-red-100';
      case 'tarea':
        return 'text-blue-600 bg-blue-100';
      case 'mejora':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'muy_alta':
        return 'text-red-700 bg-red-100 border-red-300';
      case 'alta':
        return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'media':
        return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'baja':
        return 'text-green-700 bg-green-100 border-green-300';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'muy_alta': return 'Muy Alta';
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
      default: return 'Sin prioridad';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
              <p className="text-gray-600">Explora y toma tareas disponibles</p>
            </div>
          </div>
        </div>

        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
            <p className="text-gray-600">
              Explora y toma tareas disponibles en los proyectos
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
          </button>
          
          <button
            onClick={loadInitialData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Tareas Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{availableTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Mis Tareas</p>
              <p className="text-2xl font-bold text-gray-900">{myAssignedTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="bg-red-100 p-3 rounded-lg">
              <Bug className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Bugs Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">
                {availableTasks.filter(t => t.tipo === 'bug').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Mejoras Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">
                {availableTasks.filter(t => t.tipo === 'mejora').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <ProjectFilters
          filters={filters}
          projects={projects}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('available')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tareas Disponibles ({availableTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('assigned')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assigned'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mis Tareas ({myAssignedTasks.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'available' ? (
            <div className="space-y-4">
              {availableTasks.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay tareas disponibles
                  </h3>
                  <p className="text-gray-500">
                    No se encontraron tareas disponibles con los filtros actuales
                  </p>
                </div>
              ) : (
                availableTasks.map((task) => (
                  <div key={task._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Icono y contenido */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg ${getTaskColor(task.tipo)} flex-shrink-0`}>
                          {getTaskIcon(task.tipo)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate max-w-xs sm:max-w-md">
                              {task.titulo}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.prioridad)} flex-shrink-0`}>
                              {getPriorityText(task.prioridad)}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getTaskColor(task.tipo)} flex-shrink-0`}>
                              {task.tipo.charAt(0).toUpperCase() + task.tipo.slice(1)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2 leading-tight">
                            {task.descripcion}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                            <span className="truncate">Proyecto: {task.producto?.nombre || 'Sin proyecto'}</span>
                            {task.puntos_historia && (
                              <span className="flex-shrink-0">{task.puntos_historia} SP</span>
                            )}
                            <span className="flex items-center gap-1 flex-shrink-0">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botón de acción */}
                      <div className="flex-shrink-0 self-start sm:self-center">
                        <button
                          onClick={() => handleTakeTask(task)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap w-full sm:w-auto justify-center"
                        >
                          <Plus className="h-4 w-4" />
                          Tomar Tarea
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {myAssignedTasks.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No tienes tareas asignadas
                  </h3>
                  <p className="text-gray-500">
                    Ve a la pestaña "Tareas Disponibles" para tomar nuevas tareas
                  </p>
                </div>
              ) : (
                myAssignedTasks.map((task) => (
                  <div key={task._id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Icono y contenido */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg ${getTaskColor(task.tipo)} flex-shrink-0`}>
                          {getTaskIcon(task.tipo)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate max-w-xs sm:max-w-md">
                              {task.title}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)} flex-shrink-0`}>
                              {getPriorityText(task.priority)}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium flex-shrink-0">
                              {task.status}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2 leading-tight">
                            {task.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                            <span className="truncate">Sprint: {task.sprint?.nombre || 'Sin sprint'}</span>
                            {task.spentHours && (
                              <span className="flex items-center gap-1 flex-shrink-0">
                                <Clock className="h-3 w-3" />
                                {task.spentHours}h trabajadas
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Botón de acción */}
                      <div className="flex-shrink-0 self-start sm:self-center">
                        <button
                          onClick={() => {/* Navegar a detalles de tarea */}}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium whitespace-nowrap w-full sm:w-auto justify-center"
                        >
                          <ArrowRight className="h-4 w-4" />
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Modal para asignar tarea */}
      <AssignTaskModal
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal({ isOpen: false, task: null })}
        task={assignModal.task}
        onAssignSuccess={handleAssignSuccess}
      />
    </div>
  );
};

export default Projects;
