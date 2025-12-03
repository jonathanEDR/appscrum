/**
 * ArchitectureCanvas - Canvas para mostrar arquitectura de proyectos
 * Usado por el agente Architect
 */

import { useState } from 'react';
import { 
  Boxes, 
  Database, 
  Code2, 
  Server,
  Cloud,
  Shield,
  Layers,
  Package,
  FileCode,
  Globe,
  Search,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronDown,
  GitBranch,
  Link,
  Table,
  FolderTree,
  Folder,
  File
} from 'lucide-react';

const TECH_ICONS = {
  frontend: Globe,
  backend: Server,
  database: Database,
  devops: Cloud,
  testing: CheckCircle2
};

// Componente recursivo para renderizar estructura de carpetas
const FolderStructure = ({ structure, level = 0 }) => {
  const [expandedFolders, setExpandedFolders] = useState({});
  
  const toggleFolder = (path) => {
    setExpandedFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  // Si structure es un string (formato texto), parsearlo
  if (typeof structure === 'string') {
    return (
      <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre overflow-x-auto">
        {structure}
      </pre>
    );
  }

  // Si es un array de items con estructura {name, type, children}
  if (Array.isArray(structure)) {
    return (
      <div className="space-y-0.5">
        {structure.map((item, index) => {
          const isFolder = item.type === 'folder' || item.children?.length > 0;
          const path = `${level}-${index}-${item.name}`;
          const isExpanded = expandedFolders[path];
          
          return (
            <div key={index}>
              <div 
                className={`flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isFolder ? 'cursor-pointer' : ''}`}
                style={{ paddingLeft: `${level * 16 + 4}px` }}
                onClick={() => isFolder && toggleFolder(path)}
              >
                {isFolder ? (
                  <>
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    )}
                    <Folder className="w-4 h-4 text-amber-500" />
                  </>
                ) : (
                  <>
                    <span className="w-3" />
                    <File className="w-4 h-4 text-gray-400" />
                  </>
                )}
                <span className={`text-gray-700 dark:text-gray-300 ${isFolder ? 'font-medium' : ''}`}>
                  {item.name}
                </span>
                {item.description && (
                  <span className="text-gray-400 text-xs ml-2">// {item.description}</span>
                )}
              </div>
              {isFolder && isExpanded && item.children && (
                <FolderStructure structure={item.children} level={level + 1} />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Si es un objeto con propiedades como root, folders, etc.
  if (typeof structure === 'object' && structure !== null) {
    // Intentar renderizar como árbol de carpetas
    const renderObjectTree = (obj, currentLevel = 0) => {
      return Object.entries(obj).map(([key, value], index) => {
        const isFolder = typeof value === 'object' && value !== null && !Array.isArray(value);
        const path = `obj-${currentLevel}-${index}-${key}`;
        const isExpanded = expandedFolders[path];
        
        if (key === 'root' && typeof value === 'string') {
          return (
            <div key={index} className="flex items-center gap-1.5 py-0.5 mb-2">
              <FolderTree className="w-4 h-4 text-violet-500" />
              <span className="font-medium text-gray-900 dark:text-white">{value}/</span>
            </div>
          );
        }
        
        return (
          <div key={index}>
            <div 
              className={`flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isFolder ? 'cursor-pointer' : ''}`}
              style={{ paddingLeft: `${currentLevel * 16 + 4}px` }}
              onClick={() => isFolder && toggleFolder(path)}
            >
              {isFolder ? (
                <>
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                  <Folder className="w-4 h-4 text-amber-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{key}/</span>
                </>
              ) : (
                <>
                  <span className="w-3" />
                  <File className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{key}</span>
                  {typeof value === 'string' && (
                    <span className="text-gray-400 text-xs ml-2">// {value}</span>
                  )}
                </>
              )}
            </div>
            {isFolder && isExpanded && renderObjectTree(value, currentLevel + 1)}
          </div>
        );
      });
    };
    
    return <div className="space-y-0.5">{renderObjectTree(structure)}</div>;
  }

  return <p className="text-gray-500">Sin estructura definida</p>;
};

export const ArchitectureCanvas = ({ data = [], metadata, isExpanded, onItemClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedSections, setExpandedSections] = useState({
    security: false,
    patterns: false,
    decisions: false,
    database: false,
    endpoints: false,
    integrations: false,
    structure: false
  });

  // Toggle sección expandida
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // data es un array con un solo item de arquitectura
  const architecture = data[0] || null;

  const filterModules = (modules) => {
    if (!modules) return [];
    
    return modules.filter(module => {
      const matchesSearch = !searchQuery || 
                           module.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           module.description?.toLowerCase().includes(searchQuery.toLowerCase());
      // Usar 'type' del modelo (frontend, backend, shared, etc.) o 'category' si existe
      const moduleCategory = module.type || module.category || 'core';
      const matchesCategory = selectedCategory === 'all' || moduleCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const getTechStackSummary = (techStack) => {
    if (!techStack) return [];
    
    const summary = [];
    
    // Helper para convertir objeto a array de valores
    const objectToArray = (obj) => {
      if (!obj) return [];
      if (Array.isArray(obj)) return obj;
      // Si es un objeto, extraer los valores no vacíos
      return Object.entries(obj)
        .filter(([key, value]) => value && key !== 'additional')
        .map(([key, value]) => typeof value === 'string' ? value : `${key}: ${value}`);
    };
    
    const frontendItems = objectToArray(techStack.frontend);
    const backendItems = objectToArray(techStack.backend);
    const databaseItems = objectToArray(techStack.database);
    const infrastructureItems = objectToArray(techStack.infrastructure || techStack.devops);
    
    if (frontendItems.length > 0) {
      summary.push({ type: 'frontend', count: frontendItems.length, items: frontendItems });
    }
    if (backendItems.length > 0) {
      summary.push({ type: 'backend', count: backendItems.length, items: backendItems });
    }
    if (databaseItems.length > 0) {
      summary.push({ type: 'database', count: databaseItems.length, items: databaseItems });
    }
    if (infrastructureItems.length > 0) {
      summary.push({ type: 'devops', count: infrastructureItems.length, items: infrastructureItems });
    }
    
    return summary;
  };

  if (!architecture) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center mx-auto mb-4">
            <Boxes className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sin arquitectura definida
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No hay arquitectura técnica configurada para este producto
          </p>
          <button
            onClick={() => onItemClick?.({ type: 'create_architecture' })}
            className="mt-4 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
          >
            Definir Arquitectura
          </button>
        </div>
      </div>
    );
  }

  const techSummary = getTechStackSummary(architecture.tech_stack);
  const filteredModules = filterModules(architecture.modules);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-3 border-b border-gray-200/60 dark:border-gray-800/60 space-y-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar módulos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'frontend', 'backend', 'shared', 'infrastructure', 'external'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? 'Todos' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tech Stack Overview */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/30">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Stack Tecnológico
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {techSummary.map((tech) => {
              const Icon = TECH_ICONS[tech.type] || Code2;
              return (
                <div
                  key={tech.type}
                  onClick={() => onItemClick?.({ type: 'tech_stack', data: tech })}
                  className="bg-white dark:bg-gray-900 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-xs font-medium text-gray-900 dark:text-white capitalize">
                      {tech.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {tech.count} {tech.count === 1 ? 'tecnología' : 'tecnologías'}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tech.items.slice(0, 2).map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                      >
                        {item}
                      </span>
                    ))}
                    {tech.items.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{tech.items.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Módulos</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {architecture.modules?.length || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Tablas</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {architecture.database_schema?.length || architecture.schema_db?.length || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <FileCode className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">APIs</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {architecture.api_endpoints?.length || 0}
            </p>
          </div>
        </div>

        {/* Modules List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Módulos del Sistema
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {filteredModules.length} {filteredModules.length === 1 ? 'módulo' : 'módulos'}
            </span>
          </div>

          <div className="space-y-2">
            {filteredModules.length === 0 ? (
              <div className="text-center py-8">
                <XCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No se encontraron módulos' : 'Sin módulos definidos'}
                </p>
              </div>
            ) : (
              filteredModules.map((module, index) => (
                <div
                  key={index}
                  onClick={() => onItemClick?.({ type: 'module', data: module }, true)}
                  className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                        <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {module.name}
                        </h4>
                        {(module.type || module.category) && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {module.type || module.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {module.status && (
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          module.status === 'completed' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : module.status === 'in_development'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {module.status === 'planned' ? 'Planificado' : 
                           module.status === 'in_development' ? 'En desarrollo' : 
                           module.status === 'completed' ? 'Completado' : module.status}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {module.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {module.description}
                    </p>
                  )}

                  {/* Features o Technologies */}
                  {(module.features?.length > 0 || module.technologies?.length > 0) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {(module.features || module.technologies)?.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                          {item}
                        </span>
                      ))}
                      {(module.features || module.technologies)?.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{(module.features || module.technologies).length - 3} más
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Complejidad */}
                  {module.estimated_complexity && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Complejidad:</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        module.estimated_complexity === 'high' || module.estimated_complexity === 'very_high'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : module.estimated_complexity === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}>
                        {module.estimated_complexity}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Security & Patterns */}
        {(architecture.security || architecture.architecture_patterns?.length > 0) && (
          <div className="space-y-2">
            {/* Security Section */}
            {architecture.security && (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleSection('security')}
                  className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Shield className="w-5 h-5 text-red-500" />
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white flex-1 text-left">
                    Seguridad
                  </h4>
                  {expandedSections.security ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                
                {expandedSections.security && (
                  <div className="px-3 pb-3 space-y-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="pt-2 grid grid-cols-2 gap-2">
                      {architecture.security.authentication_method && (
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Autenticación</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {architecture.security.authentication_method}
                          </p>
                        </div>
                      )}
                      {architecture.security.authorization_model && (
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Autorización</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {architecture.security.authorization_model}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {architecture.security.encryption_in_transit && (
                        <span className="px-2 py-1 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          ✓ SSL/TLS
                        </span>
                      )}
                      {architecture.security.security_headers && (
                        <span className="px-2 py-1 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          ✓ Headers seguros
                        </span>
                      )}
                      {architecture.security.audit_logging && (
                        <span className="px-2 py-1 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          ✓ Audit logs
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Patterns Section */}
            {architecture.architecture_patterns?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleSection('patterns')}
                  className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Boxes className="w-5 h-5 text-indigo-500" />
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white flex-1 text-left">
                    Patrones de Arquitectura
                  </h4>
                  <span className="text-xs text-gray-400 mr-2">
                    {architecture.architecture_patterns.length}
                  </span>
                  {expandedSections.patterns ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                
                {expandedSections.patterns && (
                  <div className="px-3 pb-3 space-y-2 border-t border-gray-100 dark:border-gray-800">
                    {architecture.architecture_patterns.map((pattern, idx) => (
                      <div key={idx} className="pt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {pattern.pattern || pattern}
                        </p>
                        {pattern.applied_to && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Aplicado a: {pattern.applied_to}
                          </p>
                        )}
                        {pattern.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {pattern.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Architecture Decisions */}
        {architecture.architecture_decisions?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <button
              onClick={() => toggleSection('decisions')}
              className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <FileCode className="w-5 h-5 text-amber-500" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white flex-1 text-left">
                Decisiones de Arquitectura
              </h4>
              <span className="text-xs text-gray-400 mr-2">
                {architecture.architecture_decisions.length}
              </span>
              {expandedSections.decisions ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {expandedSections.decisions && (
              <div className="px-3 pb-3 space-y-2 border-t border-gray-100 dark:border-gray-800">
                {architecture.architecture_decisions.map((decision, index) => (
                  <div
                    key={index}
                    className="pt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {decision.title || decision.decision}
                    </h5>
                    {decision.context && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Contexto:</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300">{decision.context}</p>
                      </div>
                    )}
                    {(decision.rationale || decision.consequences) && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Justificación:</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          {decision.rationale || decision.consequences}
                        </p>
                      </div>
                    )}
                    {decision.alternatives_considered?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Alternativas:</p>
                        <div className="flex flex-wrap gap-1">
                          {decision.alternatives_considered.map((alt, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              {alt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        decision.status === 'accepted' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {decision.status || 'Aceptada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Database Schema */}
        {architecture.database_schema?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <button
              onClick={() => toggleSection('database')}
              className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Table className="w-5 h-5 text-emerald-500" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white flex-1 text-left">
                Esquema de Base de Datos
              </h4>
              <span className="text-xs text-gray-400 mr-2">
                {architecture.database_schema.length} tabla{architecture.database_schema.length !== 1 ? 's' : ''}
              </span>
              {expandedSections.database ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {expandedSections.database && (
              <div className="px-3 pb-3 space-y-3 border-t border-gray-100 dark:border-gray-800">
                {architecture.database_schema.map((entity, index) => (
                  <div
                    key={index}
                    className="pt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-emerald-500" />
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        {entity.entity || entity.table_name}
                      </h5>
                      {entity.collection_name && (
                        <span className="text-xs text-gray-400">({entity.collection_name})</span>
                      )}
                    </div>
                    {entity.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{entity.description}</p>
                    )}
                    {entity.fields?.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Campos:</p>
                        <div className="grid grid-cols-2 gap-1">
                          {entity.fields.map((field, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-xs">
                              <span className="text-gray-700 dark:text-gray-300 font-mono">
                                {typeof field === 'string' ? field : field.name}
                              </span>
                              {field.type && (
                                <span className="text-gray-400">: {field.type}</span>
                              )}
                              {field.required && (
                                <span className="text-red-400">*</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {entity.relationships?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {entity.relationships.map((rel, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {rel.type || '→'} {rel.target_entity || rel}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* API Endpoints */}
        {architecture.api_endpoints?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <button
              onClick={() => toggleSection('endpoints')}
              className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <GitBranch className="w-5 h-5 text-amber-500" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white flex-1 text-left">
                API Endpoints
              </h4>
              <span className="text-xs text-gray-400 mr-2">
                {architecture.api_endpoints.length} endpoint{architecture.api_endpoints.length !== 1 ? 's' : ''}
              </span>
              {expandedSections.endpoints ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {expandedSections.endpoints && (
              <div className="px-3 pb-3 space-y-2 border-t border-gray-100 dark:border-gray-800">
                {architecture.api_endpoints.map((endpoint, index) => {
                  const methodColors = {
                    GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                    POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                    PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
                    PATCH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
                    DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  };
                  
                  return (
                    <div
                      key={index}
                      className="pt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${methodColors[endpoint.method] || 'bg-gray-100 text-gray-700'}`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                          {endpoint.path}
                        </code>
                      </div>
                      {endpoint.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">{endpoint.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        {endpoint.auth_required && (
                          <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            🔐 Auth
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          endpoint.status === 'implemented' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {endpoint.status === 'implemented' ? '✓ Implementado' : 'Planificado'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Integraciones */}
        {architecture.integrations?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <button
              onClick={() => toggleSection('integrations')}
              className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Link className="w-5 h-5 text-cyan-500" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white flex-1 text-left">
                Integraciones
              </h4>
              <span className="text-xs text-gray-400 mr-2">
                {architecture.integrations.length}
              </span>
              {expandedSections.integrations ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {expandedSections.integrations && (
              <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-800">
                <div className="pt-2 grid grid-cols-2 gap-2">
                  {architecture.integrations.map((integration, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {typeof integration === 'string' ? integration : integration.name}
                      </span>
                      {integration.type && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {integration.type}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Estructura del Proyecto */}
        {(architecture.project_structure || architecture.directory_structure) && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <button
              onClick={() => toggleSection('structure')}
              className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <FolderTree className="w-5 h-5 text-violet-500" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white flex-1 text-left">
                Estructura del Proyecto
              </h4>
              {expandedSections.structure ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {expandedSections.structure && (
              <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-800">
                <div className="pt-2 font-mono text-xs">
                  <FolderStructure structure={architecture.project_structure || architecture.directory_structure} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {metadata && (
        <div className="p-3 border-t border-gray-200/60 dark:border-gray-800/60">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Arquitectura completa: {architecture.completeness_score >= 80 ? '✅' : '⏳'}</span>
            <span>{new Date(architecture.updatedAt || architecture.createdAt).toLocaleDateString('es-ES')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitectureCanvas;
