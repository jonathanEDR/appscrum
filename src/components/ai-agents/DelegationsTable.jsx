/**
 * DelegationsTable Component
 * Tabla para mostrar y gestionar delegaciones de permisos
 */

import { useState, useMemo } from 'react';
import { Shield, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { DelegationRow } from './DelegationRow';
import { DelegationFilters } from './DelegationFilters';

export const DelegationsTable = ({ 
  delegations = [], 
  loading = false,
  onSuspend,
  onReactivate,
  onRevoke,
  onViewDetails
}) => {
  const { theme } = useTheme();
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    agentType: 'all'
  });

  // Filtrar delegaciones
  const filteredDelegations = useMemo(() => {
    return delegations.filter(delegation => {
      // Filtro de búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const agentTypeMatch = delegation.agentType?.toLowerCase().includes(searchLower);
        const scopeMatch = delegation.scope?.productId?.name?.toLowerCase().includes(searchLower) ||
                          delegation.scope?.sprintId?.name?.toLowerCase().includes(searchLower);
        
        if (!agentTypeMatch && !scopeMatch) return false;
      }

      // Filtro de estado
      if (filters.status !== 'all' && delegation.status !== filters.status) {
        return false;
      }

      // Filtro de tipo de agente
      if (filters.agentType !== 'all' && delegation.agentType !== filters.agentType) {
        return false;
      }

      return true;
    });
  }, [delegations, filters]);

  // Obtener tipos únicos de agentes
  const agentTypes = useMemo(() => {
    const types = [...new Set(delegations.map(d => d.agentType))];
    return types.map(type => ({
      value: type,
      label: type
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }));
  }, [delegations]);

  // Handler para limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      agentType: 'all'
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className={`
        rounded-xl border p-12 flex flex-col items-center justify-center
        ${theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'}
      `}>
        <Loader2 className={`w-12 h-12 mb-4 animate-spin ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <p className={`text-lg font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Cargando delegaciones...
        </p>
      </div>
    );
  }

  // Empty State (sin delegaciones)
  if (delegations.length === 0) {
    return (
      <div className={`
        rounded-xl border-2 border-dashed p-12 text-center
        ${theme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-gray-50 border-gray-300'}
      `}>
        <div className={`
          inline-flex items-center justify-center w-16 h-16 rounded-full mb-4
          ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
        `}>
          <Shield className={`w-8 h-8 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`} />
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          No tienes delegaciones
        </h3>
        <p className={`${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Comienza delegando permisos a un agente desde la pestaña "Agentes Disponibles"
        </p>
      </div>
    );
  }

  // No Results State (filtros aplicados sin resultados)
  if (filteredDelegations.length === 0) {
    return (
      <div className={`
        rounded-xl border
        ${theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'}
      `}>
        {/* Filtros */}
        <DelegationFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
          agentTypes={agentTypes}
        />

        {/* Sin resultados */}
        <div className="p-12 text-center">
          <div className={`
            inline-flex items-center justify-center w-16 h-16 rounded-full mb-4
            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
          `}>
            <AlertCircle className={`w-8 h-8 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No se encontraron delegaciones
          </h3>
          <p className={`mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Intenta ajustar los filtros de búsqueda
          </p>
          <button
            onClick={handleClearFilters}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
            `}
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    );
  }

  // Tabla con datos
  return (
    <div className={`
      rounded-xl border overflow-hidden
      ${theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'}
    `}>
      {/* Filtros */}
      <DelegationFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        agentTypes={agentTypes}
      />

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`
            border-b
            ${theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-700' 
              : 'bg-gray-50 border-gray-200'}
          `}>
            <tr>
              <th className={`
                px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Agente
              </th>
              <th className={`
                px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Alcance
              </th>
              <th className={`
                px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Estado
              </th>
              <th className={`
                px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Uso
              </th>
              <th className={`
                px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Fecha
              </th>
              <th className={`
                px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDelegations.map((delegation) => (
              <DelegationRow
                key={delegation._id}
                delegation={delegation}
                onSuspend={onSuspend}
                onReactivate={onReactivate}
                onRevoke={onRevoke}
                onViewDetails={onViewDetails}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer con información */}
      <div className={`
        px-6 py-3 border-t flex items-center justify-between
        ${theme === 'dark' 
          ? 'bg-gray-900/50 border-gray-700' 
          : 'bg-gray-50 border-gray-200'}
      `}>
        <div className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Mostrando <span className="font-medium">{filteredDelegations.length}</span> de{' '}
          <span className="font-medium">{delegations.length}</span> delegaciones
        </div>
        
        {filters.search || filters.status !== 'all' || filters.agentType !== 'all' ? (
          <button
            onClick={handleClearFilters}
            className={`
              text-sm font-medium transition-colors
              ${theme === 'dark'
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-700'}
            `}
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>
    </div>
  );
};
