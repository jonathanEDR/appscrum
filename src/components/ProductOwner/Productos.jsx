import React, { useState, useEffect } from 'react';
import ModalProducto from '../modalproductowner/ModalProducto';
import { useAuth } from '@clerk/clerk-react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  User,
  Calendar,
  RefreshCw,
  MoreVertical,
  Eye
} from 'lucide-react';

const Productos = () => {
  const { getToken } = useAuth();
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    responsable: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: '',
    prioridad: 'media',
    estado: 'activo'
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const estadoColors = {
    activo: 'bg-green-100 text-green-800',
    inactivo: 'bg-gray-100 text-gray-800',
    completado: 'bg-blue-100 text-blue-800'
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      
      // Usar la ruta correcta con autenticación
      const token = await getToken();
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProductos(data.products || data || []);
        setError('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Error al cargar productos');
      }
    } catch (error) {
      console.error('Error fetching productos:', error);
      setError('Error al cargar productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios reales desde la API
  const fetchUsuarios = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data.users || data || []);
        setError('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Error al cargar usuarios');
      }
    } catch (error) {
      setError('Error al cargar colaboradores: ' + error.message);
      setUsuarios([]);
      console.error('Error fetching usuarios:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = await getToken();
      const url = editingProduct 
        ? `${API_URL}/products/${editingProduct._id}`
        : `${API_URL}/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setError(`success:${data.message}`);
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
        fetchProductos();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar producto');
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      setError('Error: ' + error.message);
    }
  };

  const handleEdit = (producto) => {
    if (!producto || !producto._id) {
      console.error('Producto no válido para editar:', producto);
      setError('Error: Producto no válido para editar');
      return;
    }

    try {
      setEditingProduct(producto);
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        responsable: producto.responsable?._id || producto.responsable || '',
  fecha_inicio: producto.fecha_inicio ? (typeof producto.fecha_inicio === 'string' ? producto.fecha_inicio.split('T')[0] : new Date(producto.fecha_inicio).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
  fecha_fin: producto.fecha_fin ? (typeof producto.fecha_fin === 'string' ? producto.fecha_fin.split('T')[0] : new Date(producto.fecha_fin).toISOString().split('T')[0]) : '',
        prioridad: producto.prioridad || 'media',
        estado: producto.estado || 'activo'
      });
      setShowForm(true);
    } catch (error) {
      console.error('Error al configurar edición:', error);
      setError('Error al abrir formulario de edición');
    }
  };

  const handleDelete = async (producto) => {
    if (!producto || !producto._id) {
      console.error('Producto no válido para eliminar:', producto);
      setError('Error: Producto no válido para eliminar');
      return;
    }

    if (!window.confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`)) {
      return;
    }
    
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/products/${producto._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setError('success:Producto eliminado exitosamente');
        fetchProductos();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setError('Error: ' + error.message);
    }
  };

  const handleViewDetails = (producto) => {
    if (!producto || !producto._id) {
      console.error('Producto no válido para ver detalles:', producto);
      setError('Error: Producto no válido para ver detalles');
      return;
    }

    setSelectedProduct(producto);
    setShowDetails(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      responsable: '',
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin: '',
      prioridad: 'media',
      estado: 'activo'
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchProductos();
    fetchUsuarios();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
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
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
              <p className="text-gray-600">Administra los productos de tu organización</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
        </div>

        {/* Búsqueda */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchProductos()}
            />
          </div>
          <button
            onClick={fetchProductos}
            className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={20} />
            Actualizar
          </button>
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
      <ModalProducto
        isOpen={showForm}
        onClose={handleCancel}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        usuarios={usuarios}
        error={error}
      />

      {/* Lista de productos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Productos ({productos.length})
          </h2>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando tu primer producto
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {productos.map((producto) => (
              <div key={producto._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {producto.nombre}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${estadoColors[producto.estado]}`}>
                        {producto.estado}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{producto.descripcion}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{producto.responsable?.nombre_negocio || producto.responsable?.email || 'No asignado'}</span>
                      </div>
                      {producto.fecha_inicio && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Inicio: {new Date(producto.fecha_inicio).toLocaleDateString('es-ES')}</span>
                        </div>
                      )}
                      {producto.fecha_fin && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Fin: {new Date(producto.fecha_fin).toLocaleDateString('es-ES')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Creado: {new Date(producto.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(producto)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Editar producto"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(producto)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => handleViewDetails(producto)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {showDetails && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Detalles del Producto</h3>
              <button
                onClick={handleCloseDetails}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedProduct.nombre}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${estadoColors[selectedProduct.estado] || 'bg-gray-100 text-gray-800'}`}>
                    {selectedProduct.estado?.charAt(0).toUpperCase() + selectedProduct.estado?.slice(1)}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg leading-relaxed">{selectedProduct.descripcion || 'Sin descripción disponible'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    <span className="text-gray-900">
                      {selectedProduct.responsable?.nombre_negocio || 
                       selectedProduct.responsable?.email || 
                       'No asignado'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Creado Por</label>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-blue-500" />
                    <span className="text-gray-900">
                      {selectedProduct.created_by?.nombre_negocio || 
                       selectedProduct.created_by?.email || 
                       'Sistema'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-900">
                      {selectedProduct.fecha_inicio ? 
                        new Date(selectedProduct.fecha_inicio).toLocaleDateString('es-ES') : 
                        'No definida'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-900">
                      {selectedProduct.fecha_fin ? 
                        new Date(selectedProduct.fecha_fin).toLocaleDateString('es-ES') : 
                        'No definida'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Creación</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-900">
                      {new Date(selectedProduct.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Última Actualización</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-900">
                      {new Date(selectedProduct.updatedAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  handleCloseDetails();
                  handleEdit(selectedProduct);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Editar Producto
              </button>
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;