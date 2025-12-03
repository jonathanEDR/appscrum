/**
 * Project Architecture Service
 * Servicio para gestionar arquitectura de proyectos
 * 
 * @module services/projectArchitectureService
 */

import { apiService } from './apiService';

class ProjectArchitectureService {
  constructor() {
    this.basePath = '/architecture';
  }

  // ============================================
  // CRUD BÁSICO
  // ============================================

  /**
   * Obtener arquitectura por ID de producto
   * @param {string} productId - ID del producto
   * @param {function} getToken - Función para obtener token de autenticación
   * @returns {Promise<Object>} Datos de la arquitectura
   */
  async getArchitecture(productId, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}`,
        { method: 'GET' },
        getToken
      );
      
      // El backend devuelve { success, exists, data } o { success, exists: false, needs_definition }
      if (response.exists && response.data) {
        return response.data;
      }
      
      // Si no existe arquitectura, retornar null
      if (response.exists === false || response.needs_definition) {
        return null;
      }
      
      // Si la respuesta tiene success pero estructura diferente
      return response.data || response;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // No existe arquitectura aún
      }
      console.error('ProjectArchitectureService.getArchitecture error:', error);
      throw error;
    }
  }

  /**
   * Crear nueva arquitectura para un producto
   * @param {string} productId - ID del producto
   * @param {object} data - Datos de la arquitectura
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Arquitectura creada
   */
  async createArchitecture(productId, data, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}`,
        {
          method: 'POST',
          body: JSON.stringify({
            product_id: productId,
            ...data
          })
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('ProjectArchitectureService.createArchitecture error:', error);
      throw error;
    }
  }

  /**
   * Actualizar arquitectura completa
   * @param {string} productId - ID del producto
   * @param {object} updates - Datos a actualizar
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Arquitectura actualizada
   */
  async updateArchitecture(productId, updates, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}`,
        {
          method: 'PUT',
          body: JSON.stringify(updates)
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('ProjectArchitectureService.updateArchitecture error:', error);
      throw error;
    }
  }

  /**
   * Actualizar solo el Tech Stack
   * @param {string} productId - ID del producto
   * @param {object} techStack - Datos del tech stack
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Arquitectura actualizada
   */
  async updateTechStack(productId, techStack, getToken) {
    try {
      // El backend espera el techStack directamente en el body,
      // no envuelto en { tech_stack: ... }
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/tech-stack`,
        {
          method: 'PUT',
          body: JSON.stringify(techStack)
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('ProjectArchitectureService.updateTechStack error:', error);
      throw error;
    }
  }

  // ============================================
  // MÓDULOS
  // ============================================

  /**
   * Agregar módulo
   * @param {string} productId - ID del producto
   * @param {object} moduleData - Datos del módulo
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Arquitectura actualizada
   */
  async addModule(productId, moduleData, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/modules`,
        {
          method: 'POST',
          body: JSON.stringify(moduleData)
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('ProjectArchitectureService.addModule error:', error);
      throw error;
    }
  }

  /**
   * Actualizar módulo existente
   * @param {string} productId - ID del producto
   * @param {string} moduleId - ID del módulo
   * @param {object} updates - Datos a actualizar
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Arquitectura actualizada
   */
  async updateModule(productId, moduleId, updates, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/modules/${moduleId}`,
        {
          method: 'PUT',
          body: JSON.stringify(updates)
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('ProjectArchitectureService.updateModule error:', error);
      throw error;
    }
  }

  /**
   * Eliminar módulo
   * @param {string} productId - ID del producto
   * @param {string} moduleId - ID del módulo
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Arquitectura actualizada
   */
  async deleteModule(productId, moduleId, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/modules/${moduleId}`,
        { method: 'DELETE' },
        getToken
      );
      return response;
    } catch (error) {
      console.error('ProjectArchitectureService.deleteModule error:', error);
      throw error;
    }
  }

  // ============================================
  // ENDPOINTS
  // ============================================

  /**
   * Agregar endpoint
   * @param {string} productId - ID del producto
   * @param {object} endpointData - Datos del endpoint
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Arquitectura actualizada
   */
  async addEndpoint(productId, endpointData, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/endpoints`,
        {
          method: 'POST',
          body: JSON.stringify(endpointData)
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('ProjectArchitectureService.addEndpoint error:', error);
      throw error;
    }
  }

  /**
   * Actualizar múltiples endpoints
   * @param {string} productId - ID del producto
   * @param {array} endpoints - Array de endpoints
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Arquitectura actualizada
   */
  async updateEndpoints(productId, endpoints, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/endpoints`,
        {
          method: 'PUT',
          body: JSON.stringify({ endpoints })
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('ProjectArchitectureService.updateEndpoints error:', error);
      throw error;
    }
  }

  // ============================================
  // INTEGRACIONES
  // ============================================

  /**
   * Agregar integración
   * @param {string} productId - ID del producto
   * @param {object} integrationData - Datos de la integración
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Arquitectura actualizada
   */
  async addIntegration(productId, integrationData, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/integrations`,
        {
          method: 'POST',
          body: JSON.stringify(integrationData)
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('ProjectArchitectureService.addIntegration error:', error);
      throw error;
    }
  }

  // ============================================
  // DECISIONES (ADRs)
  // ============================================

  /**
   * Agregar decisión de arquitectura (ADR)
   * @param {string} productId - ID del producto
   * @param {object} decisionData - Datos de la decisión
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Arquitectura actualizada
   */
  async addDecision(productId, decisionData, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/decisions`,
        {
          method: 'POST',
          body: JSON.stringify(decisionData)
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('ProjectArchitectureService.addDecision error:', error);
      throw error;
    }
  }

  // ============================================
  // UTILIDADES
  // ============================================

  /**
   * Verificar si existe arquitectura para un producto
   * @param {string} productId - ID del producto
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<boolean>} Boolean indicando si existe
   */
  async checkArchitectureExists(productId, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/check`,
        { method: 'GET' },
        getToken
      );
      return response.exists;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generar resumen de arquitectura para AI
   * @param {string} productId - ID del producto
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Resumen generado
   */
  async generateSummary(productId, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/summary`,
        { method: 'GET' },
        getToken
      );
      return response;
    } catch (error) {
      console.error('ProjectArchitectureService.generateSummary error:', error);
      throw error;
    }
  }
}

// Exportar instancia única
const projectArchitectureService = new ProjectArchitectureService();
export default projectArchitectureService;
