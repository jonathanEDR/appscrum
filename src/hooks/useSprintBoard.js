import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { developersApiService } from '../services/developersApiService';

/**
 * Hook para manejar el sprint board del developer
 */
export const useSprintBoard = (initialSprintId = null) => {
  const { getToken } = useAuth();
  const [sprintData, setSprintData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSprintId, setSelectedSprintId] = useState(initialSprintId);
  const [updatingTask, setUpdatingTask] = useState(null);

  // Configurar el token provider en el servicio
  useEffect(() => {
    developersApiService.setTokenProvider(getToken);
  }, [getToken]);

  // Función para cargar datos del sprint board
  const loadSprintBoard = useCallback(async (sprintId = selectedSprintId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await developersApiService.getSprintBoardData(sprintId);
      
      if (response.success) {
        setSprintData(response.data);
      } else {
        setError('Error al cargar datos del sprint board');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar datos del sprint board');
      setSprintData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedSprintId]);

  // Función para actualizar estado de tarea con optimistic update
  const updateTaskStatus = useCallback(async (taskId, newStatus) => {
    try {
      setUpdatingTask(taskId);
      setError(null);
      
      // Optimistic update
      setSprintData(prevData => {
        if (!prevData) return prevData;
        
        const updatedTasks = prevData.tasks.map(task => 
          task._id === taskId 
            ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
            : task
        );
        
        const updatedAllTasks = prevData.allTasks.map(task => 
          task._id === taskId 
            ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
            : task
        );
        
        // Recalcular métricas
        const newMetrics = calculateSprintMetrics(updatedAllTasks);
        
        return {
          ...prevData,
          tasks: updatedTasks,
          allTasks: updatedAllTasks,
          metrics: newMetrics,
          sprint: {
            ...prevData.sprint,
            progress: newMetrics.sprintProgress
          }
        };
      });
      
      // Llamada real a la API
      const response = await developersApiService.updateTaskStatus(taskId, newStatus);
      
      if (response.success) {
        // La actualización optimista ya se aplicó, solo confirmamos
        return response.data;
      } else {
        // Revertir cambio optimista
        await loadSprintBoard();
        throw new Error('Error al actualizar tarea');
      }
    } catch (err) {
      // Revertir cambio optimista en caso de error
      await loadSprintBoard();
      setError(err.message || 'Error al actualizar tarea');
      throw err;
    } finally {
      setUpdatingTask(null);
    }
  }, [loadSprintBoard]);

  // Función para calcular métricas del sprint
  const calculateSprintMetrics = useCallback((tasks) => {
    const totalPoints = tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
    const completedPoints = tasks
      .filter(task => task.status === 'done')
      .reduce((sum, task) => sum + (task.storyPoints || 0), 0);
    
    const sprintProgress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;
    
    return {
      totalPoints,
      completedPoints,
      sprintProgress,
      todoTasks: tasks.filter(t => t.status === 'todo').length,
      inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
      codeReviewTasks: tasks.filter(t => t.status === 'code_review').length,
      testingTasks: tasks.filter(t => t.status === 'testing').length,
      doneTasks: tasks.filter(t => t.status === 'done').length
    };
  }, []);

  // Función para obtener tareas por estado
  const getTasksByStatus = useCallback((status) => {
    if (!sprintData) return [];
    return sprintData.tasks.filter(task => task.status === status);
  }, [sprintData]);

  // Función para obtener el progreso de una tarea específica
  const getTaskProgress = useCallback((task) => {
    if (!task.estimatedHours) return 0;
    const spentHours = task.spentHours || 0;
    return Math.min((spentHours / task.estimatedHours) * 100, 100);
  }, []);

  // Función para obtener color de prioridad
  const getPriorityColor = useCallback((priority) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100', 
      high: 'text-orange-600 bg-orange-100',
      critical: 'text-red-600 bg-red-100'
    };
    return colors[priority] || colors.medium;
  }, []);

  // Función para obtener color de estado
  const getStatusColor = useCallback((status) => {
    const colors = {
      todo: 'text-gray-600 bg-gray-100',
      in_progress: 'text-blue-600 bg-blue-100',
      code_review: 'text-purple-600 bg-purple-100',
      testing: 'text-yellow-600 bg-yellow-100',
      done: 'text-green-600 bg-green-100'
    };
    return colors[status] || colors.todo;
  }, []);

  // Función para verificar si el sprint está activo
  const isSprintActive = useCallback(() => {
    if (!sprintData?.sprint) return false;
    
    const now = new Date();
    const startDate = new Date(sprintData.sprint.startDate);
    const endDate = new Date(sprintData.sprint.endDate);
    
    return now >= startDate && now <= endDate;
  }, [sprintData]);

  // Función para obtener días restantes del sprint
  const getDaysRemaining = useCallback(() => {
    if (!sprintData?.sprint) return 0;
    
    const now = new Date();
    const endDate = new Date(sprintData.sprint.endDate);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(diffDays, 0);
  }, [sprintData]);

  // Función para cambiar sprint
  const changeSprint = useCallback((sprintId) => {
    setSelectedSprintId(sprintId);
    loadSprintBoard(sprintId);
  }, [loadSprintBoard]);

  // Función para refrescar datos
  const refresh = useCallback(() => {
    loadSprintBoard();
  }, [loadSprintBoard]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadSprintBoard();
  }, [loadSprintBoard]);

  return {
    // Estados
    sprintData,
    loading,
    error,
    selectedSprintId,
    updatingTask,
    
    // Funciones
    updateTaskStatus,
    changeSprint,
    refresh,
    setError,
    
    // Funciones computadas
    getTasksByStatus,
    getTaskProgress,
    getPriorityColor,
    getStatusColor,
    isSprintActive,
    getDaysRemaining,
    
    // Estados computados
    sprint: sprintData?.sprint || null,
    tasks: sprintData?.tasks || [],
    metrics: sprintData?.metrics || {},
    isActive: isSprintActive(),
    daysRemaining: getDaysRemaining()
  };
};
