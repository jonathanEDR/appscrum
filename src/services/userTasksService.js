import { useAuth } from '@clerk/clerk-react';

/**
 * Servicio para obtener tareas de usuarios específicos (para Scrum Master)
 */
class UserTasksService {
  constructor() {
    this.API_URL = import.meta.env.VITE_API_URL;
  }

  /**
   * Obtiene las tareas asignadas a un usuario específico
   * @param {string} userId - ID del usuario
   * @param {string} token - Token de autenticación
   * @returns {Promise} Promise con las tareas del usuario
   */
  async getUserTasks(userId, token) {
    try {
      const response = await fetch(`${this.API_URL}/team/members/${userId}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.tasks || [],
        stats: {
          total: data.total || 0,
          completed: data.completed || 0,
          inProgress: data.inProgress || 0,
          pending: data.pending || 0
        }
      };
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      return {
        success: false,
        error: error.message,
        data: [],
        stats: { total: 0, completed: 0, inProgress: 0, pending: 0 }
      };
    }
  }

  /**
   * Obtiene el resumen de tareas de todos los miembros del equipo
   * @param {string} token - Token de autenticación
   * @returns {Promise} Promise con el resumen de tareas por usuario
   */
  async getTeamTasksSummary(token) {
    try {
      const response = await fetch(`${this.API_URL}/team/tasks-summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.teamTasksSummary || []
      };
    } catch (error) {
      console.error('Error fetching team tasks summary:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }
}

export const userTasksService = new UserTasksService();