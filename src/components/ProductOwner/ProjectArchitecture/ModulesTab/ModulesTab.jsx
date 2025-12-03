import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Link2,
  Code,
  Layers,
  FolderOpen,
  Folder
} from 'lucide-react';

const MODULE_TYPES = [
  { value: 'frontend', label: 'Frontend', color: 'bg-blue-100 text-blue-700' },
  { value: 'backend', label: 'Backend', color: 'bg-green-100 text-green-700' },
  { value: 'shared', label: 'Shared/Common', color: 'bg-purple-100 text-purple-700' },
  { value: 'infrastructure', label: 'Infrastructure', color: 'bg-orange-100 text-orange-700' },
  { value: 'mobile', label: 'Mobile', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'external', label: 'External', color: 'bg-gray-100 text-gray-700' }
];

const MODULE_STATUS = [
  { value: 'planned', label: 'Planificado', color: 'bg-blue-100 text-blue-700' },
  { value: 'in_development', label: 'En Desarrollo', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'completed', label: 'Completado', color: 'bg-green-100 text-green-700' },
  { value: 'deprecated', label: 'Deprecado', color: 'bg-red-100 text-red-700' },
  { value: 'blocked', label: 'Bloqueado', color: 'bg-gray-100 text-gray-700' }
];

const EMPTY_MODULE = {
  name: '',
  description: '',
  type: 'backend',
  status: 'planned',
  dependencies: [],
  path: '',
  responsibilities: ''
};

/**
 * ModulesTab - CRUD de Módulos de la arquitectura
 */
const ModulesTab = ({ architecture, onAddModule, onUpdateModule, onDeleteModule, loading, theme = 'light' }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [formData, setFormData] = useState(EMPTY_MODULE);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedModule, setExpandedModule] = useState(null);
  const [dependencyInput, setDependencyInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showPathSuggestions, setShowPathSuggestions] = useState(false);
  const [pathFilter, setPathFilter] = useState('');

  const modules = architecture?.modules || [];

  // Extraer todas las rutas disponibles de directory_structure
  const availablePaths = useMemo(() => {
    const paths = [];
    const directoryStructure = architecture?.directory_structure || {};

    // Función recursiva para extraer rutas
    const extractPaths = (obj, currentPath = '') => {
      if (!obj || typeof obj !== 'object') return;
      
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = currentPath ? `${currentPath}/${key}` : key;
        
        // Solo agregar si es una carpeta (objeto)
        if (typeof value === 'object' && value !== null) {
          paths.push(newPath);
          extractPaths(value, newPath);
        }
      });
    };

    // Extraer de frontend, backend y shared
    if (directoryStructure.frontend) {
      paths.push('frontend');
      extractPaths(directoryStructure.frontend, 'frontend');
    }
    if (directoryStructure.backend) {
      paths.push('backend');
      extractPaths(directoryStructure.backend, 'backend');
    }
    if (directoryStructure.shared) {
      paths.push('shared');
      extractPaths(directoryStructure.shared, 'shared');
    }

    // También incluir rutas de módulos existentes
    modules.forEach(mod => {
      if (mod.path && !paths.includes(mod.path)) {
        paths.push(mod.path);
      }
    });

    return [...new Set(paths)].sort();
  }, [architecture?.directory_structure, modules]);

  // Filtrar sugerencias de rutas basado en el input
  const filteredPaths = useMemo(() => {
    if (!pathFilter) return availablePaths;
    const filter = pathFilter.toLowerCase();
    return availablePaths.filter(path => path.toLowerCase().includes(filter));
  }, [availablePaths, pathFilter]);

  // Filtrar módulos
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || module.type === filterType;
    const matchesStatus = filterStatus === 'all' || module.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDependency = () => {
    if (dependencyInput.trim() && !formData.dependencies.includes(dependencyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        dependencies: [...prev.dependencies, dependencyInput.trim()]
      }));
      setDependencyInput('');
    }
  };

  const handleRemoveDependency = (dep) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter(d => d !== dep)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingModule) {
        await onUpdateModule(editingModule._id || editingModule.id, formData);
      } else {
        await onAddModule(formData);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving module:', err);
    }
  };

  const handleEdit = (module) => {
    setEditingModule(module);
    setFormData({
      name: module.name || '',
      description: module.description || '',
      type: module.type || 'backend',
      status: module.status || 'planned',
      dependencies: module.dependencies || [],
      path: module.path || '',
      responsibilities: module.responsibilities || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (moduleId) => {
    try {
      await onDeleteModule(moduleId);
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting module:', err);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingModule(null);
    setFormData(EMPTY_MODULE);
    setDependencyInput('');
  };

  const getTypeConfig = (type) => {
    return MODULE_TYPES.find(t => t.value === type) || MODULE_TYPES[0];
  };

  const getStatusConfig = (status) => {
    return MODULE_STATUS.find(s => s.value === status) || MODULE_STATUS[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Package className="text-purple-600" />
            Módulos del Sistema
          </h2>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Define los componentes y módulos principales de tu arquitectura
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          disabled={loading}
        >
          <Plus size={20} />
          Nuevo Módulo
        </button>
      </div>

      {/* Filters */}
      <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar módulos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="all">Todos los tipos</option>
              {MODULE_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="all">Todos los estados</option>
            {MODULE_STATUS.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Module Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {editingModule ? 'Editar Módulo' : 'Nuevo Módulo'}
                </h3>
                <button
                  onClick={resetForm}
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nombre del Módulo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="ej: AuthenticationModule"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe la función principal del módulo..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tipo
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    {MODULE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Estado
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    {MODULE_STATUS.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Path con sugerencias */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Ruta / Path
                </label>
                <div className="relative">
                  <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={18} />
                  <input
                    type="text"
                    name="path"
                    value={formData.path}
                    onChange={(e) => {
                      handleInputChange(e);
                      setPathFilter(e.target.value);
                      setShowPathSuggestions(true);
                    }}
                    onFocus={() => setShowPathSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowPathSuggestions(false), 200)}
                    placeholder="ej: src/modules/auth"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                    autoComplete="off"
                  />
                  
                  {/* Botón para mostrar/ocultar sugerencias */}
                  <button
                    type="button"
                    onClick={() => setShowPathSuggestions(!showPathSuggestions)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-purple-600 rounded"
                  >
                    <FolderOpen size={18} />
                  </button>

                  {/* Dropdown de sugerencias */}
                  {showPathSuggestions && filteredPaths.length > 0 && (
                    <div className={`absolute z-20 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <div className={`px-3 py-2 border-b text-xs font-medium flex items-center gap-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                        <Folder size={14} />
                        Rutas disponibles del proyecto ({filteredPaths.length})
                      </div>
                      {filteredPaths.map((path, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, path }));
                            setPathFilter('');
                            setShowPathSuggestions(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 last:border-0 ${theme === 'dark' ? 'hover:bg-purple-900/50 hover:text-purple-400 border-b border-gray-700' : 'hover:bg-purple-50 hover:text-purple-700 border-b border-gray-50'}`}
                        >
                          <Folder size={14} className="text-yellow-500 flex-shrink-0" />
                          <span className={`font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{path}</span>
                        </button>
                      ))}
                      {formData.path && !availablePaths.includes(formData.path) && (
                        <div className={`px-3 py-2 text-xs flex items-center gap-2 ${theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                          <Plus size={14} />
                          Nueva ruta: <span className="font-mono">{formData.path}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {availablePaths.length === 0 && (
                  <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    💡 Tip: Define la estructura de directorios en la pestaña "Estructura" para ver rutas sugeridas aquí.
                  </p>
                )}
              </div>

              {/* Responsibilities */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Responsabilidades
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Lista las responsabilidades principales..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>

              {/* Dependencies */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Dependencias
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={dependencyInput}
                    onChange={(e) => setDependencyInput(e.target.value)}
                    placeholder="Nombre del módulo dependiente"
                    className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDependency())}
                  />
                  <button
                    type="button"
                    onClick={handleAddDependency}
                    className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.dependencies.map((dep, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-700'}`}
                    >
                      <Link2 size={14} />
                      {dep}
                      <button
                        type="button"
                        onClick={() => handleRemoveDependency(dep)}
                        className={`ml-1 ${theme === 'dark' ? 'hover:text-purple-300' : 'hover:text-purple-900'}`}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className={`flex justify-end gap-3 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-4 py-2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.name}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {editingModule ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-xl max-w-md w-full p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-red-900/50' : 'bg-red-100'}`}>
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Confirmar Eliminación</h3>
            </div>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              ¿Estás seguro de eliminar el módulo <strong>{confirmDelete.name}</strong>? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className={`px-4 py-2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id || confirmDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modules List */}
      {filteredModules.length > 0 ? (
        <div className="space-y-3">
          {filteredModules.map((module, index) => {
            const typeConfig = getTypeConfig(module.type);
            const statusConfig = getStatusConfig(module.status);
            const isExpanded = expandedModule === (module._id || index);

            return (
              <div
                key={module._id || index}
                className={`rounded-xl border overflow-hidden hover:shadow-md transition-shadow ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedModule(isExpanded ? null : (module._id || index))}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                        <Layers className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{module.name}</h4>
                        <p className={`text-sm line-clamp-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{module.description || 'Sin descripción'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(module); }}
                          className={`p-2 text-gray-400 rounded-lg ${theme === 'dark' ? 'hover:text-blue-400 hover:bg-blue-900/50' : 'hover:text-blue-600 hover:bg-blue-50'}`}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmDelete(module); }}
                          className={`p-2 text-gray-400 rounded-lg ${theme === 'dark' ? 'hover:text-red-400 hover:bg-red-900/50' : 'hover:text-red-600 hover:bg-red-50'}`}
                        >
                          <Trash2 size={18} />
                        </button>
                        {isExpanded ? <ChevronUp size={18} className={theme === 'dark' ? 'text-gray-400' : ''} /> : <ChevronDown size={18} className={theme === 'dark' ? 'text-gray-400' : ''} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className={`px-4 pb-4 border-t pt-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {module.path && (
                        <div>
                          <span className={`text-xs uppercase ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Ruta</span>
                          <p className={`font-mono text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{module.path}</p>
                        </div>
                      )}
                      {module.responsibilities && (
                        <div>
                          <span className={`text-xs uppercase ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Responsabilidades</span>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{module.responsibilities}</p>
                        </div>
                      )}
                    </div>
                    {module.dependencies?.length > 0 && (
                      <div className="mt-4">
                        <span className={`text-xs uppercase ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Dependencias</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {module.dependencies.map((dep, i) => (
                            <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${theme === 'dark' ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                              <Link2 size={12} />
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`rounded-xl border p-12 text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {modules.length === 0 ? 'No hay módulos definidos' : 'No se encontraron resultados'}
          </h3>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            {modules.length === 0 
              ? 'Comienza agregando los módulos principales de tu arquitectura'
              : 'Intenta ajustar los filtros de búsqueda'
            }
          </p>
          {modules.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              <Plus size={20} />
              Agregar Primer Módulo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ModulesTab;
