import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

/**
 * Hook para obtener el progreso real de items técnicos de una historia
 */
export const useTechnicalItemsProgress = (storyId) => {
  const { getToken } = useAuth();
  const [progress, setProgress] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    percentage: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProgress = async () => {
    if (!storyId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      const response = await fetch(`/api/backlog/story/${storyId}/technical-progress`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProgress(data.data);
      } else {
        setError(data.message || 'Error al obtener progreso');
      }
    } catch (err) {
      console.error('Error fetching technical items progress:', err);
      setError(err.message || 'Error al obtener progreso');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [storyId]);

  return {
    progress,
    loading,
    error,
    refetch: fetchProgress
  };
};