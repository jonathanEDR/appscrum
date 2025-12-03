/**
 * SchemaConfiguration Component
 * Panel de configuración para el esquema de base de datos
 * 
 * @module components/ProductOwner/DatabaseSchema/SchemaConfiguration
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  Settings,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Info,
  Code2,
  FileCode,
  Database,
  Tag,
  Globe,
  Lock
} from 'lucide-react';

const SchemaConfiguration = ({ 
  productId,
  schema,
  onSave,
  loading = false
}) => {
  const { theme } = useTheme();
  
  // Estado del formulario
  const [config, setConfig] = useState({
    version: '',
    status: 'draft',
    description: '',
    database_type: 'mongodb',
    naming_convention: 'camelCase',
    validation_level: 'strict',
    generate_timestamps: true,
    generate_indexes: true,
    soft_delete: false,
    api_version: 'v1',
    author: '',
    tags: []
  });
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });
  const [hasChanges, setHasChanges] = useState(false);

  // Cargar configuración inicial del schema
  useEffect(() => {
    if (schema) {
      setConfig({
        version: schema.version || '1.0.0',
        status: schema.status || 'draft',
        description: schema.description || '',
        database_type: schema.database_type || 'mongodb',
        naming_convention: schema.naming_convention || 'camelCase',
        validation_level: schema.validation_level || 'strict',
        generate_timestamps: schema.generate_timestamps !== false,
        generate_indexes: schema.generate_indexes !== false,
        soft_delete: schema.soft_delete || false,
        api_version: schema.api_version || 'v1',
        author: schema.author || '',
        tags: schema.tags || []
      });
      setHasChanges(false);
    }
  }, [schema]);

  // Manejar cambio en campos
  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setMessage({ type: null, text: '' });
  };

  // Guardar configuración
  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: null, text: '' });

    try {
      const result = await onSave(config);
      if (result?.success) {
        setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
        setHasChanges(false);
      } else {
        setMessage({ type: 'error', text: result?.error || 'Error al guardar configuración' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error al guardar configuración' });
    } finally {
      setSaving(false);
    }
  };

  // Resetear cambios
  const handleReset = () => {
    if (schema) {
      setConfig({
        version: schema.version || '1.0.0',
        status: schema.status || 'draft',
        description: schema.description || '',
        database_type: schema.database_type || 'mongodb',
        naming_convention: schema.naming_convention || 'camelCase',
        validation_level: schema.validation_level || 'strict',
        generate_timestamps: schema.generate_timestamps !== false,
        generate_indexes: schema.generate_indexes !== false,
        soft_delete: schema.soft_delete || false,
        api_version: schema.api_version || 'v1',
        author: schema.author || '',
        tags: schema.tags || []
      });
      setHasChanges(false);
      setMessage({ type: null, text: '' });
    }
  };

  // Agregar tag
  const addTag = (tag) => {
    if (tag && !config.tags.includes(tag)) {
      handleChange('tags', [...config.tags, tag]);
    }
  };

  // Remover tag
  const removeTag = (tagToRemove) => {
    handleChange('tags', config.tags.filter(t => t !== tagToRemove));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mensajes */}
      {message.text && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          message.type === 'success'
            ? theme === 'dark'
              ? 'bg-green-900/30 text-green-400 border border-green-800'
              : 'bg-green-50 text-green-700 border border-green-200'
            : theme === 'dark'
              ? 'bg-red-900/30 text-red-400 border border-red-800'
              : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Info Banner */}
      <div className={`flex items-start gap-3 p-4 rounded-lg ${
        theme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
      }`}>
        <Info className={`flex-shrink-0 ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        }`} size={20} />
        <div className={`text-sm ${
          theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
        }`}>
          <p className="font-medium mb-1">Configuración del Esquema</p>
          <p>Define las opciones generales para la generación de código, validaciones y comportamiento del esquema de base de datos.</p>
        </div>
      </div>

      {/* Grid de configuración */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ===== Sección: Información General ===== */}
        <div className={`p-4 rounded-lg border ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Database size={18} className="text-indigo-500" />
            <h3 className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Información General
            </h3>
          </div>

          <div className="space-y-4">
            {/* Versión */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Versión del Esquema
              </label>
              <input
                type="text"
                value={config.version}
                onChange={(e) => handleChange('version', e.target.value)}
                placeholder="1.0.0"
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Estado */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Estado
              </label>
              <select
                value={config.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="draft">Draft (Borrador)</option>
                <option value="review">Review (En Revisión)</option>
                <option value="active">Active (Activo)</option>
                <option value="deprecated">Deprecated (Obsoleto)</option>
              </select>
            </div>

            {/* Descripción */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Descripción
              </label>
              <textarea
                value={config.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe el propósito de este esquema..."
                rows={3}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Autor */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Autor
              </label>
              <input
                type="text"
                value={config.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="Nombre del autor o equipo"
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* ===== Sección: Base de Datos ===== */}
        <div className={`p-4 rounded-lg border ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Settings size={18} className="text-green-500" />
            <h3 className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Base de Datos
            </h3>
          </div>

          <div className="space-y-4">
            {/* Tipo de BD */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tipo de Base de Datos
              </label>
              <select
                value={config.database_type}
                onChange={(e) => handleChange('database_type', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="mongodb">MongoDB</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="sqlite">SQLite</option>
              </select>
            </div>

            {/* Nivel de validación */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Nivel de Validación
              </label>
              <select
                value={config.validation_level}
                onChange={(e) => handleChange('validation_level', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="strict">Strict (Estricto)</option>
                <option value="moderate">Moderate (Moderado)</option>
                <option value="relaxed">Relaxed (Relajado)</option>
              </select>
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Controla qué tan estrictas son las validaciones en los modelos
              </p>
            </div>

            {/* Opciones booleanas */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.generate_timestamps}
                  onChange={(e) => handleChange('generate_timestamps', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Generar timestamps (createdAt, updatedAt)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.generate_indexes}
                  onChange={(e) => handleChange('generate_indexes', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Generar índices automáticamente
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.soft_delete}
                  onChange={(e) => handleChange('soft_delete', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Habilitar soft delete (eliminación lógica)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ===== Sección: Generación de Código ===== */}
        <div className={`p-4 rounded-lg border ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Code2 size={18} className="text-purple-500" />
            <h3 className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Generación de Código
            </h3>
          </div>

          <div className="space-y-4">
            {/* Convención de nombres */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Convención de Nombres
              </label>
              <select
                value={config.naming_convention}
                onChange={(e) => handleChange('naming_convention', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="camelCase">camelCase</option>
                <option value="snake_case">snake_case</option>
                <option value="PascalCase">PascalCase</option>
                <option value="kebab-case">kebab-case</option>
              </select>
            </div>

            {/* Versión de API */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Versión de API
              </label>
              <input
                type="text"
                value={config.api_version}
                onChange={(e) => handleChange('api_version', e.target.value)}
                placeholder="v1"
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* ===== Sección: Tags ===== */}
        <div className={`p-4 rounded-lg border ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Tag size={18} className="text-orange-500" />
            <h3 className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Etiquetas
            </h3>
          </div>

          <div className="space-y-3">
            {/* Input para agregar tags */}
            <div>
              <input
                type="text"
                placeholder="Presiona Enter para agregar etiqueta"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTag(e.target.value.trim());
                    e.target.value = '';
                  }
                }}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Lista de tags */}
            {config.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {config.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                      theme === 'dark'
                        ? 'bg-indigo-900/30 text-indigo-300'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:opacity-70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className={`flex items-center justify-end gap-3 pt-4 border-t ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <button
          onClick={handleReset}
          disabled={!hasChanges || saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !hasChanges || saving
              ? theme === 'dark' ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
              : theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <RotateCcw size={18} />
          Descartar Cambios
        </button>
        
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !hasChanges || saving
              ? 'bg-indigo-400 cursor-not-allowed text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save size={18} />
              Guardar Configuración
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SchemaConfiguration;
