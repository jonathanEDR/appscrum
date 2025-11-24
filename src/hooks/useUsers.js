import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useDataCache } from '../context/DataContext';
import { apiService } from '../services/apiService';

/**
 * Hook personalizado para obtener la lista de usuarios con caché
 * @param {boolean} activeOnly - Solo usuarios activos (por defecto true)
 * @returns {Object} { users, loading, error, refetch }
 */
export const useUsers = (activeOnly = true) => {
  const { getToken } = useAuth();
  const { getCachedData, setCachedData } = useDataCache();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Clave de caché diferente según filtro
      const cacheKey = activeOnly ? 'usuarios:activos' : 'usuarios:todos';
      
      // 1. Verificar caché primero
      const cached = getCachedData(cacheKey);
      if (cached) {
        setUsers(cached);
        setLoading(false);
        return cached;
      }

      // 2. Si no hay caché, hacer petición a la API
      const endpoint = activeOnly ? '/users?is_active=true' : '/users';
      const data = await apiService.get(endpoint, getToken);
      const userList = data.users || data.usuarios || [];
      
      setUsers(userList);
      setCachedData(cacheKey, userList);
      setError(null);
      
      return userList;
    } catch (err) {
      console.error('❌ Error loading users:', err);
      setError(err.message || 'Error al cargar usuarios');
      setUsers([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [activeOnly]); // ✅ Solo se re-ejecuta si cambia el filtro

  // Función para refrescar manualmente
  const refetch = async () => {
    const { invalidateCache } = useDataCache();
    invalidateCache('usuarios');
    return await loadUsers();
  };

  return { 
    users, 
    loading, 
    error,
    refetch 
  };
};

export default useUsers;
