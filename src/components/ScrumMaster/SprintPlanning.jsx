import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import config from '../../config/config';
import AssignStoryModal from './AssignStoryModal';
import SprintStoriesPanel from './SprintStoriesPanel';
import { 
  Target, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  Package,
  User,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Zap,
  Flag,
  Sparkles,
  PlayCircle
} from 'lucide-react';

const SprintPlanning = () => {
  const { getToken } = useAuth();
  
  // Estados
  const [availableItems, setAvailableItems] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [sprintItems, setSprintItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productos, setProductos] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(''); // Filtro por producto
  
  // Filtros
  const [filtroProducto, setFiltroProducto] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    muy_alta: true,
    alta: true,
    media: false,
    baja: false
  });

  // Configuración de prioridades con colores y iconos
  const prioridadConfig = {
    muy_alta: {
      label: 'Muy Alta',
      color: 'bg-red-100 text-red-800 border-red-200',
      bgColor: 'bg-red-50',
      icon: Zap,
      order: 1
    },
    alta: {
      label: 'Alta', 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      bgColor: 'bg-orange-50',
      icon: Flag,
      order: 2
    },
    media: {
      label: 'Media',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      bgColor: 'bg-yellow-50',
      icon: BarChart3,
      order: 3
    },
    baja: {
      label: 'Baja',
      color: 'bg-green-100 text-green-800 border-green-200',
      bgColor: 'bg-green-50', 
      icon: TrendingUp,
      order: 4
    }
  };

  const tipoColors = {
    historia: 'bg-blue-100 text-blue-800',
    tarea: 'bg-green-100 text-green-800',
    bug: 'bg-red-100 text-red-800',
    mejora: 'bg-purple-100 text-purple-800'
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  // Recargar sprints cuando cambie el producto seleccionado
  useEffect(() => {
    if (selectedProduct !== '') {
      const reloadSprints = async () => {
        const token = await getToken();
        if (token) {
          await fetchSprints(token);
        }
      };
      reloadSprints();
    }
  }, [selectedProduct]);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        setError('No hay token de autenticación');
        return;
      }

      await Promise.all([
        fetchAvailableItems(token),
        fetchSprints(token),
        fetchProductos(token),
        fetchTeamMembers(token) // Agregar carga de miembros del equipo
      ]);
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Nueva función para obtener miembros del equipo
  const fetchTeamMembers = async (token) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${API_URL}/team/members`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const teamData = await response.json();
        const members = (teamData.members || teamData || []).map(member => ({
          _id: member._id,
          name: member.user ? 
            `${member.user.firstName || ''} ${member.user.lastName || ''}`.trim() || 
            member.user.nombre_negocio || 
            member.user.email : 
            'Usuario Desconocido',
          email: member.user?.email || '',
          role: member.role || 'developer',
          skills: member.skills || [],
          availability: member.availability || 100,
          workload: {
            currentStoryPoints: member.workload?.currentStoryPoints || 0,
            maxStoryPoints: member.workload?.maxStoryPoints || 24
          }
        }));
        
        setTeamMembers(members);
        console.log('Miembros del equipo cargados:', members.length);
      } else {
        console.warn('No se pudieron cargar los miembros del equipo');
        setTeamMembers([]);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
    }
  };

  // Obtener items disponibles para planning
  const fetchAvailableItems = async (token) => {
    try {
      const params = new URLSearchParams();
      params.append('estado', 'pendiente');
      if (filtroProducto) params.append('producto', filtroProducto);
      if (filtroPrioridad) params.append('prioridad', filtroPrioridad);
      
      const response = await fetch(`${config.API_URL}/backlog?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const itemsDisponibles = (data.items || []).filter(item => !item.sprint);
        setAvailableItems(itemsDisponibles);
      } else {
        throw new Error('Error al obtener items del backlog');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Error al cargar items del backlog: ' + error.message);
      setAvailableItems([]);
    }
  };

  // Obtener sprints disponibles
  const fetchSprints = async (token) => {
    try {
      const params = new URLSearchParams();
      params.append('estado', 'planificado');
      if (selectedProduct) {
        params.append('producto', selectedProduct);
      }
      
      const response = await fetch(`${config.API_URL}/sprints?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const sprintsDisponibles = data.sprints || [];
        setSprints(sprintsDisponibles);
        console.log('Sprints cargados:', sprintsDisponibles.length);
      } else {
        throw new Error('Error al obtener sprints');
      }
    } catch (error) {
      console.error('Error fetching sprints:', error);
      setError('Error al cargar sprints: ' + error.message);
      setSprints([]);
    }
  };

  // Obtener productos
  const fetchProductos = async (token) => {
    try {
      const response = await fetch(`${config.API_URL}/productos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProductos(data.productos || []);
      } else {
        throw new Error('Error al obtener productos');
      }
    } catch (error) {
      console.error('Error fetching productos:', error);
      setError('Error al cargar productos: ' + error.message);
      setProductos([]);
    }
  };

  // Cargar items del sprint seleccionado
  const loadSprintItems = async (sprintId) => {
    try {
      const token = await getToken();
      const response = await fetch(`${config.API_URL}/backlog?sprint=${sprintId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSprintItems(data.items || []);
      } else {
        throw new Error('Error al cargar items del sprint');
      }
    } catch (error) {
      console.error('Error loading sprint items:', error);
      setError('Error al cargar items del sprint: ' + error.message);
      setSprintItems([]);
    }
  };

  // Agrupar items por prioridad
  const groupItemsByPriority = (items) => {
    const grupos = { muy_alta: [], alta: [], media: [], baja: [] };
    items.forEach(item => {
      if (grupos[item.prioridad]) {
        grupos[item.prioridad].push(item);
      }
    });
    return grupos;
  };

  // Toggle sección expandida
  const toggleSection = (prioridad) => {
    setExpandedSections(prev => ({
      ...prev,
      [prioridad]: !prev[prioridad]
    }));
  };

  // Seleccionar sprint
  const handleSelectSprint = async (sprint) => {
    setSelectedSprint(sprint);
    await loadSprintItems(sprint._id);
  };

  // Aplicar filtros
  const handleApplyFilters = async () => {
    const token = await getToken();
    await fetchAvailableItems(token);
  };

  // Manejar asignación de historia exitosa
  const handleStoryAssigned = (assignedStory) => {
    // Actualizar la lista de items del sprint
    setSprintItems(prev => [...prev, assignedStory]);
    
    // Remover la historia de la lista de disponibles
    setAvailableItems(prev => 
      prev.filter(item => item._id !== assignedStory._id)
    );
  };

  // Manejar remoción de historia del sprint
  const handleStoryRemoved = (removedStory) => {
    // Remover la historia de la lista del sprint
    setSprintItems(prev => 
      prev.filter(item => item._id !== removedStory._id)
    );
    
    // Añadir la historia de vuelta a disponibles si cumple los filtros
    setAvailableItems(prev => [...prev, removedStory]);
  };

  // Refrescar datos del sprint seleccionado
  const handleRefreshSprintData = async () => {
    if (selectedSprint) {
      await loadSprintItems(selectedSprint._id);
    }
  };

  // Manejar cambio de producto
  const handleProductChange = async (productId) => {
    setSelectedProduct(productId);
    setSelectedSprint(null);
    setSprintItems([]);
    
    // Recargar sprints con el nuevo filtro
    const token = await getToken();
    await fetchSprints(token);
  };

  // Manejar apertura del modal con debug
  const handleOpenAssignModal = (sprint) => {
    console.log('Abriendo modal para sprint:', sprint?.nombre);
    console.log('Sprint seleccionado:', selectedSprint?.nombre);
    setShowAssignModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando Sprint Planning...</span>
      </div>
    );
  }

  const itemsGrouped = groupItemsByPriority(availableItems);
  const totalStoryPoints = availableItems.reduce((sum, item) => sum + (item.puntos_historia || 0), 0);
  const sprintStoryPoints = sprintItems.reduce((sum, item) => sum + (item.puntos_historia || 0), 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Sprint Planning</h1>
        </div>
        <p className="opacity-90">
          Planifica sprints basándote en las prioridades del Product Owner
        </p>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div>
              <h3 className="font-medium">Error de conexión</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar estado real - sin datos ficticios */}
      {!error && (
        <>
          {/* Resumen de métricas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{availableItems.length}</div>
              <div className="text-sm text-gray-600">Items Disponibles</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-green-600">{totalStoryPoints}</div>
              <div className="text-sm text-gray-600">Story Points Total</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{sprintItems.length}</div>
              <div className="text-sm text-gray-600">Items en Sprint</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{sprintStoryPoints}</div>
              <div className="text-sm text-gray-600">Puntos Asignados</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg border p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={selectedProduct}
                onChange={(e) => handleProductChange(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los productos</option>
                {productos.map(producto => (
                  <option key={producto._id} value={producto._id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
              
              <select
                value={filtroProducto}
                onChange={(e) => setFiltroProducto(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Filtro Backlog</option>
                {productos.map(producto => (
                  <option key={producto._id} value={producto._id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
              
              <select
                value={filtroPrioridad}
                onChange={(e) => setFiltroPrioridad(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las prioridades</option>
                <option value="muy_alta">Muy Alta</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
              
              <button
                onClick={handleApplyFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Aplicar Filtros
              </button>
            </div>
          </div>

          {/* Layout principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Selección de Sprint */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Seleccionar Sprint</h3>
                {selectedProduct && (
                  <div className="text-sm text-gray-600">
                    {productos.find(p => p._id === selectedProduct)?.nombre || 'Producto'}
                  </div>
                )}
              </div>
              
              {sprints.length === 0 ? (
                <div className="bg-white p-6 rounded-lg border text-center">
                  <PlayCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {selectedProduct 
                      ? 'No hay sprints disponibles para este producto'
                      : 'No hay sprints disponibles para planificación'
                    }
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {selectedProduct 
                      ? 'Selecciona otro producto o crea un nuevo sprint'
                      : 'Selecciona un producto o crea un nuevo sprint'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sprints.map(sprint => (
                    <div 
                      key={sprint._id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedSprint?._id === sprint._id 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => handleSelectSprint(sprint)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{sprint.nombre}</div>
                          <div className="text-sm text-gray-600">{sprint.objetivo}</div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(sprint.fecha_inicio).toLocaleDateString()} - 
                            {new Date(sprint.fecha_fin).toLocaleDateString()}
                          </div>
                          {sprint.producto && (
                            <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {sprint.producto.nombre}
                            </div>
                          )}
                        </div>
                        
                        {selectedSprint?._id === sprint._id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Botón Asignar Historia clickeado');
                              handleOpenAssignModal(sprint);
                            }}
                            className="ml-4 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                          >
                            <Plus className="h-4 w-4" />
                            Asignar Historia
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Información del Equipo */}
              {teamMembers.length > 0 && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Estado del Equipo ({teamMembers.length} miembros)
                  </h4>
                  
                  <div className="space-y-2">
                    {teamMembers.slice(0, 5).map(member => {
                      const workloadPercentage = member.workload.maxStoryPoints > 0 
                        ? Math.round((member.workload.currentStoryPoints / member.workload.maxStoryPoints) * 100)
                        : 0;
                      
                      const getWorkloadColor = (percentage) => {
                        if (percentage > 100) return 'text-red-600 bg-red-100';
                        if (percentage > 80) return 'text-yellow-600 bg-yellow-100';
                        return 'text-green-600 bg-green-100';
                      };
                      
                      return (
                        <div key={member._id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{member.name}</div>
                              <div className="text-xs text-gray-500">{member.role}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${getWorkloadColor(workloadPercentage)}`}>
                              {workloadPercentage}%
                            </div>
                            <div className="text-xs text-gray-500">
                              {member.workload.currentStoryPoints}/{member.workload.maxStoryPoints} SP
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {teamMembers.length > 5 && (
                      <div className="text-xs text-gray-500 text-center pt-2 border-t">
                        +{teamMembers.length - 5} miembros más
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Backlog por Prioridades */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Backlog</h3>
              
              {availableItems.length === 0 ? (
                <div className="bg-white p-6 rounded-lg border text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay items en el backlog</p>
                  <p className="text-sm text-gray-400 mt-2">Crea items en el backlog para planificar sprints</p>
                </div>
              ) : (
                Object.entries(prioridadConfig)
                  .sort(([,a], [,b]) => a.order - b.order)
                  .map(([prioridad, config]) => {
                    const items = itemsGrouped[prioridad] || [];
                    const Icon = config.icon;
                    const totalPoints = items.reduce((sum, item) => sum + (item.puntos_historia || 0), 0);
                    
                    return (
                      <div key={prioridad} className={`border rounded-lg ${config.bgColor}`}>
                        <div 
                          className="flex items-center justify-between p-4 cursor-pointer"
                          onClick={() => toggleSection(prioridad)}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            <div>
                              <h4 className="font-medium text-gray-900">{config.label}</h4>
                              <p className="text-sm text-gray-600">
                                {items.length} items ({totalPoints} pts)
                              </p>
                            </div>
                          </div>
                          {expandedSections[prioridad] ? 
                            <ChevronUp className="h-5 w-5" /> : 
                            <ChevronDown className="h-5 w-5" />
                          }
                        </div>
                        
                        {expandedSections[prioridad] && (
                          <div className="border-t p-4 space-y-2">
                            {items.length === 0 ? (
                              <p className="text-gray-500 text-sm text-center py-4">
                                No hay items con esta prioridad
                              </p>
                            ) : (
                              items.map(item => (
                                <div key={item._id} className="p-3 bg-white border rounded-lg">
                                  <h5 className="font-medium text-gray-900">{item.titulo}</h5>
                                  <p className="text-sm text-gray-600 mt-1">{item.descripcion}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-2 py-1 rounded text-xs ${tipoColors[item.tipo] || 'bg-gray-100 text-gray-800'}`}>
                                      {item.tipo}
                                    </span>
                                    <span className="text-xs text-gray-500">{item.puntos_historia} pts</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          </div>
          
          {/* Panel de historias del sprint seleccionado */}
          {selectedSprint && (
            <div className="lg:col-span-2">
              <SprintStoriesPanel
                sprint={selectedSprint}
                sprintItems={sprintItems}
                teamMembers={teamMembers}
                onStoryRemoved={handleStoryRemoved}
                onRefresh={handleRefreshSprintData}
              />
            </div>
          )}
        </>
      )}
      
      {/* Modal de asignación de historias */}
      {console.log('Renderizando modal - isOpen:', showAssignModal, 'sprint:', selectedSprint?.nombre)}
      <AssignStoryModal
        isOpen={showAssignModal}
        onClose={() => {
          console.log('Cerrando modal');
          setShowAssignModal(false);
        }}
        sprint={selectedSprint}
        teamMembers={teamMembers}
        onStoryAssigned={handleStoryAssigned}
      />
    </div>
  );
};

export default SprintPlanning;
