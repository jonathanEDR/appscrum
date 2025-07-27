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
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    responsable: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: '',
    prioridad: 'media',
    estado: 'activo'
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const estadoColors = {
    activo: 'bg-green-100 text-green-800',
    inactivo: 'bg-gray-100 text-gray-800',
    completado: 'bg-blue-100 text-blue-800'
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      
      // Usar ruta temporal sin autenticación para testing
      const response = await fetch(`${API_URL}/productos-demo`);
      
      if (response.ok) {
        const data = await response.json();
        setProductos(data.products || []);
        setError('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar productos');
      }
    } catch (error) {
      console.error('Error fetching productos:', error);
      setError('Error al cargar productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Usar datos simulados para testing
  const fetchUsuarios = async () => {
    try {
      // Usuarios simulados para testing
      const usuariosDemo = [
        {
          _id: '507f1f77bcf86cd799439012',
          nombre_negocio: 'Juan Pérez',
          email: 'juan.perez@empresa.com',
          role: 'product_owner'
        },
        {
          _id: '507f1f77bcf86cd799439014', 
          nombre_negocio: 'María García',
          email: 'maria.garcia@empresa.com',
          role: 'scrum_master'
        },
        {
          _id: '507f1f77bcf86cd799439016',
          nombre_negocio: 'Carlos López',
          email: 'carlos.lopez@empresa.com',
          role: 'developer'
        },
        {
          _id: '507f1f77bcf86cd799439018',
          nombre_negocio: 'Ana Martínez',
          email: 'ana.martinez@empresa.com',
          role: 'product_owner'
        }
      ];
      
      setUsuarios(usuariosDemo);
      setError('');
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
        ? `${API_URL}/productos/${editingProduct._id}`
        : `${API_URL}/productos`;
      
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
      setError('Error: ' + error.message);
    }
  };

  const handleEdit = (producto) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      responsable: producto.responsable._id,
      fecha_inicio: producto.fecha_inicio ? producto.fecha_inicio.split('T')[0] : new Date().toISOString().split('T')[0],
      fecha_fin: producto.fecha_fin ? producto.fecha_fin.split('T')[0] : '',
      prioridad: producto.prioridad || 'media',
      estado: producto.estado
    });
    setShowForm(true);
  };

  const handleDelete = async (producto) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`)) {
      return;
    }
    
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/productos/${producto._id}`, {
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
      setError('Error: ' + error.message);
    }
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
                      {producto.prioridad && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          producto.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                          producto.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {producto.prioridad}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{producto.descripcion}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{producto.responsable?.nombre_negocio || producto.responsable?.email}</span>
                      </div>
                      {producto.fecha_inicio && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Inicio: {new Date(producto.fecha_inicio).toLocaleDateString()}</span>
                        </div>
                      )}
                      {producto.fecha_fin && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Fin: {new Date(producto.fecha_fin).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Creado: {new Date(producto.createdAt).toLocaleDateString()}</span>
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
    </div>
  );
};

export default Productos;