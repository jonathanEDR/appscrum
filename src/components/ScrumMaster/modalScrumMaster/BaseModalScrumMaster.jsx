import React, { useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

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
  const { theme } = useTheme();
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
        <div className={`inline-block transform overflow-hidden rounded-lg text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full ${maxWidth} sm:align-middle ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
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
              <div className={`border-t px-6 py-4 flex justify-end gap-3 ${
                theme === 'dark' 
                  ? 'border-gray-700 bg-gray-900' 
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
                ? theme === 'dark'
                  ? 'bg-green-900/30 text-green-400 border border-green-800'
                  : 'bg-green-50 text-green-700 border border-green-200'
                : theme === 'dark'
                  ? 'bg-red-900/30 text-red-400 border border-red-800'
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
export const DateField = ({ label, value, onChange, required = false, min, help }) => {
  const { theme } = useTheme();
  
  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label} {required && '*'}
      </label>
      <div className="relative">
        <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`} />
        <input
          type="date"
          required={required}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          value={value || new Date().toISOString().split('T')[0]}
          onChange={onChange}
          min={min}
        />
      </div>
      {help && <p className={`text-xs mt-1 ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
      }`}>{help}</p>}
    </div>
  );
};

export default BaseModalScrumMaster;
