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

      // Si no hay productId, retornar array vacío
      if (!prodId) {
        setSprints([]);
        setLoading(false);
        return [];
      }

      // Clave de caché específica por producto
      const cacheKey = `sprints:${prodId}`;
      
      // 1. Verificar caché primero
      const cached = getCachedData(cacheKey);
      if (cached) {
        setSprints(cached);
        setLoading(false);
        return cached;
      }

      // 2. Si no hay caché, hacer petición a la API
      const data = await apiService.get(`/sprints?producto=${prodId}`, getToken);
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
    if (productId) {
      invalidateCache(`sprints:${productId}`);
    }
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
