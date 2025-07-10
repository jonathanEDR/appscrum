import { useState, useEffect, useCallback } from 'react';
import scrumMasterService from '../services/scrumMasterService.js';

// Hook para gestionar impedimentos
export const useImpediments = (initialFilters = {}) => {
  const [impediments, setImpediments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchImpediments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await scrumMasterService.getImpediments(filters);
      setImpediments(response.impediments || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching impediments:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createImpediment = async (impedimentData) => {
    try {
      setLoading(true);
      const response = await scrumMasterService.createImpediment(impedimentData);
      await fetchImpediments(); // Refrescar lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateImpediment = async (id, impedimentData) => {
    try {
      setLoading(true);
      const response = await scrumMasterService.updateImpediment(id, impedimentData);
      await fetchImpediments(); // Refrescar lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteImpediment = async (id) => {
    try {
      setLoading(true);
      const response = await scrumMasterService.deleteImpediment(id);
      await fetchImpediments(); // Refrescar lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    fetchImpediments();
  }, [fetchImpediments]);

  return {
    impediments,
    loading,
    error,
    filters,
    updateFilters,
    createImpediment,
    updateImpediment,
    deleteImpediment,
    refetch: fetchImpediments
  };
};

// Hook para gestionar ceremonias
export const useCeremonies = (initialFilters = {}) => {
  const [ceremonies, setCeremonies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchCeremonies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await scrumMasterService.getCeremonies(filters);
      setCeremonies(response.ceremonies || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching ceremonies:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createCeremony = async (ceremonyData) => {
    try {
      setLoading(true);
      const response = await scrumMasterService.createCeremony(ceremonyData);
      await fetchCeremonies(); // Refrescar lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCeremony = async (id, ceremonyData) => {
    try {
      setLoading(true);
      const response = await scrumMasterService.updateCeremony(id, ceremonyData);
      await fetchCeremonies(); // Refrescar lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    fetchCeremonies();
  }, [fetchCeremonies]);

  return {
    ceremonies,
    loading,
    error,
    filters,
    updateFilters,
    createCeremony,
    updateCeremony,
    refetch: fetchCeremonies
  };
};

// Hook para gestionar métricas del equipo
export const useTeamMetrics = (timeframe = 'current_sprint') => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [velocityData, teamData] = await Promise.all([
        scrumMasterService.getTeamVelocity(timeframe),
        scrumMasterService.getTeamMembers()
      ]);
      
      setMetrics({
        velocity: velocityData,
        team: teamData
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics
  };
};

// Hook para gestionar datos del sprint actual
export const useCurrentSprint = () => {
  const [sprintData, setSprintData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSprintData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener el sprint actual (esto debería ser una llamada real a la API)
      const currentSprintId = 23; // Esto debería venir de la API
      const [metricsData, burndownData] = await Promise.all([
        scrumMasterService.getSprintMetrics(currentSprintId),
        scrumMasterService.getBurndownData(currentSprintId)
      ]);
      
      setSprintData({
        metrics: metricsData,
        burndown: burndownData
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching sprint data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSprintData();
  }, [fetchSprintData]);

  return {
    sprintData,
    loading,
    error,
    refetch: fetchSprintData
  };
};

// Hook para gestionar el equipo
export const useTeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeamMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await scrumMasterService.getTeamMembers();
      setTeamMembers(response.members || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMemberStatus = async (memberId, status) => {
    try {
      setLoading(true);
      const response = await scrumMasterService.updateTeamMemberStatus(memberId, status);
      await fetchTeamMembers(); // Refrescar lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  return {
    teamMembers,
    loading,
    error,
    updateMemberStatus,
    refetch: fetchTeamMembers
  };
};

// Hook personalizado para exportar reportes
export const useReportExport = () => {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const exportImpedimentsReport = async (format = 'pdf', filters = {}) => {
    try {
      setExporting(true);
      setError(null);
      await scrumMasterService.exportImpedimentsReport(format, filters);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setExporting(false);
    }
  };

  const exportSprintReport = async (sprintId, format = 'pdf') => {
    try {
      setExporting(true);
      setError(null);
      await scrumMasterService.exportSprintReport(sprintId, format);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setExporting(false);
    }
  };

  return {
    exporting,
    error,
    exportImpedimentsReport,
    exportSprintReport
  };
};
