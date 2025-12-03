/**
 * EntityList Component
 * Lista de entidades del esquema de base de datos
 * 
 * @module components/ProductOwner/DatabaseSchema/EntityList
 */

import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  Layers, 
  Eye, 
  Trash2, 
  Code, 
  GitBranch, 
  Calendar,
  Database,
  Search,
  MoreVertical,
  RefreshCw,
  Copy,
  Download
} from 'lucide-react';

const EntityList = ({ 
  entities = [], 
  loading = false,
  onView,
  onDelete,
  onGenerateCode,
  onResync
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionsFor, setShowActionsFor] = useState(null);

  // Filtrar entidades por búsqueda
  const filteredEntities = entities.filter(entity => 
    entity.entity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cerrar menú de acciones al hacer clic fuera
  const handleClickOutside = () => {
    setShowActionsFor(null);
  };

  // Manejar generación de código
  const handleGenerateCode = async (entityName) => {
    setShowActionsFor(null);
    if (onGenerateCode) {
      const result = await onGenerateCode(entityName);
      if (result?.code) {
        // Copiar al portapapeles
        navigator.clipboard.writeText(result.code);
        alert('Código copiado al portapapeles');
      }
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Tipo de fuente colores
  const sourceTypeColors = {
    mongoose: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    prisma: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    sequelize: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    typeorm: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    manual: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div 
            key={i}
            className={`animate-pulse rounded-lg p-4 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-lg ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
              }`}></div>
              <div className="flex-1 space-y-2">
                <div className={`h-4 w-1/4 rounded ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}></div>
                <div className={`h-3 w-1/2 rounded ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div onClick={handleClickOutside}>
      {/* Barra de búsqueda */}
      <div className="mb-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Buscar entidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
      </div>

      {/* Lista de entidades */}
      {filteredEntities.length === 0 ? (
        <div className="text-center py-12">
          <Layers className={`mx-auto h-12 w-12 mb-4 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h3 className={`text-lg font-medium mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {searchTerm ? 'No se encontraron entidades' : 'Sin entidades'}
          </h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {searchTerm 
              ? 'Intenta con otro término de búsqueda'
              : 'Importa código de modelos para comenzar'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntities.map((entity, index) => (
            <div
              key={entity.entity || index}
              className={`relative rounded-lg border p-4 transition-all hover:shadow-md ${
                theme === 'dark'
                  ? 'bg-gray-750 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icono */}
                <div className={`p-2.5 rounded-lg ${
                  theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-100'
                }`}>
                  <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-lg font-semibold truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {entity.entity}
                    </h3>
                    {entity.source_type && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        sourceTypeColors[entity.source_type] || sourceTypeColors.manual
                      }`}>
                        {entity.source_type}
                      </span>
                    )}
                  </div>

                  {entity.description && (
                    <p className={`text-sm mb-2 line-clamp-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {entity.description}
                    </p>
                  )}

                  {/* Estadísticas */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className={`flex items-center gap-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <Database size={14} />
                      <span>{entity.fields_count || entity.fields?.length || 0} campos</span>
                    </div>
                    <div className={`flex items-center gap-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <GitBranch size={14} />
                      <span>{entity.relationships_count || entity.relationships?.length || 0} relaciones</span>
                    </div>
                    {entity.imported_at && (
                      <div className={`flex items-center gap-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        <Calendar size={14} />
                        <span>Importado: {formatDate(entity.imported_at)}</span>
                      </div>
                    )}
                    {entity.module && (
                      <div className={`px-2 py-0.5 rounded text-xs ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {entity.module}
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1">
                  {/* Botón Ver */}
                  <button
                    onClick={() => onView?.(entity.entity)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Ver detalles"
                  >
                    <Eye size={18} />
                  </button>

                  {/* Botón Código */}
                  <button
                    onClick={() => handleGenerateCode(entity.entity)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Generar código"
                  >
                    <Code size={18} />
                  </button>

                  {/* Botón Eliminar */}
                  <button
                    onClick={() => onDelete?.(entity.entity)}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30'
                        : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* Menú de más acciones */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionsFor(showActionsFor === entity.entity ? null : entity.entity);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* Dropdown de acciones */}
                    {showActionsFor === entity.entity && (
                      <div 
                        className={`absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border z-10 ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-gray-200'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setShowActionsFor(null);
                              onResync?.(entity.entity);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                              theme === 'dark'
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <RefreshCw size={16} />
                            Re-sincronizar
                          </button>
                          <button
                            onClick={() => handleGenerateCode(entity.entity)}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                              theme === 'dark'
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Copy size={16} />
                            Copiar código
                          </button>
                          <button
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                              theme === 'dark'
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Download size={16} />
                            Descargar .js
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contador */}
      {filteredEntities.length > 0 && (
        <div className={`mt-4 text-sm ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Mostrando {filteredEntities.length} de {entities.length} entidades
        </div>
      )}
    </div>
  );
};

export default EntityList;
