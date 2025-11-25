import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import config from '../config/config';

// Hook personalizado para datos del dashboard Scrum Master
export const useScrumMasterDashboard = () => {
  const { getToken } = useAuth();
  const [data, setData] = useState({
    sprints: [],
    activeSprint: null,
    backlogItems: [],
    technicalItems: [],
    teamMembers: [],
    metrics: {
      totalStoryPoints: 0,
      completedStoryPoints: 0,
      pendingTasks: 0,
      criticalBugs: 0,
      activeImpediments: 0,
      teamVelocity: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = await getToken();
      
      // Fetch en paralelo de todos los datos necesarios
      const [
        sprintsResponse,
        backlogResponse,
        technicalItemsResponse,
        teamMembersResponse,
        bugStatsResponse
      ] = await Promise.all([
        fetch(`${config.API_URL}/sprints`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${config.API_URL}/backlog?tipo=historia&limit=100`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${config.API_URL}/backlog?tipo=tarea,bug,mejora&limit=100`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${config.API_URL}/team/members`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${config.API_URL}/scrum-master/bugs?limit=1`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      // Procesar respuestas
      const sprints = sprintsResponse.ok ? (await sprintsResponse.json())?.sprints || [] : [];
      const backlogData = backlogResponse.ok ? await backlogResponse.json() : { items: [] };
      const technicalData = technicalItemsResponse.ok ? await technicalItemsResponse.json() : { items: [] };
      const teamData = teamMembersResponse.ok ? await teamMembersResponse.json() : { members: [] };
      const bugData = bugStatsResponse.ok ? await bugStatsResponse.json() : { data: { stats: {} } };

      // Encontrar sprint activo
      const activeSprint = sprints.find(s => s.estado === 'activo') || sprints[0] || null;

      if (!activeSprint) {
        // En producción a veces no hay sprint activo; loggear para detectar la causa
        console.warn('useScrumMasterDashboard: no active sprint found. Using fallback defaults.');
      }

      // Obtener items del sprint activo si existe
      let activeSprintItems = [];
      if (activeSprint) {
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
          console.warn('Error fetching sprint items:', err);
        }
      }

      // Calcular métricas
      const backlogItems = backlogData.items || [];
      const technicalItems = technicalData.items || [];
      const teamMembers = teamData.members || [];

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

      // Obtener estadísticas de bugs reportados desde el nuevo endpoint
      const bugStats = bugData.data?.stats || {};
      const totalBugReports = bugStats.total || 0;
      const openBugs = bugStats.open || 0;
      const criticalBugReports = bugStats.critical || 0;
      const blockerBugs = bugStats.blockers || 0;

      // Calcular velocidad del equipo (story points completados en sprints recientes)
      const teamVelocity = completedStoryPoints; // Simplificado por ahora

      // Valores por defecto seguros
      const safeActiveSprint = activeSprint || { name: 'Sin sprint activo', progress: 0, daysRemaining: 0, _id: null };
      const safeMetrics = {
        totalStoryPoints,
        completedStoryPoints,
        pendingTasks,
        criticalBugs,
        activeImpediments: 2, // Placeholder - necesitaría endpoint de impedimentos
        teamVelocity,
        // Nuevas métricas de bug reports
        totalBugReports,
        openBugs,
        criticalBugReports,
        blockerBugs,
        technicalItemsPending: pendingTasks + openBugs
      };

      setData({
        sprints,
        activeSprint: safeActiveSprint,
        backlogItems,
        technicalItems,
        teamMembers,
        activeSprintItems,
        metrics: safeMetrics
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData
  };
};
