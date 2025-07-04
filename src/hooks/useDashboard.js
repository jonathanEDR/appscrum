import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { apiService } from '../services/apiService';
import { UI_CONFIG } from '../config/config';

// Hook personalizado para manejar los datos del dashboard
export function useDashboard() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Eliminado: notas
  const [users, setUsers] = useState([]);
  const [isServerConnected, setIsServerConnected] = useState(false);

  // Eliminado: setNotesData

  // Función para verificar la conexión con el servidor
  const checkServerConnection = useCallback(async () => {
    try {
      const isConnected = await apiService.checkHealth();
      setIsServerConnected(isConnected);
      return isConnected;
    } catch (error) {
      console.error('Error checking server connection:', error);
      setIsServerConnected(false);
      return false;
    }
  }, []);

  // Eliminado: fetchNotes

  // Función para obtener todos los usuarios (solo para admins)
  const fetchUsers = useCallback(async () => {
    try {
      const usersData = await apiService.getAllUsers(getToken);
      setUsers(Array.isArray(usersData) ? usersData : []);
      return usersData;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }, [getToken]);

  // Función para cargar todos los datos del dashboard (sin notas)
  const loadDashboardData = useCallback(async (userRole) => {
    try {
      setLoading(true);
      setError(null);

      // Verificar conexión del servidor
      const isConnected = await checkServerConnection();
      if (!isConnected) {
        throw new Error('Server is not running. Please start the backend server.');
      }

      // Registrar usuario si es necesario
      await apiService.registerUser(getToken);

      // Cargar usuarios solo si es admin o super_admin
      if (['admin', 'super_admin'].includes(userRole)) {
        try {
          await fetchUsers();
        } catch (error) {
          // No es crítico si falla la carga de usuarios
          console.warn('Could not load users:', error);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [checkServerConnection, getToken, fetchUsers]);

  // Eliminado: createNote, deleteNote, updateNote

  // Función para refrescar los datos
  const refreshData = useCallback(async (userRole) => {
    await loadDashboardData(userRole);
  }, [loadDashboardData]);

  // Función para actualizar el rol de un usuario (solo admins)
  const updateUserRole = useCallback(async (userId, newRole) => {
    try {
      await apiService.updateUserRole(getToken, userId, newRole);
      // Refrescar la lista de usuarios
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }, [getToken, fetchUsers]);

  // Efecto para verificar la conexión del servidor periódicamente
  useEffect(() => {
    const serverCheckInterval = setInterval(
      checkServerConnection, 
      UI_CONFIG.AUTO_REFRESH_INTERVAL
    );
    
    return () => clearInterval(serverCheckInterval);
  }, [checkServerConnection]);

  return {
    // Estados
    loading,
    error,
    users,
    isServerConnected,
    
    // Funciones
    loadDashboardData,
    refreshData,
    updateUserRole,
    checkServerConnection,
    
    // Funciones de utilidad
    setError,
    setLoading
  };
}

export default useDashboard;
