import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { developersApiService } from '../services/developersApiService';

/**
 * Hook para manejar repositorios de código
 */
export const useCodeRepositories = () => {
  const { getToken } = useAuth();
  const [repositories, setRepositories] = useState([]);
  const [commits, setCommits] = useState([]);
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);

  // Estados de carga específicos
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [loadingPRs, setLoadingPRs] = useState(false);

  // Configurar el token provider en el servicio
  useEffect(() => {
    developersApiService.setTokenProvider(getToken);
  }, [getToken]);

  // Función para cargar repositorios
  const loadRepositories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await developersApiService.getRepositories();
      
      if (response.success) {
        setRepositories(response.data || []);
        
        // Seleccionar el primer repositorio si existe
        if (response.data && response.data.length > 0 && !selectedRepo) {
          setSelectedRepo(response.data[0]);
        }
      } else {
        setError('Error al cargar repositorios');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar repositorios');
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRepo]);

  // Función para cargar commits
  const loadCommits = useCallback(async (filters = {}) => {
    try {
      setLoadingCommits(true);
      
      const response = await developersApiService.getCommitHistory(filters);
      
      if (response.success) {
        setCommits(response.data || []);
      } else {
        console.error('Error al cargar commits');
      }
    } catch (err) {
      console.error('Error al cargar commits:', err);
      setCommits([]);
    } finally {
      setLoadingCommits(false);
    }
  }, []);

  // Función para cargar pull requests
  const loadPullRequests = useCallback(async (filters = {}) => {
    try {
      setLoadingPRs(true);
      
      const response = await developersApiService.getPullRequests(filters);
      
      if (response.success) {
        setPullRequests(response.data || []);
      } else {
        console.error('Error al cargar pull requests');
      }
    } catch (err) {
      console.error('Error al cargar pull requests:', err);
      setPullRequests([]);
    } finally {
      setLoadingPRs(false);
    }
  }, []);

  // Función para seleccionar repositorio
  const selectRepository = useCallback((repo) => {
    setSelectedRepo(repo);
    
    // Cargar datos específicos del repositorio
    if (repo) {
      loadCommits({ repository: repo._id });
      loadPullRequests({ repository: repo._id });
    }
  }, [loadCommits, loadPullRequests]);

  // Función para filtrar commits por repositorio
  const getCommitsByRepo = useCallback((repoId) => {
    return commits.filter(commit => 
      commit.repository && commit.repository._id === repoId
    );
  }, [commits]);

  // Función para filtrar PRs por repositorio
  const getPRsByRepo = useCallback((repoId) => {
    return pullRequests.filter(pr => 
      pr.repository && pr.repository._id === repoId
    );
  }, [pullRequests]);

  // Función para obtener estadísticas de repositorio
  const getRepoStats = useCallback((repo) => {
    if (!repo) return null;
    
    const repoCommits = getCommitsByRepo(repo._id);
    const repoPRs = getPRsByRepo(repo._id);
    
    return {
      commits: repoCommits.length,
      pullRequests: repoPRs.length,
      openPRs: repoPRs.filter(pr => pr.status === 'open').length,
      mergedPRs: repoPRs.filter(pr => pr.status === 'merged').length,
      lastCommit: repoCommits.length > 0 ? repoCommits[0] : null,
      totalAdditions: repoCommits.reduce((sum, commit) => sum + (commit.additions || 0), 0),
      totalDeletions: repoCommits.reduce((sum, commit) => sum + (commit.deletions || 0), 0)
    };
  }, [getCommitsByRepo, getPRsByRepo]);

  // Función para obtener estadísticas generales
  const getGeneralStats = useCallback(() => {
    return {
      totalRepos: repositories.length,
      totalCommits: commits.length,
      totalPRs: pullRequests.length,
      activeRepos: repositories.filter(repo => repo.status === 'active').length,
      recentCommits: commits.slice(0, 5),
      recentPRs: pullRequests.slice(0, 3),
      languageStats: repositories.reduce((acc, repo) => {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
        return acc;
      }, {})
    };
  }, [repositories, commits, pullRequests]);

  // Función para formatear fecha de commit
  const formatCommitDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Hace 1 día';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }, []);

  // Función para refrescar todos los datos
  const refresh = useCallback(async () => {
    await Promise.all([
      loadRepositories(),
      loadCommits(),
      loadPullRequests()
    ]);
  }, [loadRepositories, loadCommits, loadPullRequests]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      await loadRepositories();
      // Los commits y PRs se cargarán cuando se seleccione un repositorio
      await Promise.all([
        loadCommits(),
        loadPullRequests()
      ]);
    };
    
    loadInitialData();
  }, [loadRepositories, loadCommits, loadPullRequests]);

  return {
    // Estados
    repositories,
    commits,
    pullRequests,
    loading,
    loadingCommits,
    loadingPRs,
    error,
    selectedRepo,
    
    // Funciones
    selectRepository,
    refresh,
    setError,
    
    // Funciones computadas
    getCommitsByRepo,
    getPRsByRepo,
    getRepoStats,
    getGeneralStats,
    formatCommitDate,
    
    // Estados computados
    repoStats: selectedRepo ? getRepoStats(selectedRepo) : null,
    generalStats: getGeneralStats()
  };
};
