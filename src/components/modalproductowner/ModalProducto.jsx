import React, { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { X, Package, User, Calendar, FileText, Settings, Save } from 'lucide-react';

const ModalProducto = ({
  isOpen,
  onClose,
  editingProduct,
  formData,
  setFormData,
  handleSubmit,
  usuarios,
  error
}) => {
  const { theme } = useTheme();
  
  // Establecer fecha actual cuando se abre el modal para nuevo producto
  useEffect(() => {
    if (isOpen && !editingProduct) {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        fecha_inicio: prev.fecha_inicio || today,
        fecha_fin: prev.fecha_fin || ''
      }));
    }
  }, [isOpen, editingProduct, setFormData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className={`inline-block transform overflow-hidden rounded-lg text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          {/* Header del Modal */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h2>
                  <p className="text-orange-100 text-sm">
                    {editingProduct ? 'Modifica la información del producto' : 'Completa la información del nuevo producto'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Contenido del Modal dividido en 2 partes */}
          <form onSubmit={handleSubmit}>
            <div className="flex">
              {/* Parte Izquierda - Información Principal */}
              <div className={`flex-1 p-6 border-r ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-orange-600" />
                    <h3 className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Información Principal</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Nombre del Producto */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Nombre del Producto *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Sistema de Gestión Empresarial"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      />
                    </div>

                    {/* Descripción */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Descripción *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe el objetivo y alcance del producto..."
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      />
                    </div>

                    {/* Responsable */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Responsable del Producto *
                      </label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <select
                          required
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors appearance-none ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          value={formData.responsable}
                          onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                          disabled={usuarios.length === 0}
                        >
                          <option value="">
                            {usuarios.length === 0 ? 'No hay colaboradores disponibles' : 'Seleccionar responsable'}
                          </option>
                          {usuarios.map(usuario => (
                            <option key={usuario._id} value={usuario._id}>
                              {usuario.nombre_negocio || usuario.email} ({usuario.role})
                            </option>
                          ))}
                        </select>
                      </div>
                      {usuarios.length === 0 && (
                        <p className={`text-xs mt-2 flex items-center gap-1 ${
                          theme === 'dark' ? 'text-red-400' : 'text-red-500'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${
                            theme === 'dark' ? 'bg-red-400' : 'bg-red-500'
                          }`}></span>
                          No hay colaboradores disponibles para asignar. Agrega colaboradores primero.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Parte Derecha - Configuración y Fechas */}
              <div className="flex-1 p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="h-5 w-5 text-orange-600" />
                    <h3 className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Configuración</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Fecha de Inicio */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Fecha de Inicio
                      </label>
                      <div className="relative">
                        <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <input
                          type="date"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          value={formData.fecha_inicio || new Date().toISOString().split('T')[0]}
                          onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Fecha de Finalización */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Fecha de Finalización Estimada
                      </label>
                      <div className="relative">
                        <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <input
                          type="date"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          value={formData.fecha_fin}
                          onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                          min={formData.fecha_inicio || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <p className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        La fecha no puede ser anterior a la fecha de inicio
                      </p>
                    </div>

                    {/* Estado */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Estado del Producto
                      </label>
                      <select
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        value={formData.estado}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      >
                        <option value="activo">🟢 Activo</option>
                        <option value="inactivo">🟡 Inactivo</option>
                        <option value="completado">🔵 Completado</option>
                      </select>
                    </div>

                    {/* Prioridad */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Prioridad
                      </label>
                      <select
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        value={formData.prioridad || 'media'}
                        onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                      >
                        <option value="alta">🔴 Alta</option>
                        <option value="media">🟡 Media</option>
                        <option value="baja">🟢 Baja</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className={`rounded-lg p-4 ${
                  theme === 'dark' 
                    ? 'bg-gray-900/50 border border-gray-700' 
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <h4 className={`text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Información</h4>
                  <div className={`text-xs space-y-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <p>• Todos los campos marcados con * son obligatorios</p>
                    <p>• La fecha actual se establece automáticamente</p>
                    <p>• El responsable recibirá notificaciones del producto</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className={`border-t px-6 py-4 flex justify-end gap-3 ${
              theme === 'dark' 
                ? 'border-gray-600 bg-gray-900/30' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={usuarios.length === 0}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
              </button>
            </div>
          </form>

          {/* Mensaje de Error/Éxito */}
          {error && (
            <div className={`mx-6 mb-4 p-3 rounded-lg text-sm border ${
              error.startsWith('success:') 
                ? theme === 'dark' 
                  ? 'bg-green-900/30 text-green-300 border-green-700' 
                  : 'bg-green-50 text-green-700 border-green-200'
                : theme === 'dark' 
                  ? 'bg-red-900/30 text-red-300 border-red-700' 
                  : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {error.startsWith('success:') ? error.replace('success:', '') : error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalProducto;
