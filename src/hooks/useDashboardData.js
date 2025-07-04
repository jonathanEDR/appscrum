import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { apiService } from '../services/apiService';

export const useDashboardData = (userRole) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Eliminado: notas
  const [users, setUsers] = useState([]);
  const [isServerConnected, setIsServerConnected] = useState(false);

  // Eliminado: setNotesData

  // Verificar conexión con el servidor
  const checkServerConnection = useCallback(async () => {
    try {
      await apiService.checkServerHealth();
      setIsServerConnected(true);
      return true;
    } catch (error) {
      console.error('Error connecting to server:', error);
      setIsServerConnected(false);
      return false;
    }
  }, []);

  // Eliminado: loadNotes

  // Cargar usuarios (solo para admins)
  const loadUsers = useCallback(async () => {
    if (!['admin', 'super_admin'].includes(userRole)) {
      return;
    }

    try {
      const usersData = await apiService.getAllUsers(getToken);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      // No es crítico, continúa sin usuarios
    }
  }, [userRole, getToken]);

  // Función principal para cargar todos los datos
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Verificar conexión con el servidor
      const isConnected = await checkServerConnection();
      if (!isConnected) {
        throw new Error('Server is not running. Please start the backend server.');
      }

      // Cargar datos en paralelo
      await Promise.all([
        loadUsers()
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [checkServerConnection, loadUsers]);

  // Eliminado: createNote, deleteNote, updateNote

  // Función para actualizar rol de usuario
  const updateUserRole = useCallback(async (userId, newRole) => {
    try {
      await apiService.updateUserRole(userId, newRole, getToken);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }, [getToken]);

  // Función para refrescar datos
  const refreshData = useCallback(async () => {
    await loadDashboardData();
  }, [loadDashboardData]);

  // Cargar datos inicial
  useEffect(() => {
    if (userRole) {
      loadDashboardData();
    }
  }, [userRole, loadDashboardData]);

  return {
    // Estados
    loading,
    error,
    // Eliminado: notes
    users,
    isServerConnected,
    
    // Funciones
    // Eliminado: createNote, deleteNote, updateNote
    updateUserRole,
    refreshData,
    // Eliminado: setNotesData
    
    // Utilidades
    checkServerConnection
  };
};
