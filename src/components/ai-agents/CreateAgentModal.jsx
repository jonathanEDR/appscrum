/**
 * CreateAgentModal Component
 * Modal para crear un nuevo agente AI personalizado
 * Sigue el schema correcto del modelo Agent del backend
 */

import { useState } from 'react';
import { X, Bot, AlertTriangle, Plus, Minus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const CreateAgentModal = ({ isOpen, onClose, onSubmit }) => {
  const { theme } = useTheme();

  // Estado del formulario siguiendo el schema Agent
  const [formData, setFormData] = useState({
    type: 'product_owner',
    name: '',
    display_name: '',
    description: '',
    status: 'active',
    version: '1.0.0',
    capabilities: [{
      name: '',
      description: '',
      requires_permission: '',
      enabled: true
    }],
    configuration: {
      provider: 'openai',
      model: 'gpt-4-turbo',
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    },
    system_prompt: '',
    context_requirements: {
      needs_product_data: true,
      needs_backlog_data: true,
      needs_sprint_data: false,
      needs_team_data: false,
      needs_metrics_data: false
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Validación
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre técnico es requerido';
    } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
      newErrors.name = 'Solo minúsculas, números y guiones';
    }

    if (!formData.display_name.trim()) {
      newErrors.display_name = 'El nombre para mostrar es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.system_prompt.trim()) {
      newErrors.system_prompt = 'El system prompt es requerido';
    }

    // Validar que haya al menos una capability con datos
    const validCapabilities = formData.capabilities.filter(
      cap => cap.name.trim() && cap.description.trim()
    );
    if (validCapabilities.length === 0) {
      newErrors.capabilities = 'Debes agregar al menos una capacidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleConfigChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      configuration: { ...prev.configuration, [field]: value }
    }));
  };

  const handleContextChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      context_requirements: { ...prev.context_requirements, [field]: value }
    }));
  };

  // Capabilities handlers
  const handleCapabilityChange = (index, field, value) => {
    const newCapabilities = [...formData.capabilities];
    newCapabilities[index] = { ...newCapabilities[index], [field]: value };
    setFormData(prev => ({ ...prev, capabilities: newCapabilities }));
    if (errors.capabilities) {
      setErrors(prev => ({ ...prev, capabilities: undefined }));
    }
  };

  const addCapability = () => {
    setFormData(prev => ({
      ...prev,
      capabilities: [...prev.capabilities, { name: '', description: '', requires_permission: '', enabled: true }]
    }));
  };

  const removeCapability = (index) => {
    if (formData.capabilities.length > 1) {
      setFormData(prev => ({
        ...prev,
        capabilities: prev.capabilities.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Limpiar capabilities vacías
      const cleanedData = {
        ...formData,
        capabilities: formData.capabilities.filter(
          cap => cap.name.trim() && cap.description.trim()
        )
      };

      await onSubmit(cleanedData);
      onClose();
    } catch (error) {
      console.error('Error al crear agente:', error);
      setErrors({ submit: error.message || 'Error al crear el agente' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`
            relative w-full max-w-4xl transform overflow-hidden rounded-2xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
            shadow-2xl transition-all
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`
            flex items-center justify-between p-6 border-b
            ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Crear Nuevo Agente AI
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Define un asistente personalizado para tu equipo
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`
                p-2 rounded-xl transition-colors
                ${theme === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Error general */}
            {errors.submit && (
              <div className={`
                flex items-center space-x-2 p-4 rounded-xl
                ${theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}
              `}>
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-500">{errors.submit}</p>
              </div>
            )}

            {/* Información básica */}
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Información Básica
              </h3>

              {/* Tipo */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tipo de Agente *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors
                    ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20
                  `}
                >
                  <option value="product_owner">Product Owner</option>
                  <option value="scrum_master">Scrum Master</option>
                  <option value="developer">Developer</option>
                  <option value="tester">Tester</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>

              {/* Nombre técnico */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nombre Técnico * <span className="text-xs text-gray-500">(minúsculas, números, guiones)</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value.toLowerCase())}
                  placeholder="ej: mi-agente-personalizado"
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors
                    ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }
                    ${errors.name ? 'border-red-500' : 'focus:border-purple-500'}
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20
                  `}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Display name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nombre para Mostrar *
                </label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => handleChange('display_name', e.target.value)}
                  placeholder="ej: Mi Agente Personalizado"
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors
                    ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }
                    ${errors.display_name ? 'border-red-500' : 'focus:border-purple-500'}
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20
                  `}
                />
                {errors.display_name && <p className="mt-1 text-sm text-red-500">{errors.display_name}</p>}
              </div>

              {/* Descripción */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe las capacidades y propósito del agente..."
                  rows={3}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors resize-none
                    ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }
                    ${errors.description ? 'border-red-500' : 'focus:border-purple-500'}
                    focus:outline-none focus:ring-2 focus:ring-purple-500/20
                  `}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
            </div>

            {/* Capacidades */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Capacidades *
                </h3>
                <button
                  type="button"
                  onClick={addCapability}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar</span>
                </button>
              </div>

              {formData.capabilities.map((capability, index) => (
                <div 
                  key={index} 
                  className={`
                    p-4 rounded-xl border space-y-3
                    ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Capacidad {index + 1}
                    </span>
                    {formData.capabilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCapability(index)}
                        className="p-1 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={capability.name}
                    onChange={(e) => handleCapabilityChange(index, 'name', e.target.value)}
                    placeholder="Nombre de la capacidad (ej: create_user_story)"
                    className={`
                      w-full px-3 py-2 rounded-lg border text-sm transition-colors
                      ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }
                      focus:outline-none focus:border-purple-500
                    `}
                  />

                  <textarea
                    value={capability.description}
                    onChange={(e) => handleCapabilityChange(index, 'description', e.target.value)}
                    placeholder="Descripción de la capacidad..."
                    rows={2}
                    className={`
                      w-full px-3 py-2 rounded-lg border text-sm transition-colors resize-none
                      ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }
                      focus:outline-none focus:border-purple-500
                    `}
                  />

                  <input
                    type="text"
                    value={capability.requires_permission}
                    onChange={(e) => handleCapabilityChange(index, 'requires_permission', e.target.value)}
                    placeholder="Permiso requerido (opcional, ej: canCreateBacklogItems)"
                    className={`
                      w-full px-3 py-2 rounded-lg border text-sm transition-colors
                      ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }
                      focus:outline-none focus:border-purple-500
                    `}
                  />
                </div>
              ))}
              {errors.capabilities && <p className="text-sm text-red-500">{errors.capabilities}</p>}
            </div>

            {/* Configuración del modelo AI */}
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Configuración del Modelo AI
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Provider */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Proveedor
                  </label>
                  <select
                    value={formData.configuration.provider}
                    onChange={(e) => handleConfigChange('provider', e.target.value)}
                    className={`
                      w-full px-3 py-2 rounded-lg border transition-colors
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                      focus:outline-none focus:border-purple-500
                    `}
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="google">Google</option>
                    <option value="cohere">Cohere</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Modelo
                  </label>
                  <select
                    value={formData.configuration.model}
                    onChange={(e) => handleConfigChange('model', e.target.value)}
                    className={`
                      w-full px-3 py-2 rounded-lg border transition-colors
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                      focus:outline-none focus:border-purple-500
                    `}
                  >
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                  </select>
                </div>

                {/* Temperature */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Temperature: {formData.configuration.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.configuration.temperature}
                    onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Preciso</span>
                    <span>Creativo</span>
                  </div>
                </div>

                {/* Max Tokens */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    value={formData.configuration.max_tokens}
                    onChange={(e) => handleConfigChange('max_tokens', parseInt(e.target.value))}
                    min="100"
                    max="8000"
                    step="100"
                    className={`
                      w-full px-3 py-2 rounded-lg border transition-colors
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                      focus:outline-none focus:border-purple-500
                    `}
                  />
                </div>
              </div>
            </div>

            {/* System Prompt */}
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                System Prompt *
              </h3>
              <textarea
                value={formData.system_prompt}
                onChange={(e) => handleChange('system_prompt', e.target.value)}
                placeholder="Define el comportamiento y personalidad del agente..."
                rows={5}
                className={`
                  w-full px-4 py-3 rounded-xl border transition-colors resize-none font-mono text-sm
                  ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }
                  ${errors.system_prompt ? 'border-red-500' : 'focus:border-purple-500'}
                  focus:outline-none focus:ring-2 focus:ring-purple-500/20
                `}
              />
              {errors.system_prompt && <p className="text-sm text-red-500">{errors.system_prompt}</p>}
            </div>

            {/* Requerimientos de contexto */}
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Requerimientos de Contexto
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(formData.context_requirements).map(([key, value]) => {
                  if (typeof value !== 'boolean') return null;
                  return (
                    <label key={key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleContextChange(key, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                      />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {key.replace('needs_', '').replace(/_/g, ' ')}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className={`
                  px-6 py-2.5 rounded-xl font-medium transition-colors
                  ${theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-6 py-2.5 rounded-xl font-medium text-white
                  bg-gradient-to-r from-purple-500 to-blue-500
                  hover:from-purple-600 hover:to-blue-600
                  transition-all transform hover:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  flex items-center space-x-2
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Crear Agente</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
