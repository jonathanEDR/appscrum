/**
 * EntityDetailsModal Component
 * Modal para mostrar los detalles completos de una entidad
 * 
 * @module components/ProductOwner/DatabaseSchema/EntityDetailsModal
 */

import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  X, 
  Database, 
  Key, 
  Link2, 
  Hash, 
  Calendar, 
  Code,
  Copy,
  Download,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const EntityDetailsModal = ({ 
  isOpen, 
  onClose, 
  entity,
  productId,
  onGenerateCode
}) => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('fields');
  const [expandedFields, setExpandedFields] = useState(new Set());
  const [generatedCode, setGeneratedCode] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !entity) return null;

  // Secciones del modal
  const sections = [
    { id: 'fields', label: 'Campos', count: entity.fields?.length || 0 },
    { id: 'relationships', label: 'Relaciones', count: entity.relationships?.length || 0 },
    { id: 'indexes', label: 'Índices', count: entity.indexes?.length || 0 },
    { id: 'code', label: 'Código' }
  ];

  // Toggle campo expandido
  const toggleField = (fieldName) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldName)) {
      newExpanded.delete(fieldName);
    } else {
      newExpanded.add(fieldName);
    }
    setExpandedFields(newExpanded);
  };

  // Generar y mostrar código
  const handleShowCode = async () => {
    if (!generatedCode && onGenerateCode) {
      const result = await onGenerateCode(entity.entity);
      if (result?.code) {
        setGeneratedCode(result.code);
      }
    }
    setShowCode(true);
    setActiveSection('code');
  };

  // Copiar código
  const handleCopyCode = async () => {
    if (generatedCode) {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Obtener color del tipo
  const getTypeColor = (type) => {
    const colors = {
      String: 'text-green-600 dark:text-green-400',
      Number: 'text-blue-600 dark:text-blue-400',
      Boolean: 'text-purple-600 dark:text-purple-400',
      Date: 'text-orange-600 dark:text-orange-400',
      ObjectId: 'text-indigo-600 dark:text-indigo-400',
      Array: 'text-yellow-600 dark:text-yellow-400',
      Object: 'text-pink-600 dark:text-pink-400',
      Mixed: 'text-gray-600 dark:text-gray-400'
    };
    return colors[type] || 'text-gray-600 dark:text-gray-400';
  };

  // Obtener icono de relación
  const getRelationIcon = (type) => {
    switch (type) {
      case 'one-to-one': return '1:1';
      case 'one-to-many': return '1:N';
      case 'many-to-many': return 'N:M';
      default: return '?';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${
              theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-100'
            }`}>
              <Database className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {entity.entity}
              </h2>
              {entity.description && (
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {entity.description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Info bar */}
        <div className={`flex flex-wrap items-center gap-4 px-4 py-3 border-b ${
          theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
          {entity.collection_name && (
            <div className={`flex items-center gap-1 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Database size={14} />
              <span>Colección: <strong>{entity.collection_name}</strong></span>
            </div>
          )}
          {entity.source_type && (
            <div className={`px-2 py-0.5 rounded text-xs ${
              theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}>
              {entity.source_type}
            </div>
          )}
          {entity.timestamps?.enabled && (
            <div className={`flex items-center gap-1 text-xs ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              <Calendar size={12} />
              Timestamps
            </div>
          )}
          {entity.soft_delete?.enabled && (
            <div className={`flex items-center gap-1 text-xs ${
              theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              Soft Delete
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 px-4 pt-3 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeSection === section.id
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-white border-b-2 border-indigo-500'
                    : 'bg-white text-indigo-600 border-b-2 border-indigo-500'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {section.label}
              {section.count !== undefined && (
                <span className={`px-1.5 py-0.5 text-xs rounded ${
                  activeSection === section.id
                    ? 'bg-indigo-500 text-white'
                    : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  {section.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-280px)]">
          {/* Campos */}
          {activeSection === 'fields' && (
            <div className="space-y-2">
              {entity.fields?.length === 0 ? (
                <div className="text-center py-8">
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    No hay campos definidos
                  </p>
                </div>
              ) : (
                entity.fields?.map((field, index) => (
                  <div 
                    key={field.name || index}
                    className={`rounded-lg border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    {/* Header del campo */}
                    <button
                      onClick={() => toggleField(field.name)}
                      className={`w-full flex items-center justify-between p-3 text-left ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {expandedFields.has(field.name) ? (
                          <ChevronDown size={16} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {field.name}
                        </span>
                        <span className={`text-sm ${getTypeColor(field.type)}`}>
                          {field.type}
                          {field.array_type && `<${field.array_type}>`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {field.required && (
                          <span className="px-1.5 py-0.5 text-xs rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            required
                          </span>
                        )}
                        {field.unique && (
                          <span className="px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            unique
                          </span>
                        )}
                        {field.index && (
                          <span className="px-1.5 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                            index
                          </span>
                        )}
                        {field.is_foreign_key && (
                          <Key size={14} className="text-indigo-500" />
                        )}
                        {field.is_sensitive && (
                          <Lock size={14} className="text-red-500" />
                        )}
                      </div>
                    </button>

                    {/* Detalles expandidos */}
                    {expandedFields.has(field.name) && (
                      <div className={`px-4 pb-3 pt-0 border-t ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          {field.description && (
                            <div className="col-span-2">
                              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                                Descripción:
                              </span>
                              <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                {field.description}
                              </span>
                            </div>
                          )}
                          {field.default_value !== undefined && (
                            <div>
                              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                                Default:
                              </span>
                              <code className={`ml-2 px-1 rounded ${
                                theme === 'dark' ? 'bg-gray-700 text-green-400' : 'bg-gray-100 text-green-600'
                              }`}>
                                {JSON.stringify(field.default_value)}
                              </code>
                            </div>
                          )}
                          {field.enum_values?.length > 0 && (
                            <div className="col-span-2">
                              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                                Enum:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {field.enum_values.map((val, i) => (
                                  <code key={i} className={`px-1.5 py-0.5 rounded text-xs ${
                                    theme === 'dark' ? 'bg-gray-700 text-purple-400' : 'bg-purple-100 text-purple-600'
                                  }`}>
                                    {JSON.stringify(val)}
                                  </code>
                                ))}
                              </div>
                            </div>
                          )}
                          {field.reference && (
                            <div>
                              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                                Referencia:
                              </span>
                              <span className={`ml-2 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                {field.reference}
                              </span>
                            </div>
                          )}
                          {field.minlength && (
                            <div>
                              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                                Min length:
                              </span>
                              <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                {field.minlength}
                              </span>
                            </div>
                          )}
                          {field.maxlength && (
                            <div>
                              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                                Max length:
                              </span>
                              <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                {field.maxlength}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Relaciones */}
          {activeSection === 'relationships' && (
            <div className="space-y-3">
              {entity.relationships?.length === 0 ? (
                <div className="text-center py-8">
                  <Link2 className={`mx-auto h-10 w-10 mb-2 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    No hay relaciones definidas
                  </p>
                </div>
              ) : (
                entity.relationships?.map((rel, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`px-3 py-1 rounded font-mono text-sm font-bold ${
                      theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {getRelationIcon(rel.type)}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        → {rel.target_entity}
                      </div>
                      {rel.field && (
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Campo: {rel.field}
                        </div>
                      )}
                    </div>
                    {rel.cascade_delete && (
                      <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        CASCADE
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Índices */}
          {activeSection === 'indexes' && (
            <div className="space-y-3">
              {entity.indexes?.length === 0 ? (
                <div className="text-center py-8">
                  <Hash className={`mx-auto h-10 w-10 mb-2 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    No hay índices compuestos definidos
                  </p>
                </div>
              ) : (
                entity.indexes?.map((idx, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Hash size={16} className="text-yellow-500" />
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {idx.name || `Index ${index + 1}`}
                      </span>
                      {idx.unique && (
                        <span className="px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          UNIQUE
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {idx.fields?.map((field, i) => (
                        <code key={i} className={`px-2 py-1 rounded text-sm ${
                          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {field}
                        </code>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Código */}
          {activeSection === 'code' && (
            <div>
              {!generatedCode ? (
                <div className="text-center py-8">
                  <Code className={`mx-auto h-10 w-10 mb-2 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Genera el código Mongoose de esta entidad
                  </p>
                  <button
                    onClick={handleShowCode}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Generar Código
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <button
                      onClick={handleCopyCode}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${
                        copied
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <pre className={`p-4 rounded-lg overflow-auto text-sm ${
                    theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-900 text-gray-100'
                  }`}>
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 p-4 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntityDetailsModal;
