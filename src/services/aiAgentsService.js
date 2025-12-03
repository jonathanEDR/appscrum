/**
 * AI Agents Service
 * Servicio para gestionar agentes AI y delegaciones de permisos
 */

import { apiService } from './apiService';

class AIAgentsService {
  constructor() {
    this.baseEndpoint = '/ai-agents';
  }

  // ==================== GESTIÓN DE AGENTES ====================

  /**
   * Obtener lista de agentes disponibles
   * @param {Object} filters - Filtros opcionales (status, type)
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Array>} Lista de agentes
   */
  async getAgents(filters = {}, getToken) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.type) queryParams.append('type', filters.type);
      
      const queryString = queryParams.toString();
      const endpoint = `${this.baseEndpoint}/agents${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiService.get(endpoint, getToken);
      
      return {
        success: true,
        agents: response.agents || [],
        message: response.message
      };
    } catch (error) {
      console.error('Error al obtener agentes:', error);
      throw {
        success: false,
        message: error.message || 'Error al cargar agentes',
        code: error.code
      };
    }
  }

  /**
   * Obtener detalles de un agente específico
   * @param {string} agentId - ID del agente
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Object>} Detalles del agente
   */
  async getAgentById(agentId, getToken) {
    try {
      const endpoint = `${this.baseEndpoint}/agents/${agentId}`;
      const response = await apiService.get(endpoint, getToken);
      
      return {
        success: true,
        agent: response.agent,
        message: response.message
      };
    } catch (error) {
      console.error('Error al obtener agente:', error);
      throw {
        success: false,
        message: error.message || 'Error al cargar agente',
        code: error.code
      };
    }
  }

  /**
   * Crear un nuevo agente personalizado
   * @param {Object} agentData - Datos del agente
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Object>} Agente creado
   */
  async createAgent(agentData, getToken) {
    try {
      const endpoint = `${this.baseEndpoint}/agents`;
      const response = await apiService.post(endpoint, agentData, getToken);
      
      return {
        success: true,
        agent: response.agent,
        message: response.message || 'Agente creado exitosamente'
      };
    } catch (error) {
      console.error('Error al crear agente:', error);
      throw {
        success: false,
        message: error.message || 'Error al crear agente',
        code: error.code
      };
    }
  }

  // ==================== GESTIÓN DE DELEGACIONES ====================

  /**
   * Crear una nueva delegación de permisos
   * @param {Object} delegationData - Datos de la delegación
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Object>} Delegación creada
   */
  async createDelegation(delegationData, getToken) {
    try {
      const response = await apiService.post(`${this.baseEndpoint}/delegate`, delegationData, getToken);
      
      return {
        success: true,
        delegation: response.delegation,
        message: response.message || 'Delegación creada exitosamente'
      };
    } catch (error) {
      console.error('Error al crear delegación:', error);
      throw {
        success: false,
        message: error.message || 'Error al crear delegación',
        code: error.code
      };
    }
  }

  /**
   * Obtener mis delegaciones activas
   * @param {Object} filters - Filtros opcionales
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Array>} Lista de delegaciones
   */
  async getMyDelegations(filters = {}, getToken) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.agent_id) queryParams.append('agent_id', filters.agent_id);
      
      const queryString = queryParams.toString();
      const endpoint = `${this.baseEndpoint}/my-delegations${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiService.get(endpoint, getToken);
      
      return {
        success: true,
        delegations: response.delegations || [],
        summary: response.summary,
        message: response.message
      };
    } catch (error) {
      console.error('Error al obtener delegaciones:', error);
      throw {
        success: false,
        message: error.message || 'Error al cargar delegaciones',
        code: error.code
      };
    }
  }

  /**
   * Revocar una delegación
   * @param {string} delegationId - ID de la delegación
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Object>} Resultado de la operación
   */
  async revokeDelegation(delegationId, getToken) {
    try {
      const response = await apiService.delete(`${this.baseEndpoint}/delegate/${delegationId}`, getToken);
      
      return {
        success: true,
        message: response.message || 'Delegación revocada exitosamente'
      };
    } catch (error) {
      console.error('Error al revocar delegación:', error);
      throw {
        success: false,
        message: error.message || 'Error al revocar delegación',
        code: error.code
      };
    }
  }

  /**
   * Suspender una delegación temporalmente
   * @param {string} delegationId - ID de la delegación
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Object>} Resultado de la operación
   */
  async suspendDelegation(delegationId, getToken) {
    try {
      const response = await apiService.put(`${this.baseEndpoint}/delegate/${delegationId}/suspend`, {}, getToken);
      
      return {
        success: true,
        delegation: response.delegation,
        message: response.message || 'Delegación suspendida exitosamente'
      };
    } catch (error) {
      console.error('Error al suspender delegación:', error);
      throw {
        success: false,
        message: error.message || 'Error al suspender delegación',
        code: error.code
      };
    }
  }

  /**
   * Reactivar una delegación suspendida
   * @param {string} delegationId - ID de la delegación
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Object>} Resultado de la operación
   */
  async reactivateDelegation(delegationId, getToken) {
    try {
      const response = await apiService.put(`${this.baseEndpoint}/delegate/${delegationId}/reactivate`, {}, getToken);
      
      return {
        success: true,
        delegation: response.delegation,
        message: response.message || 'Delegación reactivada exitosamente'
      };
    } catch (error) {
      console.error('Error al reactivar delegación:', error);
      throw {
        success: false,
        message: error.message || 'Error al reactivar delegación',
        code: error.code
      };
    }
  }

  // ==================== PERMISOS ====================

  /**
   * Obtener permisos disponibles para delegación
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Array>} Lista de permisos disponibles
   */
  async getAvailablePermissions(getToken) {
    try {
      // Por ahora retornamos permisos hardcodeados hasta que el backend implemente el endpoint
      const permissions = [
        { id: 'canCreateBacklogItems', name: 'Crear elementos del backlog', category: 'backlog' },
        { id: 'canEditBacklogItems', name: 'Editar elementos del backlog', category: 'backlog' },
        { id: 'canDeleteBacklogItems', name: 'Eliminar elementos del backlog', category: 'backlog' },
        { id: 'canPrioritizeBacklog', name: 'Priorizar backlog', category: 'backlog' },
        { id: 'canCreateSprints', name: 'Crear sprints', category: 'sprint' },
        { id: 'canEditSprints', name: 'Editar sprints', category: 'sprint' },
        { id: 'canCloseSprints', name: 'Cerrar sprints', category: 'sprint' },
        { id: 'canAssignTasks', name: 'Asignar tareas', category: 'team' },
        { id: 'canViewMetrics', name: 'Ver métricas', category: 'metrics' },
        { id: 'canGenerateReports', name: 'Generar reportes', category: 'reports' }
      ];
      
      return {
        success: true,
        permissions: permissions,
        message: 'Permisos cargados exitosamente'
      };
      
      // Código comentado para cuando el backend esté listo:
      // const response = await apiService.get(`${this.baseEndpoint}/available-permissions`, getToken);
      // return {
      //   success: true,
      //   permissions: response.permissions || [],
      //   message: response.message
      // };
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      throw {
        success: false,
        message: error.message || 'Error al cargar permisos disponibles',
        code: error.code
      };
    }
  }

  // ==================== AUDITORÍA Y ESTADÍSTICAS ====================

  /**
   * Obtener historial de acciones ejecutadas
   * @param {Object} filters - Filtros opcionales
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Array>} Lista de acciones
   */
  async getMyActions(filters = {}, getToken) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.agent_id) queryParams.append('agent_id', filters.agent_id);
      if (filters.action_type) queryParams.append('action_type', filters.action_type);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.start_date) queryParams.append('start_date', filters.start_date);
      if (filters.end_date) queryParams.append('end_date', filters.end_date);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.page) queryParams.append('page', filters.page);
      
      const queryString = queryParams.toString();
      const endpoint = `${this.baseEndpoint}/actions/my-actions${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiService.get(endpoint, getToken);
      
      return {
        success: true,
        actions: response.actions || [],
        pagination: response.pagination,
        summary: response.summary,
        message: response.message
      };
    } catch (error) {
      console.error('Error al obtener acciones:', error);
      throw {
        success: false,
        message: error.message || 'Error al cargar historial de acciones',
        code: error.code
      };
    }
  }

  /**
   * Obtener estadísticas de uso
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Object>} Estadísticas de uso
   */
  async getMyStatistics(getToken) {
    try {
      const response = await apiService.get(`${this.baseEndpoint}/statistics`, getToken);
      
      return {
        success: true,
        statistics: response.statistics,
        message: response.message
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw {
        success: false,
        message: error.message || 'Error al cargar estadísticas',
        code: error.code
      };
    }
  }

  // ==================== ORQUESTADOR ====================

  /**
   * Enviar mensaje al orquestador (chat)
   * @param {string} message - Mensaje del usuario
   * @param {Object} context - Contexto (product_id, etc.)
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Object>} Respuesta del orquestador
   */
  async sendChatMessage(message, context = {}, getToken) {
    try {
      const response = await apiService.post(`${this.baseEndpoint}/orchestrator/chat`, {
        message,
        context
      }, getToken);
      
      return {
        success: true,
        response: response.response,
        metadata: response.metadata,
        message: response.message
      };
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw {
        success: false,
        message: error.message || 'Error al procesar el mensaje',
        code: error.code,
        details: error.details
      };
    }
  }

  /**
   * Ejecutar tarea de forma asíncrona
   * @param {Object} taskData - Datos de la tarea
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Object>} ID del job para tracking
   */
  async executeAsync(taskData, getToken) {
    try {
      const response = await apiService.post(`${this.baseEndpoint}/orchestrator/execute-async`, taskData, getToken);
      
      return {
        success: true,
        job_id: response.job_id,
        message: response.message || 'Tarea encolada exitosamente'
      };
    } catch (error) {
      console.error('Error al ejecutar tarea asíncrona:', error);
      throw {
        success: false,
        message: error.message || 'Error al encolar tarea',
        code: error.code
      };
    }
  }

  /**
   * Obtener estado de una tarea asíncrona
   * @param {string} jobId - ID del job
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Object>} Estado del job
   */
  async getTaskStatus(jobId, getToken) {
    try {
      const response = await apiService.get(`${this.baseEndpoint}/orchestrator/status/${jobId}`, getToken);
      
      return {
        success: true,
        job: response.job,
        message: response.message
      };
    } catch (error) {
      console.error('Error al obtener estado de tarea:', error);
      throw {
        success: false,
        message: error.message || 'Error al obtener estado de la tarea',
        code: error.code
      };
    }
  }

  /**
   * Cancelar tarea asíncrona
   * @param {string} jobId - ID del job
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Object>} Resultado de la operación
   */
  async cancelTask(jobId, getToken) {
    try {
      const response = await apiService.delete(`${this.baseEndpoint}/orchestrator/tasks/${jobId}`, getToken);
      
      return {
        success: true,
        message: response.message || 'Tarea cancelada exitosamente'
      };
    } catch (error) {
      console.error('Error al cancelar tarea:', error);
      throw {
        success: false,
        message: error.message || 'Error al cancelar tarea',
        code: error.code
      };
    }
  }

  // ==================== UTILIDADES ====================

  /**
   * Validar si un usuario tiene delegación activa para un agente
   * @param {string} agentId - ID del agente
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<boolean>} True si tiene delegación activa
   */
  async hasActiveDelegation(agentId, getToken) {
    try {
      const { delegations } = await this.getMyDelegations({ 
        agent_id: agentId, 
        status: 'active' 
      }, getToken);
      return delegations.length > 0;
    } catch (error) {
      console.error('Error al verificar delegación:', error);
      return false;
    }
  }

  /**
   * Obtener resumen rápido de delegaciones
   * @param {Function} getToken - Función para obtener token de Clerk
   * @returns {Promise<Object>} Resumen de delegaciones
   */
  async getDelegationsSummary(getToken) {
    try {
      const { delegations, summary } = await this.getMyDelegations({}, getToken);
      
      return {
        total: delegations.length,
        active: delegations.filter(d => d.status === 'active').length,
        suspended: delegations.filter(d => d.status === 'suspended').length,
        details: summary
      };
    } catch (error) {
      console.error('Error al obtener resumen:', error);
      return {
        total: 0,
        active: 0,
        suspended: 0,
        details: null
      };
    }
  }
}

// Exportar instancia única
export const aiAgentsService = new AIAgentsService();
export default aiAgentsService;
