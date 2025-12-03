/**
 * useAgents Hook
 * Hook para gestionar agentes AI disponibles
 */

import { useState, useEffect, useCallback } from 'react';
import { aiAgentsService } from '../services/aiAgentsService';
import { useAuth } from '@clerk/clerk-react';

export const useAgents = (initialFilters = {}) => {
  const { isSignedIn, getToken } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  /**
   * Cargar lista de agentes
   */
  const fetchAgents = useCallback(async () => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await aiAgentsService.getAgents(filters, getToken);
      setAgents(response.agents || []);
    } catch (err) {
      console.error('Error al cargar agentes:', err);
      setError(err.message || 'Error al cargar agentes');
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, getToken, filters]);

  /**
   * Obtener un agente específico por ID
   */
  const getAgentById = useCallback(async (agentId) => {
    try {
      const response = await aiAgentsService.getAgentById(agentId, getToken);
      return response.agent;
    } catch (err) {
      console.error('Error al obtener agente:', err);
      throw err;
    }
  }, [getToken]);

  /**
   * Actualizar filtros
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Limpiar filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Cargar agentes al montar o cuando cambien los filtros
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    loading,
    error,
    filters,
    refetch: fetchAgents,
    getAgentById,
    updateFilters,
    clearFilters
  };
};

export default useAgents;
