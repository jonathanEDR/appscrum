import React, { useState } from 'react';

const SprintModal = ({ sprint, releases, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: sprint?.nombre || '',
    objetivo: sprint?.objetivo || '',
  fecha_inicio: sprint?.fecha_inicio ? (typeof sprint.fecha_inicio === 'string' ? sprint.fecha_inicio.split('T')[0] : new Date(sprint.fecha_inicio).toISOString().split('T')[0]) : '',
  fecha_fin: sprint?.fecha_fin ? (typeof sprint.fecha_fin === 'string' ? sprint.fecha_fin.split('T')[0] : new Date(sprint.fecha_fin).toISOString().split('T')[0]) : '',
    velocidad_planificada: sprint?.velocidad_planificada || 0,
    // NUEVOS CAMPOS - Mejoras Implementadas
    release_id: sprint?.release_id || '',
    prioridad: sprint?.prioridad || 'media',
    capacidad_equipo: sprint?.capacidad_equipo || 0,
    progreso: sprint?.progreso || 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {sprint ? 'Editar Sprint' : 'Nuevo Sprint'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objetivo
            </label>
            <textarea
              value={formData.objetivo}
              onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          {/* NUEVOS CAMPOS - Release y Prioridad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Release Asociado (Opcional)
              </label>
              <select
                value={formData.release_id}
                onChange={(e) => setFormData({ ...formData, release_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sprint Independiente</option>
                {releases?.map(release => (
                  <option key={release._id} value={release._id}>
                    {release.nombre} (v{release.version})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                value={formData.prioridad}
                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="baja">🟢 Baja</option>
                <option value="media">🟡 Media</option>
                <option value="alta">🟠 Alta</option>
                <option value="critica">🔴 Crítica</option>
              </select>
            </div>
          </div>
          
          {/* Capacidad del Equipo y Progreso */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad Equipo (horas)
              </label>
              <input
                type="number"
                value={formData.capacidad_equipo}
                onChange={(e) => setFormData({ ...formData, capacidad_equipo: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="160"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progreso (%)
              </label>
              <input
                type="number"
                value={formData.progreso}
                onChange={(e) => setFormData({ ...formData, progreso: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                placeholder="0"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Velocidad Planificada
            </label>
            <input
              type="number"
              value={formData.velocidad_planificada}
              onChange={(e) => setFormData({ ...formData, velocidad_planificada: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {sprint ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SprintModal;
