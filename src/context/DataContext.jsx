import React, { createContext, useState, useContext, useCallback } from 'react';

const DataContext = createContext();

// TTL (Time To Live) en milisegundos para cada tipo de dato
const CACHE_TTL = {
  productos: 5 * 60 * 1000,    // 5 minutos - datos relativamente estáticos
  usuarios: 5 * 60 * 1000,     // 5 minutos - cambian poco
  sprints: 2 * 60 * 1000,      // 2 minutos - moderadamente dinámicos
  backlog: 1 * 60 * 1000,      // 1 minuto - más dinámicos
  releases: 3 * 60 * 1000,     // 3 minutos
  metricas: 2 * 60 * 1000,     // 2 minutos
  default: 2 * 60 * 1000       // 2 minutos por defecto
};

export const DataProvider = ({ children }) => {
  const [cache, setCache] = useState({});

  /**
   * Obtener datos del caché si no han expirado
   * @param {string} key - Clave del caché (ej: 'productos', 'sprints:123')
   * @returns {any|null} - Datos cacheados o null si no existen o expiraron
   */
  const getCachedData = useCallback((key) => {
    const cached = cache[key];
    if (!cached) {
      return null;
    }
    
    const now = Date.now();
    const cacheType = key.split(':')[0];
    const ttl = CACHE_TTL[cacheType] || CACHE_TTL.default;
    
    if (now - cached.timestamp > ttl) {
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[key];
        return newCache;
      });
      return null;
    }
    
    return cached.data;
  }, [cache]);

  /**
   * Guardar datos en el caché con timestamp
   * @param {string} key - Clave del caché
   * @param {any} data - Datos a cachear
   */
  const setCachedData = useCallback((key, data) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now()
      }
    }));
  }, []);

  /**
   * Invalidar caché por patrón
   * @param {string} pattern - Patrón para buscar claves (ej: 'sprints' invalida todos los sprints)
   */
  const invalidateCache = useCallback((pattern) => {
    console.log(`🗑️ Invalidando caché: ${pattern}`);
    setCache(prev => {
      const newCache = { ...prev };
      Object.keys(newCache).forEach(key => {
        if (key.startsWith(pattern)) {
          console.log(`   - Eliminado: ${key}`);
          delete newCache[key];
        }
      });
      return newCache;
    });
  }, []);

  /**
   * Limpiar todo el caché
   */
  const clearCache = useCallback(() => {
    console.log(`🧹 Limpiando todo el caché`);
    setCache({});
  }, []);

  /**
   * Obtener estadísticas del caché
   */
  const getCacheStats = useCallback(() => {
    const entries = Object.entries(cache);
    const now = Date.now();
    
    const stats = {
      totalEntries: entries.length,
      entries: entries.map(([key, value]) => {
        const cacheType = key.split(':')[0];
        const ttl = CACHE_TTL[cacheType] || CACHE_TTL.default;
        const age = now - value.timestamp;
        const remaining = ttl - age;
        
        return {
          key,
          age: Math.round(age / 1000),
          remaining: Math.round(remaining / 1000),
          expired: remaining <= 0
        };
      })
    };
    
    return stats;
  }, [cache]);

  const value = {
    getCachedData,
    setCachedData,
    invalidateCache,
    clearCache,
    getCacheStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

/**
 * Hook para acceder al sistema de caché
 */
export const useDataCache = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataCache debe usarse dentro de un DataProvider');
  }
  return context;
};

export default DataContext;
