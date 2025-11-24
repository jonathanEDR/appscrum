import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Package,
  Users,
  Flag,
  Zap,
  RefreshCw,
  Save,
  ArrowLeft,
  AlertTriangle,
  Info
} from 'lucide-react';
import config from '../../config/config';
import { useProducts } from '../../hooks/useProducts';
import { useSprints } from '../../hooks/useSprints';

const API_BASE_URL = config.API_URL || import.meta.env.VITE_API_URL || '';

const SprintBacklogPlanning = () => {
  const { getToken } = useAuth();
  
  // Estados
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [availableStories, setAvailableStories] = useState([]);
  const [sprintStories, setSprintStories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [capacityValidation, setCapacityValidation] = useState(null);
  const [pendingStories, setPendingStories] = useState([]);

  // ✅ Usar custom hooks con caché
  const { products: productos, loading: loadingProducts } = useProducts();
  const { sprints, loading: loadingSprints } = useSprints(selectedProduct);

  // Configuración de prioridades
  const prioridadConfig = {
    muy_alta: { label: 'Muy Alta', icon: '🔴', color: 'border-red-500 bg-red-50' },
    alta: { label: 'Alta', icon: '🟠', color: 'border-orange-500 bg-orange-50' },
    media: { label: 'Media', icon: '🟡', color: 'border-yellow-500 bg-yellow-50' },
    baja: { label: 'Baja', icon: '🟢', color: 'border-green-500 bg-green-50' }
  };

  const tipoColors = {
    historia: 'bg-blue-100 text-blue-800',
    tarea: 'bg-green-100 text-green-800',
    bug: 'bg-red-100 text-red-800',
    mejora: 'bg-purple-100 text-purple-800'
  };

  // ✅ OPTIMIZADO: useCallback para cargarBacklogItems
  const cargarBacklogItems = useCallback(async () => {
    if (!selectedProduct) {
      setAvailableStories([]);
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/backlog?producto=${selectedProduct}&estado=pendiente`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Filtrar solo items sin sprint asignado
        // Mostrar todas las historias pendientes, no solo las "ready"
        const availableItems = (data.items || []).filter(item => !item.sprint);
        setAvailableStories(availableItems);
      }
    } catch (error) {
      console.error('Error al cargar backlog:', error);
    }
  }, [selectedProduct, getToken]);

  // ✅ OPTIMIZADO: useCallback para cargarSprintStories
  const cargarSprintStories = useCallback(async () => {
    if (!selectedSprint?._id) {
      setSprintStories([]);
      setPendingStories([]);
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/sprints/${selectedSprint._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSprintStories(data.historias || []);
      }
    } catch (error) {
      console.error('Error al cargar historias del sprint:', error);
    }
  }, [selectedSprint?._id, getToken]);

  // ✅ OPTIMIZADO: Cargar backlog items solo cuando cambia el producto
  useEffect(() => {
    cargarBacklogItems();
  }, [cargarBacklogItems]);

  // ✅ OPTIMIZADO: Cargar sprint stories solo cuando se selecciona sprint
  useEffect(() => {
    cargarSprintStories();
  }, [cargarSprintStories]);

  const isReadyForSprint = (item) => {
    return (
      item.descripcion && item.descripcion.length > 10 &&
      item.criterios_aceptacion && item.criterios_aceptacion.length > 0 &&
      item.puntos_historia > 0 &&
      item.estado === 'pendiente'
    );
  };

  const validateCapacity = useCallback(async () => {
    if (!selectedSprint || pendingStories.length === 0) {
      setCapacityValidation(null);
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/sprints/${selectedSprint._id}/validate-capacity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ storyIds: pendingStories })
      });

      if (response.ok) {
        const validation = await response.json();
        setCapacityValidation(validation);
      }
    } catch (error) {
      console.error('Error al validar capacidad:', error);
    }
  }, [selectedSprint, pendingStories, getToken]);

  // ✅ OPTIMIZADO: Validación de capacidad con debounce (DESPUÉS de declarar validateCapacity)
  useEffect(() => {
    if (!selectedSprint || pendingStories.length === 0) {
      setCapacityValidation(null);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      validateCapacity();
    }, 500); // 500ms de debounce para reducir peticiones
    
    return () => clearTimeout(timeoutId);
  }, [validateCapacity, selectedSprint, pendingStories.length]);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // Si no hay destino, no hacer nada
    if (!destination) return;

    // Si se soltó en el mismo lugar, no hacer nada
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Mover de backlog disponible a sprint
    if (source.droppableId === 'available' && destination.droppableId === 'sprint') {
      const story = availableStories.find(s => s._id === draggableId);
      if (story && !pendingStories.includes(draggableId)) {
        setPendingStories([...pendingStories, draggableId]);
      }
    }

    // Mover de sprint de vuelta a backlog
    if (source.droppableId === 'sprint' && destination.droppableId === 'available') {
      setPendingStories(pendingStories.filter(id => id !== draggableId));
    }
  };

  const handleSaveAssignments = async () => {
    if (pendingStories.length === 0) {
      setError('No hay historias pendientes para asignar');
      return;
    }

    if (capacityValidation && !capacityValidation.isValid) {
      if (!window.confirm('⚠️ El sprint estará sobrecargado. ¿Deseas continuar de todos modos?')) {
        return;
      }
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/sprints/${selectedSprint._id}/assign-multiple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ storyIds: pendingStories })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(`✅ ${data.assigned} historia(s) asignadas exitosamente`);
        setPendingStories([]);
        setCapacityValidation(null);
        
        // Recargar datos
        await cargarBacklogItems();
        await cargarSprintStories();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al asignar historias');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const getPendingStories = () => {
    return availableStories.filter(story => pendingStories.includes(story._id));
  };

  const getCapacityIndicator = () => {
    if (!capacityValidation || !capacityValidation.capacityInPoints) {
      return null;
    }

    const percentage = parseFloat(capacityValidation.percentageUsed);
    let colorClass = 'bg-green-500';
    let icon = <CheckCircle size={20} />;

    if (percentage > 100) {
      colorClass = 'bg-red-500';
      icon = <AlertCircle size={20} />;
    } else if (percentage > 90) {
      colorClass = 'bg-yellow-500';
      icon = <AlertTriangle size={20} />;
    } else if (percentage < 70) {
      colorClass = 'bg-blue-500';
      icon = <Info size={20} />;
    }

    return (
      <div className="mt-4 p-4 border rounded-lg bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Capacidad del Sprint</span>
          <div className="flex items-center gap-2">
            {icon}
            <span className={`text-lg font-bold ${
              percentage > 100 ? 'text-red-600' : 
              percentage > 90 ? 'text-yellow-600' : 
              percentage < 70 ? 'text-blue-600' : 'text-green-600'
            }`}>
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${colorClass}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
          <div>
            <span className="font-medium">Actual: </span>
            {capacityValidation.currentPoints} pts
          </div>
          <div>
            <span className="font-medium">Nuevos: </span>
            +{capacityValidation.newPoints} pts
          </div>
          <div>
            <span className="font-medium">Total: </span>
            {capacityValidation.totalPoints} pts
          </div>
        </div>

        {capacityValidation.message && (
          <div className={`mt-2 p-2 rounded text-sm ${
            capacityValidation.severity === 'error' ? 'bg-red-50 text-red-700' :
            capacityValidation.severity === 'warning' ? 'bg-yellow-50 text-yellow-700' :
            capacityValidation.severity === 'info' ? 'bg-blue-50 text-blue-700' :
            'bg-green-50 text-green-700'
          }`}>
            {capacityValidation.message}
          </div>
        )}
      </div>
    );
  };

  // ✅ Mostrar loading solo mientras cargan productos
  if (loadingProducts) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="text-blue-600" />
              Planificación de Sprint
            </h1>
            <p className="text-gray-600 mt-1">Arrastra historias del backlog al sprint</p>
          </div>
        </div>
      </div>

      {/* Selectores */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Producto
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setSelectedSprint(null);
                setPendingStories([]);
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar producto</option>
              {productos.map(producto => (
                <option key={producto._id} value={producto._id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sprint
            </label>
            <select
              value={selectedSprint?._id || ''}
              onChange={(e) => {
                const sprint = sprints.find(s => s._id === e.target.value);
                setSelectedSprint(sprint);
                setPendingStories([]);
              }}
              disabled={!selectedProduct}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Seleccionar sprint</option>
              {sprints.map(sprint => (
                <option key={sprint._id} value={sprint._id}>
                  {sprint.nombre} ({sprint.estado})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedSprint && (
          <div className="border-t pt-4 grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Objetivo:</span>
              <p className="font-medium">{selectedSprint.objetivo}</p>
            </div>
            <div>
              <span className="text-gray-600">Fechas:</span>
              <p className="font-medium">
                {new Date(selectedSprint.fecha_inicio).toLocaleDateString()} - {new Date(selectedSprint.fecha_fin).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Capacidad:</span>
              <p className="font-medium">{selectedSprint.capacidad_equipo} hrs</p>
            </div>
            <div>
              <span className="text-gray-600">Historias actuales:</span>
              <p className="font-medium">{sprintStories.length}</p>
            </div>
          </div>
        )}
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-700">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {/* Drag & Drop Area */}
      {selectedSprint && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-2 gap-6">
            {/* Panel Izquierdo: Backlog Disponible */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package size={20} className="text-gray-600" />
                  Backlog Disponible
                  <span className="text-sm font-normal text-gray-500">
                    ({availableStories.length} historias)
                  </span>
                </h2>
                <button
                  onClick={cargarBacklogItems}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Actualizar"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              <Droppable droppableId="available">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] border-2 border-dashed rounded-lg p-4 transition-colors ${
                      snapshot.isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    {availableStories.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Package size={48} className="mx-auto mb-2 opacity-50" />
                        <p className="font-medium">No hay historias disponibles</p>
                        <p className="text-sm mt-1">
                          Todas las historias del backlog están asignadas a un sprint
                        </p>
                        <p className="text-sm text-blue-600 mt-2">
                          💡 Crea nuevas historias en "Product Backlog"
                        </p>
                      </div>
                    ) : (
                      availableStories.map((story, index) => (
                        <Draggable key={story._id} draggableId={story._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-3 p-4 bg-white border-l-4 ${
                                prioridadConfig[story.prioridad]?.color || 'border-gray-300'
                              } rounded-lg shadow-sm transition-all ${
                                snapshot.isDragging ? 'shadow-lg rotate-2 scale-105' : 'hover:shadow-md'
                              } ${
                                pendingStories.includes(story._id) ? 'opacity-50' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium text-gray-900 flex-1">{story.titulo}</h3>
                                <div className="flex items-center gap-2 ml-2">
                                  {!isReadyForSprint(story) && (
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded" title="Faltan criterios o puntos">
                                      ⚠️ Incompleta
                                    </span>
                                  )}
                                  <span className="text-lg">
                                    {prioridadConfig[story.prioridad]?.icon}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-xs flex-wrap">
                                <span className={`px-2 py-1 rounded ${tipoColors[story.tipo] || 'bg-gray-100'}`}>
                                  {story.tipo}
                                </span>
                                <span className={`px-2 py-1 rounded font-medium ${
                                  story.puntos_historia > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {story.puntos_historia || 0} pts
                                </span>
                                {story.criterios_aceptacion?.length > 0 ? (
                                  <span className="text-green-600">
                                    ✓ {story.criterios_aceptacion.length} criterios
                                  </span>
                                ) : (
                                  <span className="text-gray-400">
                                    ⚠️ Sin criterios
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Panel Derecho: Sprint */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Target size={20} className="text-blue-600" />
                  {selectedSprint.nombre}
                  <span className="text-sm font-normal text-gray-500">
                    ({sprintStories.length + pendingStories.length} historias)
                  </span>
                </h2>
              </div>

              <Droppable droppableId="sprint">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] border-2 border-dashed rounded-lg p-4 transition-colors ${
                      snapshot.isDraggingOver ? 'border-green-500 bg-green-50' : 'border-blue-300 bg-blue-50'
                    }`}
                  >
                    {/* Historias ya asignadas */}
                    {sprintStories.map((story) => (
                      <div
                        key={story._id}
                        className="mb-3 p-4 bg-gray-100 border-l-4 border-gray-400 rounded-lg opacity-70"
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-gray-700">{story.titulo}</h3>
                          <span className="text-xs text-gray-500">Ya asignada</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs mt-2">
                          <span className={`px-2 py-1 rounded ${tipoColors[story.tipo] || 'bg-gray-100'}`}>
                            {story.tipo}
                          </span>
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded">
                            {story.puntos_historia || 0} pts
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Historias pendientes de guardar */}
                    {getPendingStories().map((story, index) => (
                      <Draggable key={story._id} draggableId={story._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-3 p-4 bg-white border-l-4 border-green-500 rounded-lg shadow-sm transition-all ${
                              snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium text-gray-900">{story.titulo}</h3>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                Pendiente
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className={`px-2 py-1 rounded ${tipoColors[story.tipo] || 'bg-gray-100'}`}>
                                {story.tipo}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">
                                {story.puntos_historia || 0} pts
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {sprintStories.length === 0 && pendingStories.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <Target size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Arrastra historias aquí</p>
                        <p className="text-sm">Este sprint está vacío</p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Indicador de capacidad */}
              {getCapacityIndicator()}

              {/* Botón guardar */}
              {pendingStories.length > 0 && (
                <button
                  onClick={handleSaveAssignments}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Guardar Asignaciones ({pendingStories.length})
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </DragDropContext>
      )}

      {!selectedProduct && (
        <div className="text-center py-12 text-gray-500">
          <Package size={48} className="mx-auto mb-2 opacity-50" />
          <p className="text-lg font-medium">Selecciona un producto para comenzar</p>
        </div>
      )}

      {selectedProduct && !selectedSprint && (
        <div className="text-center py-12 text-gray-500">
          <Target size={48} className="mx-auto mb-2 opacity-50" />
          <p className="text-lg font-medium">Selecciona un sprint para planificar</p>
        </div>
      )}
    </div>
  );
};

export default SprintBacklogPlanning;
