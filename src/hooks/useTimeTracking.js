import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { developersApiService } from '../services/developersApiService';

/**
 * Hook para manejar time tracking y timer
 */
export const useTimeTracking = (initialPeriod = 'week') => {
  const { getToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [entries, setEntries] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(initialPeriod);
  const [timerSeconds, setTimerSeconds] = useState(0);
  
  // Ref para el intervalo del timer
  const timerIntervalRef = useRef(null);

  // Configurar el token provider en el servicio
  useEffect(() => {
    developersApiService.setTokenProvider(getToken);
  }, [getToken]);

  // Función para cargar estadísticas
  const loadStats = useCallback(async (newPeriod = period) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await developersApiService.getTimeTrackingStats(newPeriod);
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError('Error al cargar estadísticas');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }, [period]);

  // Función para cargar entradas de tiempo
  const loadEntries = useCallback(async (filters = {}) => {
    try {
      const response = await developersApiService.getTimeEntries(filters);
      
      if (response.success) {
        setEntries(response.data || []);
      } else {
        setError('Error al cargar entradas de tiempo');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar entradas de tiempo');
    }
  }, []);

  // Función para cargar timer activo
  const loadActiveTimer = useCallback(async () => {
    try {
      const response = await developersApiService.getActiveTimer();
      
      if (response.success && response.data) {
        setActiveTimer(response.data);
        
        // Calcular tiempo transcurrido
        if (response.data.startTime) {
          const startTime = new Date(response.data.startTime);
          const now = new Date();
          const elapsedSeconds = Math.floor((now - startTime) / 1000);
          setTimerSeconds(elapsedSeconds);
          
          // Iniciar contador si hay timer activo
          startTimerCounter();
        }
      } else {
        setActiveTimer(null);
        setTimerSeconds(0);
      }
    } catch (err) {
      console.error('Error al cargar timer activo:', err);
      setActiveTimer(null);
      setTimerSeconds(0);
    }
  }, []);

  // Función para iniciar timer
  const startTimer = useCallback(async (taskId) => {
    try {
      setError(null);
      
      const response = await developersApiService.startTimer(taskId);
      
      if (response.success) {
        setActiveTimer(response.data);
        setTimerSeconds(0);
        startTimerCounter();
        
        // Recargar estadísticas
        await loadStats();
        
        return response.data;
      } else {
        throw new Error('Error al iniciar timer');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar timer');
      throw err;
    }
  }, [loadStats]);

  // Función para detener timer
  const stopTimer = useCallback(async (description = '') => {
    try {
      setError(null);
      
      const response = await developersApiService.stopTimer(description);
      
      if (response.success) {
        setActiveTimer(null);
        setTimerSeconds(0);
        stopTimerCounter();
        
        // Recargar estadísticas y entradas
        await Promise.all([
          loadStats(),
          loadEntries()
        ]);
        
        return response.data;
      } else {
        throw new Error('Error al detener timer');
      }
    } catch (err) {
      setError(err.message || 'Error al detener timer');
      throw err;
    }
  }, [loadStats, loadEntries]);

  // Función para crear entrada manual de tiempo
  const createTimeEntry = useCallback(async (timeData) => {
    try {
      setError(null);
      
      const response = await developersApiService.createTimeEntry(timeData);
      
      if (response.success) {
        // Recargar datos
        await Promise.all([
          loadStats(),
          loadEntries()
        ]);
        
        return response.data;
      } else {
        throw new Error('Error al crear entrada de tiempo');
      }
    } catch (err) {
      setError(err.message || 'Error al crear entrada de tiempo');
      throw err;
    }
  }, [loadStats, loadEntries]);

  // Función para actualizar entrada de tiempo
  const updateTimeEntry = useCallback(async (entryId, updateData) => {
    try {
      setError(null);
      
      const response = await developersApiService.updateTimeEntry(entryId, updateData);
      
      if (response.success) {
        // Actualizar entrada en el estado local
        setEntries(prevEntries => 
          prevEntries.map(entry => 
            entry._id === entryId 
              ? { ...entry, ...updateData }
              : entry
          )
        );
        
        // Recargar estadísticas
        await loadStats();
        
        return response.data;
      } else {
        throw new Error('Error al actualizar entrada de tiempo');
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar entrada de tiempo');
      throw err;
    }
  }, [loadStats]);

  // Función para eliminar entrada de tiempo
  const deleteTimeEntry = useCallback(async (entryId) => {
    try {
      setError(null);
      
      const response = await developersApiService.deleteTimeEntry(entryId);
      
      if (response.success) {
        // Eliminar entrada del estado local
        setEntries(prevEntries => 
          prevEntries.filter(entry => entry._id !== entryId)
        );
        
        // Recargar estadísticas
        await loadStats();
        
        return response.data;
      } else {
        throw new Error('Error al eliminar entrada de tiempo');
      }
    } catch (err) {
      setError(err.message || 'Error al eliminar entrada de tiempo');
      throw err;
    }
  }, [loadStats]);

  // Función para iniciar contador del timer
  const startTimerCounter = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
  }, []);

  // Función para detener contador del timer
  const stopTimerCounter = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Función para cambiar período de estadísticas
  const changePeriod = useCallback((newPeriod) => {
    setPeriod(newPeriod);
    loadStats(newPeriod);
  }, [loadStats]);

  // Función para formatear tiempo del timer
  const formatTimerTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Función para refrescar todos los datos
  const refresh = useCallback(async () => {
    await Promise.all([
      loadStats(),
      loadEntries(),
      loadActiveTimer()
    ]);
  }, [loadStats, loadEntries, loadActiveTimer]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        loadStats(),
        loadEntries(),
        loadActiveTimer()
      ]);
    };
    
    loadInitialData();
  }, [loadStats, loadEntries, loadActiveTimer]);

  // Efecto para limpiar interval al desmontar
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  return {
    // Estados
    stats,
    entries,
    activeTimer,
    loading,
    error,
    period,
    timerSeconds,
    
    // Funciones
    startTimer,
    stopTimer,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    changePeriod,
    refresh,
    formatTimerTime,
    setError,
    
    // Estados computados
    isTimerRunning: !!activeTimer,
    formattedTimerTime: formatTimerTime(timerSeconds)
  };
};
