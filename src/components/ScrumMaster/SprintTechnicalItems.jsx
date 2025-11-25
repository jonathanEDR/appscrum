import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  Target, 
  Bug, 
  Settings, 
  CheckSquare, 
  User, 
  UserPlus,
  UserCheck,
  AlertTriangle,
  Filter,
  Search,
  Eye,
  ChevronDown,
  ChevronRight,
  Link2,
  Plus
} from 'lucide-react';
import StoryWithTechnicalItems from './StoryWithTechnicalItems';
import AssignUserToTechnicalItemModal from './AssignUserToTechnicalItemModal';
import ModalBacklogItemSM from './modalsSM/ModalBacklogItemSM';

// Componente para mostrar items técnicos sin asignar
const UnassignedTechnicalItems = ({ items, onAssignUser, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getItemIcon = (type) => {
    switch (type) {
      case 'tarea': return <CheckSquare className="h-4 w-4" />;
      case 'bug': return <Bug className="h-4 w-4" />;
      case 'mejora': return <Settings className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  const getItemColor = (type) => {
    switch (type) {
      case 'tarea': return 'bg-purple-100 text-purple-600';
      case 'bug': return 'bg-red-100 text-red-600';
      case 'mejora': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completado': return 'bg-green-100 text-green-800';
      case 'en_progreso': return 'bg-yellow-100 text-yellow-800';
      case 'pendiente': return 'bg-gray-100 text-gray-800';
      case 'bloqueado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completado': return 'Completado';
      case 'en_progreso': return 'En Progreso';
      case 'pendiente': return 'Pendiente';
      case 'bloqueado': return 'Bloqueado';
      default: return 'Sin estado';
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 w-full text-left group"
        >
          {isExpanded ? 
            <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-gray-700" /> :
            <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
          }
          <h3 className="text-lg font-semibold text-gray-900">
            Items Técnicos Sin Asignar
          </h3>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
            {items.length} items
          </span>
        </button>
        
        {isExpanded && (
          <p className="text-sm text-gray-500 mt-2">
            Estos items técnicos no están asignados a ninguna historia. Puedes asignarlos a un developer usando el botón "Asignar Usuario".
          </p>
        )}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3">
          {items.map(item => (
            <div key={item._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${getItemColor(item.tipo)}`}>
                    {getItemIcon(item.tipo)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 truncate">
                        {item.titulo}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.estado)}`}>
                        {getStatusText(item.estado)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getItemColor(item.tipo)}`}>
                        {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 truncate">
                      {item.descripcion}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Producto: {item.producto?.nombre || 'Sin producto'}</span>
                      {item.asignado_a && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{item.asignado_a.nombre_negocio || item.asignado_a.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => onAssignUser(item)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      item.asignado_a 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                    title={item.asignado_a ? "Cambiar asignación" : "Asignar a un developer"}
                  >
                    {item.asignado_a ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {item.asignado_a ? 'Asignado' : 'Asignar Usuario'}
                  </button>
                  
                  <button
                    onClick={() => onViewDetails(item)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente principal para mostrar historias con items técnicos
const SprintTechnicalItems = ({ sprintData, onRefresh }) => {
  const { getToken } = useAuth();
  const [hierarchicalData, setHierarchicalData] = useState({
    historias: [],
    items_sin_historia: [],
    sprint: null,
    estadisticas: {
      total_historias: 0,
      total_items_tecnicos: 0,
      items_sin_asignar: 0
    }
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    producto: 'todos',
    estado: 'todos',
    search: ''
  });
  
  // Estados para UI
  const [showFilters, setShowFilters] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Estados para modales
  const [assignUserModal, setAssignUserModal] = useState({
    isOpen: false,
    technicalItem: null
  });
  
  // Estados para modal de creación de items técnicos
  const [createModal, setCreateModal] = useState({
    isOpen: false,
    editingItem: null
  });
  
  // Estados para datos necesarios en el modal
  const [usuarios, setUsuarios] = useState([]);
  const [sprints, setSprints] = useState([]);

  useEffect(() => {
    if (sprintData?._id) {
      fetchHierarchicalData();
      
      // 🆕 Auto-refresh cada 30 segundos para ver cambios en tiempo real
      const refreshInterval = setInterval(() => {
        fetchHierarchicalData();
      }, 30000); // 30 segundos
      
      // Limpiar interval al desmontar
      return () => clearInterval(refreshInterval);
    }
  }, [sprintData]);

  const fetchHierarchicalData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = await getToken();
      const API_URL = import.meta.env.VITE_API_URL;
      
      // Obtener vista jerárquica del sprint
      const hierarchicalResponse = await fetch(
        `${API_URL}/backlog/sprint/${sprintData._id}/hierarchical`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Obtener productos para filtros
      const productsResponse = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!hierarchicalResponse.ok) {
        throw new Error('Error al obtener datos jerárquicos del sprint');
      }

      const hierarchicalData = await hierarchicalResponse.json();
      const productsData = productsResponse.ok ? await productsResponse.json() : { products: [] };
      
      // Asegurar que hierarchicalData tenga la estructura correcta
      setHierarchicalData({
        historias: Array.isArray(hierarchicalData?.historias) ? hierarchicalData.historias : [],
        items_sin_historia: Array.isArray(hierarchicalData?.items_sin_historia) ? hierarchicalData.items_sin_historia : [],
        sprint: hierarchicalData?.sprint || null,
        estadisticas: hierarchicalData?.estadisticas || hierarchicalData?.resumen || {
          total_historias: 0,
          total_items_tecnicos: 0,
          items_sin_asignar: 0
        }
      });
      setProducts(productsData.products || []);
      
      // Cargar usuarios y sprints para el modal de creación
      await Promise.all([fetchUsuarios(), fetchSprints()]);
      
    } catch (error) {
      console.error('Error fetching hierarchical data:', error);
      setError('Error al cargar datos del sprint');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar usuarios del equipo
  const fetchUsuarios = async () => {
    try {
      const token = await getToken();
      const API_URL = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${API_URL}/team/members`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const usuariosFormateados = (data.members || []).map(member => ({
          _id: member.user?._id || member._id,
          nombre_negocio: member.user?.nombre_negocio 
            ? member.user.nombre_negocio 
            : member.user?.email || 'Usuario',
          email: member.user?.email || '',
          role: member.role || 'developer'
        }));
        setUsuarios(usuariosFormateados);
      }
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  // Función para cargar sprints
  const fetchSprints = async () => {
    try {
      const token = await getToken();
      const API_URL = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${API_URL}/sprints`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSprints(data.sprints || data || []);
      }
    } catch (error) {
      console.error('Error fetching sprints:', error);
    }
  };

  // Filtrar historias según los criterios seleccionados
  const filteredHistorias = Array.isArray(hierarchicalData?.historias) 
    ? hierarchicalData.historias.filter(storyData => {
        // Validar que storyData tenga la estructura correcta
        if (!storyData || !storyData.historia) {
          console.warn('⚠️ storyData sin historia:', storyData);
          return false;
        }
        
        const { historia } = storyData;
        const matchesProduct = filters.producto === 'todos' || 
          historia.producto?._id === filters.producto;
        const matchesStatus = filters.estado === 'todos' || historia.estado === filters.estado;
        const matchesSearch = !filters.search || 
          historia.titulo?.toLowerCase().includes(filters.search.toLowerCase()) ||
          historia.descripcion?.toLowerCase().includes(filters.search.toLowerCase());
          
        return matchesProduct && matchesStatus && matchesSearch;
      })
    : [];

  // Filtrar items sin asignar
  const filteredUnassigned = Array.isArray(hierarchicalData?.items_sin_historia)
    ? hierarchicalData.items_sin_historia.filter(item => {
        const matchesProduct = filters.producto === 'todos' || 
          item.producto?._id === filters.producto;
        const matchesStatus = filters.estado === 'todos' || item.estado === filters.estado;
        const matchesSearch = !filters.search || 
          item.titulo?.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.descripcion?.toLowerCase().includes(filters.search.toLowerCase());
          
        return matchesProduct && matchesStatus && matchesSearch;
      })
    : [];

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleViewDetails = (item) => {
    // TODO: Implementar modal de detalles de item
  };

  const handleAssignUserToItem = (technicalItem) => {
    setAssignUserModal({
      isOpen: true,
      technicalItem
    });
  };

  const handleAssignSuccess = (result) => {
    console.log('✅ [SPRINT] Item asignado, refrescando datos...');
    // Refrescar datos
    fetchHierarchicalData();
    if (onRefresh) onRefresh();
  };

  // Funciones para el modal de creación de items técnicos
  const handleCreateTechnicalItem = () => {
    setCreateModal({
      isOpen: true,
      editingItem: null
    });
  };

  const handleCreateModalClose = () => {
    setCreateModal({
      isOpen: false,
      editingItem: null
    });
  };

  const handleCreateModalSuccess = (message) => {
    // Refrescar datos
    fetchHierarchicalData();
    if (onRefresh) onRefresh();
    handleCreateModalClose();
  };

  const getSummaryStats = () => {
    const totalHistorias = filteredHistorias?.length || 0;
    
    // Calcular stats de items técnicos
    let totalTechnicalItems = 0;
    let completedTechnicalItems = 0;
    let inProgressTechnicalItems = 0;
    
    if (Array.isArray(filteredHistorias)) {
      filteredHistorias.forEach(storyData => {
        const items = Array.isArray(storyData?.items_tecnicos) ? storyData.items_tecnicos : [];
        totalTechnicalItems += items.length;
        completedTechnicalItems += items.filter(item => item.estado === 'completado').length;
        inProgressTechnicalItems += items.filter(item => item.estado === 'en_progreso').length;
      });
    }
    
    // Agregar items sin asignar
    if (Array.isArray(filteredUnassigned)) {
      totalTechnicalItems += filteredUnassigned.length;
      completedTechnicalItems += filteredUnassigned.filter(item => item.estado === 'completado').length;
      inProgressTechnicalItems += filteredUnassigned.filter(item => item.estado === 'en_progreso').length;
    }
    
    const completedHistorias = Array.isArray(filteredHistorias) 
      ? filteredHistorias.filter(storyData => storyData?.historia?.estado === 'completado').length
      : 0;
    
    const inProgressHistorias = Array.isArray(filteredHistorias)
      ? filteredHistorias.filter(storyData => storyData?.historia?.estado === 'en_progreso').length
      : 0;
    
    return { 
      totalHistorias,
      completedHistorias,
      inProgressHistorias,
      totalTechnicalItems,
      completedTechnicalItems,
      inProgressTechnicalItems,
      unassignedItems: filteredUnassigned?.length || 0
    };
  };

  const getAvailableStories = () => {
    if (!Array.isArray(hierarchicalData?.historias)) return [];
    return hierarchicalData.historias.map(storyData => storyData.historia);
  };

  const stats = getSummaryStats();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 text-left group"
          >
            {isExpanded ? 
              <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-gray-700" /> :
              <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
            }
            <h3 className="text-xl font-semibold text-gray-900">
              Historias y Items Técnicos del Sprint
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {stats.totalHistorias} historias
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchHierarchicalData}
              disabled={loading}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                loading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'hover:bg-green-50 border-green-200 text-green-700'
              }`}
              title="Actualizar datos del sprint"
            >
              <svg 
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
            
            <button
              onClick={handleCreateTechnicalItem}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              title="Crear nuevo item técnico para este sprint"
            >
              <Plus className="h-4 w-4" />
              Nuevo Item Técnico
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filtros
            </button>
          </div>
        </div>

        {/* Stats resumidas */}
        {isExpanded && (
          <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Historias: {stats.totalHistorias}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>H. Completadas: {stats.completedHistorias}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>H. En progreso: {stats.inProgressHistorias}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Items técnicos: {stats.totalTechnicalItems}</span>
            </div>
            {stats.unassignedItems > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Sin asignar: {stats.unassignedItems}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {isExpanded && (
        <>
          {/* Filtros */}
          {showFilters && (
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro por producto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Producto
                  </label>
                  <select
                    value={filters.producto}
                    onChange={(e) => handleFilterChange('producto', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="todos">Todos los productos</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={filters.estado}
                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="completado">Completado</option>
                    <option value="bloqueado">Bloqueado</option>
                  </select>
                </div>

                {/* Búsqueda */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Búsqueda
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Buscar historias..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contenido */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Error al cargar datos</h4>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                  onClick={fetchHierarchicalData}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Reintentar
                </button>
              </div>
            ) : filteredHistorias.length === 0 && filteredUnassigned.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-400 mb-2">
                  No hay historias ni items técnicos
                </h4>
                <p className="text-sm text-gray-500">
                  {(hierarchicalData?.historias?.length || 0) === 0 
                    ? 'Este sprint no tiene historias asignadas aún.'
                    : 'No hay items que coincidan con los filtros seleccionados.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Historias con items técnicos */}
                {filteredHistorias.map(storyData => (
                  <StoryWithTechnicalItems
                    key={storyData?.historia?._id || Math.random()}
                    storyData={storyData}
                    onViewDetails={handleViewDetails}
                    onAssignUser={handleAssignUserToItem}
                  />
                ))}

                {/* Items técnicos sin asignar */}
                {filteredUnassigned.length > 0 && (
                  <UnassignedTechnicalItems
                    items={filteredUnassigned}
                    onAssignUser={handleAssignUserToItem}
                    onViewDetails={handleViewDetails}
                  />
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de asignación de usuario */}
      <AssignUserToTechnicalItemModal
        isOpen={assignUserModal.isOpen}
        onClose={() => setAssignUserModal({ isOpen: false, technicalItem: null })}
        technicalItem={assignUserModal.technicalItem}
        onAssignSuccess={handleAssignSuccess}
      />

      {/* Modal de creación de items técnicos */}
      <ModalBacklogItemSM
        isOpen={createModal.isOpen}
        onClose={handleCreateModalClose}
        editingItem={createModal.editingItem}
        productos={products}
        usuarios={usuarios}
        sprints={sprints}
        onSuccess={handleCreateModalSuccess}
        currentSprint={sprintData} // Pasar sprint actual para pre-selección
      />
    </div>
  );
};

export default SprintTechnicalItems;