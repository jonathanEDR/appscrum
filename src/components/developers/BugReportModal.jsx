import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  X, 
  Bug, 
  FileText, 
  Camera,
  Send,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useBugReports } from '../../hooks/useBugReports';
import { useDeveloperTasks } from '../../hooks/useDeveloperTasks';

const BugReportModal = ({ isOpen, onClose }) => {
  const { createBugReport, loading } = useBugReports();
  const { tasks } = useDeveloperTasks();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    severity: 'major',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    environment: '',
    relatedTask: '',
    attachments: []
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (!formData.actualBehavior.trim()) {
      newErrors.actualBehavior = 'Describir el comportamiento actual es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await createBugReport(formData);
        
        // Resetear formulario
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          severity: 'major',
          stepsToReproduce: '',
          expectedBehavior: '',
          actualBehavior: '',
          environment: '',
          relatedTask: '',
          attachments: []
        });
        
        onClose();
      } catch (error) {
        console.error('Error creando bug report:', error);
      }
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Bug className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Reportar Bug</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del Bug *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Describe brevemente el problema..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Severidad y Prioridad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severidad
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="minor">Menor</option>
                <option value="major">Mayor</option>
                <option value="critical">Crítica</option>
                <option value="blocker">Bloqueante</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
          </div>

          {/* Tarea Relacionada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarea Relacionada (opcional)
            </label>
            <select
              name="relatedTask"
              value={formData.relatedTask}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Ninguna - Bug general del sistema</option>
              {tasks && tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.titulo || task.title} - {task.status}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Selecciona la tarea específica a la que está relacionado este bug
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción General *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Proporciona una descripción detallada del problema..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Pasos para reproducir */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pasos para Reproducir
            </label>
            <textarea
              name="stepsToReproduce"
              value={formData.stepsToReproduce}
              onChange={handleInputChange}
              rows={3}
              placeholder="1. Ir a...&#10;2. Hacer clic en...&#10;3. Observar que..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Comportamiento esperado vs actual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comportamiento Esperado
              </label>
              <textarea
                name="expectedBehavior"
                value={formData.expectedBehavior}
                onChange={handleInputChange}
                rows={3}
                placeholder="¿Qué debería pasar?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comportamiento Actual *
              </label>
              <textarea
                name="actualBehavior"
                value={formData.actualBehavior}
                onChange={handleInputChange}
                rows={3}
                placeholder="¿Qué está pasando realmente?"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.actualBehavior ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.actualBehavior && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.actualBehavior}
                </p>
              )}
            </div>
          </div>

          {/* Entorno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entorno
            </label>
            <input
              type="text"
              name="environment"
              value={formData.environment}
              onChange={handleInputChange}
              placeholder="Browser, OS, versión de la app, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Archivos adjuntos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivos Adjuntos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                accept="image/*,.pdf,.txt,.log"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Camera className="h-8 w-8" />
                <span className="text-sm font-medium">Haz clic para subir archivos</span>
                <span className="text-xs text-gray-500">Screenshots, logs, etc.</span>
              </label>
              
              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Reportando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Reportar Bug
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BugReportModal;
