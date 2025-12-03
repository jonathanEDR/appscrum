/**
 * useDatabaseSchema Hook
 * Hook personalizado para gestionar esquemas de base de datos
 * 
 * @module hooks/useDatabaseSchema
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { databaseSchemaService } from '../services/databaseSchemaService';

/**
 * Hook para gestionar el esquema de base de datos de un producto
 * @param {string} productId - ID del producto (opcional, puede cargarse después)
 * @returns {Object} Estado y funciones para gestionar el esquema
 */
export const useDatabaseSchema = (initialProductId = null) => {
  const { getToken } = useAuth();
  
  // Estado principal
  const [productId, setProductId] = useState(initialProductId);
  const [schema, setSchema] = useState(null);
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [relationshipMap, setRelationshipMap] = useState({ nodes: [], edges: [] });
  
  // Estados de carga
  const [loading, setLoading] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState(false);
  const [loadingEntity, setLoadingEntity] = useState(false);
  const [importing, setImporting] = useState(false);
  
  // Estados de error/éxito
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // ============================================
  // FUNCIONES DE CARGA
  // ============================================

  /**
   * Cargar esquema completo del producto
   */
  const fetchSchema = useCallback(async (pid = productId) => {
    if (!pid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await databaseSchemaService.getSchema(pid, getToken);
      
      if (response.success) {
        setSchema(response.data);
        setEntities(response.data?.entities || []);
      } else {
        setError(response.error || 'Error al cargar el esquema');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar el esquema');
    } finally {
      setLoading(false);
    }
  }, [productId, getToken]);

  /**
   * Cargar solo la lista de entidades (más ligero)
   */
  const fetchEntities = useCallback(async (pid = productId) => {
    if (!pid) return;
    
    setLoadingEntities(true);
    setError(null);
    
    try {
      const response = await databaseSchemaService.getEntities(pid, getToken);
      
      if (response.success) {
        setEntities(response.entities || []);
      } else {
        setError(response.error || 'Error al cargar entidades');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar entidades');
    } finally {
      setLoadingEntities(false);
    }
  }, [productId, getToken]);

  /**
   * Cargar una entidad específica
   */
  const fetchEntity = useCallback(async (entityName, pid = productId) => {
    if (!pid || !entityName) return null;
    
    setLoadingEntity(true);
    setError(null);
    
    try {
      const response = await databaseSchemaService.getEntity(pid, entityName, getToken);
      
      if (response.success) {
        setSelectedEntity(response.data);
        return response.data;
      } else {
        setError(response.error || 'Error al cargar la entidad');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Error al cargar la entidad');
      return null;
    } finally {
      setLoadingEntity(false);
    }
  }, [productId, getToken]);

  /**
   * Cargar mapa de relaciones
   */
  const fetchRelationshipMap = useCallback(async (pid = productId) => {
    if (!pid) return;
    
    try {
      const response = await databaseSchemaService.getRelationshipMap(pid, getToken);
      
      if (response.success) {
        setRelationshipMap({
          nodes: response.nodes || [],
          edges: response.edges || []
        });
      }
    } catch (err) {
      console.error('Error al cargar mapa de relaciones:', err);
    }
  }, [productId, getToken]);

  // ============================================
  // FUNCIONES DE IMPORTACIÓN
  // ============================================

  /**
   * Importar código de una entidad
   */
  const importCode = useCallback(async (code, options = {}, pid = productId) => {
    if (!pid || !code) {
      setError('ProductId y código son requeridos');
      return null;
    }
    
    setImporting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await databaseSchemaService.importCode(pid, code, options, getToken);
      
      if (response.success) {
        setSuccessMessage(response.message || 'Entidad importada exitosamente');
        // Refrescar lista de entidades
        await fetchEntities(pid);
        return response;
      } else {
        setError(response.error || 'Error al importar código');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Error al importar código');
      return null;
    } finally {
      setImporting(false);
    }
  }, [productId, getToken, fetchEntities]);

  /**
   * Importar múltiples entidades
   */
  const importBulk = useCallback(async (codes, options = {}, pid = productId) => {
    if (!pid || !codes?.length) {
      setError('ProductId y códigos son requeridos');
      return null;
    }
    
    setImporting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await databaseSchemaService.importBulk(pid, codes, options, getToken);
      
      if (response.success) {
        setSuccessMessage(response.message || 'Entidades importadas exitosamente');
        await fetchEntities(pid);
        return response;
      } else {
        setError(response.error || 'Error en importación masiva');
        return response; // Puede tener errores parciales
      }
    } catch (err) {
      setError(err.message || 'Error en importación masiva');
      return null;
    } finally {
      setImporting(false);
    }
  }, [productId, getToken, fetchEntities]);

  /**
   * Preview de código sin guardar
   */
  const previewCode = useCallback(async (code, ormType = 'mongoose') => {
    if (!code) {
      setError('Código es requerido para preview');
      return null;
    }
    
    try {
      const response = await databaseSchemaService.parsePreview(code, ormType, getToken);
      return response;
    } catch (err) {
      setError(err.message || 'Error en preview');
      return null;
    }
  }, [getToken]);

  // ============================================
  // FUNCIONES DE GESTIÓN
  // ============================================

  /**
   * Actualizar una entidad
   */
  const updateEntity = useCallback(async (entityName, data, pid = productId) => {
    if (!pid || !entityName) return null;
    
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await databaseSchemaService.updateEntity(pid, entityName, data, getToken);
      
      if (response.success) {
        setSuccessMessage(response.message || 'Entidad actualizada');
        await fetchEntities(pid);
        return response;
      } else {
        setError(response.error || 'Error al actualizar entidad');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar entidad');
      return null;
    }
  }, [productId, getToken, fetchEntities]);

  /**
   * Eliminar una entidad
   */
  const deleteEntity = useCallback(async (entityName, pid = productId) => {
    if (!pid || !entityName) return false;
    
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await databaseSchemaService.deleteEntity(pid, entityName, getToken);
      
      if (response.success) {
        setSuccessMessage(response.message || 'Entidad eliminada');
        await fetchEntities(pid);
        return true;
      } else {
        setError(response.error || 'Error al eliminar entidad');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Error al eliminar entidad');
      return false;
    }
  }, [productId, getToken, fetchEntities]);

  /**
   * Actualizar configuración del esquema
   */
  const updateSchemaConfig = useCallback(async (config, pid = productId) => {
    if (!pid) return null;
    
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await databaseSchemaService.updateSchema(pid, config, getToken);
      
      if (response.success) {
        setSuccessMessage(response.message || 'Configuración actualizada');
        await fetchSchema(pid);
        return response;
      } else {
        setError(response.error || 'Error al actualizar configuración');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar configuración');
      return null;
    }
  }, [productId, getToken, fetchSchema]);

  /**
   * Re-sincronizar una entidad
   */
  const resyncEntity = useCallback(async (entityName, pid = productId) => {
    if (!pid || !entityName) return null;
    
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await databaseSchemaService.resyncEntity(pid, entityName, getToken);
      
      if (response.success) {
        setSuccessMessage(response.message || 'Entidad re-sincronizada');
        await fetchEntities(pid);
        return response;
      } else {
        setError(response.error || 'Error al re-sincronizar');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Error al re-sincronizar');
      return null;
    }
  }, [productId, getToken, fetchEntities]);

  // ============================================
  // FUNCIONES DE EXPORTACIÓN
  // ============================================

  /**
   * Exportar esquema completo
   */
  const exportSchema = useCallback(async (pid = productId) => {
    if (!pid) return null;
    
    try {
      const response = await databaseSchemaService.exportSchema(pid, getToken);
      return response;
    } catch (err) {
      setError(err.message || 'Error al exportar esquema');
      return null;
    }
  }, [productId, getToken]);

  /**
   * Descargar esquema como archivo
   */
  const downloadSchema = useCallback(async (productName, pid = productId) => {
    if (!pid) return false;
    
    try {
      await databaseSchemaService.downloadSchema(pid, productName, getToken);
      setSuccessMessage('Esquema descargado');
      return true;
    } catch (err) {
      setError(err.message || 'Error al descargar esquema');
      return false;
    }
  }, [productId, getToken]);

  /**
   * Generar código de una entidad
   */
  const generateCode = useCallback(async (entityName, pid = productId) => {
    if (!pid || !entityName) return null;
    
    try {
      const response = await databaseSchemaService.generateCode(pid, entityName, getToken);
      return response;
    } catch (err) {
      setError(err.message || 'Error al generar código');
      return null;
    }
  }, [productId, getToken]);

  /**
   * Descargar código de una entidad
   */
  const downloadCode = useCallback(async (entityName, pid = productId) => {
    if (!pid || !entityName) return false;
    
    try {
      await databaseSchemaService.downloadCode(pid, entityName, getToken);
      setSuccessMessage('Código descargado');
      return true;
    } catch (err) {
      setError(err.message || 'Error al descargar código');
      return false;
    }
  }, [productId, getToken]);

  // ============================================
  // UTILIDADES
  // ============================================

  /**
   * Limpiar mensajes de error/éxito
   */
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  /**
   * Cambiar el producto activo
   */
  const changeProduct = useCallback((newProductId) => {
    setProductId(newProductId);
    setSchema(null);
    setEntities([]);
    setSelectedEntity(null);
    setRelationshipMap({ nodes: [], edges: [] });
    clearMessages();
  }, [clearMessages]);

  /**
   * Refrescar todo
   */
  const refresh = useCallback(async () => {
    if (!productId) return;
    
    await Promise.all([
      fetchSchema(),
      fetchRelationshipMap()
    ]);
  }, [productId, fetchSchema, fetchRelationshipMap]);

  // ============================================
  // EFECTOS
  // ============================================

  // Cargar esquema cuando cambia el productId
  useEffect(() => {
    if (productId) {
      fetchSchema();
    }
  }, [productId, fetchSchema]);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Estado
    productId,
    schema,
    entities,
    selectedEntity,
    relationshipMap,
    
    // Estados de carga
    loading,
    loadingEntities,
    loadingEntity,
    importing,
    
    // Mensajes
    error,
    successMessage,
    
    // Stats calculados
    stats: schema?.stats || {
      total_entities: entities.length,
      total_fields: 0,
      total_relationships: 0,
      total_indexes: 0
    },
    
    // Funciones de carga
    fetchSchema,
    fetchEntities,
    fetchEntity,
    fetchRelationshipMap,
    
    // Funciones de importación
    importCode,
    importBulk,
    previewCode,
    
    // Funciones de gestión
    updateEntity,
    deleteEntity,
    updateSchemaConfig,
    resyncEntity,
    
    // Funciones de exportación
    exportSchema,
    downloadSchema,
    generateCode,
    downloadCode,
    
    // Utilidades
    clearMessages,
    changeProduct,
    setProductId: changeProduct,
    setSelectedEntity,
    refresh
  };
};

export default useDatabaseSchema;
