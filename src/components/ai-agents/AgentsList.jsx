/**
 * AgentsList Component
 * Lista de agentes AI con filtros y búsqueda
 */

import React, { useState, useMemo } from 'react';
import { Search, Filter, Bot, RefreshCw } from 'lucide-react';
import AgentCard from './AgentCard';
import { useTheme } from '../../context/ThemeContext';

const AgentsList = ({ 
  agents = [], 
  loading = false, 
  onDelegate,
  onViewDetails,
  onRefresh,
  delegations = []
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');

  // Tipos de agentes disponibles
  const agentTypes = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'product_owner', label: 'Product Owner' },
    { value: 'scrum_master', label: 'Scrum Master' },
    { value: 'developer', label: 'Developer' },
    { value: 'tester', label: 'Tester' },
    { value: 'custom', label: 'Personalizado' }
  ];

  // Estados disponibles
  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
    { value: 'training', label: 'En entrenamiento' }
  ];

  // Verificar si un agente tiene delegación
  const hasDelegation = (agentId) => {
    return delegations.some(d => d.agent_id === agentId && d.status === 'active');
  };

  // Filtrar agentes
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      // Filtro por búsqueda
      const matchesSearch = searchTerm === '' || 
        agent.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por tipo
      const matchesType = filterType === 'all' || agent.type === filterType;

      // Filtro por estado
      const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [agents, searchTerm, filterType, filterStatus]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div 
          key={i}
          className={`rounded-2xl border-2 overflow-hidden ${
            theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="animate-pulse">
            <div className="h-24 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="flex gap-2 pt-2">
                <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className={`text-center py-16 px-4 rounded-2xl border-2 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <Bot className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={40} />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        No se encontraron agentes
      </h3>
      <p className={`mb-4 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {searchTerm || filterType !== 'all' || filterStatus !== 'active'
          ? 'Intenta ajustar los filtros de búsqueda'
          : 'No hay agentes disponibles en este momento'}
      </p>
      {(searchTerm || filterType !== 'all' || filterStatus !== 'active') && (
        <button
          onClick={() => {
            setSearchTerm('');
            setFilterType('all');
            setFilterStatus('active');
          }}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <Search 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} 
            size={20} 
          />
          <input
            type="text"
            placeholder="Buscar agentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        {/* Filtro por tipo */}
        <div className="relative">
          <Filter 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} 
            size={18} 
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`pl-10 pr-8 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            {agentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por estado */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          {statusOptions.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        {/* Botón refresh */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`px-4 py-2.5 rounded-lg border-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
            }`}
          >
            <RefreshCw 
              className={loading ? 'animate-spin' : ''} 
              size={20} 
            />
          </button>
        )}
      </div>

      {/* Contador de resultados */}
      {!loading && agents.length > 0 && (
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Mostrando <span className="font-semibold">{filteredAgents.length}</span> de{' '}
          <span className="font-semibold">{agents.length}</span> agentes
        </div>
      )}

      {/* Lista de agentes */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredAgents.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent._id}
              agent={agent}
              hasDelegation={hasDelegation(agent._id)}
              onDelegate={onDelegate}
              onViewDetails={onViewDetails}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentsList;
