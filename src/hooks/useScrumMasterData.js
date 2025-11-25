import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useDataCache } from '../context/DataContext';
import config from '../config/config';

/**
 * Hook centralizado para datos del Scrum Master con caché inteligente
 * Replica el patrón optimizado de Product Owner
 * 
 * @param {boolean} autoLoad - Cargar datos automáticamente al montar (default: true)
 * @returns {Object} { data, loading, error, refresh, updateSection }
 */
export const useScrumMasterData = (autoLoad = true) => {
  const { getToken } = useAuth();
  const { getCachedData, setCachedData, invalidateCache } = useDataCache();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    sprints: [],
    activeSprint: null,
    backlogItems: [],
    technicalItems: [],
    teamMembers: [],
    products: [],
    users: [],
    metrics: {
      totalStoryPoints: 0,
      completedStoryPoints: 0,
      pendingTasks: 0,
      criticalBugs: 0,
      activeImpediments: 0,
      teamVelocity: 0
    }
  });

  /**
   * Calcula métricas basadas en los datos cargados
   */
  const calculateMetrics = useCallback((dashboardData) => {
    const { backlogItems = [], technicalItems = [], activeSprint } = dashboardData;
    
    // Filtrar items del sprint activo
    const activeSprintItems = activeSprint 
      ? backlogItems.filter(item => item.sprint?._id === activeSprint._id || item.sprint === activeSprint._id)
      : [];

    const totalStoryPoints = activeSprintItems.reduce((sum, item) => 
      sum + (item.puntos_historia || 0), 0
    );
    
    const completedStoryPoints = activeSprintItems
      .filter(item => item.estado === 'completado')
      .reduce((sum, item) => sum + (item.puntos_historia || 0), 0);

    const pendingTasks = technicalItems.filter(item => 
      item.tipo === 'tarea' && item.estado !== 'completado'
    ).length;

    const criticalBugs = technicalItems.filter(item => 
      item.tipo === 'bug' && ['muy_alta', 'alta'].includes(item.prioridad)
    ).length;

    return {
      totalStoryPoints,
      completedStoryPoints,
      pendingTasks,
      criticalBugs,
      activeImpediments: 0, // TODO: Agregar cuando exista endpoint de impedimentos
      teamVelocity: completedStoryPoints,
      completionRate: totalStoryPoints > 0 
        ? Math.round((completedStoryPoints / totalStoryPoints) * 100) 
        : 0
    };
  }, []);

  /**
   * Carga de datos con estrategia de caché
   * 1. Verifica caché primero
   * 2. Si es válido, usa caché (carga instantánea)
   * 3. Si no, hace petición al backend
   * 4. Guarda resultado en caché
   */
  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // 1. Verificar caché primero (si no es refresh forzado)
      if (!forceRefresh) {
        const cachedData = getCachedData('scrumMaster:dashboard');
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return cachedData;
        }
      }

      // 2. ✅ Usar endpoint consolidado optimizado
      const response = await fetch(`${config.API_URL}/scrum-master/dashboard`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Si el endpoint consolidado no existe aún, usar fallback a múltiples consultas
        return await loadDataFallback(token);
      }

      // 3. Procesar respuesta del endpoint consolidado
      const dashboardData = await response.json();

      // 4. Guardar en caché
      setCachedData('scrumMaster:dashboard', dashboardData);
      setData(dashboardData);

      return dashboardData;

    } catch (err) {
      console.error('❌ Error loading Scrum Master data:', err);
      setError(err.message || 'Error al cargar datos del dashboard');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getToken, getCachedData, setCachedData, calculateMetrics]);

  /**
   * Función fallback para cargar datos con múltiples consultas
   * Se usa si el endpoint consolidado no está disponible aún
   */
  const loadDataFallback = useCallback(async (token) => {
    try {
      const [
        sprintsResponse,
        backlogResponse,
        technicalItemsResponse,
        teamMembersResponse,
        productsResponse
      ] = await Promise.all([
        fetch(`${config.API_URL}/sprints?limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${config.API_URL}/backlog?tipo=historia&limit=50`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${config.API_URL}/backlog?tipo=tarea,bug,mejora&limit=100`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${config.API_URL}/team/members`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${config.API_URL}/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      // Procesar respuestas
      const sprints = sprintsResponse.ok ? (await sprintsResponse.json())?.sprints || [] : [];
      const backlogData = backlogResponse.ok ? await backlogResponse.json() : { items: [] };
      const technicalData = technicalItemsResponse.ok ? await technicalItemsResponse.json() : { items: [] };
      const teamData = teamMembersResponse.ok ? await teamMembersResponse.json() : { members: [] };
      const productsData = productsResponse.ok ? await productsResponse.json() : { products: [] };

      const activeSprint = sprints.find(s => s.estado === 'activo') || sprints[0] || null;

      let activeSprintItems = [];
      if (activeSprint?._id) {
        try {
          const sprintItemsResponse = await fetch(
            `${config.API_URL}/backlog?sprint=${activeSprint._id}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          if (sprintItemsResponse.ok) {
            const sprintItemsData = await sprintItemsResponse.json();
            activeSprintItems = sprintItemsData.items || [];
          }
        } catch (err) {
          console.warn('Error fetching active sprint items:', err);
        }
      }

      const dashboardData = {
        sprints,
        activeSprint,
        backlogItems: backlogData.items || [],
        technicalItems: technicalData.items || [],
        teamMembers: teamData.members || [],
        products: productsData.products || productsData.productos || [],
        activeSprintItems,
        timestamp: Date.now()
      };

      dashboardData.metrics = calculateMetrics(dashboardData);
      
      setCachedData('scrumMaster:dashboard', dashboardData);
      setData(dashboardData);
      
      return dashboardData;
    } catch (error) {
      throw error;
    }
  }, [setCachedData, calculateMetrics]);

  /**
   * Refrescar datos (invalida caché y recarga)
   * Útil para botones de "Actualizar" o después de crear/editar datos
   */
  const refresh = useCallback(async () => {
    console.log('🔄 Refrescando datos (invalidando caché)...');
    invalidateCache('scrumMaster');
    return await loadData(true);
  }, [loadData, invalidateCache]);

  /**
   * Actualizar solo una sección específica sin recargar todo
   * Útil para actualizaciones optimistas o parciales
   * 
   * @param {string} section - Sección a actualizar (ej: 'sprints', 'teamMembers')
   * @param {any} newData - Nuevos datos para esa sección
   */
  const updateSection = useCallback((section, newData) => {
    setData(prev => {
      const updated = {
        ...prev,
        [section]: newData
      };
      
      // Recalcular métricas si se actualizaron datos relevantes
      if (['backlogItems', 'technicalItems', 'activeSprint'].includes(section)) {
        updated.metrics = calculateMetrics(updated);
      }
      
      // Actualizar caché
      setCachedData('scrumMaster:dashboard', updated);
      
      return updated;
    });
  }, [setCachedData, calculateMetrics]);

  /**
   * Actualizar un item específico del backlog o technical items
   */
  const updateItem = useCallback((itemId, updates) => {
    setData(prev => {
      const updateItems = (items) => items.map(item => 
        item._id === itemId ? { ...item, ...updates } : item
      );

      const updated = {
        ...prev,
        backlogItems: updateItems(prev.backlogItems),
        technicalItems: updateItems(prev.technicalItems)
      };

      // Recalcular métricas
      updated.metrics = calculateMetrics(updated);
      
      // Actualizar caché
      setCachedData('scrumMaster:dashboard', updated);
      
      return updated;
    });
  }, [setCachedData, calculateMetrics]);

  /**
   * Cambiar sprint activo
   */
  const setActiveSprint = useCallback((sprint) => {
    updateSection('activeSprint', sprint);
  }, [updateSection]);

  // Carga automática al montar (si autoLoad = true)
  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [autoLoad]); // Solo ejecutar una vez

  return {
    // Datos
    data,
    loading,
    error,
    
    // Funciones
    refresh,
    updateSection,
    updateItem,
    setActiveSprint,
    
    // Acceso directo a secciones (conveniencia)
    sprints: data.sprints,
    activeSprint: data.activeSprint,
    backlogItems: data.backlogItems,
    technicalItems: data.technicalItems,
    teamMembers: data.teamMembers,
    products: data.products,
    metrics: data.metrics
  };
};

export default useScrumMasterData;
