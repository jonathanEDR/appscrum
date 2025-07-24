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
  Target
} from 'lucide-react';
import config from '../../config/config';

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
            assignedTo: assignedTo || undefined
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

  if (!isOpen) return null;

  console.log('Modal rendering - isOpen:', isOpen, 'sprint:', sprint?.nombre);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">Asignar Historia al Sprint</h2>
              <p className="text-blue-100 text-sm">{sprint?.nombre}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-200px)]">
          {/* Lista de historias disponibles */}
          <div className="flex-1 p-6 overflow-y-auto border-r">
            <div className="space-y-4">
              {/* Filtros y búsqueda */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar historias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Todas las prioridades</option>
                    {Object.entries(prioridadConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Todos los tipos</option>
                    {Object.entries(tipoConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={fetchAvailableStories}
                  disabled={loading}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Filter className="h-4 w-4" />
                  Aplicar Filtros
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Lista de historias */}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600 text-sm">Cargando historias...</span>
                </div>
              ) : filteredStories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No hay historias disponibles</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Todas las historias ya están asignadas o no cumplen los filtros
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 font-medium">
                    {filteredStories.length} historias disponibles
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
                        <h4 className="font-medium text-gray-900 text-sm">
                          {story.titulo}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${prioridadConfig[story.prioridad]?.color || 'bg-gray-100 text-gray-800'}`}>
                            {prioridadConfig[story.prioridad]?.label || story.prioridad}
                          </span>
                          <span className="text-xs text-gray-500">
                            {story.puntos_historia} SP
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {story.descripcion}
                      </p>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded ${tipoConfig[story.tipo]?.color || 'bg-gray-100 text-gray-800'}`}>
                          {tipoConfig[story.tipo]?.label || story.tipo}
                        </span>
                        
                        {story.asignado_a && (
                          <div className="flex items-center gap-1">
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

          {/* Panel de asignación */}
          <div className="w-80 p-6 bg-gray-50">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Detalles de Asignación</h3>
              
              {selectedStory ? (
                <div className="space-y-4">
                  {/* Historia seleccionada */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {selectedStory.titulo}
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
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <strong>{selectedStory.puntos_historia}</strong> Story Points
                    </div>
                  </div>

                  {/* Asignar a miembro del equipo */}
                  {teamMembers.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Asignar a (opcional):
                      </label>
                      <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Sin asignar</option>
                        {teamMembers.map(member => (
                          <option key={member._id} value={member._id}>
                            {member.name} ({member.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Botón de asignación */}
                  <button
                    onClick={handleAssignStory}
                    disabled={assigning}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {assigning ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Asignando...
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
                  <p className="text-sm">Selecciona una historia</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Haz clic en una historia para asignarla al sprint
                  </p>
                </div>
              )}

              {/* Info del sprint */}
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Sprint: {sprint?.nombre}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(sprint?.fecha_inicio).toLocaleDateString()} - 
                      {new Date(sprint?.fecha_fin).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>{teamMembers.length} miembros</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignStoryModal;
