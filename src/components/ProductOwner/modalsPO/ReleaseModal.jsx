import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';

const ReleaseModal = ({ release, onClose, onSave }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    nombre: release?.nombre || '',
    version: release?.version || '',
    descripcion: release?.descripcion || '',
    fecha_objetivo: release?.fecha_objetivo ? release.fecha_objetivo.split('T')[0] : '',
    prioridad: release?.prioridad || 'media',
    notas: release?.notas || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg p-6 w-full max-w-md ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {release ? 'Editar Release' : 'Nuevo Release'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Versión
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              rows="3"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Fecha Objetivo
            </label>
            <input
              type="date"
              value={formData.fecha_objetivo}
              onChange={(e) => setFormData({ ...formData, fecha_objetivo: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Prioridad
            </label>
            <select
              value={formData.prioridad}
              onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 border rounded-lg ${
                theme === 'dark' 
                  ? 'text-gray-300 border-gray-600 hover:bg-gray-700' 
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-white ${
                theme === 'dark' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {release ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReleaseModal;
