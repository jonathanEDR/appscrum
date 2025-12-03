/**
 * DelegationForm Component
 * Formulario para delegar permisos a un agente AI
 */

import { useState, useEffect } from 'react';
import { X, Shield, Calendar, Package, AlertTriangle, CheckCircle2, Globe, Layers } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const DelegationForm = ({ 
  agent, 
  isOpen, 
  onClose, 
  onSubmit, 
  availablePermissions = [],
  userProducts = [],
  userSprints = []
}) => {
  const { theme } = useTheme();

  // Estado del formulario
  const [formData, setFormData] = useState({
    selectedPermissions: [],
    scopeType: 'global', // 'global', 'product', 'sprint'
    scopeProductId: '',
    scopeSprintId: '',
    limits: {
      maxActions: 100,
      maxCostPerAction: 1.0,
      maxConcurrentTasks: 3
    },
    duration: 'permanent', // 'temporary', 'permanent'
    expiresAt: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resetear formulario cuando cambia el agente
  useEffect(() => {
    if (agent) {
      setFormData({
        selectedPermissions: agent.requiredPermissions || [],
        scopeType: 'global',
        scopeProductId: '',
        scopeSprintId: '',
        limits: {
          maxActions: 100,
          maxCostPerAction: 1.0,
          maxConcurrentTasks: 3
        },
        duration: 'permanent',
        expiresAt: ''
      });
      setErrors({});
    }
  }, [agent]);

  if (!isOpen || !agent) return null;

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (formData.selectedPermissions.length === 0) {
      newErrors.permissions = 'Debes seleccionar al menos un permiso';
    }

    if (formData.scopeType === 'product' && !formData.scopeProductId) {
      newErrors.scope = 'Debes seleccionar un producto';
    }

    if (formData.scopeType === 'sprint' && !formData.scopeSprintId) {
      newErrors.scope = 'Debes seleccionar un sprint';
    }

    if (formData.duration === 'temporary' && !formData.expiresAt) {
      newErrors.duration = 'Debes especificar una fecha de expiración';
    }

    if (formData.limits.maxActions < 1) {
      newErrors.maxActions = 'El número de acciones debe ser mayor a 0';
    }

    if (formData.limits.maxCostPerAction < 0) {
      newErrors.maxCost = 'El costo no puede ser negativo';
    }

    if (formData.limits.maxConcurrentTasks < 1 || formData.limits.maxConcurrentTasks > 10) {
      newErrors.maxTasks = 'Las tareas concurrentes deben estar entre 1 y 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en checkboxes de permisos
  const handlePermissionToggle = (permission) => {
    setFormData(prev => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.includes(permission)
        ? prev.selectedPermissions.filter(p => p !== permission)
        : [...prev.selectedPermissions, permission]
    }));
  };

  // Seleccionar/Deseleccionar todos los permisos
  const toggleAllPermissions = () => {
    if (formData.selectedPermissions.length === availablePermissions.length) {
      setFormData(prev => ({ ...prev, selectedPermissions: [] }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        selectedPermissions: availablePermissions.map(p => p.name) 
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Construir objeto de delegación
      const delegationData = {
        agentType: agent.type,
        permissions: formData.selectedPermissions,
        scope: {
          type: formData.scopeType,
          ...(formData.scopeType === 'product' && { productId: formData.scopeProductId }),
          ...(formData.scopeType === 'sprint' && { sprintId: formData.scopeSprintId })
        },
        limits: formData.limits,
        ...(formData.duration === 'temporary' && { expiresAt: new Date(formData.expiresAt) })
      };

      await onSubmit(delegationData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Error al crear delegación' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Colores según el tipo de agente
  const typeColors = {
    'product-owner': 'bg-purple-500',
    'scrum-master': 'bg-blue-500',
    'developer': 'bg-green-500',
    'orchestrator': 'bg-orange-500'
  };

  const agentColor = typeColors[agent.type] || 'bg-gray-500';

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className={`
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden
          flex flex-col
        `}
      >
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className={`${agentColor} p-2 rounded-lg`}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Delegar Permisos
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {agent.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`
              p-2 rounded-lg transition-colors
              ${theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}
            `}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Permisos */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Permisos a Delegar *
              </label>
              <button
                type="button"
                onClick={toggleAllPermissions}
                className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                {formData.selectedPermissions.length === availablePermissions.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </button>
            </div>
            
            {availablePermissions.length > 0 ? (
              <div className={`
                p-4 rounded-lg border max-h-60 overflow-y-auto
                ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-300'}
              `}>
                <div className="space-y-2">
                  {availablePermissions.map((permission) => (
                    <label
                      key={permission.name}
                      className={`
                        flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors
                        ${formData.selectedPermissions.includes(permission.name)
                          ? theme === 'dark' ? 'bg-gray-600' : 'bg-blue-50 border border-blue-200'
                          : theme === 'dark' ? 'hover:bg-gray-600/50' : 'hover:bg-gray-100'}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedPermissions.includes(permission.name)}
                        onChange={() => handlePermissionToggle(permission.name)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {permission.name}
                        </div>
                        {permission.description && (
                          <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {permission.description}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`
                p-4 rounded-lg text-center
                ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
              `}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Cargando permisos disponibles...
                </p>
              </div>
            )}
            
            {errors.permissions && (
              <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{errors.permissions}</span>
              </p>
            )}
          </section>

          {/* Alcance (Scope) */}
          <section>
            <label className={`text-sm font-semibold mb-3 block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Alcance de la Delegación *
            </label>
            
            <div className="space-y-3">
              {/* Global */}
              <label className={`
                flex items-center space-x-3 p-4 rounded-lg cursor-pointer border-2 transition-all
                ${formData.scopeType === 'global'
                  ? `${agentColor} bg-opacity-10 border-current`
                  : theme === 'dark' ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-300 hover:border-gray-400'}
              `}>
                <input
                  type="radio"
                  name="scopeType"
                  value="global"
                  checked={formData.scopeType === 'global'}
                  onChange={(e) => setFormData(prev => ({ ...prev, scopeType: e.target.value, scopeProductId: '', scopeSprintId: '' }))}
                />
                <Globe className={`w-5 h-5 ${formData.scopeType === 'global' ? 'text-current' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="flex-1">
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Global
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    El agente podrá actuar en todos los productos y sprints
                  </div>
                </div>
              </label>

              {/* Producto Específico */}
              <label className={`
                flex items-center space-x-3 p-4 rounded-lg cursor-pointer border-2 transition-all
                ${formData.scopeType === 'product'
                  ? `${agentColor} bg-opacity-10 border-current`
                  : theme === 'dark' ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-300 hover:border-gray-400'}
              `}>
                <input
                  type="radio"
                  name="scopeType"
                  value="product"
                  checked={formData.scopeType === 'product'}
                  onChange={(e) => setFormData(prev => ({ ...prev, scopeType: e.target.value, scopeSprintId: '' }))}
                />
                <Package className={`w-5 h-5 ${formData.scopeType === 'product' ? 'text-current' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="flex-1">
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Producto Específico
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Limitar al agente a un producto concreto
                  </div>
                </div>
              </label>

              {formData.scopeType === 'product' && (
                <select
                  value={formData.scopeProductId}
                  onChange={(e) => setFormData(prev => ({ ...prev, scopeProductId: e.target.value }))}
                  className={`
                    w-full px-4 py-2 rounded-lg border ml-10 mt-2
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                  `}
                >
                  <option value="">Seleccionar producto...</option>
                  {userProducts.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Sprint Específico */}
              <label className={`
                flex items-center space-x-3 p-4 rounded-lg cursor-pointer border-2 transition-all
                ${formData.scopeType === 'sprint'
                  ? `${agentColor} bg-opacity-10 border-current`
                  : theme === 'dark' ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-300 hover:border-gray-400'}
              `}>
                <input
                  type="radio"
                  name="scopeType"
                  value="sprint"
                  checked={formData.scopeType === 'sprint'}
                  onChange={(e) => setFormData(prev => ({ ...prev, scopeType: e.target.value, scopeProductId: '' }))}
                />
                <Layers className={`w-5 h-5 ${formData.scopeType === 'sprint' ? 'text-current' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="flex-1">
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Sprint Específico
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Limitar al agente a un sprint concreto
                  </div>
                </div>
              </label>

              {formData.scopeType === 'sprint' && (
                <select
                  value={formData.scopeSprintId}
                  onChange={(e) => setFormData(prev => ({ ...prev, scopeSprintId: e.target.value }))}
                  className={`
                    w-full px-4 py-2 rounded-lg border ml-10 mt-2
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                  `}
                >
                  <option value="">Seleccionar sprint...</option>
                  {userSprints.map(sprint => (
                    <option key={sprint._id} value={sprint._id}>
                      {sprint.name} - {sprint.product?.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {errors.scope && (
              <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{errors.scope}</span>
              </p>
            )}
          </section>

          {/* Límites */}
          <section>
            <label className={`text-sm font-semibold mb-3 block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Límites de Uso
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`text-xs mb-1 block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Máx. Acciones
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.limits.maxActions}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    limits: { ...prev.limits, maxActions: parseInt(e.target.value) || 0 }
                  }))}
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                  `}
                />
                {errors.maxActions && (
                  <p className="text-red-500 text-xs mt-1">{errors.maxActions}</p>
                )}
              </div>

              <div>
                <label className={`text-xs mb-1 block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Costo Máx./Acción ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.limits.maxCostPerAction}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    limits: { ...prev.limits, maxCostPerAction: parseFloat(e.target.value) || 0 }
                  }))}
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                  `}
                />
                {errors.maxCost && (
                  <p className="text-red-500 text-xs mt-1">{errors.maxCost}</p>
                )}
              </div>

              <div>
                <label className={`text-xs mb-1 block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tareas Concurrentes
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.limits.maxConcurrentTasks}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    limits: { ...prev.limits, maxConcurrentTasks: parseInt(e.target.value) || 1 }
                  }))}
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                  `}
                />
                {errors.maxTasks && (
                  <p className="text-red-500 text-xs mt-1">{errors.maxTasks}</p>
                )}
              </div>
            </div>
          </section>

          {/* Duración */}
          <section>
            <label className={`text-sm font-semibold mb-3 block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Duración de la Delegación
            </label>
            
            <div className="space-y-3">
              <label className={`
                flex items-center space-x-3 p-4 rounded-lg cursor-pointer border-2 transition-all
                ${formData.duration === 'permanent'
                  ? `${agentColor} bg-opacity-10 border-current`
                  : theme === 'dark' ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-300 hover:border-gray-400'}
              `}>
                <input
                  type="radio"
                  name="duration"
                  value="permanent"
                  checked={formData.duration === 'permanent'}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value, expiresAt: '' }))}
                />
                <CheckCircle2 className={`w-5 h-5 ${formData.duration === 'permanent' ? 'text-current' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="flex-1">
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Permanente
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    La delegación estará activa hasta que la revoques manualmente
                  </div>
                </div>
              </label>

              <label className={`
                flex items-center space-x-3 p-4 rounded-lg cursor-pointer border-2 transition-all
                ${formData.duration === 'temporary'
                  ? `${agentColor} bg-opacity-10 border-current`
                  : theme === 'dark' ? 'bg-gray-700/50 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-300 hover:border-gray-400'}
              `}>
                <input
                  type="radio"
                  name="duration"
                  value="temporary"
                  checked={formData.duration === 'temporary'}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
                <Calendar className={`w-5 h-5 ${formData.duration === 'temporary' ? 'text-current' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <div className="flex-1">
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Temporal
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    La delegación expirará automáticamente en la fecha especificada
                  </div>
                </div>
              </label>

              {formData.duration === 'temporary' && (
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                  className={`
                    w-full px-4 py-2 rounded-lg border ml-10 mt-2
                    ${theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'}
                  `}
                />
              )}
            </div>

            {errors.duration && (
              <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{errors.duration}</span>
              </p>
            )}
          </section>

          {/* Error General */}
          {errors.submit && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{errors.submit}</span>
              </p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className={`
          px-6 py-4 border-t flex items-center justify-between
          ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}
        `}>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800'
                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 disabled:bg-gray-100'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all
              flex items-center space-x-2
              ${agentColor} text-white hover:opacity-90
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg hover:shadow-xl
            `}
          >
            <Shield className="w-4 h-4" />
            <span>{isSubmitting ? 'Creando...' : 'Crear Delegación'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
