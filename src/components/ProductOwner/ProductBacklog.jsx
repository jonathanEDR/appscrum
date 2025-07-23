import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import config from '../../config/config';
import { 
  List, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Package,
  User,
  Clock,
  Calendar
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
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'historia',
    prioridad: 'media',
    producto: '',
    puntos_historia: '',
    asignado_a: '',
    sprint: '', // Campo para asociar a sprint
    criterios_aceptacion: [{ descripcion: '', completado: false }],
    etiquetas: []
  });

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

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      console.log('Token obtenido:', token ? 'Token válido' : 'No hay token');
      
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (filtroProducto) params.append('producto', filtroProducto);
      if (filtroEstado) params.append('estado', filtroEstado);
      if (filtroPrioridad) params.append('prioridad', filtroPrioridad);
      
      const url = `${config.API_URL}/backlog?${params.toString()}`;
      console.log('Haciendo petición a:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Datos recibidos:', data);
        setItems(data.items || []);
        setError('');
      } else {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(errorText || 'Error al cargar backlog');
      }
    } catch (error) {
      console.error('Error fetching backlog:', error);
      setError('Error al cargar backlog: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async () => {
    try {
      const token = await getToken();
      console.log('Obteniendo productos con token:', token ? 'válido' : 'inválido');
      
      const url = `${config.API_URL}/productos`;
      console.log('URL productos:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response productos status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Productos obtenidos:', data);
        setProductos(data.productos || []);
      } else {
        const errorText = await response.text();
        console.log('Error productos:', errorText);
      }
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const token = await getToken();
      console.log('Cargando usuarios...');
      
      const response = await fetch(`${config.API_URL}/users-for-assignment`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Usuarios obtenidos:', data);
      setUsuarios(data.usuarios || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar usuarios');
    }
  };

  const fetchSprints = async () => {
    try {
      const token = await getToken();
      console.log('Cargando sprints...');
      
      const response = await fetch(`${config.API_URL}/sprints`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Sprints obtenidos:', data);
      
      // El backend devuelve { sprints, pagination }
      const allSprints = data.sprints || [];
      
      // Solo mostrar sprints en estado 'planificado' o 'activo'
      const sprintsDisponibles = allSprints.filter(sprint => 
        sprint.estado === 'planificado' || sprint.estado === 'activo'
      );
      
      setSprints(sprintsDisponibles);
    } catch (error) {
      console.error('Error al cargar sprints:', error);
      setError('Error al cargar sprints');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = await getToken();
      const url = editingItem 
        ? `${config.API_URL}/backlog/${editingItem._id}`
        : `${config.API_URL}/backlog`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      // Limpiar datos antes de enviar
      const submitData = {
        ...formData,
        puntos_historia: formData.puntos_historia ? parseInt(formData.puntos_historia) : undefined,
        // Limpiar campos ObjectId: convertir strings vacíos a undefined
        asignado_a: formData.asignado_a && formData.asignado_a.trim() !== '' ? formData.asignado_a : undefined,
        sprint: formData.sprint && formData.sprint.trim() !== '' ? formData.sprint : undefined,
        criterios_aceptacion: formData.criterios_aceptacion.filter(c => c.descripcion.trim() !== ''),
        etiquetas: formData.etiquetas.filter(tag => tag.trim() !== '')
      };
      
      console.log('Enviando datos:', method, url, submitData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta exitosa:', data);
        setError(`success:${data.message}`);
        setShowForm(false);
        setEditingItem(null);
        resetForm();
        fetchItems();
      } else {
        const errorData = await response.text();
        console.log('Error response:', errorData);
        throw new Error(errorData || 'Error al guardar item');
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      setError('Error: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      titulo: item.titulo,
      descripcion: item.descripcion,
      tipo: item.tipo,
      prioridad: item.prioridad,
      producto: item.producto._id,
      puntos_historia: item.puntos_historia?.toString() || '',
      asignado_a: item.asignado_a?._id || '',
      sprint: item.sprint?._id || '', // Asociar sprint al editar
      criterios_aceptacion: item.criterios_aceptacion?.length > 0 
        ? item.criterios_aceptacion 
        : [{ descripcion: '', completado: false }],
      etiquetas: item.etiquetas || []
    });
    setShowForm(true);
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

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      tipo: 'historia',
      prioridad: 'media',
      producto: '',
      puntos_historia: '',
      asignado_a: '',
      sprint: '', // Reiniciar campo de sprint
      criterios_aceptacion: [{ descripcion: '', completado: false }],
      etiquetas: []
    });
  };

  const addCriterio = () => {
    setFormData({
      ...formData,
      criterios_aceptacion: [...formData.criterios_aceptacion, { descripcion: '', completado: false }]
    });
  };

  const removeCriterio = (index) => {
    const newCriterios = formData.criterios_aceptacion.filter((_, i) => i !== index);
    setFormData({ ...formData, criterios_aceptacion: newCriterios });
  };

  const updateCriterio = (index, descripcion) => {
    const newCriterios = [...formData.criterios_aceptacion];
    newCriterios[index].descripcion = descripcion;
    setFormData({ ...formData, criterios_aceptacion: newCriterios });
  };

  // Cargar datos iniciales
  useEffect(() => {
    // Verificar autenticación antes de cargar datos
    const verificarAutenticacion = async () => {
      try {
        const token = await getToken();
        console.log('Token en useEffect:', token);
        
        if (!token) {
          setError('No hay token de autenticación');
          setLoading(false);
          return;
        }
        
        await cargarDatos();
      } catch (error) {
        console.error('Error en autenticación:', error);
        setError('Error de autenticación');
        setLoading(false);
      }
    };
    
    verificarAutenticacion();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchItems(),
        fetchProductos(),
        fetchUsuarios(),
        fetchSprints() // Cargar sprints disponibles
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando backlog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <List className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Backlog</h1>
              <p className="text-gray-600">Gestiona las historias de usuario y tareas</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Nueva Historia
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filtroProducto}
            onChange={(e) => setFiltroProducto(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todos los productos</option>
            {productos.map(producto => (
              <option key={producto._id} value={producto._id}>
                {producto.nombre}
              </option>
            ))}
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="en_revision">En Revisión</option>
            <option value="completado">Completado</option>
          </select>
          <div className="flex gap-2">
            <select
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todas las prioridades</option>
              <option value="muy_alta">Muy Alta</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
            <button
              onClick={fetchItems}
              className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className={`p-4 rounded-lg ${
          error.startsWith('success:')
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {error.startsWith('success:') ? error.replace('success:', '') : error}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingItem ? 'Editar Historia' : 'Nueva Historia'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto *
                </label>
                <select
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.producto}
                  onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
                >
                  <option value="">Seleccionar producto</option>
                  {productos.map(producto => (
                    <option key={producto._id} value={producto._id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                required
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                >
                  <option value="historia">Historia</option>
                  <option value="tarea">Tarea</option>
                  <option value="bug">Bug</option>
                  <option value="mejora">Mejora</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridad
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.prioridad}
                  onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                >
                  <option value="muy_alta">Muy Alta</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Puntos Historia
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.puntos_historia}
                  onChange={(e) => setFormData({ ...formData, puntos_historia: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asignado a
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.asignado_a}
                  onChange={(e) => setFormData({ ...formData, asignado_a: e.target.value })}
                >
                  <option value="">Sin asignar</option>
                  {usuarios.map(usuario => (
                    <option key={usuario._id} value={usuario._id}>
                      {usuario.nombre_negocio || usuario.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sprint */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asignar a Sprint
                <span className="text-xs text-gray-500 ml-2">
                  (Solo sprints planificados o activos)
                </span>
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.sprint}
                onChange={(e) => setFormData({ ...formData, sprint: e.target.value })}
              >
                <option value="">Sin sprint asignado</option>
                {sprints.length === 0 && (
                  <option disabled>No hay sprints disponibles</option>
                )}
                {sprints.map(sprint => (
                  <option key={sprint._id} value={sprint._id}>
                    {sprint.nombre} ({sprint.estado}) - {new Date(sprint.fecha_inicio).toLocaleDateString()} a {new Date(sprint.fecha_fin).toLocaleDateString()}
                  </option>
                ))}
              </select>
              {sprints.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Crea un sprint en el módulo Roadmap para poder asignar historias
                </p>
              )}
            </div>

            {/* Criterios de Aceptación */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Criterios de Aceptación
                </label>
                <button
                  type="button"
                  onClick={addCriterio}
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  + Agregar criterio
                </button>
              </div>
              {formData.criterios_aceptacion.map((criterio, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Descripción del criterio"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={criterio.descripcion}
                    onChange={(e) => updateCriterio(index, e.target.value)}
                  />
                  {formData.criterios_aceptacion.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCriterio(index)}
                      className="text-red-600 hover:text-red-700 px-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingItem ? 'Actualizar' : 'Crear'} Historia
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de items */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Items del Backlog ({items.length})
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <List className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay items</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando tu primera historia de usuario
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-500">#{index + 1}</span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.titulo}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${tipoColors[item.tipo]}`}>
                        {item.tipo}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${prioridadColors[item.prioridad]}`}>
                        {item.prioridad.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${estadoColors[item.estado]}`}>
                        {item.estado.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{item.descripcion}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Package size={14} />
                        <span>{item.producto?.nombre}</span>
                      </div>
                      {item.asignado_a && (
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>{item.asignado_a?.nombre_negocio || item.asignado_a?.email}</span>
                        </div>
                      )}
                      {item.sprint && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span className="text-blue-600 font-medium">Sprint: {item.sprint?.nombre}</span>
                        </div>
                      )}
                      {item.puntos_historia && (
                        <span>Puntos: {item.puntos_historia}</span>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar item"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductBacklog;