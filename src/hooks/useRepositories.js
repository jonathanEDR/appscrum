import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { repositoryApiService } from '../services/repositoryApiService';

/**
 * Hook para manejar repositorios de código
 */
export const useRepositories = (projectId) => {
  const { getToken } = useAuth();
  const [repositories, setRepositories] = useState([]);
  const [selectedRepository, setSelectedRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  // Configurar el token provider
  useEffect(() => {
    repositoryApiService.setTokenProvider(getToken);
  }, [getToken]);

  // Cargar repositorios al inicio
  useEffect(() => {
    if (projectId) {
      loadRepositories();
    }
  }, [projectId]);

  /**
   * Carga repositorios del proyecto
   */
  const loadRepositories = useCallback(async () => {
    if (!projectId) {
      setError('ID de proyecto requerido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando repositorios del proyecto:', projectId);
      
      const response = await repositoryApiService.getProjectRepositories(projectId);
      
      if (response.success) {
        const formattedRepos = response.data.map(repo => 
          repositoryApiService.formatRepositoryData(repo)
        );
        
        setRepositories(formattedRepos);
        
        // Seleccionar el primer repositorio si no hay ninguno seleccionado
        if (!selectedRepository && formattedRepos.length > 0) {
          setSelectedRepository(formattedRepos[0]);
        }
        
        console.log('✅ Repositorios cargados:', formattedRepos.length);
      } else {
        setError('Error al cargar repositorios');
      }
    } catch (err) {
      console.error('❌ Error cargando repositorios:', err);
      setError(err.message || 'Error al cargar repositorios');
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  }, [projectId, selectedRepository]);

  /**
   * Selecciona un repositorio y carga sus detalles
   */
  const selectRepository = useCallback(async (repository) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📂 Seleccionando repositorio:', repository.name);
      
      const response = await repositoryApiService.getRepositoryDetails(repository.id);
      
      if (response.success) {
        const repoWithDetails = {
          ...repositoryApiService.formatRepositoryData(response.data),
          commits: response.data.commits?.map(commit => 
            repositoryApiService.formatCommitData(commit)
          ) || [],
          pullRequests: response.data.pullRequests?.map(pr => 
            repositoryApiService.formatPullRequestData(pr)
          ) || [],
          statistics: response.data.statistics || {}
        };
        
        setSelectedRepository(repoWithDetails);
        console.log('✅ Repositorio seleccionado con detalles');
      } else {
        setError('Error al cargar detalles del repositorio');
      }
    } catch (err) {
      console.error('❌ Error seleccionando repositorio:', err);
      setError(err.message || 'Error al seleccionar repositorio');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sincroniza un repositorio con GitHub
   */
  const syncRepository = useCallback(async (repositoryId) => {
    try {
      setSyncing(repositoryId);
      setError(null);
      
      console.log('🔄 Sincronizando repositorio:', repositoryId);
      
      const response = await repositoryApiService.syncRepository(repositoryId);
      
      if (response.success) {
        // Actualizar el repositorio en la lista
        const updatedRepo = repositoryApiService.formatRepositoryData(response.data);
        
        setRepositories(prevRepos => 
          prevRepos.map(repo => 
            repo.id === repositoryId ? updatedRepo : repo
          )
        );
        
        // Si es el repositorio seleccionado, actualizarlo también
        if (selectedRepository?.id === repositoryId) {
          setSelectedRepository(prevRepo => ({
            ...prevRepo,
            ...updatedRepo
          }));
        }
        
        setLastSync(new Date());
        console.log('✅ Repositorio sincronizado exitosamente');
        
        return { success: true, message: 'Repositorio sincronizado exitosamente' };
      } else {
        setError('Error al sincronizar repositorio');
        return { success: false, message: 'Error al sincronizar repositorio' };
      }
    } catch (err) {
      console.error('❌ Error sincronizando repositorio:', err);
      const errorMessage = err.message || 'Error al sincronizar repositorio';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setSyncing(null);
    }
  }, [selectedRepository]);

  /**
   * Refresca datos de un repositorio específico
   */
  const refreshRepository = useCallback(async (repositoryId) => {
    const repository = repositories.find(repo => repo.id === repositoryId);
    if (repository) {
      await selectRepository(repository);
    }
  }, [repositories, selectRepository]);

  /**
   * Obtiene estadísticas generales
   */
  const getOverallStatistics = useCallback(() => {
    if (repositories.length === 0) {
      return {
        totalRepositories: 0,
        totalCommits: 0,
        totalBranches: 0,
        activeRepositories: 0
      };
    }

    return {
      totalRepositories: repositories.length,
      totalCommits: repositories.reduce((sum, repo) => sum + (repo.metrics?.commits || 0), 0),
      totalBranches: repositories.reduce((sum, repo) => sum + (repo.metrics?.branches || 0), 0),
      activeRepositories: repositories.filter(repo => repo.status === 'active').length
    };
  }, [repositories]);

  /**
   * Filtra repositorios por criterios
   */
  const filterRepositories = useCallback((criteria) => {
    let filtered = [...repositories];

    if (criteria.status) {
      filtered = filtered.filter(repo => repo.status === criteria.status);
    }

    if (criteria.language) {
      filtered = filtered.filter(repo => repo.language === criteria.language);
    }

    if (criteria.search) {
      const searchLower = criteria.search.toLowerCase();
      filtered = filtered.filter(repo => 
        repo.name.toLowerCase().includes(searchLower) ||
        repo.description?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [repositories]);

  /**
   * Obtiene actividad reciente de todos los repositorios
   */
  const getRecentActivity = useCallback(() => {
    const allActivity = [];

    repositories.forEach(repo => {
      if (repo.commits) {
        repo.commits.slice(0, 5).forEach(commit => {
          allActivity.push({
            type: 'commit',
            repository: repo.name,
            data: commit,
            date: new Date(commit.date)
          });
        });
      }

      if (repo.pullRequests) {
        repo.pullRequests.slice(0, 3).forEach(pr => {
          allActivity.push({
            type: 'pull_request',
            repository: repo.name,
            data: pr,
            date: new Date(pr.updatedAt)
          });
        });
      }
    });

    // Ordenar por fecha descendente
    return allActivity
      .sort((a, b) => b.date - a.date)
      .slice(0, 20);
  }, [repositories]);

  return {
    // Estado
    repositories,
    selectedRepository,
    loading,
    error,
    syncing,
    lastSync,

    // Acciones
    loadRepositories,
    selectRepository,
    syncRepository,
    refreshRepository,

    // Utilidades
    getOverallStatistics,
    filterRepositories,
    getRecentActivity,

    // Estados derivados
    hasRepositories: repositories.length > 0,
    isRepositorySelected: selectedRepository !== null,
    isSyncing: syncing !== null
  };
};

/**
 * Hook específico para commits
 */
export const useRepositoryCommits = (repositoryId) => {
  const { getToken } = useAuth();
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    hasMore: true
  });

  useEffect(() => {
    repositoryApiService.setTokenProvider(getToken);
  }, [getToken]);

  const loadCommits = useCallback(async (options = {}) => {
    if (!repositoryId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await repositoryApiService.getRepositoryCommits(repositoryId, {
        ...options,
        page: options.page || pagination.page,
        limit: options.limit || pagination.limit
      });

      if (response.success) {
        const formattedCommits = response.data.map(commit => 
          repositoryApiService.formatCommitData(commit)
        );

        if (options.page === 1 || !options.page) {
          setCommits(formattedCommits);
        } else {
          setCommits(prev => [...prev, ...formattedCommits]);
        }

        setPagination(prev => ({
          ...prev,
          hasMore: formattedCommits.length === pagination.limit
        }));
      } else {
        setError('Error al cargar commits');
      }
    } catch (err) {
      console.error('Error loading commits:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [repositoryId, pagination.page, pagination.limit]);

  const loadMore = useCallback(() => {
    if (!loading && pagination.hasMore) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
      loadCommits({ page: pagination.page + 1 });
    }
  }, [loading, pagination.hasMore, pagination.page, loadCommits]);

  useEffect(() => {
    if (repositoryId) {
      loadCommits();
    }
  }, [repositoryId]);

  return {
    commits,
    loading,
    error,
    pagination,
    loadCommits,
    loadMore
  };
};

/**
 * Hook específico para pull requests
 */
export const useRepositoryPullRequests = (repositoryId) => {
  const { getToken } = useAuth();
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    repositoryApiService.setTokenProvider(getToken);
  }, [getToken]);

  const loadPullRequests = useCallback(async (options = {}) => {
    if (!repositoryId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await repositoryApiService.getRepositoryPullRequests(repositoryId, options);

      if (response.success) {
        const formattedPRs = response.data.map(pr => 
          repositoryApiService.formatPullRequestData(pr)
        );
        setPullRequests(formattedPRs);
      } else {
        setError('Error al cargar pull requests');
      }
    } catch (err) {
      console.error('Error loading pull requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [repositoryId]);

  useEffect(() => {
    if (repositoryId) {
      loadPullRequests();
    }
  }, [repositoryId]);

  return {
    pullRequests,
    loading,
    error,
    loadPullRequests
  };
};
