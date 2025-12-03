/**
 * DatabaseEditorCanvas - Canvas específico para editar esquema de base de datos
 * Muestra las tablas/entidades con sus campos y relaciones
 */

import { useState } from 'react';
import { 
  Database,
  Table2,
  ChevronRight,
  ChevronDown,
  Key,
  Link2,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  Layers,
  ArrowRight
} from 'lucide-react';

// Iconos por tipo de campo
const FIELD_TYPE_ICONS = {
  'String': Type,
  'Number': Hash,
  'Boolean': ToggleLeft,
  'Date': Calendar,
  'ObjectId': Key,
  'Array': Layers,
  'Object': Database,
  'default': Type
};

// Colores por tipo de campo
const FIELD_TYPE_COLORS = {
  'String': 'text-blue-500',
  'Number': 'text-green-500',
  'Boolean': 'text-purple-500',
  'Date': 'text-orange-500',
  'ObjectId': 'text-amber-500',
  'Array': 'text-cyan-500',
  'Object': 'text-pink-500',
  'default': 'text-gray-500'
};

// Componente para mostrar un campo
const FieldItem = ({ field }) => {
  const fieldType = field.type || 'String';
  const Icon = FIELD_TYPE_ICONS[fieldType] || FIELD_TYPE_ICONS.default;
  const colorClass = FIELD_TYPE_COLORS[fieldType] || FIELD_TYPE_COLORS.default;
  
  return (
    <div className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded">
      <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
      <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">
        {field.name || field.field_name || 'unknown'}
      </span>
      <span className="text-xs text-gray-400">: {fieldType}</span>
      {field.required && (
        <span className="text-[10px] px-1 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
          required
        </span>
      )}
      {field.unique && (
        <span className="text-[10px] px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          unique
        </span>
      )}
    </div>
  );
};

// Componente para mostrar una relación
const RelationshipItem = ({ relationship }) => {
  const relType = relationship.type || 'one-to-many';
  const target = relationship.target_entity || relationship.target || 'Unknown';
  
  return (
    <div className="flex items-center gap-2 py-1 px-2 text-sm">
      <Link2 className="w-3.5 h-3.5 text-violet-500" />
      <span className="text-gray-500 dark:text-gray-400">{relType}</span>
      <ArrowRight className="w-3 h-3 text-gray-400" />
      <span className="text-violet-600 dark:text-violet-400 font-medium">{target}</span>
      {relationship.field && (
        <span className="text-xs text-gray-400">({relationship.field})</span>
      )}
    </div>
  );
};

// Componente para una tabla/entidad
const TableCard = ({ table, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const entityName = table.entity || table.table_name || table.name || 'Unknown';
  const collectionName = table.collection_name || entityName.toLowerCase();
  const fields = table.fields || [];
  const relationships = table.relationships || [];
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header de la tabla */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Table2 className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-gray-900 dark:text-white">{entityName}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({collectionName})</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {fields.length} campos
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
        </div>
      </button>
      
      {/* Contenido expandido */}
      {isExpanded && (
        <div className="p-3 space-y-3">
          {/* Descripción */}
          {table.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {table.description}
            </p>
          )}
          
          {/* Campos */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Campos ({fields.length})
            </h4>
            <div className="space-y-0.5 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-2">
              {fields.length > 0 ? (
                fields.map((field, idx) => (
                  <FieldItem key={idx} field={field} />
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-2">Sin campos definidos</p>
              )}
            </div>
          </div>
          
          {/* Relaciones */}
          {relationships.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Relaciones ({relationships.length})
              </h4>
              <div className="space-y-0.5 bg-violet-50 dark:bg-violet-900/10 rounded-lg p-2">
                {relationships.map((rel, idx) => (
                  <RelationshipItem key={idx} relationship={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const DatabaseEditorCanvas = ({ schema = [] }) => {
  const tables = Array.isArray(schema) ? schema : [];
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Esquema de Base de Datos
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {tables.length} {tables.length === 1 ? 'tabla' : 'tablas'} definidas
            </p>
          </div>
        </div>
      </div>
      
      {/* Contenido - Lista de tablas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tables.length > 0 ? (
          tables.map((table, idx) => (
            <TableCard 
              key={idx} 
              table={table} 
              defaultExpanded={idx === 0}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Sin tablas definidas</p>
            <p className="text-sm">Usa el chat para agregar tablas al esquema</p>
          </div>
        )}
      </div>
      
      {/* Footer con tip */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 Escribe "agregar tabla usuarios con campos email, nombre, rol" para modificar
        </p>
      </div>
    </div>
  );
};

export default DatabaseEditorCanvas;
