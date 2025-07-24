import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import config from '../../config/config';
import ModalBacklogItem from './modalsSM/ModalBacklogItemSM';
import { 
  Plus, 
  Search, 
  Filter,
  Package,
  User,
  Calendar,
  Target,
  Tag,
  CheckCircle,
  Clock,
  AlertTriangle,
  Bug,
  Wrench,
  Zap
} from 'lucide-react';

const ScrumMasterBacklog = () => {
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
  const [filtroTipo, setFiltroTipo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Configuración de colores por tipo
  const tipoColors = {
    tarea: 'bg-green-100 text-green-800',
    bug: 'bg-red-100 text-red-800',
    mejora: 'bg-purple-100 text-purple-800'
  };

  const tipoIcons = {
    tarea: Wrench,
    bug: Bug,
    mejora: Zap
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

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchItems(),
        fetchProductos(),
        fetchUsuarios(),
        fetchSprints()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Error al cargar datos iniciales');
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const token = await getToken();
      
      // Solo obtener tareas técnicas (tareas, bugs, mejoras) usando parámetro tipo
      const technicalTypes = ['tarea', 'bug', 'mejora'];
      const typeFilter = `tipo=${technicalTypes.join(',')}`;
      
      console.log('Fetching Scrum Master technical items...');
      
      const response = await fetch(`${config.API_URL}/backlog?${typeFilter}&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Scrum Master Backlog Items:', data);
        setItems(data.items || data || []);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al cargar items del backlog');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Error al cargar items del backlog');
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
        const data = await response.json();
        setProductos(data.products || data || []);
      }
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${config.API_URL}/team/members`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const members = data.members || data || [];
        // Mapear a formato compatible
        const usuariosFormateados = members.map(member => ({
          _id: member._id,
          nombre_negocio: member.user?.firstName && member.user?.lastName 
            ? `${member.user.firstName} ${member.user.lastName}` 
            : member.user?.nombre_negocio || member.user?.email || 'Usuario',
          email: member.user?.email || '',
          role: member.role || 'developer'
        }));
        setUsuarios(usuariosFormateados);
      }
    } catch (error) {
      console.error('Error fetching usuarios:', error);
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
        setSprints(data.sprints || data || []);
      }
    } catch (error) {
      console.error('Error fetching sprints:', error);
    }
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleModalSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
    fetchItems(); // Recargar items
    handleModalClose();
  };

  // Filtrar items
  const filteredItems = items.filter(item => {
    const matchesSearch = !searchTerm || 
      item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProducto = !filtroProducto || item.producto?._id === filtroProducto;
    const matchesEstado = !filtroEstado || item.estado === filtroEstado;
    const matchesPrioridad = !filtroPrioridad || item.prioridad === filtroPrioridad;
    const matchesTipo = !filtroTipo || item.tipo === filtroTipo;

    return matchesSearch && matchesProducto && matchesEstado && matchesPrioridad && matchesTipo;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFiltroProducto('');
    setFiltroEstado('');
    setFiltroPrioridad('');
    setFiltroTipo('');
  };

  const getItemIcon = (tipo) => {
    const IconComponent = tipoIcons[tipo] || Wrench;
    return <IconComponent className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión Técnica del Backlog</h1>
          <p className="text-gray-600">Administra tareas técnicas, bugs y mejoras del proyecto</p>
        </div>
        <button
          onClick={handleCreateItem}
          className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo Item Técnico
        </button>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Búsqueda */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por título o descripción..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filtro por Tipo */}
          <div>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="tarea">Tareas</option>
              <option value="bug">Bugs</option>
              <option value="mejora">Mejoras</option>
            </select>
          </div>

          {/* Filtro por Producto */}
          <div>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={filtroProducto}
              onChange={(e) => setFiltroProducto(e.target.value)}
            >
              <option value="">Todos los productos</option>
              {productos.map(producto => (
                <option key={producto._id} value={producto._id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado */}
          <div>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="en_revision">En Revisión</option>
              <option value="completado">Completado</option>
            </select>
          </div>

          {/* Filtro por Prioridad */}
          <div>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
            >
              <option value="">Todas las prioridades</option>
              <option value="muy_alta">Muy Alta</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>

        {/* Botón limpiar filtros */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wrench className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tareas</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.tipo === 'tarea').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Bug className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Bugs</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.tipo === 'bug').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Mejoras</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.tipo === 'mejora').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Items */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Items Técnicos ({filteredItems.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay items técnicos
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza creando tareas, reportando bugs o planificando mejoras
              </p>
              <button
                onClick={handleCreateItem}
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Crear Primer Item
              </button>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${tipoColors[item.tipo]}`}>
                        {getItemIcon(item.tipo)}
                        {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                      </div>
                      
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${prioridadColors[item.prioridad]}`}>
                        {item.prioridad.replace('_', ' ').toUpperCase()}
                      </span>
                      
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${estadoColors[item.estado]}`}>
                        {item.estado.replace('_', ' ').toUpperCase()}
                      </span>

                      {item.puntos_historia && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {item.puntos_historia} SP
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {item.titulo}
                    </h3>
                    
                    <p className="text-gray-600 mb-3">
                      {item.descripcion}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>{item.producto?.nombre || 'Sin producto'}</span>
                      </div>
                      
                      {item.asignado_a && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{item.asignado_a.nombre_negocio || item.asignado_a.email}</span>
                        </div>
                      )}
                      
                      {item.sprint && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Sprint: {item.sprint.nombre}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {item.etiquetas && item.etiquetas.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <div className="flex gap-1">
                          {item.etiquetas.map((etiqueta, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                            >
                              {etiqueta}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <ModalBacklogItem
        isOpen={showModal}
        onClose={handleModalClose}
        editingItem={editingItem}
        productos={productos}
        usuarios={usuarios}
        sprints={sprints}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default ScrumMasterBacklog;
