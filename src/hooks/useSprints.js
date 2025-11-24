import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useDataCache } from '../context/DataContext';
import { apiService } from '../services/apiService';

/**
 * Hook personalizado para obtener sprints con caché por producto
 * @param {string} productId - ID del producto (opcional)
 * @returns {Object} { sprints, loading, error, refetch }
 */
export const useSprints = (productId = null) => {
  const { getToken } = useAuth();
  const { getCachedData, setCachedData, invalidateCache } = useDataCache();
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSprints = async (prodId = productId) => {
    try {
      setLoading(true);
      setError(null);

      // Clave de caché: si hay producto específico, usar esa clave; sino, usar clave general
      const cacheKey = prodId ? `sprints:${prodId}` : 'sprints:all';
      
      // 1. Verificar caché primero
      const cached = getCachedData(cacheKey);
      if (cached) {
        setSprints(cached);
        setLoading(false);
        return cached;
      }

      // 2. Si no hay caché, hacer petición a la API
      // Si hay productId, filtrar por producto; sino, obtener todos
      const endpoint = prodId ? `/sprints?producto=${prodId}` : '/sprints';
      const data = await apiService.get(endpoint, getToken);
      const sprintList = data.sprints || [];
      
      setSprints(sprintList);
      setCachedData(cacheKey, sprintList);
      setError(null);
      
      return sprintList;
    } catch (err) {
      console.error('❌ Error loading sprints:', err);
      setError(err.message || 'Error al cargar sprints');
      setSprints([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSprints(productId);
  }, [productId]); // ✅ Solo se re-ejecuta si cambia el productId

  // Función para refrescar manualmente
  const refetch = async () => {
    const cacheKey = productId ? `sprints:${productId}` : 'sprints:all';
    invalidateCache(cacheKey);
    return await loadSprints(productId);
  };

  return { 
    sprints, 
    loading, 
    error,
    refetch 
  };
};

export default useSprints;
