/**
 * Servicio para gestión de sprints
 * Proporciona funciones para interactuar con la API de sprints
 */

import config from '../config/config';

class SprintService {
  constructor() {
    this.API_URL = config.API_URL || import.meta.env.VITE_API_URL;
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
      return data.sprints || data || [];
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

      return await response.json();
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
      return sprints.find(sprint => 
        sprint.estado === 'activo' || sprint.status === 'active'
      ) || null;
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
      return data.items || data || [];
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
        this.getSprintById(token, sprintId),
        this.getSprintBacklogItems(token, sprintId)
      ]);

      return this.calculateSprintMetrics(sprintData, backlogItems);
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
    const completed = backlogItems.filter(item => 
      item.estado === 'completado' || item.status === 'completed'
    ).length;
    
    const inProgress = backlogItems.filter(item => 
      item.estado === 'en_progreso' || item.status === 'in_progress'
    ).length;
    
    const remaining = backlogItems.filter(item => 
      item.estado === 'pendiente' || item.status === 'pending'
    ).length;
    
    const totalPlanned = backlogItems.length;
    const completionPercentage = totalPlanned > 0 ? (completed / totalPlanned) * 100 : 0;

    // Calcular puntos de historia
    const totalStoryPoints = backlogItems.reduce((sum, item) => 
      sum + (item.puntos_historia || item.storyPoints || 1), 0
    );
    
    const completedStoryPoints = backlogItems
      .filter(item => item.estado === 'completado' || item.status === 'completed')
      .reduce((sum, item) => sum + (item.puntos_historia || item.storyPoints || 1), 0);

    // Calcular días
    const startDate = new Date(sprint.fecha_inicio || sprint.startDate);
    const endDate = new Date(sprint.fecha_fin || sprint.endDate);
    const today = new Date();
    
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays - daysElapsed);

    return {
      id: sprint._id || sprint.id,
      name: sprint.nombre || sprint.name,
      goal: sprint.objetivo || sprint.goal || 'Sin objetivo definido',
      startDate: sprint.fecha_inicio || sprint.startDate,
      endDate: sprint.fecha_fin || sprint.endDate,
      status: sprint.estado || sprint.status,
      
      // Métricas de items
      planned: totalPlanned,
      completed,
      inProgress,
      remaining,
      completionPercentage: Math.round(completionPercentage),
      
      // Métricas de puntos de historia
      totalStoryPoints,
      completedStoryPoints,
      velocity: completedStoryPoints,
      
      // Métricas de tiempo
      totalDays,
      daysElapsed: Math.max(0, daysElapsed),
      daysRemaining,
      isOverdue: today > endDate,
      
      // Datos para burndown
      burndownData: this.generateBurndownData(sprint, backlogItems),
      
      // Información del equipo
      teamMembers: this.generateTeamMembersData(backlogItems)
    };
  }

  /**
   * Genera datos para el gráfico burndown
   * @param {Object} sprint - Datos del sprint
   * @param {Array} items - Items del backlog
   * @returns {Array} Datos del burndown chart
   */
  generateBurndownData(sprint, items) {
    const startDate = new Date(sprint.fecha_inicio || sprint.startDate);
    const endDate = new Date(sprint.fecha_fin || sprint.endDate);
    
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalPoints = items.reduce((sum, item) => sum + (item.puntos_historia || item.storyPoints || 1), 0);
    
    const data = [];
    const maxDays = Math.min(totalDays, 14); // Limitar a 14 días
    
    for (let i = 0; i <= maxDays; i++) {
      const plannedRemaining = Math.max(0, totalPoints - (totalPoints / totalDays) * i);
      
      // Simular progreso real basado en items completados
      const completedItems = items.filter(item => 
        item.estado === 'completado' || item.status === 'completed'
      ).length;
      
      const progressFactor = Math.min(i / maxDays, 1);
      const actualRemaining = Math.max(0, totalPoints - (completedItems * progressFactor * 1.2));
      
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
    
    items.forEach(item => {
      const assignedUser = item.asignado_a || item.assignedTo;
      if (assignedUser) {
        const key = assignedUser._id || assignedUser.id || assignedUser.email;
        const name = assignedUser.nombre_negocio || 
                    assignedUser.name || 
                    `${assignedUser.firstName || ''} ${assignedUser.lastName || ''}`.trim() ||
                    assignedUser.email;
        
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
        const points = item.puntos_historia || item.storyPoints || 1;
        member.planned += points;
        member.items.push(item);
        
        if (item.estado === 'completado' || item.status === 'completed') {
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
