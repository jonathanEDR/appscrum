/**
 * useDelegations Hook
 * Hook para gestionar delegaciones de permisos a agentes AI
 */

import { useState, useEffect, useCallback } from 'react';
import { aiAgentsService } from '../services/aiAgentsService';
import { useAuth } from '@clerk/clerk-react';

export const useDelegations = (initialFilters = {}) => {
  const { isSignedIn, getToken } = useAuth();
  const [delegations, setDelegations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  /**
   * Cargar delegaciones del usuario
   */
  const fetchDelegations = useCallback(async () => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await aiAgentsService.getMyDelegations(filters, getToken);
      setDelegations(response.delegations || []);
      setSummary(response.summary || null);
    } catch (err) {
      console.error('Error al cargar delegaciones:', err);
      setError(err.message || 'Error al cargar delegaciones');
      setDelegations([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, getToken, filters]);

  /**
   * Crear una nueva delegación
   */
  const createDelegation = useCallback(async (delegationData) => {
    try {
      setError(null);
      const response = await aiAgentsService.createDelegation(delegationData, getToken);
      
      // Recargar delegaciones después de crear
      await fetchDelegations();
      
      return response;
    } catch (err) {
      console.error('Error al crear delegación:', err);
      setError(err.message || 'Error al crear delegación');
      throw err;
    }
  }, [getToken, fetchDelegations]);

  /**
   * Revocar una delegación
   */
  const revokeDelegation = useCallback(async (delegationId) => {
    try {
      setError(null);
      const response = await aiAgentsService.revokeDelegation(delegationId, getToken);
      
      // Recargar delegaciones después de revocar
      await fetchDelegations();
      
      return response;
    } catch (err) {
      console.error('Error al revocar delegación:', err);
      setError(err.message || 'Error al revocar delegación');
      throw err;
    }
  }, [getToken, fetchDelegations]);

  /**
   * Suspender una delegación
   */
  const suspendDelegation = useCallback(async (delegationId) => {
    try {
      setError(null);
      const response = await aiAgentsService.suspendDelegation(delegationId, getToken);
      
      // Actualizar delegación en el estado local
      setDelegations(prev => 
        prev.map(d => 
          d._id === delegationId 
            ? { ...d, status: 'suspended' }
            : d
        )
      );
      
      return response;
    } catch (err) {
      console.error('Error al suspender delegación:', err);
      setError(err.message || 'Error al suspender delegación');
      throw err;
    }
  }, [getToken]);

  /**
   * Reactivar una delegación
   */
  const reactivateDelegation = useCallback(async (delegationId) => {
    try {
      setError(null);
      const response = await aiAgentsService.reactivateDelegation(delegationId, getToken);
      
      // Actualizar delegación en el estado local
      setDelegations(prev => 
        prev.map(d => 
          d._id === delegationId 
            ? { ...d, status: 'active' }
            : d
        )
      );
      
      return response;
    } catch (err) {
      console.error('Error al reactivar delegación:', err);
      setError(err.message || 'Error al reactivar delegación');
      throw err;
    }
  }, [getToken]);

  /**
   * Verificar si existe delegación activa para un agente
   */
  const hasActiveDelegation = useCallback((agentId) => {
    return delegations.some(
      d => d.agent_id === agentId && d.status === 'active'
    );
  }, [delegations]);

  /**
   * Obtener delegación de un agente específico
   */
  const getDelegationByAgent = useCallback((agentId) => {
    return delegations.find(d => d.agent_id === agentId);
  }, [delegations]);

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

  // Cargar delegaciones al montar o cuando cambien los filtros
  useEffect(() => {
    fetchDelegations();
  }, [fetchDelegations]);

  return {
    delegations,
    loading,
    error,
    summary,
    filters,
    refetch: fetchDelegations,
    createDelegation,
    revokeDelegation,
    suspendDelegation,
    reactivateDelegation,
    hasActiveDelegation,
    getDelegationByAgent,
    updateFilters,
    clearFilters
  };
};

export default useDelegations;
