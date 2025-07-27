import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  X, 
  Plus, 
  User, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Filter,
  Users,
  Calendar,
  Target,
  BookOpen,
  Clock
} from 'lucide-react';
import config from '../../config/config';
import BaseModalScrumMaster, { DateField } from './modalScrumMaster/BaseModalScrumMaster';

const AssignStoryModal = ({ 
  isOpen, 
  onClose, 
  sprint, 
  teamMembers = [],
  onStoryAssigned 
}) => {
  const { getToken } = useAuth();
  const [availableStories, setAvailableStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);
  const [assignedTo, setAssignedTo] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [fechaAsignacion, setFechaAsignacion] = useState('');
  const [fechaEstimadaFinalizacion, setFechaEstimadaFinalizacion] = useState('');
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterType, setFilterType] = useState('');

  // Configuraciones
  const prioridadConfig = {
    muy_alta: { label: 'Muy Alta', color: 'bg-red-100 text-red-800', order: 1 },
    alta: { label: 'Alta', color: 'bg-orange-100 text-orange-800', order: 2 },
    media: { label: 'Media', color: 'bg-yellow-100 text-yellow-800', order: 3 },
    baja: { label: 'Baja', color: 'bg-green-100 text-green-800', order: 4 }
  };

  const tipoConfig = {
    historia: { label: 'Historia', color: 'bg-blue-100 text-blue-800' },
    tarea: { label: 'Tarea', color: 'bg-green-100 text-green-800' },
    bug: { label: 'Bug', color: 'bg-red-100 text-red-800' },
    mejora: { label: 'Mejora', color: 'bg-purple-100 text-purple-800' }
  };

  // Establecer fechas automáticas
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setFechaAsignacion(today);
      
      // Calcular fecha estimada basada en la duración del sprint
      if (sprint?.fecha_fin) {
        setFechaEstimadaFinalizacion(sprint.fecha_fin);
      } else {
        // Si no hay fecha fin del sprint, usar 2 semanas por defecto
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
        setFechaEstimadaFinalizacion(twoWeeksLater.toISOString().split('T')[0]);
      }
    }
  }, [isOpen, sprint]);

  useEffect(() => {
    if (isOpen && sprint) {
      fetchAvailableStories();
    }
  }, [isOpen, sprint]);

  const fetchAvailableStories = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = await getToken();
      const params = new URLSearchParams();
      
      if (filterPriority) params.append('prioridad', filterPriority);
      if (filterType) params.append('tipo', filterType);
      
      console.log('Fetching available stories for sprint:', sprint?._id);
      console.log('API URL:', `${config.API_URL}/sprints/${sprint._id}/available-stories?${params.toString()}`);
      
      const response = await fetch(
        `${config.API_URL}/sprints/${sprint._id}/available-stories?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Stories received:', data.stories?.length || 0);
        console.log('Sample data:', data.stories?.slice(0, 2));
        setAvailableStories(data.stories || []);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al cargar historias disponibles');
      }
    } catch (error) {
      console.error('Error fetching available stories:', error);
      setError('Error al cargar historias: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStory = async () => {
    if (!selectedStory) return;

    try {
      setAssigning(true);
      const token = await getToken();
      
      const response = await fetch(
        `${config.API_URL}/sprints/${sprint._id}/assign-story`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            storyId: selectedStory._id,
            assignedTo: assignedTo || undefined,
            fechaAsignacion: fechaAsignacion,
            fechaEstimadaFinalizacion: fechaEstimadaFinalizacion
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Remover la historia de la lista de disponibles
        setAvailableStories(prev => 
          prev.filter(story => story._id !== selectedStory._id)
        );
        
        // Notificar al componente padre
        if (onStoryAssigned) {
          onStoryAssigned(data.story);
        }
        
        // Reset form
        setSelectedStory(null);
        setAssignedTo('');
        
        // Mostrar éxito brevemente
        setTimeout(() => {
          // El modal se cierra automáticamente o se puede mantener abierto
        }, 1000);
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al asignar historia');
      }
    } catch (error) {
      console.error('Error assigning story:', error);
      setError('Error al asignar historia: ' + error.message);
    } finally {
      setAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedStory(null);
    setAssignedTo('');
    setError('');
    setSearchTerm('');
    setFilterPriority('');
    setFilterType('');
    onClose();
  };

  // Filtrar historias por término de búsqueda
  const filteredStories = availableStories.filter(story => {
    const matchesSearch = searchTerm === '' || 
      story.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <BaseModalScrumMaster
      isOpen={isOpen}
      onClose={handleClose}
      title="Asignar Historia al Sprint"
      subtitle={`Sprint: ${sprint?.nombre || 'Sin nombre'}`}
      icon={BookOpen}
      maxWidth="sm:max-w-6xl"
      showDivider={true}
    >
      {/* Panel Izquierdo - Lista de Historias */}
      <div className="flex-1 p-6 border-r border-gray-200">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Historias Disponibles
          </h3>

          {/* Filtros y búsqueda */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar historias por título o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">🔍 Todas las prioridades</option>
                {Object.entries(prioridadConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">📋 Todos los tipos</option>
                {Object.entries(tipoConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={fetchAvailableStories}
              disabled={loading}
              className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {loading ? 'Cargando...' : 'Aplicar Filtros'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Lista de historias */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Cargando historias...</span>
              </div>
            ) : filteredStories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay historias disponibles</p>
                <p className="text-sm text-gray-400 mt-1">
                  Todas las historias ya están asignadas o no cumplen los filtros
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 font-medium">
                  📊 {filteredStories.length} historias disponibles
                </p>
                
                {filteredStories.map(story => (
                  <div
                    key={story._id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedStory?._id === story._id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedStory(story)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {story.titulo}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${prioridadConfig[story.prioridad]?.color || 'bg-gray-100 text-gray-800'}`}>
                          {prioridadConfig[story.prioridad]?.label || story.prioridad}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {story.puntos_historia} SP
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {story.descripcion}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`px-2 py-1 rounded ${tipoConfig[story.tipo]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {tipoConfig[story.tipo]?.label || story.tipo}
                      </span>
                      
                      {story.asignado_a && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <User className="h-3 w-3" />
                          <span>
                            {story.asignado_a.firstName} {story.asignado_a.lastName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panel Derecho - Detalles de Asignación y Fechas */}
      <div className="flex-1 p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Detalles de Asignación
          </h3>
          
          {selectedStory ? (
            <div className="space-y-4">
              {/* Historia seleccionada */}
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  📋 {selectedStory.titulo}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {selectedStory.descripcion}
                </p>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs ${prioridadConfig[selectedStory.prioridad]?.color}`}>
                    {prioridadConfig[selectedStory.prioridad]?.label}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${tipoConfig[selectedStory.tipo]?.color}`}>
                    {tipoConfig[selectedStory.tipo]?.label}
                  </span>
                  <span className="text-sm text-blue-600 font-medium">
                    {selectedStory.puntos_historia} SP
                  </span>
                </div>
              </div>

              {/* Fechas de Asignación */}
              <div className="space-y-4">
                <DateField
                  label="Fecha de Asignación"
                  value={fechaAsignacion}
                  onChange={(e) => setFechaAsignacion(e.target.value)}
                  required={true}
                  help="Fecha cuando se asigna la historia al sprint"
                />

                <DateField
                  label="Fecha Estimada de Finalización"
                  value={fechaEstimadaFinalizacion}
                  onChange={(e) => setFechaEstimadaFinalizacion(e.target.value)}
                  min={fechaAsignacion}
                  help="Fecha estimada para completar la historia"
                />
              </div>

              {/* Asignar a miembro del equipo */}
              {teamMembers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asignar a Desarrollador
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white"
                    >
                      <option value="">Sin asignar (se asignará después)</option>
                      {teamMembers.map(member => (
                        <option key={member._id} value={member._id}>
                          👤 {member.name} ({member.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Botón de asignación */}
              <button
                onClick={handleAssignStory}
                disabled={assigning}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {assigning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Asignando historia...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Asignar al Sprint
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Selecciona una historia</p>
              <p className="text-sm text-gray-400 mt-1">
                Haz clic en una historia de la izquierda para asignarla
              </p>
            </div>
          )}

          {/* Info del sprint */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Información del Sprint
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Sprint:</strong> {sprint?.nombre}</p>
              <p><strong>Duración:</strong> {new Date(sprint?.fecha_inicio).toLocaleDateString()} - {new Date(sprint?.fecha_fin).toLocaleDateString()}</p>
              <p><strong>Equipo:</strong> {teamMembers.length} desarrolladores</p>
            </div>
          </div>
        </div>
      </div>
    </BaseModalScrumMaster>
  );
};

export default AssignStoryModal;
