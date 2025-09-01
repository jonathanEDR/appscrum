import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import config from '../../config/config';
import { apiService } from '../../services/apiService';
import ModalBacklogItem from './modalsPO/ModalBacklogItem';
import { 
  List, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Filter,
  RefreshCw,
  Package,
  User,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ProductBacklog = () => {
  const { getToken } = useAuth();
  const [items, setItems] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroProducto, setFiltroProducto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);

  const tipoColors = {
    historia: 'bg-blue-100 text-blue-800',
    tarea: 'bg-green-100 text-green-800',
    bug: 'bg-red-100 text-red-800',
    mejora: 'bg-purple-100 text-purple-800'
  };

  const prioridadColors = {
    muy_alta: 'bg-red-100 text-red-800',
    alta: 'bg-orange-100 text-orange-800',
    media: 'bg-yellow-100 text-yellow-800',
    baja: 'bg-green-100 text-green-800'
  };

  const estadoColors = {
    pendiente: 'bg-gray-100 text-gray-800',
    en_progreso: 'bg-blue-100 text-blue-800',
    en_revision: 'bg-purple-100 text-purple-800',
    completado: 'bg-green-100 text-green-800'
  };

  // Función para evaluar si un item está listo para sprint
  const isReadyForSprint = (item) => {
    // Criterios para estar "listo para sprint":
    // 1. Tiene descripción completa
    // 2. Tiene criterios de aceptación
    // 3. Tiene puntos de historia estimados
    // 4. Está en estado pendiente (no asignado a sprint)
    const hasDescription = item.descripcion && item.descripcion.trim().length > 10;
    const hasCriteria = item.criterios_aceptacion && item.criterios_aceptacion.length > 0 && 
                       item.criterios_aceptacion.some(c => c.descripcion && c.descripcion.trim().length > 0);
    const hasStoryPoints = item.puntos_historia && item.puntos_historia > 0;
    const isPending = item.estado === 'pendiente' && !item.sprint;
    
    return hasDescription && hasCriteria && hasStoryPoints && isPending;
  };

  const fetchItems = async () => {
    try {
      setIsFiltering(true);
      const token = await getToken();
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filtroProducto) params.append('producto', filtroProducto);
      if (filtroEstado) params.append('estado', filtroEstado);
      if (filtroPrioridad) params.append('prioridad', filtroPrioridad);
      
      const url = `${config.API_URL}/backlog?${params.toString()}`;
      console.log('Fetching with filters:', { searchTerm, filtroProducto, filtroEstado, filtroPrioridad });
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
        setError('');
        console.log('Filtered items received:', data.items?.length || 0);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al cargar backlog');
      }
    } catch (error) {
      console.error('Error fetching backlog:', error);
      setError('Error al cargar backlog: ' + error.message);
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  const fetchProductos = async () => {
    try {
      const token = await getToken();
  const response = await fetch(`${config.API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const ct = response.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          const text = await response.text();
          console.error('Productos API devolvió no-JSON:', text.substring(0,300));
          setProductos([]);
        } else {
          const data = await response.json();
          console.log('Productos recibidos:', data); // Debug log
          setProductos(data.products || data.productos || []); // Manejar ambos formatos
        }
      } else {
        console.error('❌ Error response from productos API:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('❌ Error details:', errorText);
      }
    } catch (error) {
      console.error('❌ Error fetching productos:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const token = await getToken();
  const response = await fetch(`${config.API_URL}/users-for-assignment`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const ct = response.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          const t = await response.text();
          console.error('users-for-assignment returned non-JSON:', t.substring(0,300));
          setUsuarios([]);
        } else {
          const data = await response.json();
          setUsuarios(data.users || []);
        }
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const fetchSprints = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${config.API_URL}/sprints`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const allSprints = data.sprints || [];
        const sprintsDisponibles = allSprints.filter(sprint => 
          sprint.estado === 'planificado' || sprint.estado === 'activo'
        );
        setSprints(sprintsDisponibles);
      }
    } catch (error) {
      console.error('Error al cargar sprints:', error);
    }
  };

  const handleNewItem = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleModalSuccess = (message) => {
    setError(`success:${message}`);
    fetchItems();
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${item.titulo}"?`)) {
      return;
    }
    
    try {
      const token = await getToken();
      const response = await fetch(`${config.API_URL}/backlog/${item._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setError('success:Item eliminado exitosamente');
        fetchItems();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar item');
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setError('No hay token de autenticación');
          setLoading(false);
          return;
        }
        
        await Promise.all([
          fetchProductos(),
          fetchUsuarios(),
          fetchSprints()
        ]);
        
        // Cargar items después de tener los datos de referencia
        await fetchItems();
      } catch (error) {
        console.error('Error cargando datos:', error);
        setError('Error al cargar datos iniciales');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Efecto para aplicar filtros automáticamente
  useEffect(() => {
    // Solo ejecutar si ya se han cargado los datos iniciales y no estamos en loading
    if (productos.length > 0 && !loading) {
      console.log('Aplicando filtros:', { searchTerm, filtroProducto, filtroEstado, filtroPrioridad });
      const timeoutId = setTimeout(() => {
        fetchItems();
      }, 300); // Debounce de 300ms

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, filtroProducto, filtroEstado, filtroPrioridad, productos.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando backlog...</span>
      </div>
    );
  }

  const readyForSprintCount = items.filter(item => isReadyForSprint(item)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <List className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Backlog</h1>
            <p className="text-gray-600">
              Gestiona los items del backlog del producto 
              {readyForSprintCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  {readyForSprintCount} listos para sprint
                </span>
              )}
              {items.length > 0 && (
                <span className="ml-2 text-gray-500">
                  • {items.length} elementos total
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleNewItem}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Item
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className={`p-4 rounded-lg ${
          error.startsWith('success:') 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {error.replace('success:', '')}
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <div>
            <select
              value={filtroProducto}
              onChange={(e) => setFiltroProducto(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los productos</option>
              {productos.map(producto => (
                <option key={producto._id} value={producto._id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="en_revision">En Revisión</option>
              <option value="completado">Completado</option>
            </select>
          </div>
          
          <div>
            <select
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las prioridades</option>
              <option value="muy_alta">Muy Alta</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
        
        {/* Indicadores de filtros activos */}
        {(searchTerm || filtroProducto || filtroEstado || filtroPrioridad) && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Filtros activos:</span>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Búsqueda: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-600">✕</button>
                </span>
              )}
              {filtroProducto && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Producto: {productos.find(p => p._id === filtroProducto)?.nombre}
                  <button onClick={() => setFiltroProducto('')} className="hover:text-green-600">✕</button>
                </span>
              )}
              {filtroEstado && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Estado: {filtroEstado.replace('_', ' ')}
                  <button onClick={() => setFiltroEstado('')} className="hover:text-yellow-600">✕</button>
                </span>
              )}
              {filtroPrioridad && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Prioridad: {filtroPrioridad.replace('_', ' ')}
                  <button onClick={() => setFiltroPrioridad('')} className="hover:text-purple-600">✕</button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFiltroProducto('');
                  setFiltroEstado('');
                  setFiltroPrioridad('');
                }}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                Limpiar todos
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            {items.length > 0 && `Mostrando ${items.length} elementos`}
            {isFiltering && (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                <span>Filtrando...</span>
              </>
            )}
          </div>
          <button
            onClick={fetchItems}
            disabled={isFiltering}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-3 w-3 ${isFiltering ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Lista de Items */}
      <div className="bg-white rounded-lg border border-gray-200">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay items en el backlog</h3>
            <p className="text-gray-500 mb-4">Comienza agregando el primer item al product backlog</p>
            <button
              onClick={handleNewItem}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear Primer Item
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map((item) => {
              const readyForSprint = isReadyForSprint(item);
              
              return (
                <div key={item._id} className={`p-6 hover:bg-gray-50 transition-colors ${
                  readyForSprint ? 'border-l-4 border-l-green-500 bg-green-50/30' : ''
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {readyForSprint && (
                          <div className="flex items-center gap-1 text-green-600" title="Listo para Sprint Planning">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-xs font-medium">Ready</span>
                          </div>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">{item.titulo}</h3>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipoColors[item.tipo]}`}>
                            {item.tipo}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${prioridadColors[item.prioridad]}`}>
                            {item.prioridad.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColors[item.estado]}`}>
                            {item.estado.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{item.descripcion}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {item.producto && (
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            <span>{item.producto.nombre}</span>
                          </div>
                        )}
                        
                        {item.asignado_a && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{item.asignado_a.nombre_negocio || item.asignado_a.firstName}</span>
                          </div>
                        )}
                        
                        {item.sprint && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{item.sprint.nombre}</span>
                          </div>
                        )}
                        
                        {item.puntos_historia && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{item.puntos_historia} puntos</span>
                          </div>
                        )}
                      </div>
                      
                      {item.etiquetas && item.etiquetas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.etiquetas.map((etiqueta, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {etiqueta}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar item"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <ModalBacklogItem
        isOpen={showModal}
        onClose={handleCloseModal}
        editingItem={editingItem}
        productos={productos}
        usuarios={usuarios}
        sprints={sprints}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default ProductBacklog;