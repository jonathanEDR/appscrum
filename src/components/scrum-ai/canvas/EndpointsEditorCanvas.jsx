/**
 * EndpointsEditorCanvas - Canvas específico para editar API endpoints
 * Muestra los endpoints con método, path, descripción y más detalles
 */

import { useState } from 'react';
import { 
  Globe,
  ChevronDown,
  Lock,
  Unlock,
  FileJson,
  ArrowRight,
  Tag,
  Users,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

// Colores y estilos por método HTTP
const METHOD_STYLES = {
  GET: { 
    bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800'
  },
  POST: { 
    bg: 'bg-blue-100 dark:bg-blue-900/30', 
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800'
  },
  PUT: { 
    bg: 'bg-amber-100 dark:bg-amber-900/30', 
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800'
  },
  PATCH: { 
    bg: 'bg-orange-100 dark:bg-orange-900/30', 
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800'
  },
  DELETE: { 
    bg: 'bg-red-100 dark:bg-red-900/30', 
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800'
  }
};

// Iconos por estado
const STATUS_ICONS = {
  'implemented': { icon: CheckCircle, color: 'text-green-500' },
  'in_progress': { icon: Clock, color: 'text-amber-500' },
  'planned': { icon: AlertCircle, color: 'text-gray-400' }
};

// Componente para el badge del método HTTP
const MethodBadge = ({ method }) => {
  const upperMethod = (method || 'GET').toUpperCase();
  const style = METHOD_STYLES[upperMethod] || METHOD_STYLES.GET;
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${style.bg} ${style.text}`}>
      {upperMethod}
    </span>
  );
};

// Componente para mostrar un endpoint
const EndpointCard = ({ endpoint, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const method = (endpoint.method || 'GET').toUpperCase();
  const path = endpoint.path || endpoint.endpoint || '/unknown';
  const description = endpoint.description || 'Sin descripción';
  const authRequired = endpoint.auth_required !== false;
  const roles = endpoint.roles_allowed || endpoint.roles || [];
  const module = endpoint.module || '';
  const status = endpoint.status || 'planned';
  
  const methodStyle = METHOD_STYLES[method] || METHOD_STYLES.GET;
  const statusInfo = STATUS_ICONS[status] || STATUS_ICONS.planned;
  const StatusIcon = statusInfo.icon;
  
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border ${methodStyle.border} overflow-hidden`}>
      {/* Header del endpoint */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <MethodBadge method={method} />
          <code className="text-sm font-mono text-gray-800 dark:text-gray-200 truncate">
            {path}
          </code>
          {authRequired ? (
            <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" title="Requiere autenticación" />
          ) : (
            <Unlock className="w-4 h-4 text-gray-400 flex-shrink-0" title="Público" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
        </div>
      </button>
      
      {/* Contenido expandido */}
      {isExpanded && (
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-3">
          {/* Descripción */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
          
          {/* Detalles */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {/* Módulo */}
            {module && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-violet-500" />
                <span className="text-gray-500 dark:text-gray-400">Módulo:</span>
                <span className="text-gray-700 dark:text-gray-300">{module}</span>
              </div>
            )}
            
            {/* Estado */}
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
              <span className="text-gray-500 dark:text-gray-400">Estado:</span>
              <span className="text-gray-700 dark:text-gray-300 capitalize">
                {status.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          {/* Roles permitidos */}
          {roles.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Roles:</span>
              {roles.map((role, idx) => (
                <span 
                  key={idx}
                  className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Agrupar endpoints por módulo o por método
const groupEndpoints = (endpoints, groupBy = 'method') => {
  const groups = {};
  
  endpoints.forEach(ep => {
    const key = groupBy === 'method' 
      ? (ep.method || 'GET').toUpperCase()
      : (ep.module || 'General');
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(ep);
  });
  
  return groups;
};

export const EndpointsEditorCanvas = ({ endpoints = [] }) => {
  const [groupBy, setGroupBy] = useState('method'); // 'method' or 'module'
  const endpointList = Array.isArray(endpoints) ? endpoints : [];
  
  const grouped = groupEndpoints(endpointList, groupBy);
  const groupKeys = Object.keys(grouped).sort();
  
  // Contar por método
  const methodCounts = {
    GET: endpointList.filter(e => (e.method || 'GET').toUpperCase() === 'GET').length,
    POST: endpointList.filter(e => (e.method || '').toUpperCase() === 'POST').length,
    PUT: endpointList.filter(e => (e.method || '').toUpperCase() === 'PUT').length,
    PATCH: endpointList.filter(e => (e.method || '').toUpperCase() === 'PATCH').length,
    DELETE: endpointList.filter(e => (e.method || '').toUpperCase() === 'DELETE').length,
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                API Endpoints
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {endpointList.length} {endpointList.length === 1 ? 'endpoint' : 'endpoints'} definidos
              </p>
            </div>
          </div>
          
          {/* Toggle de agrupación */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setGroupBy('method')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                groupBy === 'method' 
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Por Método
            </button>
            <button
              onClick={() => setGroupBy('module')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                groupBy === 'module' 
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Por Módulo
            </button>
          </div>
        </div>
        
        {/* Resumen por método */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {Object.entries(methodCounts).map(([method, count]) => count > 0 && (
            <div key={method} className="flex items-center gap-1">
              <MethodBadge method={method} />
              <span className="text-xs text-gray-500 dark:text-gray-400">×{count}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Contenido - Lista de endpoints agrupados */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {endpointList.length > 0 ? (
          groupKeys.map(groupKey => (
            <div key={groupKey}>
              {/* Header del grupo */}
              <div className="flex items-center gap-2 mb-2">
                {groupBy === 'method' ? (
                  <MethodBadge method={groupKey} />
                ) : (
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    📁 {groupKey}
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  ({grouped[groupKey].length})
                </span>
              </div>
              
              {/* Endpoints del grupo */}
              <div className="space-y-2 ml-2">
                {grouped[groupKey].map((endpoint, idx) => (
                  <EndpointCard 
                    key={idx} 
                    endpoint={endpoint} 
                    defaultExpanded={idx === 0 && groupKeys.indexOf(groupKey) === 0}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Sin endpoints definidos</p>
            <p className="text-sm">Usa el chat para agregar endpoints a la API</p>
          </div>
        )}
      </div>
      
      {/* Footer con tip */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 Escribe "agregar endpoint POST /api/users para crear usuarios" para modificar
        </p>
      </div>
    </div>
  );
};

export default EndpointsEditorCanvas;
