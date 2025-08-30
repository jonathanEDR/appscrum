/**
 * Servicio para gestión de sprints
 * Proporciona funciones para interactuar con la API de sprints
 */

import config from '../config/config';

class SprintService {
  constructor() {
    this.API_URL = config.API_URL || import.meta.env.VITE_API_URL;
  }

  // Helpers para normalizar y asegurar tipos
  _ensureArray(value) {
    return Array.isArray(value) ? value : (value ? [value] : []);
  }

  _safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  _normalizeSprintSummary(raw) {
    if (!raw) return { id: null, name: 'Sin nombre', status: 'unknown' };
    return {
      id: raw._id || raw.id || null,
      name: raw.nombre || raw.name || 'Sin nombre',
      goal: raw.objetivo || raw.goal || null,
      startDate: raw.fecha_inicio || raw.startDate || null,
      endDate: raw.fecha_fin || raw.endDate || null,
      status: raw.estado || raw.status || 'unknown',
      progreso: this._safeNumber(raw.progreso, 0)
    };
  }

  /**
   * Obtiene todos los sprints
   * @param {string} token - Token de autenticación
   * @param {Object} filters - Filtros opcionales (estado, producto, etc.)
   * @returns {Promise<Array>} Lista de sprints
   */
  async getSprints(token, filters = {}) {
    try {
      if (!this.API_URL) {
        throw new Error('API_URL no configurada');
      }

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const url = `${this.API_URL}/sprints${queryParams.toString() ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

  const data = await response.json();
  const rawList = data && data.sprints ? data.sprints : (Array.isArray(data) ? data : (data || []).sprints || []);
  // Normalizar a lista segura
  const list = Array.isArray(rawList) ? rawList.map(s => this._normalizeSprintSummary(s)) : [];
  return list;
    } catch (error) {
      console.error('Error fetching sprints:', error);
      throw error;
    }
  }

  /**
   * Obtiene un sprint específico por ID
   * @param {string} token - Token de autenticación
   * @param {string} sprintId - ID del sprint
   * @returns {Promise<Object>} Datos del sprint
   */
  async getSprintById(token, sprintId) {
    try {
      if (!this.API_URL) {
        throw new Error('API_URL no configurada');
      }

      const response = await fetch(`${this.API_URL}/sprints/${sprintId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();

      // Normalizar objeto completo del sprint
      const sprintRaw = json || {};
      const historias = Array.isArray(sprintRaw.historias) ? sprintRaw.historias : (sprintRaw.historias || []);

      return {
        ...this._normalizeSprintSummary(sprintRaw),
        // incluir datos crudos útiles
        raw: sprintRaw,
        historias,
        metricas: sprintRaw.metricas || sprintRaw.metricas || {
          total_historias: historias.length,
          historias_completadas: historias.filter(h => h && (h.estado === 'hecho' || h.status === 'completed')).length,
          puntos_totales: historias.reduce((sum, h) => sum + (h && (h.puntos_historia || h.storyPoints) ? (h.puntos_historia || h.storyPoints) : 0), 0),
          puntos_completados: historias.filter(h => h && (h.estado === 'hecho' || h.status === 'completed')).reduce((sum, h) => sum + (h && (h.puntos_historia || h.storyPoints) ? (h.puntos_historia || h.storyPoints) : 0), 0)
        }
      };
    } catch (error) {
      console.error('Error fetching sprint details:', error);
      throw error;
    }
  }

  /**
   * Obtiene el sprint activo
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object|null>} Sprint activo o null si no hay ninguno
   */
  async getActiveSprint(token) {
    try {
      const sprints = await this.getSprints(token, { estado: 'activo' });
  const list = Array.isArray(sprints) ? sprints : [];
  return list.find(sprint => sprint.status === 'activo' || sprint.status === 'active' || sprint.estado === 'activo') || null;
    } catch (error) {
      console.error('Error fetching active sprint:', error);
      throw error;
    }
  }

  /**
   * Obtiene items del backlog para un sprint específico
   * @param {string} token - Token de autenticación
   * @param {string} sprintId - ID del sprint
   * @returns {Promise<Array>} Items del backlog
   */
  async getSprintBacklogItems(token, sprintId) {
    try {
      if (!this.API_URL) {
        throw new Error('API_URL no configurada');
      }

      const response = await fetch(`${this.API_URL}/backlog?sprint=${sprintId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

  const data = await response.json();
  const items = Array.isArray(data && data.items) ? data.items : (Array.isArray(data) ? data : []);
  return items;
    } catch (error) {
      console.error('Error fetching sprint backlog items:', error);
      throw error;
    }
  }

  /**
   * Obtiene métricas de un sprint
   * @param {string} token - Token de autenticación
   * @param {string} sprintId - ID del sprint
   * @returns {Promise<Object>} Métricas del sprint
   */
  async getSprintMetrics(token, sprintId) {
    try {
      const [sprintData, backlogItems] = await Promise.all([
        this.getSprintById(token, sprintId).catch(() => null),
        this.getSprintBacklogItems(token, sprintId).catch(() => [])
      ]);

      return this.calculateSprintMetrics(sprintData || {}, backlogItems || []);
    } catch (error) {
      console.error('Error fetching sprint metrics:', error);
      throw error;
    }
  }

  /**
   * Calcula métricas de un sprint basado en sus datos
   * @param {Object} sprint - Datos del sprint
   * @param {Array} backlogItems - Items del backlog
   * @returns {Object} Métricas calculadas
   */
  calculateSprintMetrics(sprint, backlogItems) {
    const items = Array.isArray(backlogItems) ? backlogItems : [];
    const completed = items.filter(item => item && (item.estado === 'completado' || item.status === 'completed')).length;
    const inProgress = items.filter(item => item && (item.estado === 'en_progreso' || item.status === 'in_progress')).length;
    const remaining = items.filter(item => item && (item.estado === 'pendiente' || item.status === 'pending')).length;

    const totalPlanned = items.length;
    const completionPercentage = totalPlanned > 0 ? (completed / totalPlanned) * 100 : 0;

    const totalStoryPoints = items.reduce((sum, item) => {
      const pts = item && (item.puntos_historia || item.storyPoints);
      return sum + (this._safeNumber(pts, 1));
    }, 0);

    const completedStoryPoints = items
      .filter(item => item && (item.estado === 'completado' || item.status === 'completed'))
      .reduce((sum, item) => sum + this._safeNumber(item && (item.puntos_historia || item.storyPoints), 1), 0);

    const start = new Date(sprint.fecha_inicio || sprint.startDate || null);
    const end = new Date(sprint.fecha_fin || sprint.endDate || null);
    const today = new Date();

    const totalDays = (isNaN(end - start) ? 1 : Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24))));
    const daysElapsed = isNaN(today - start) ? 0 : Math.max(0, Math.ceil((today - start) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, totalDays - daysElapsed);

    return {
      id: sprint._id || sprint.id || null,
      name: sprint.nombre || sprint.name || 'Sin nombre',
      goal: sprint.objetivo || sprint.goal || 'Sin objetivo definido',
      startDate: sprint.fecha_inicio || sprint.startDate || null,
      endDate: sprint.fecha_fin || sprint.endDate || null,
      status: sprint.estado || sprint.status || 'unknown',

      planned: totalPlanned,
      completed,
      inProgress,
      remaining,
      completionPercentage: Math.round(completionPercentage),

      totalStoryPoints,
      completedStoryPoints,
      velocity: completedStoryPoints,

      totalDays,
      daysElapsed: Math.max(0, daysElapsed),
      daysRemaining,
      isOverdue: (end && today > end) || false,

      burndownData: this.generateBurndownData(sprint || {}, items || []),
      teamMembers: this.generateTeamMembersData(items || [])
    };
  }

  /**
   * Genera datos para el gráfico burndown
   * @param {Object} sprint - Datos del sprint
   * @param {Array} items - Items del backlog
   * @returns {Array} Datos del burndown chart
   */
  generateBurndownData(sprint, items) {
    const startDate = new Date(sprint.fecha_inicio || sprint.startDate || null);
    const endDate = new Date(sprint.fecha_fin || sprint.endDate || null);

    const totalDaysRaw = isNaN(endDate - startDate) ? 1 : Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    const totalPoints = items.reduce((sum, item) => sum + this._safeNumber(item && (item.puntos_historia || item.storyPoints), 1), 0);

    const data = [];
    const maxDays = Math.min(totalDaysRaw, 14); // Limitar a 14 días

    const completedItemsCount = items.filter(item => item && (item.estado === 'completado' || item.status === 'completed')).length;

    for (let i = 0; i <= maxDays; i++) {
      const plannedRemaining = Math.max(0, totalPoints - (totalPoints / (totalDaysRaw || 1)) * i);

      const progressFactor = Math.min(i / (maxDays || 1), 1);
      const actualRemaining = Math.max(0, totalPoints - (completedItemsCount * progressFactor * 1.2));

      data.push({
        day: i + 1,
        planned: Math.round(plannedRemaining),
        actual: Math.round(actualRemaining)
      });
    }

    return data;
  }

  /**
   * Genera datos de miembros del equipo basado en asignaciones
   * @param {Array} items - Items del backlog
   * @returns {Array} Datos de miembros del equipo
   */
  generateTeamMembersData(items) {
    const memberMap = new Map();

    const list = Array.isArray(items) ? items : [];
    list.forEach(item => {
      const assignedUser = item && (item.asignado_a || item.assignedTo);
      if (assignedUser) {
        const key = assignedUser._id || assignedUser.id || assignedUser.email || JSON.stringify(assignedUser);
        const name = assignedUser.nombre_negocio || assignedUser.name || `${assignedUser.firstName || ''} ${assignedUser.lastName || ''}`.trim() || assignedUser.email || 'Sin nombre';

        if (!memberMap.has(key)) {
          memberMap.set(key, {
            id: key,
            name: name,
            role: assignedUser.role || 'Developer',
            completed: 0,
            planned: 0,
            availability: 'available',
            items: []
          });
        }

        const member = memberMap.get(key);
        const points = this._safeNumber(item && (item.puntos_historia || item.storyPoints), 1);
        member.planned += points;
        member.items.push(item);

        if (item && (item.estado === 'completado' || item.status === 'completed')) {
          member.completed += points;
        }
      }
    });

    return Array.from(memberMap.values());
  }

  /**
   * Ejecuta acciones en un sprint (iniciar, pausar, finalizar)
   * @param {string} token - Token de autenticación
   * @param {string} sprintId - ID del sprint
   * @param {string} action - Acción a ejecutar ('iniciar', 'pausar', 'finalizar')
   * @param {Object} data - Datos adicionales para la acción
   * @returns {Promise<Object>} Resultado de la acción
   */
  async executeSprintAction(token, sprintId, action, data = {}) {
    try {
      if (!this.API_URL) {
        throw new Error('API_URL no configurada');
      }

      const response = await fetch(`${this.API_URL}/sprints/${sprintId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error executing sprint action:', error);
      throw error;
    }
  }

  /**
   * Obtiene workload del equipo basado en el sprint activo
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object>} Workload del equipo por miembro
   */
  async getTeamWorkloadFromActiveSprint(token) {
    try {
      const activeSprint = await this.getActiveSprint(token);
      
      if (!activeSprint) {
        return {};
      }

      const backlogItems = await this.getSprintBacklogItems(token, activeSprint._id);
      const teamMembers = this.generateTeamMembersData(backlogItems);

      // Convertir a objeto por email/id para fácil lookup
      const workloadMap = {};
      teamMembers.forEach(member => {
        workloadMap[member.id] = {
          currentStoryPoints: member.planned,
          completedStoryPoints: member.completed,
          assignedItems: member.items.length,
          completedItems: member.items.filter(item => 
            item.estado === 'completado' || item.status === 'completed'
          ).length,
          sprintName: activeSprint.nombre || activeSprint.name
        };
      });

      return workloadMap;
    } catch (error) {
      console.error('Error getting team workload:', error);
      return {};
    }
  }
}

// Instancia singleton del servicio
const sprintService = new SprintService();

export default sprintService;
