/**
 * DelegationFilters Component
 * Barra de filtros para la tabla de delegaciones
 */

import { Search, Filter, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const DelegationFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  agentTypes = []
}) => {
  const { theme } = useTheme();

  const handleSearchChange = (e) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e) => {
    onFiltersChange({ ...filters, status: e.target.value });
  };

  const handleAgentTypeChange = (e) => {
    onFiltersChange({ ...filters, agentType: e.target.value });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.agentType !== 'all';

  return (
    <div className={`
      p-4 border-b
      ${theme === 'dark' 
        ? 'bg-gray-900/50 border-gray-700' 
        : 'bg-gray-50 border-gray-200'}
    `}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1">
          <div className="relative">
            <Search className={`
              absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
            `} />
            <input
              type="text"
              placeholder="Buscar por agente, producto o sprint..."
              value={filters.search}
              onChange={handleSearchChange}
              className={`
                w-full pl-10 pr-4 py-2 rounded-lg border transition-colors
                ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'}
                focus:outline-none focus:ring-2 focus:ring-blue-500/20
              `}
            />
          </div>
        </div>

        {/* Filtro por Estado */}
        <div className="w-full md:w-48">
          <div className="relative">
            <Filter className={`
              absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
            `} />
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className={`
                w-full pl-10 pr-4 py-2 rounded-lg border appearance-none cursor-pointer transition-colors
                ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}
                focus:outline-none focus:ring-2 focus:ring-blue-500/20
              `}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="suspended">Suspendidos</option>
              <option value="revoked">Revocados</option>
              <option value="expired">Expirados</option>
            </select>
          </div>
        </div>

        {/* Filtro por Tipo de Agente */}
        {agentTypes.length > 0 && (
          <div className="w-full md:w-48">
            <select
              value={filters.agentType}
              onChange={handleAgentTypeChange}
              className={`
                w-full px-4 py-2 rounded-lg border appearance-none cursor-pointer transition-colors
                ${theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}
                focus:outline-none focus:ring-2 focus:ring-blue-500/20
              `}
            >
              <option value="all">Todos los agentes</option>
              {agentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Botón Limpiar Filtros */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap
              ${theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
            `}
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Indicadores de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.search && (
            <div className={`
              inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium
              ${theme === 'dark'
                ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
                : 'bg-blue-100 text-blue-700 border border-blue-200'}
            `}>
              <span>Búsqueda: "{filters.search}"</span>
              <button
                onClick={() => onFiltersChange({ ...filters, search: '' })}
                className="hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {filters.status !== 'all' && (
            <div className={`
              inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium
              ${theme === 'dark'
                ? 'bg-purple-900/30 text-purple-400 border border-purple-800'
                : 'bg-purple-100 text-purple-700 border border-purple-200'}
            `}>
              <span>Estado: {filters.status}</span>
              <button
                onClick={() => onFiltersChange({ ...filters, status: 'all' })}
                className="hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {filters.agentType !== 'all' && (
            <div className={`
              inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium
              ${theme === 'dark'
                ? 'bg-green-900/30 text-green-400 border border-green-800'
                : 'bg-green-100 text-green-700 border border-green-200'}
            `}>
              <span>
                Agente: {agentTypes.find(t => t.value === filters.agentType)?.label || filters.agentType}
              </span>
              <button
                onClick={() => onFiltersChange({ ...filters, agentType: 'all' })}
                className="hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
