import { useState, useEffect, useCallback } from 'react';
import projectArchitectureService from '../services/projectArchitectureService';

/**
 * Hook personalizado para gestionar la arquitectura de proyectos
 * @param {string} productId - ID del producto
 * @param {function} getToken - Función para obtener token de autenticación
 * @returns {object} Estado y funciones de la arquitectura
 */
const useProjectArchitecture = (productId, getToken) => {
  const [architecture, setArchitecture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [stats, setStats] = useState({
    totalModules: 0,
    totalEndpoints: 0,
    totalIntegrations: 0,
    totalDecisions: 0,
    completenessScore: 0
  });

  // Calcular estadísticas y score de completitud
  const calculateStats = useCallback((archData) => {
    if (!archData) {
      setStats({
        totalModules: 0,
        totalEndpoints: 0,
        totalIntegrations: 0,
        totalDecisions: 0,
        completenessScore: 0
      });
      return;
    }

    const totalModules = archData.modules?.length || 0;
    const totalEndpoints = archData.api_endpoints?.length || 0;
    const totalIntegrations = archData.integrations?.length || 0;
    const totalDecisions = archData.architecture_decisions?.length || 0;

    // Calcular completeness score
    let score = 0;
    
    // Tech Stack definido (25%) - verificar campos del modelo real
    const hasTechStack = archData.tech_stack && (
      archData.tech_stack.frontend?.framework ||
      archData.tech_stack.backend?.framework ||
      archData.tech_stack.database?.primary ||
      archData.tech_stack.database?.primary_db // compatibilidad
    );
    if (hasTechStack) score += 25;

    // Módulos definidos (25%)
    if (totalModules > 0) score += 25;

    // Endpoints documentados (20%)
    if (totalEndpoints > 0) score += 20;

    // Integraciones configuradas (15%)
    if (totalIntegrations > 0) score += 15;

    // Decisiones documentadas (10%)
    if (totalDecisions > 0) score += 10;

    // Security configurado (5%)
    if (archData.security?.authentication_method) score += 5;

    setStats({
      totalModules,
      totalEndpoints,
      totalIntegrations,
      totalDecisions,
      completenessScore: score
    });
  }, []);

  // Obtener arquitectura
  const fetchArchitecture = useCallback(async () => {
    if (!productId || !getToken) return;

    setLoading(true);
    setError(null);

    try {
      const data = await projectArchitectureService.getArchitecture(productId, getToken);
      setArchitecture(data);
      calculateStats(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar la arquitectura');
      console.error('Error fetching architecture:', err);
    } finally {
      setLoading(false);
    }
  }, [productId, getToken, calculateStats]);

  // Crear arquitectura inicial
  const createArchitecture = useCallback(async (initialData = {}) => {
    if (!productId || !getToken) return;

    setLoading(true);
    setError(null);

    try {
      const data = await projectArchitectureService.createArchitecture(productId, initialData, getToken);
      setArchitecture(data);
      calculateStats(data);
      setSuccessMessage('Arquitectura creada exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al crear la arquitectura');
      console.error('Error creating architecture:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, getToken, calculateStats]);

  // Actualizar arquitectura completa
  const updateArchitecture = useCallback(async (updates) => {
    if (!productId || !getToken) return;

    setLoading(true);
    setError(null);

    try {
      const data = await projectArchitectureService.updateArchitecture(productId, updates, getToken);
      setArchitecture(data);
      calculateStats(data);
      setSuccessMessage('Arquitectura actualizada exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar la arquitectura');
      console.error('Error updating architecture:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, getToken, calculateStats]);

  // Actualizar Tech Stack
  const updateTechStack = useCallback(async (techStack) => {
    if (!productId || !getToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await projectArchitectureService.updateTechStack(productId, techStack, getToken);
      
      // El backend devuelve { success, data: tech_stack, message }
      // Actualizamos solo el tech_stack en el estado local
      if (response.success && response.data) {
        setArchitecture(prev => ({
          ...prev,
          tech_stack: response.data
        }));
        calculateStats({ ...architecture, tech_stack: response.data });
      }
      
      setSuccessMessage('Tech Stack actualizado exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar Tech Stack');
      console.error('Error updating tech stack:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, getToken, calculateStats, architecture]);

  // Agregar módulo
  const addModule = useCallback(async (moduleData) => {
    if (!productId || !getToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await projectArchitectureService.addModule(productId, moduleData, getToken);
      
      // Refrescar arquitectura completa para obtener estado actualizado
      await fetchArchitecture();
      
      setSuccessMessage('Módulo agregado exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al agregar módulo');
      console.error('Error adding module:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, getToken, fetchArchitecture]);

  // Actualizar módulo
  const updateModule = useCallback(async (moduleId, updates) => {
    if (!productId || !getToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await projectArchitectureService.updateModule(productId, moduleId, updates, getToken);
      
      // Refrescar arquitectura completa para obtener estado actualizado
      await fetchArchitecture();
      
      setSuccessMessage('Módulo actualizado exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar módulo');
      console.error('Error updating module:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, getToken, fetchArchitecture]);

  // Eliminar módulo
  const deleteModule = useCallback(async (moduleId) => {
    if (!productId || !getToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await projectArchitectureService.deleteModule(productId, moduleId, getToken);
      
      // Refrescar arquitectura completa para obtener estado actualizado
      await fetchArchitecture();
      
      setSuccessMessage('Módulo eliminado exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al eliminar módulo');
      console.error('Error deleting module:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, getToken, fetchArchitecture]);

  // Agregar endpoint
  const addEndpoint = useCallback(async (endpointData) => {
    if (!productId || !getToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await projectArchitectureService.addEndpoint(productId, endpointData, getToken);
      
      // Refrescar arquitectura completa para obtener estado actualizado
      await fetchArchitecture();
      
      setSuccessMessage('Endpoint agregado exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al agregar endpoint');
      console.error('Error adding endpoint:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, getToken, fetchArchitecture]);

  // Actualizar endpoints
  const updateEndpoints = useCallback(async (endpoints) => {
    if (!productId || !getToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await projectArchitectureService.updateEndpoints(productId, endpoints, getToken);
      
      // Refrescar arquitectura completa para obtener estado actualizado
      await fetchArchitecture();
      
      setSuccessMessage('Endpoints actualizados exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar endpoints');
      console.error('Error updating endpoints:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, getToken, fetchArchitecture]);

  // Agregar integración
  const addIntegration = useCallback(async (integrationData) => {
    if (!productId || !getToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await projectArchitectureService.addIntegration(productId, integrationData, getToken);
      
      // Refrescar arquitectura completa para obtener estado actualizado
      await fetchArchitecture();
      
      setSuccessMessage('Integración agregada exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al agregar integración');
      console.error('Error adding integration:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, getToken, fetchArchitecture]);

  // Agregar decisión de arquitectura
  const addDecision = useCallback(async (decisionData) => {
    if (!productId || !getToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await projectArchitectureService.addDecision(productId, decisionData, getToken);
      
      // Refrescar arquitectura completa para obtener estado actualizado
      await fetchArchitecture();
      
      setSuccessMessage('Decisión agregada exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al agregar decisión');
      console.error('Error adding decision:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, getToken, fetchArchitecture]);

  // Verificar si existe arquitectura
  const checkExists = useCallback(async () => {
    if (!productId || !getToken) return false;

    try {
      return await projectArchitectureService.checkArchitectureExists(productId, getToken);
    } catch (err) {
      console.error('Error checking architecture existence:', err);
      return false;
    }
  }, [productId, getToken]);

  // Cargar arquitectura al montar o cambiar productId
  useEffect(() => {
    if (productId && getToken) {
      fetchArchitecture();
    }
  }, [productId, getToken, fetchArchitecture]);

  return {
    // Estado
    architecture,
    loading,
    error,
    successMessage,
    stats,

    // Funciones principales
    fetchArchitecture,
    createArchitecture,
    updateArchitecture,
    checkExists,

    // Tech Stack
    updateTechStack,

    // Módulos
    addModule,
    updateModule,
    deleteModule,

    // Endpoints
    addEndpoint,
    updateEndpoints,

    // Integraciones
    addIntegration,

    // Decisiones
    addDecision
  };
};

export default useProjectArchitecture;
