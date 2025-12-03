import React, { useState } from 'react';
import {
  Workflow,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  Search,
  Filter,
  Lock,
  Unlock,
  Copy,
  CheckCircle
} from 'lucide-react';

const HTTP_METHODS = [
  { value: 'GET', label: 'GET', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'POST', label: 'POST', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'PUT', label: 'PUT', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'PATCH', label: 'PATCH', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'DELETE', label: 'DELETE', color: 'bg-red-100 text-red-700 border-red-200' }
];

// Estados válidos según el modelo del backend
const ENDPOINT_STATUS = [
  { value: 'planned', label: 'Planificado', color: 'bg-blue-100 text-blue-700' },
  { value: 'in_development', label: 'En Desarrollo', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'implemented', label: 'Implementado', color: 'bg-green-100 text-green-700' },
  { value: 'testing', label: 'En Pruebas', color: 'bg-purple-100 text-purple-700' },
  { value: 'deprecated', label: 'Deprecado', color: 'bg-red-100 text-red-700' }
];

const EMPTY_ENDPOINT = {
  method: 'GET',
  path: '',
  description: '',
  module: '',
  auth_required: true,
  request_body: '',
  response_example: '',
  status: 'planned'
};

/**
 * EndpointsTab - CRUD de Endpoints API
 */
const EndpointsTab = ({ architecture, onAddEndpoint, onUpdateEndpoints, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState(EMPTY_ENDPOINT);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterAuth, setFilterAuth] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [copiedPath, setCopiedPath] = useState(null);
  const [showPathSuggestions, setShowPathSuggestions] = useState(false);

  const endpoints = architecture?.api_endpoints || [];
  const modules = architecture?.modules || [];

  // Obtener paths base únicos de los endpoints existentes agrupados por módulo
  const getModuleBasePaths = (moduleName) => {
    const moduleEndpoints = endpoints.filter(ep => ep.module === moduleName);
    const basePaths = new Set();
    
    moduleEndpoints.forEach(ep => {
      if (ep.path) {
        // Extraer la ruta base (hasta el segundo /)
        const parts = ep.path.split('/').filter(p => p);
        if (parts.length >= 2) {
          basePaths.add(`/${parts[0]}/${parts[1]}`);
        } else if (parts.length === 1) {
          basePaths.add(`/${parts[0]}`);
        }
      }
    });
    
    return Array.from(basePaths);
  };

  // Generar sugerencias de path basadas en el módulo seleccionado
  const getPathSuggestions = () => {
    const suggestions = [];
    const selectedModule = formData.module;
    
    if (selectedModule) {
      // Buscar paths existentes para este módulo
      const modulePaths = getModuleBasePaths(selectedModule);
      suggestions.push(...modulePaths);
      
      // Si no hay paths, generar sugerencia basada en el nombre del módulo
      if (modulePaths.length === 0) {
        const moduleSlug = selectedModule.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        suggestions.push(`/api/${moduleSlug}`);
        suggestions.push(`/api/v1/${moduleSlug}`);
      }
    }
    
    // Agregar paths comunes si no hay módulo seleccionado
    if (!selectedModule) {
      // Obtener todos los paths base únicos
      const allBasePaths = new Set();
      endpoints.forEach(ep => {
        if (ep.path) {
          const parts = ep.path.split('/').filter(p => p);
          if (parts.length >= 2) {
            allBasePaths.add(`/${parts[0]}/${parts[1]}`);
          }
        }
      });
      suggestions.push(...Array.from(allBasePaths));
      
      // Si no hay ninguno, sugerir rutas comunes
      if (suggestions.length === 0) {
        suggestions.push('/api/v1');
        suggestions.push('/api');
      }
    }
    
    // Filtrar por lo que el usuario está escribiendo
    const currentPath = formData.path.toLowerCase();
    return suggestions.filter(s => 
      s.toLowerCase().includes(currentPath) || currentPath === '' || currentPath === '/'
    ).slice(0, 5);
  };

  // Manejar cambio de módulo - autocompletar path
  const handleModuleChange = (e) => {
    const moduleName = e.target.value;
    setFormData(prev => ({
      ...prev,
      module: moduleName
    }));
    
    // Si se selecciona un módulo y el path está vacío, sugerir un path
    if (moduleName && (!formData.path || formData.path === '/')) {
      const basePaths = getModuleBasePaths(moduleName);
      if (basePaths.length > 0) {
        setFormData(prev => ({
          ...prev,
          module: moduleName,
          path: basePaths[0] + '/'
        }));
      } else {
        // Generar path basado en el nombre del módulo
        const moduleSlug = moduleName.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        setFormData(prev => ({
          ...prev,
          module: moduleName,
          path: `/api/${moduleSlug}/`
        }));
      }
    }
  };

  // Agrupar endpoints por módulo - guardar índice original

  // Agrupar endpoints por módulo - guardar índice original
  const groupedEndpoints = {};
  let filteredCount = 0;
  
  endpoints.forEach((endpoint, originalIdx) => {
    // Solo incluir si pasa los filtros
    const matchesSearch = endpoint.path?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'all' || endpoint.method === filterMethod;
    const matchesAuth = filterAuth === 'all' || 
                       (filterAuth === 'auth' && endpoint.auth_required) ||
                       (filterAuth === 'public' && !endpoint.auth_required);
    
    if (matchesSearch && matchesMethod && matchesAuth) {
      const module = endpoint.module || 'Sin módulo';
      if (!groupedEndpoints[module]) groupedEndpoints[module] = [];
      groupedEndpoints[module].push({ ...endpoint, originalIndex: originalIdx });
      filteredCount++;
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Asegurar que el path comience con /
  const normalizePath = (path) => {
    if (!path) return '';
    const trimmedPath = path.trim();
    return trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Normalizar el path antes de enviar
    const normalizedFormData = {
      ...formData,
      path: normalizePath(formData.path)
    };
    
    try {
      if (editingIndex !== null) {
        // Actualizar endpoint existente
        const updatedEndpoints = [...endpoints];
        updatedEndpoints[editingIndex] = normalizedFormData;
        await onUpdateEndpoints(updatedEndpoints);
      } else {
        // Agregar nuevo endpoint
        await onAddEndpoint(normalizedFormData);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving endpoint:', err);
    }
  };

  const handleEdit = (endpoint, index) => {
    setEditingIndex(index);
    setFormData({
      method: endpoint.method || 'GET',
      path: endpoint.path || '',
      description: endpoint.description || '',
      module: endpoint.module || '',
      auth_required: endpoint.auth_required !== false,
      request_body: endpoint.request_body || '',
      response_example: endpoint.response_example || '',
      status: endpoint.status || 'planned'
    });
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    try {
      const updatedEndpoints = endpoints.filter((_, i) => i !== index);
      await onUpdateEndpoints(updatedEndpoints);
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting endpoint:', err);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingIndex(null);
    setFormData(EMPTY_ENDPOINT);
  };

  const copyToClipboard = (path) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const getMethodConfig = (method) => {
    return HTTP_METHODS.find(m => m.value === method) || HTTP_METHODS[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Workflow className="text-green-600" />
            Endpoints API
          </h2>
          <p className="text-gray-600 mt-1">
            Documenta los endpoints de tu API REST
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            <Plus size={20} />
            Nuevo Endpoint
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por path o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Method Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todos los métodos</option>
              {HTTP_METHODS.map(method => (
                <option key={method.value} value={method.value}>{method.label}</option>
              ))}
            </select>
          </div>

          {/* Auth Filter */}
          <select
            value={filterAuth}
            onChange={(e) => setFilterAuth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Auth: Todos</option>
            <option value="auth">Requiere Auth</option>
            <option value="public">Público</option>
          </select>
        </div>
      </div>

      {/* Endpoint Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingIndex !== null ? 'Editar Endpoint' : 'Nuevo Endpoint'}
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
              {/* Method & Path */}
              <div className="flex gap-4">
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método *
                  </label>
                  <select
                    name="method"
                    value={formData.method}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {HTTP_METHODS.map(method => (
                      <option key={method.value} value={method.value}>{method.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Path * <span className="text-gray-400 text-xs">(debe comenzar con /)</span>
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 font-mono">
                      /
                    </span>
                    <input
                      type="text"
                      name="path"
                      value={formData.path.startsWith('/') ? formData.path.slice(1) : formData.path}
                      onChange={(e) => {
                        const value = e.target.value;
                        const cleanValue = value.startsWith('/') ? value.slice(1) : value;
                        setFormData(prev => ({
                          ...prev,
                          path: `/${cleanValue}`
                        }));
                      }}
                      onFocus={() => setShowPathSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowPathSuggestions(false), 200)}
                      required
                      placeholder="api/v1/resource"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-500 font-mono"
                    />
                  </div>
                  
                  {/* Path Suggestions Dropdown */}
                  {showPathSuggestions && getPathSuggestions().length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      <div className="p-2 border-b border-gray-100">
                        <span className="text-xs text-gray-500 font-medium">Rutas sugeridas:</span>
                      </div>
                      {getPathSuggestions().map((suggestion, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-green-50 text-sm font-mono text-gray-700 flex items-center gap-2"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              path: suggestion + '/'
                            }));
                            setShowPathSuggestions(false);
                          }}
                        >
                          <span className="text-green-600">{suggestion}</span>
                          <span className="text-gray-400 text-xs">+ agregar recurso</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descripción breve del endpoint"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Module - Primero para que autocomplete el path */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Módulo Asociado
                  </label>
                  <select
                    name="module"
                    value={formData.module}
                    onChange={handleModuleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sin módulo</option>
                    {modules.map((mod, idx) => (
                      <option key={idx} value={mod.name}>{mod.name}</option>
                    ))}
                  </select>
                  {formData.module && (
                    <p className="text-xs text-gray-500 mt-1">
                      Al seleccionar un módulo, se sugiere automáticamente una ruta base
                    </p>
                  )}
                </div>

                {/* Auth Required */}
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="auth_required"
                      checked={formData.auth_required}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Requiere Autenticación
                    </span>
                  </label>
                </div>
              </div>

              {/* Request Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Body (JSON Schema o ejemplo)
                </label>
                <textarea
                  name="request_body"
                  value={formData.request_body}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder='{"field": "value"}'
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"
                />
              </div>

              {/* Response Example */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Response Example (JSON)
                </label>
                <textarea
                  name="response_example"
                  value={formData.response_example}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder='{"success": true, "data": {...}}'
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"
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
                  disabled={loading || !formData.path}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
              ¿Estás seguro de eliminar el endpoint <strong className="font-mono">{confirmDelete.path}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.originalIndex)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Endpoints List */}
      {Object.keys(groupedEndpoints).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedEndpoints).map(([moduleName, moduleEndpoints]) => (
            <div key={moduleName} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-semibold text-gray-700">
                  {moduleName} ({moduleEndpoints.length})
                </h4>
              </div>
              <div className="divide-y divide-gray-100">
                {moduleEndpoints.map((endpoint) => {
                  const methodConfig = getMethodConfig(endpoint.method);
                  
                  return (
                    <div
                      key={endpoint.originalIndex}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <span className={`text-xs font-bold px-2 py-1 rounded border ${methodConfig.color}`}>
                            {endpoint.method}
                          </span>
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm text-gray-800">
                              {endpoint.path}
                            </code>
                            <button
                              onClick={() => copyToClipboard(endpoint.path)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Copiar path"
                            >
                              {copiedPath === endpoint.path ? (
                                <CheckCircle size={14} className="text-green-500" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                          {endpoint.auth_required ? (
                            <Lock size={14} className="text-gray-400" title="Requiere autenticación" />
                          ) : (
                            <Unlock size={14} className="text-green-500" title="Endpoint público" />
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(endpoint, endpoint.originalIndex)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(endpoint)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {endpoint.description && (
                        <p className="text-sm text-gray-500 mt-2 ml-16">
                          {endpoint.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Workflow size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {endpoints.length === 0 ? 'No hay endpoints definidos' : 'No se encontraron resultados'}
          </h3>
          <p className="text-gray-500 mb-4">
            {endpoints.length === 0 
              ? 'Documenta los endpoints de tu API para tener una referencia clara'
              : 'Intenta ajustar los filtros de búsqueda'
            }
          </p>
          {endpoints.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Plus size={20} />
              Agregar Primer Endpoint
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EndpointsTab;
