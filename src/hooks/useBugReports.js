import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { developersApiService } from '../services/developersApiService';

/**
 * Hook para manejar reportes de bugs
 */
export const useBugReports = (initialFilters = {}) => {
  const { getToken } = useAuth();
  const [bugReports, setBugReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [submitting, setSubmitting] = useState(false);

  // Configurar el token provider en el servicio
  useEffect(() => {
    developersApiService.setTokenProvider(getToken);
  }, [getToken]);

  // Función para cargar reportes de bugs
  const loadBugReports = useCallback(async (newFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedFilters = { ...filters, ...newFilters };
      const response = await developersApiService.getBugReports(mergedFilters);
      
      if (response.success) {
        setBugReports(response.data || []);
      } else {
        setError('Error al cargar reportes de bugs');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar reportes de bugs');
      setBugReports([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Función para crear nuevo reporte de bug
  const createBugReport = useCallback(async (bugData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await developersApiService.createBugReport(bugData);
      
      if (response.success) {
        // Agregar el nuevo bug al estado local
        setBugReports(prevBugs => [response.data, ...prevBugs]);
        
        return response.data;
      } else {
        throw new Error('Error al crear reporte de bug');
      }
    } catch (err) {
      setError(err.message || 'Error al crear reporte de bug');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  // Función para aplicar filtros
  const applyFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Función para refrescar datos
  const refresh = useCallback(() => {
    loadBugReports();
  }, [loadBugReports]);

  // Función para obtener estadísticas de bugs
  const getBugStats = useCallback(() => {
    const stats = {
      total: bugReports.length,
      open: bugReports.filter(bug => bug.status === 'open').length,
      inProgress: bugReports.filter(bug => bug.status === 'in_progress').length,
      resolved: bugReports.filter(bug => bug.status === 'resolved').length,
      closed: bugReports.filter(bug => bug.status === 'closed').length,
      byPriority: {
        low: bugReports.filter(bug => bug.priority === 'low').length,
        medium: bugReports.filter(bug => bug.priority === 'medium').length,
        high: bugReports.filter(bug => bug.priority === 'high').length,
        critical: bugReports.filter(bug => bug.priority === 'critical').length
      }
    };
    
    return stats;
  }, [bugReports]);

  // Función para filtrar bugs por texto
  const filterByText = useCallback((searchText) => {
    if (!searchText.trim()) {
      return bugReports;
    }
    
    const lowerSearch = searchText.toLowerCase();
    return bugReports.filter(bug => 
      bug.title.toLowerCase().includes(lowerSearch) ||
      bug.description.toLowerCase().includes(lowerSearch) ||
      bug.type.toLowerCase().includes(lowerSearch)
    );
  }, [bugReports]);

  // Efecto para cargar bugs cuando cambian los filtros
  useEffect(() => {
    loadBugReports();
  }, [loadBugReports]);

  return {
    // Estados
    bugReports,
    loading,
    error,
    filters,
    submitting,
    
    // Funciones
    createBugReport,
    applyFilters,
    clearFilters,
    refresh,
    setError,
    
    // Funciones computadas
    getBugStats,
    filterByText,
    
    // Estados computados
    bugStats: getBugStats()
  };
};
