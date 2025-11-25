import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const ImpedimentModal = ({ isOpen, onClose, impediment, onSave, teamMembers = [] }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsible: '',
    priority: 'medium',
    category: 'technical',
    status: 'open'
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (impediment) {
        // Editar impedimento existente
        setFormData({
          title: impediment.title || '',
          description: impediment.description || '',
          responsible: impediment.responsible || '',
          priority: impediment.priority || 'medium',
          category: impediment.category || 'technical',
          status: impediment.status || 'open'
        });
      } else {
        // Nuevo impedimento - resetear formulario
        setFormData({
          title: '',
          description: '',
          responsible: '',
          priority: 'medium',
          category: 'technical',
          status: 'open'
        });
      }
    }
  }, [isOpen, impediment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (!formData.title.trim()) {
        throw new Error('El título es obligatorio');
      }
      if (!formData.description.trim()) {
        throw new Error('La descripción es obligatoria');
      }
      if (!formData.responsible.trim()) {
        throw new Error('El responsable es obligatorio');
      }
      
      await onSave(formData);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className={`relative rounded-lg shadow-xl max-w-2xl w-full ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Nuevo Impedimento
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full p-3 border rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Descripción *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full p-3 border rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Responsable *</label>
              {teamMembers && teamMembers.length > 0 ? (
                <select
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  className={`w-full p-3 border rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  <option value="">Seleccionar responsable...</option>
                  {teamMembers.map((member, index) => (
                    <option key={index} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  className={`w-full p-3 border rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Nombre del responsable"
                  required
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full p-3 border rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="technical">Técnico</option>
                  <option value="requirements">Requisitos</option>
                  <option value="external_dependency">Dependencia Externa</option>
                  <option value="resource">Recursos</option>
                  <option value="communication">Comunicación</option>
                </select>
              </div>
            
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Prioridad</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className={`w-full p-3 border rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>

            {error && (
              <div className={`p-3 rounded-lg text-sm ${
                theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700'
              }`}>
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 border rounded-lg ${
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Crear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImpedimentModal;
