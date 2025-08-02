import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import config from '../../../config/config';
import { 
  X, 
  Plus, 
  Minus,
  Package,
  Calendar,
  Target,
  Tag,
  CheckCircle
} from 'lucide-react';

const ModalBacklogItem = ({ 
  isOpen, 
  onClose, 
  editingItem, 
  productos, 
  usuarios, 
  sprints, 
  onSuccess 
}) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'historia',
    prioridad: 'media',
    producto: '',
    puntos_historia: '',
    sprint: '',
    criterios_aceptacion: [{ descripcion: '', completado: false }],
    etiquetas: []
  });

  // Configuraciones de colores y opciones
  const tipoOptions = [
    { value: 'historia', label: 'Historia de Usuario', color: 'text-blue-600' },
    { value: 'tarea', label: 'Tarea', color: 'text-green-600' },
    { value: 'bug', label: 'Bug', color: 'text-red-600' },
    { value: 'mejora', label: 'Mejora', color: 'text-purple-600' }
  ];

  const prioridadOptions = [
    { value: 'muy_alta', label: 'Muy Alta', color: 'text-red-600' },
    { value: 'alta', label: 'Alta', color: 'text-orange-600' },
    { value: 'media', label: 'Media', color: 'text-yellow-600' },
    { value: 'baja', label: 'Baja', color: 'text-green-600' }
  ];

  // Efecto para cargar datos cuando se edita un item
  useEffect(() => {
    if (editingItem) {
      setFormData({
        titulo: editingItem.titulo || '',
        descripcion: editingItem.descripcion || '',
        tipo: editingItem.tipo || 'historia',
        prioridad: editingItem.prioridad || 'media',
        producto: editingItem.producto?._id || '',
        puntos_historia: editingItem.puntos_historia?.toString() || '',
        sprint: editingItem.sprint?._id || '',
        criterios_aceptacion: editingItem.criterios_aceptacion?.length > 0 
          ? editingItem.criterios_aceptacion 
          : [{ descripcion: '', completado: false }],
        etiquetas: editingItem.etiquetas || []
      });
    } else {
      resetForm();
    }
  }, [editingItem, productos, usuarios, sprints]); // Agregar productos a las dependencias

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      tipo: 'historia',
      prioridad: 'media',
      producto: '',
      puntos_historia: '',
      sprint: '',
      criterios_aceptacion: [{ descripcion: '', completado: false }],
      etiquetas: []
    });
    setError('');
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.titulo.trim()) {
      setError('El título es requerido');
      return;
    }
    
    if (!formData.descripcion.trim()) {
      setError('La descripción es requerida');
      return;
    }
    
    if (!formData.producto) {
      setError('Debe seleccionar un producto');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const token = await getToken();
      const url = editingItem 
        ? `${config.API_URL}/backlog/${editingItem._id}`
        : `${config.API_URL}/backlog`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      // Limpiar y preparar datos
      const submitData = {
        ...formData,
        puntos_historia: formData.puntos_historia ? parseInt(formData.puntos_historia) : undefined,
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
      
      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta exitosa:', data);
        
        // Notificar éxito al componente padre
        onSuccess(data.message || `Item ${editingItem ? 'actualizado' : 'creado'} exitosamente`);
        
        // Cerrar modal y resetear
        onClose();
        resetForm();
      } else {
        const errorData = await response.text();
        console.log('Error response:', errorData);
        throw new Error(errorData || 'Error al guardar item');
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      setError('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar criterios de aceptación
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

  // Manejar cambio de etiquetas
  const handleEtiquetaChange = (value) => {
    const etiquetas = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({ ...formData, etiquetas });
  };

  // Cerrar modal
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Editar Item del Backlog' : 'Nuevo Item del Backlog'}
              </h2>
              <p className="text-sm text-gray-500">
                {editingItem ? 'Actualiza la información del item' : 'Agrega un nuevo item al product backlog'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Título y Descripción */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Como usuario, quiero poder..."
                required
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe detalladamente el item del backlog..."
                required
              />
            </div>
          </div>

          {/* Tipo, Prioridad y Puntos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {tipoOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad *
              </label>
              <select
                value={formData.prioridad}
                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {prioridadOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puntos de Historia
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.puntos_historia}
                onChange={(e) => setFormData({ ...formData, puntos_historia: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1-100"
              />
            </div>
          </div>

          {/* Producto y Sprint */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="h-4 w-4 inline mr-1" />
                Producto *
              </label>
              <select
                value={formData.producto}
                onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar producto</option>
                {(productos || []).map(producto => (
                  <option key={producto._id} value={producto._id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
              {(!productos || productos.length === 0) && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ No se han cargado productos. Recargando...
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Sprint
              </label>
              <select
                value={formData.sprint}
                onChange={(e) => setFormData({ ...formData, sprint: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sin asignar</option>
                {(sprints || []).map(sprint => (
                  <option key={sprint._id} value={sprint._id}>
                    {sprint.nombre} ({sprint.estado})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Criterios de Aceptación */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                <Target className="h-4 w-4 inline mr-1" />
                Criterios de Aceptación
              </label>
              <button
                type="button"
                onClick={addCriterio}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Agregar
              </button>
            </div>
            <div className="space-y-3">
              {formData.criterios_aceptacion.map((criterio, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={criterio.descripcion}
                    onChange={(e) => updateCriterio(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Criterio de aceptación..."
                  />
                  {formData.criterios_aceptacion.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCriterio(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Etiquetas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="h-4 w-4 inline mr-1" />
              Etiquetas
            </label>
            <input
              type="text"
              value={formData.etiquetas.join(', ')}
              onChange={(e) => handleEtiquetaChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="frontend, backend, api (separadas por comas)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separa las etiquetas con comas
            </p>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {editingItem ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  {editingItem ? 'Actualizar Item' : 'Crear Item'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalBacklogItem;
