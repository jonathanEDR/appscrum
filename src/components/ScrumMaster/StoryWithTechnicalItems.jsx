import React, { useState } from 'react';
import { 
  Target, 
  Bug, 
  Settings, 
  CheckSquare, 
  User, 
  Eye,
  ChevronDown,
  ChevronRight,
  Link2,
  MoreVertical
} from 'lucide-react';

const StoryWithTechnicalItems = ({ 
  storyData, 
  onViewDetails, 
  onAssignTechnicalItem,
  onEditTechnicalItem 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { historia, items_tecnicos } = storyData;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completado': return 'bg-green-100 text-green-800';
      case 'en_progreso': return 'bg-yellow-100 text-yellow-800';
      case 'pendiente': return 'bg-gray-100 text-gray-800';
      case 'bloqueado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completado': return 'Completado';
      case 'en_progreso': return 'En Progreso';
      case 'pendiente': return 'Pendiente';
      case 'bloqueado': return 'Bloqueado';
      default: return 'Sin estado';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critica': return 'text-red-600';
      case 'alta': return 'text-orange-600';
      case 'media': return 'text-yellow-600';
      case 'baja': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTechnicalItemIcon = (type) => {
    switch (type) {
      case 'tarea': return <CheckSquare className="h-4 w-4" />;
      case 'bug': return <Bug className="h-4 w-4" />;
      case 'mejora': return <Settings className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  const getTechnicalItemColor = (type) => {
    switch (type) {
      case 'tarea': return 'bg-purple-100 text-purple-600';
      case 'bug': return 'bg-red-100 text-red-600';
      case 'mejora': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTechnicalItemTypeText = (type) => {
    switch (type) {
      case 'tarea': return 'Tarea';
      case 'bug': return 'Bug';
      case 'mejora': return 'Mejora';
      default: return 'Item';
    }
  };

  const getCompletionStats = () => {
    const total = items_tecnicos.length;
    const completed = items_tecnicos.filter(item => item.estado === 'completado').length;
    const inProgress = items_tecnicos.filter(item => item.estado === 'en_progreso').length;
    
    return { total, completed, inProgress, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const stats = getCompletionStats();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header de la historia */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Target className="h-5 w-5" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {historia.titulo}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(historia.estado)}`}>
                    {getStatusText(historia.estado)}
                  </span>
                  {historia.puntos_historia && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium">
                      {historia.puntos_historia} SP
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-3">
                  {historia.descripcion}
                </p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Producto:</span>
                    <span>{historia.producto?.nombre || 'Sin producto'}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Prioridad:</span>
                    <span className={getPriorityColor(historia.prioridad)}>
                      {historia.prioridad?.charAt(0).toUpperCase() + historia.prioridad?.slice(1) || 'Media'}
                    </span>
                  </div>
                  
                  {historia.asignado_a && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{historia.asignado_a.nombre_negocio || historia.asignado_a.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Barra de progreso de items técnicos */}
            {items_tecnicos.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progreso de Items Técnicos
                  </span>
                  <span className="text-sm text-gray-500">
                    {stats.completed}/{stats.total} completados
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.percentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>✅ {stats.completed} completados</span>
                  <span>🔄 {stats.inProgress} en progreso</span>
                  <span>📋 {stats.total} total</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-6">
            {items_tecnicos.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {isExpanded ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
                {items_tecnicos.length} items técnicos
              </button>
            )}
            
            <button
              onClick={() => onViewDetails(historia)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Ver detalles de historia"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Items técnicos (expandible) */}
      {isExpanded && items_tecnicos.length > 0 && (
        <div className="p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              Items Técnicos Asignados
            </h4>
            <div className="text-sm text-gray-500">
              {items_tecnicos.length} item{items_tecnicos.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="space-y-3">
            {items_tecnicos.map((item) => (
              <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${getTechnicalItemColor(item.tipo)}`}>
                      {getTechnicalItemIcon(item.tipo)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 truncate">
                          {item.titulo}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.estado)}`}>
                          {getStatusText(item.estado)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTechnicalItemColor(item.tipo)}`}>
                          {getTechnicalItemTypeText(item.tipo)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 truncate">
                        {item.descripcion}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Prioridad:</span>
                          <span className={getPriorityColor(item.prioridad)}>
                            {item.prioridad?.charAt(0).toUpperCase() + item.prioridad?.slice(1) || 'Media'}
                          </span>
                        </div>
                        
                        {item.asignado_a && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{item.asignado_a.nombre_negocio || item.asignado_a.email}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Link2 className="h-3 w-3" />
                          <span>Asignado a historia</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => onAssignTechnicalItem(item)}
                      className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                      title="Reasignar a otra historia"
                    >
                      <Link2 className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => onViewDetails(item)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => onEditTechnicalItem?.(item)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Más opciones"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay items técnicos */}
      {items_tecnicos.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          <div className="flex flex-col items-center gap-2">
            <CheckSquare className="h-8 w-8 text-gray-300" />
            <p className="text-sm">No hay items técnicos asignados a esta historia</p>
            <p className="text-xs">Las tareas, bugs y mejoras aparecerán aquí cuando se asignen</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryWithTechnicalItems;
