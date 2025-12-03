/**
 * Database Schema Service
 * Servicio para gestionar esquemas de base de datos
 * 
 * @module services/databaseSchemaService
 */

import { apiService } from './apiService';

class DatabaseSchemaService {
  constructor() {
    this.basePath = '/database-schema';
  }

  // ============================================
  // CRUD BÁSICO
  // ============================================

  /**
   * Obtener o crear esquema de base de datos de un producto
   * @param {string} productId - ID del producto
   * @param {function} getToken - Función para obtener token de autenticación
   * @returns {Promise<Object>} Esquema de base de datos
   */
  async getSchema(productId, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}`,
        { method: 'GET' },
        getToken
      );
      return response;
    } catch (error) {
      console.error('DatabaseSchemaService.getSchema error:', error);
      throw error;
    }
  }

  /**
   * Actualizar información general del esquema
   * @param {string} productId - ID del producto
   * @param {Object} data - Datos a actualizar
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Esquema actualizado
   */
  async updateSchema(productId, data, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}`,
        {
          method: 'PUT',
          body: JSON.stringify(data)
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('DatabaseSchemaService.updateSchema error:', error);
      throw error;
    }
  }

  // ============================================
  // IMPORTACIÓN DE CÓDIGO
  // ============================================

  /**
   * Importar una entidad desde código fuente
   * @param {string} productId - ID del producto
   * @param {string} code - Código fuente del modelo
   * @param {Object} options - Opciones (orm_type, overwrite)
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Resultado de la importación
   */
  async importCode(productId, code, options = {}, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/import`,
        {
          method: 'POST',
          body: JSON.stringify({
            code,
            orm_type: options.orm_type || 'mongoose',
            overwrite: options.overwrite !== false
          })
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('DatabaseSchemaService.importCode error:', error);
      throw error;
    }
  }

  /**
   * Importar múltiples entidades desde código fuente
   * @param {string} productId - ID del producto
   * @param {Array<string>} codes - Array de códigos fuente
   * @param {Object} options - Opciones (orm_type, overwrite)
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Resultado de la importación masiva
   */
  async importBulk(productId, codes, options = {}, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/import-bulk`,
        {
          method: 'POST',
          body: JSON.stringify({
            codes,
            orm_type: options.orm_type || 'mongoose',
            overwrite: options.overwrite !== false
          })
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('DatabaseSchemaService.importBulk error:', error);
      throw error;
    }
  }

  /**
   * Preview de parsing sin guardar
   * @param {string} code - Código fuente
   * @param {string} ormType - Tipo de ORM
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Preview del parsing
   */
  async parsePreview(code, ormType = 'mongoose', getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/parse-preview`,
        {
          method: 'POST',
          body: JSON.stringify({
            code,
            orm_type: ormType
          })
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('DatabaseSchemaService.parsePreview error:', error);
      throw error;
    }
  }

  // ============================================
  // GESTIÓN DE ENTIDADES
  // ============================================

  /**
   * Listar todas las entidades de un producto
   * @param {string} productId - ID del producto
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Lista de entidades
   */
  async getEntities(productId, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/entities`,
        { method: 'GET' },
        getToken
      );
      return response;
    } catch (error) {
      console.error('DatabaseSchemaService.getEntities error:', error);
      throw error;
    }
  }

  /**
   * Obtener una entidad específica
   * @param {string} productId - ID del producto
   * @param {string} entityName - Nombre de la entidad
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Entidad completa
   */
  async getEntity(productId, entityName, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/entity/${encodeURIComponent(entityName)}`,
        { method: 'GET' },
        getToken
      );
      return response;
    } catch (error) {
      console.error('DatabaseSchemaService.getEntity error:', error);
      throw error;
    }
  }

  /**
   * Actualizar una entidad existente
   * @param {string} productId - ID del producto
   * @param {string} entityName - Nombre de la entidad
   * @param {Object} data - Datos a actualizar
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Entidad actualizada
   */
  async updateEntity(productId, entityName, data, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/entity/${encodeURIComponent(entityName)}`,
        {
          method: 'PUT',
          body: JSON.stringify(data)
        },
        getToken
      );
      return response;
    } catch (error) {
      console.error('DatabaseSchemaService.updateEntity error:', error);
      throw error;
    }
  }

  /**
   * Eliminar una entidad
   * @param {string} productId - ID del producto
   * @param {string} entityName - Nombre de la entidad
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteEntity(productId, entityName, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/entity/${encodeURIComponent(entityName)}`,
        { method: 'DELETE' },
        getToken
      );
      return response;
    } catch (error) {
      console.error('DatabaseSchemaService.deleteEntity error:', error);
      throw error;
    }
  }

  /**
   * Re-sincronizar una entidad desde su código fuente
   * @param {string} productId - ID del producto
   * @param {string} entityName - Nombre de la entidad
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Entidad re-sincronizada
   */
  async resyncEntity(productId, entityName, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/entity/${encodeURIComponent(entityName)}/resync`,
        { method: 'POST' },
        getToken
      );
      return response;
    } catch (error) {
      console.error('DatabaseSchemaService.resyncEntity error:', error);
      throw error;
    }
  }

  // ============================================
  // VISUALIZACIÓN Y EXPORTACIÓN
  // ============================================

  /**
   * Obtener mapa de relaciones para visualización
   * @param {string} productId - ID del producto
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Mapa de nodos y relaciones
   */
  async getRelationshipMap(productId, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/relationship-map`,
        { method: 'GET' },
        getToken
      );
      return response;
    } catch (error) {
      console.error('DatabaseSchemaService.getRelationshipMap error:', error);
      throw error;
    }
  }

  /**
   * Exportar esquema completo a JSON
   * @param {string} productId - ID del producto
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Esquema exportado
   */
  async exportSchema(productId, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/export`,
        { method: 'GET' },
        getToken
      );
      return response;
    } catch (error) {
      console.error('DatabaseSchemaService.exportSchema error:', error);
      throw error;
    }
  }

  /**
   * Generar código Mongoose a partir de una entidad
   * @param {string} productId - ID del producto
   * @param {string} entityName - Nombre de la entidad
   * @param {function} getToken - Función para obtener token
   * @returns {Promise<Object>} Código generado
   */
  async generateCode(productId, entityName, getToken) {
    try {
      const response = await apiService.request(
        `${this.basePath}/product/${productId}/entity/${encodeURIComponent(entityName)}/code`,
        { method: 'GET' },
        getToken
      );
      return response;
    } catch (error) {
      console.error('DatabaseSchemaService.generateCode error:', error);
      throw error;
    }
  }

  // ============================================
  // UTILIDADES
  // ============================================

  /**
   * Descargar esquema como archivo JSON
   * @param {string} productId - ID del producto
   * @param {string} productName - Nombre del producto para el archivo
   * @param {function} getToken - Función para obtener token
   */
  async downloadSchema(productId, productName, getToken) {
    try {
      const data = await this.exportSchema(productId, getToken);
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `database-schema-${productName || productId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('DatabaseSchemaService.downloadSchema error:', error);
      throw error;
    }
  }

  /**
   * Descargar código de una entidad
   * @param {string} productId - ID del producto
   * @param {string} entityName - Nombre de la entidad
   * @param {function} getToken - Función para obtener token
   */
  async downloadCode(productId, entityName, getToken) {
    try {
      const result = await this.generateCode(productId, entityName, getToken);
      
      if (result.success && result.code) {
        const blob = new Blob([result.code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${entityName}.js`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      return result;
    } catch (error) {
      console.error('DatabaseSchemaService.downloadCode error:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const databaseSchemaService = new DatabaseSchemaService();
export default databaseSchemaService;
