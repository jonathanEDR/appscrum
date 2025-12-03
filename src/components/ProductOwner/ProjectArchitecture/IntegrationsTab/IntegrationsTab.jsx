import React, { useState, useCallback, useMemo } from 'react';
import {
  Plug,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  Search,
  ExternalLink,
  Key,
  Globe,
  Cloud,
  Database,
  CreditCard,
  Mail,
  MessageSquare,
  Shield,
  BarChart3,
  Eye,
  EyeOff
} from 'lucide-react';

// Tipos de integración según backend: payment, auth, email, sms, analytics, storage, ai, maps, social, other
const INTEGRATION_TYPES = [
  { value: 'payment', label: 'Pagos', icon: CreditCard },
  { value: 'auth', label: 'Autenticación', icon: Shield },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'sms', label: 'SMS', icon: MessageSquare },
  { value: 'analytics', label: 'Analytics', icon: BarChart3 },
  { value: 'storage', label: 'Storage/CDN', icon: Cloud },
  { value: 'ai', label: 'Inteligencia Artificial', icon: Globe },
  { value: 'maps', label: 'Mapas', icon: Globe },
  { value: 'social', label: 'Redes Sociales', icon: Globe },
  { value: 'other', label: 'Otro', icon: Plug }
];

// Estados de integración según backend: planned, configured, active, deprecated
const INTEGRATION_STATUS = [
  { value: 'planned', label: 'Planificado', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'configured', label: 'Configurado', color: 'bg-blue-100 text-blue-700' },
  { value: 'active', label: 'Activo', color: 'bg-green-100 text-green-700' },
  { value: 'deprecated', label: 'Deprecado', color: 'bg-gray-100 text-gray-700' }
];

// Estructura según backend: name, type, provider, status, api_version, environment_vars, documentation_url, notes
const EMPTY_INTEGRATION = {
  name: '',
  type: 'payment',
  provider: '',
  status: 'planned',
  api_version: '',
  environment_vars: [],
  documentation_url: '',
  notes: ''
};

/**
 * IntegrationsTab - CRUD de Integraciones externas
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.architecture - Arquitectura del proyecto con integraciones
 * @param {Array} props.architecture.integrations - Lista de integraciones
 * @param {Function} props.onAddIntegration - Callback para agregar integración
 * @param {Function} props.onUpdateArchitecture - Callback para actualizar arquitectura
 * @param {boolean} [props.loading=false] - Estado de carga
 * 
 * Tipos de integración: payment, auth, email, sms, analytics, storage, ai, maps, social, other
 * Estados de integración: planned, configured, active, deprecated
 * 
 * environment_vars soporta:
 * - Formato nuevo: [{name: string, value: string, var_type: 'config'|'secret'}]
 * - Formato antiguo: [string] (retrocompatibilidad)
 */
const IntegrationsTab = ({ architecture, onAddIntegration, onUpdateArchitecture, loading = false }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState(EMPTY_INTEGRATION);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Sistema unificado de variables con nombre y valor
  const [newVarName, setNewVarName] = useState(''); // Nombre de la variable (ej: STRIPE_API_KEY)
  const [newVarValue, setNewVarValue] = useState(''); // Valor/descripción (ej: sk_live_xxx o "Clave de producción")
  const [newVarType, setNewVarType] = useState('config'); // Tipo: 'config' o 'secret'
  
  // Variables como objetos { name, value, type }
  const [envVariables, setEnvVariables] = useState([]);
  
  // Control de visibilidad de claves secretas (por índice)
  const [visibleSecrets, setVisibleSecrets] = useState({});

  const integrations = architecture?.integrations || [];

  // Toggle visibilidad de una clave secreta - optimizado con useCallback
  const toggleSecretVisibility = useCallback((index) => {
    setVisibleSecrets(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, []);

  // Filtrar integraciones - optimizado con useMemo
  const filteredIntegrations = useMemo(() => {
    return integrations.map((integration, originalIndex) => ({
      ...integration,
      originalIndex
    })).filter(integration => {
      const matchesSearch = integration.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           integration.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || integration.type === filterType;
      const matchesStatus = filterStatus === 'all' || integration.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [integrations, searchTerm, filterType, filterStatus]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Agregar una nueva variable con nombre y valor
  const handleAddVariable = useCallback(() => {
    const varName = newVarName.trim().toUpperCase();
    const varValue = newVarValue.trim();
    
    if (varName && !envVariables.find(v => v.name === varName)) {
      setEnvVariables(prev => [...prev, {
        name: varName,
        value: varValue,
        type: newVarType
      }]);
      setNewVarName('');
      setNewVarValue('');
      // Mantener el tipo seleccionado para agregar más del mismo tipo
    }
  }, [newVarName, newVarValue, newVarType, envVariables]);

  // Eliminar una variable
  const handleRemoveVariable = useCallback((indexToRemove) => {
    setEnvVariables(prev => prev.filter((_, index) => index !== indexToRemove));
    // También limpiar la visibilidad si era un secreto
    setVisibleSecrets(prev => {
      const updated = { ...prev };
      delete updated[indexToRemove];
      return updated;
    });
  }, []);

  // Manejar Enter en el input
  const handleVarKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddVariable();
    }
  }, [handleAddVariable]);

  // Obtener variables separadas por tipo para mostrar - optimizado con useMemo
  const configVars = useMemo(() => envVariables.filter(v => v.type === 'config'), [envVariables]);
  const secretVars = useMemo(() => envVariables.filter(v => v.type === 'secret'), [envVariables]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convertir variables al formato del backend con objetos completos
      const dataToSave = {
        ...formData,
        environment_vars: envVariables.map(v => ({
          name: v.name,
          value: v.value || '',
          var_type: v.type
        }))
      };

      if (editingIndex !== null) {
        const updatedIntegrations = [...integrations];
        updatedIntegrations[editingIndex] = dataToSave;
        await onUpdateArchitecture({ integrations: updatedIntegrations });
      } else {
        await onAddIntegration(dataToSave);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving integration:', err);
    }
  };

  // Cargar variables existentes al editar (soporta formato antiguo y nuevo)
  const loadExistingVars = (vars) => {
    if (!vars || vars.length === 0) return [];
    
    // Verificar si es el formato nuevo (objetos) o antiguo (strings)
    if (typeof vars[0] === 'object' && vars[0].name) {
      // Formato nuevo: array de objetos { name, value, var_type }
      return vars.map(v => ({
        name: v.name || '',
        value: v.value || '',
        type: v.var_type || 'config'
      }));
    } else {
      // Formato antiguo: array de strings (solo nombres)
      return vars.map(varName => ({
        name: varName,
        value: '',
        type: /SECRET|KEY|TOKEN|PASSWORD|PRIVATE/i.test(varName) ? 'secret' : 'config'
      }));
    }
  };

  const handleEdit = (integration, index) => {
    setEditingIndex(index);
    
    // Cargar variables existentes (soporta ambos formatos)
    const loadedVars = loadExistingVars(integration.environment_vars);
    setEnvVariables(loadedVars);
    
    setFormData({
      name: integration.name || '',
      type: integration.type || 'payment',
      provider: integration.provider || '',
      status: integration.status || 'planned',
      api_version: integration.api_version || '',
      environment_vars: integration.environment_vars || [],
      documentation_url: integration.documentation_url || '',
      notes: integration.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    try {
      const updatedIntegrations = integrations.filter((_, i) => i !== index);
      await onUpdateArchitecture({ integrations: updatedIntegrations });
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting integration:', err);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingIndex(null);
    setFormData(EMPTY_INTEGRATION);
    setNewVarName('');
    setNewVarValue('');
    setNewVarType('config');
    setEnvVariables([]);
    setVisibleSecrets({});
  };

  const getTypeConfig = (type) => {
    return INTEGRATION_TYPES.find(t => t.value === type) || INTEGRATION_TYPES[8];
  };

  const getStatusConfig = (status) => {
    return INTEGRATION_STATUS.find(s => s.value === status) || INTEGRATION_STATUS[2];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plug className="text-orange-600" />
            Integraciones Externas
          </h2>
          <p className="text-gray-600 mt-1">
            Gestiona las integraciones con servicios externos
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          disabled={loading}
        >
          <Plus size={20} />
          Nueva Integración
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar integraciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Todos los tipos</option>
            {INTEGRATION_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Todos los estados</option>
            {INTEGRATION_STATUS.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Integration Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingIndex !== null ? 'Editar Integración' : 'Nueva Integración'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Integración *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="ej: Stripe, SendGrid, Cloudinary"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {INTEGRATION_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {INTEGRATION_STATUS.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Provider & API Version */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proveedor
                  </label>
                  <input
                    type="text"
                    name="provider"
                    value={formData.provider}
                    onChange={handleInputChange}
                    placeholder="ej: Stripe, SendGrid, Twilio, AWS"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Versión de API
                  </label>
                  <input
                    type="text"
                    name="api_version"
                    value={formData.api_version}
                    onChange={handleInputChange}
                    placeholder="ej: v1, 2024-01-01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Documentation URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Documentación
                </label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="url"
                    name="documentation_url"
                    value={formData.documentation_url}
                    onChange={handleInputChange}
                    placeholder="https://docs.service.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Variables de Entorno - Sistema con Nombre y Valor */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Key size={18} className="text-gray-600" />
                  Variables de Entorno Requeridas
                </h4>

                {/* Lista de variables agregadas */}
                {envVariables.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {/* Variables de Configuración */}
                    {configVars.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <span className="text-xs text-blue-600 font-medium flex items-center gap-1 mb-2">
                          <Globe size={12} /> Variables de Configuración ({configVars.length})
                        </span>
                        <div className="space-y-1">
                          {configVars.map((variable, idx) => {
                            const originalIndex = envVariables.findIndex(v => v.name === variable.name);
                            return (
                              <div 
                                key={`config-${idx}`}
                                className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-200"
                              >
                                <div className="flex-1 min-w-0">
                                  <span className="font-mono text-sm text-blue-800 font-medium">{variable.name}</span>
                                  {variable.value && (
                                    <span className="text-gray-500 text-xs ml-2">= {variable.value}</span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariable(originalIndex)}
                                  className="ml-2 text-blue-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Claves Secretas */}
                    {secretVars.length > 0 && (
                      <div className="bg-orange-50 rounded-lg p-3">
                        <span className="text-xs text-orange-600 font-medium flex items-center gap-1 mb-2">
                          🔐 Claves Secretas ({secretVars.length})
                        </span>
                        <div className="space-y-1">
                          {secretVars.map((variable, idx) => {
                            const originalIndex = envVariables.findIndex(v => v.name === variable.name);
                            const isVisible = visibleSecrets[originalIndex];
                            return (
                              <div 
                                key={`secret-${idx}`}
                                className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-orange-200"
                              >
                                <div className="flex-1 min-w-0 flex items-center gap-2">
                                  <span className="font-mono text-sm text-orange-800 font-medium">🔐 {variable.name}</span>
                                  {variable.value && (
                                    <span className="text-gray-500 text-xs font-mono">
                                      = {isVisible ? variable.value : '••••••••'}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  {/* Botón para mostrar/ocultar valor */}
                                  {variable.value && (
                                    <button
                                      type="button"
                                      onClick={() => toggleSecretVisibility(originalIndex)}
                                      className="p-1 text-orange-400 hover:text-orange-600 rounded hover:bg-orange-100"
                                      title={isVisible ? 'Ocultar valor' : 'Mostrar valor'}
                                    >
                                      {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                  )}
                                  {/* Botón para eliminar */}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveVariable(originalIndex)}
                                    className="p-1 text-orange-400 hover:text-red-600 rounded hover:bg-red-50"
                                    title="Eliminar variable"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Formulario para agregar nueva variable */}
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                    {/* Nombre de la variable */}
                    <div className="md:col-span-4">
                      <label className="block text-xs text-gray-500 mb-1">Nombre de Variable</label>
                      <input
                        type="text"
                        value={newVarName}
                        onChange={(e) => setNewVarName(e.target.value.toUpperCase())}
                        onKeyDown={handleVarKeyDown}
                        placeholder="STRIPE_API_KEY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                      />
                    </div>
                    
                    {/* Valor/Descripción */}
                    <div className="md:col-span-4">
                      <label className="block text-xs text-gray-500 mb-1">Valor o Descripción</label>
                      <input
                        type="text"
                        value={newVarValue}
                        onChange={(e) => setNewVarValue(e.target.value)}
                        onKeyDown={handleVarKeyDown}
                        placeholder="sk_live_xxx... o descripción"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                    
                    {/* Tipo */}
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Tipo</label>
                      <select
                        value={newVarType}
                        onChange={(e) => setNewVarType(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm font-medium ${
                          newVarType === 'secret' 
                            ? 'border-orange-300 bg-orange-50 text-orange-700' 
                            : 'border-blue-300 bg-blue-50 text-blue-700'
                        }`}
                      >
                        <option value="config">📋 Config</option>
                        <option value="secret">🔐 Secret</option>
                      </select>
                    </div>
                    
                    {/* Botón Agregar */}
                    <div className="md:col-span-2 flex items-end">
                      <button
                        type="button"
                        onClick={handleAddVariable}
                        disabled={!newVarName.trim()}
                        className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={18} />
                        Agregar
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ⚠️ Las claves secretas nunca deben estar en el código, guárdalas en un archivo .env
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Adicionales
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Información adicional, limitaciones, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.name}
                  className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {editingIndex !== null ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirmar Eliminación</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de eliminar la integración <strong>{confirmDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.index)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Grid */}
      {filteredIntegrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map((integration, index) => {
            const typeConfig = getTypeConfig(integration.type);
            const statusConfig = getStatusConfig(integration.status);
            const TypeIcon = typeConfig.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TypeIcon className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                      <span className="text-xs text-gray-500">{typeConfig.label}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>

                {integration.provider && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Proveedor:</span> {integration.provider}
                  </p>
                )}

                {integration.api_version && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="font-medium">Versión:</span> 
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{integration.api_version}</span>
                  </div>
                )}

                {integration.environment_vars?.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Key size={14} />
                    <span className="font-mono text-xs truncate">
                      {/* Soportar formato nuevo (objetos) y antiguo (strings) */}
                      {typeof integration.environment_vars[0] === 'object' 
                        ? integration.environment_vars.slice(0, 2).map(v => v.name).join(', ')
                        : integration.environment_vars.slice(0, 2).join(', ')
                      }
                      {integration.environment_vars.length > 2 && ` +${integration.environment_vars.length - 2}`}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {integration.documentation_url && (
                      <a
                        href={integration.documentation_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        title="Ver documentación"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(integration, integration.originalIndex)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ ...integration, index: integration.originalIndex })}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Plug size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {integrations.length === 0 ? 'No hay integraciones configuradas' : 'No se encontraron resultados'}
          </h3>
          <p className="text-gray-500 mb-4">
            {integrations.length === 0 
              ? 'Agrega las integraciones externas que usa tu proyecto'
              : 'Intenta ajustar los filtros de búsqueda'
            }
          </p>
          {integrations.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              <Plus size={20} />
              Agregar Primera Integración
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// PropTypes para validación de props
export default IntegrationsTab;
