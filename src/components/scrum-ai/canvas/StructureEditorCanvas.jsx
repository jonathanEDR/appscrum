/**
 * StructureEditorCanvas - Canvas específico para editar estructura de proyecto
 * Muestra 3 paneles: Frontend, Backend y Shared/Config
 */

import { useState } from 'react';
import { 
  Folder,
  FolderOpen,
  File,
  ChevronRight,
  ChevronDown,
  Globe,
  Server,
  Settings,
  Plus,
  FolderTree,
  Layers
} from 'lucide-react';

// Componente recursivo para renderizar estructura de carpetas
const FolderNode = ({ name, content, level = 0, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || level < 2);
  
  const isFolder = typeof content === 'object' && content !== null && !Array.isArray(content);
  const isDescription = typeof content === 'string';
  
  if (name === 'root') {
    return (
      <div className="mb-2">
        <div className="flex items-center gap-2 py-1">
          <FolderTree className="w-4 h-4 text-violet-500" />
          <span className="font-semibold text-gray-900 dark:text-white">{content}/</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors ${isFolder ? 'cursor-pointer' : ''}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => isFolder && setIsExpanded(!isExpanded)}
      >
        {isFolder ? (
          <>
            <span className="w-4 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )}
            </span>
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-amber-500" />
            ) : (
              <Folder className="w-4 h-4 text-amber-500" />
            )}
            <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">{name}/</span>
          </>
        ) : (
          <>
            <span className="w-4" />
            <File className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400 text-sm">{name}</span>
            {isDescription && (
              <span className="text-gray-400 dark:text-gray-500 text-xs ml-2 truncate">// {content}</span>
            )}
          </>
        )}
      </div>
      
      {isFolder && isExpanded && (
        <div>
          {Object.entries(content).map(([key, value]) => (
            <FolderNode 
              key={key} 
              name={key} 
              content={value} 
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Panel individual para cada sección (Frontend, Backend, etc.)
const StructurePanel = ({ title, icon: Icon, iconColor, structure, emptyMessage }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const hasContent = structure && Object.keys(structure).length > 0;
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header del panel */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${iconColor} flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
      </button>
      
      {/* Contenido */}
      {isExpanded && (
        <div className="p-3 max-h-[300px] overflow-y-auto">
          {hasContent ? (
            <div className="space-y-0.5">
              {Object.entries(structure).map(([key, value]) => (
                <FolderNode key={key} name={key} content={value} defaultExpanded={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{emptyMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const StructureEditorCanvas = ({ structure, onAddFolder }) => {
  // Separar la estructura en Frontend, Backend y Config/Shared
  const frontendStructure = structure?.frontend || {};
  const backendStructure = structure?.backend || {};
  
  // Detectar otras carpetas de configuración/shared
  const configFolders = {};
  if (structure) {
    Object.entries(structure).forEach(([key, value]) => {
      if (!['frontend', 'backend', 'root'].includes(key)) {
        configFolders[key] = value;
      }
    });
  }
  
  const rootName = structure?.root || 'project';
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Estructura del Proyecto
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {rootName}/ • Organización de carpetas y archivos
            </p>
          </div>
        </div>
      </div>
      
      {/* Contenido - 3 Paneles */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Panel Frontend */}
        <StructurePanel
          title="Frontend"
          icon={Globe}
          iconColor="bg-gradient-to-br from-blue-500 to-cyan-500"
          structure={frontendStructure}
          emptyMessage="Sin estructura frontend definida"
        />
        
        {/* Panel Backend */}
        <StructurePanel
          title="Backend"
          icon={Server}
          iconColor="bg-gradient-to-br from-green-500 to-emerald-500"
          structure={backendStructure}
          emptyMessage="Sin estructura backend definida"
        />
        
        {/* Panel Config/Shared (si existe) */}
        {Object.keys(configFolders).length > 0 && (
          <StructurePanel
            title="Configuración / Shared"
            icon={Settings}
            iconColor="bg-gradient-to-br from-gray-500 to-slate-600"
            structure={configFolders}
            emptyMessage="Sin archivos de configuración"
          />
        )}
      </div>
      
      {/* Footer con acciones */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 Usa el chat para agregar, modificar o eliminar carpetas
        </p>
      </div>
    </div>
  );
};

export default StructureEditorCanvas;
