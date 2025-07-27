import React, { useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

const BaseModalScrumMaster = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  formData,
  setFormData,
  handleSubmit,
  editingItem,
  isLoading = false,
  error,
  maxWidth = 'sm:max-w-3xl',
  showDivider = false
}) => {
  // Establecer fecha actual cuando se abre el modal para nuevo item
  useEffect(() => {
    if (isOpen && !editingItem && setFormData) {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        fecha_inicio: prev?.fecha_inicio || today,
        fecha_creacion: prev?.fecha_creacion || today,
        fecha: prev?.fecha || today
      }));
    }
  }, [isOpen, editingItem, setFormData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
          onClick={onClose}
        />

        {/* Modal */}
        <div className={`inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full ${maxWidth} sm:align-middle`}>
          {/* Header del Modal */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {title}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    {subtitle}
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

          {/* Contenido del Modal */}
          {handleSubmit ? (
            <form onSubmit={handleSubmit}>
              {showDivider ? (
                <div className="flex">
                  {children}
                </div>
              ) : (
                <div className="p-6">
                  {children}
                </div>
              )}

              {/* Botones de Acción */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      {editingItem ? '✏️ Actualizar' : '✨ Crear'}
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              {children}
            </div>
          )}

          {/* Mensaje de Error/Éxito */}
          {error && (
            <div className={`mx-6 mb-4 p-3 rounded-lg text-sm ${
              error.startsWith('success:') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {error.startsWith('success:') ? error.replace('success:', '') : error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Hook para fechas automáticas
export const useAutoDate = (isOpen, editingItem, setFormData) => {
  useEffect(() => {
    if (isOpen && !editingItem && setFormData) {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        fecha_inicio: prev?.fecha_inicio || today,
        fecha_creacion: prev?.fecha_creacion || today,
        fecha: prev?.fecha || today
      }));
    }
  }, [isOpen, editingItem, setFormData]);
};

// Componente de campo de fecha reutilizable
export const DateField = ({ label, value, onChange, required = false, min, help }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && '*'}
    </label>
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="date"
        required={required}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        value={value || new Date().toISOString().split('T')[0]}
        onChange={onChange}
        min={min}
      />
    </div>
    {help && <p className="text-xs text-gray-500 mt-1">{help}</p>}
  </div>
);

export default BaseModalScrumMaster;
