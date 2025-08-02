import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { developersApiService } from '../services/developersApiService';

/**
 * Hook para manejar las tareas del developer
 */
export const useDeveloperTasks = (initialFilters = {}) => {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [filters, setFilters] = useState(initialFilters);

  // Configurar el token provider en el servicio
  useEffect(() => {
    developersApiService.setTokenProvider(getToken);
  }, [getToken]);

  // Función para cargar tareas
  const loadTasks = useCallback(async (newFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedFilters = { ...filters, ...newFilters };
      const response = await developersApiService.getTasks(mergedFilters);
      
      if (response.success) {
        setTasks(response.data.tasks || []);
        setPagination(response.data.pagination || { current: 1, pages: 1, total: 0 });
      } else {
        setError('Error al cargar tareas');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar tareas');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Función para actualizar estado de tarea
  const updateTaskStatus = useCallback(async (taskId, newStatus) => {
    try {
      const response = await developersApiService.updateTaskStatus(taskId, newStatus);
      
      if (response.success) {
        // Actualizar la tarea en el estado local
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === taskId 
              ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
              : task
          )
        );
        return response.data;
      } else {
        throw new Error('Error al actualizar tarea');
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar tarea');
      throw err;
    }
  }, []);

  // Función para aplicar filtros
  const applyFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters, page: 1 }));
  }, []);

  // Función para cambiar página
  const changePage = useCallback((page) => {
    setFilters(prevFilters => ({ ...prevFilters, page }));
  }, []);

  // Función para refrescar datos
  const refresh = useCallback(() => {
    loadTasks();
  }, [loadTasks]);

  // Efecto para cargar tareas cuando cambian los filtros
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    error,
    pagination,
    filters,
    updateTaskStatus,
    applyFilters,
    changePage,
    refresh,
    setError
  };
};
