import { apiService } from './apiService';

class RepositoryApiService {
  constructor() {
    this.baseURL = '/repositories';  // Sin /api porque apiService ya lo incluye
    this.tokenProvider = null;
  }

  /**
   * Configura el proveedor de tokens
   */
  setTokenProvider(tokenProvider) {
    this.tokenProvider = tokenProvider;
  }

  /**
   * Obtiene el token del contexto
   */
  async _getTokenFromContext() {
    if (!this.tokenProvider) {
      throw new Error('Token provider no configurado');
    }
    return await this.tokenProvider();
  }

  /**
   * Manejo de errores
   */
  handleError(error) {
    console.error('Repository API Error:', error);
    
    if (error.response?.status === 401) {
      return new Error('No autorizado. Por favor, inicia sesión nuevamente.');
    }
    
    if (error.response?.status === 403) {
      return new Error('No tienes permisos para acceder a esta funcionalidad.');
    }
    
    if (error.response?.status === 404) {
      return new Error('Repositorio no encontrado.');
    }
    
    return new Error(error.response?.data?.message || 'Error al comunicarse con el servidor');
  }

  /**
   * Obtiene repositorios del proyecto
   */
  async getProjectRepositories(projectId) {
    try {
      const token = await this._getTokenFromContext();
      const url = `${this.baseURL}/project/${projectId}`;  // Cambiado a /project/:projectId
      
      console.log('📡 Obteniendo repositorios del proyecto:', projectId);
      
      const response = await apiService.get(url, token);
      return response;
    } catch (error) {
      console.error('Error al obtener repositorios:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene detalles de un repositorio específico
   */
  async getRepositoryDetails(repositoryId) {
    try {
      const token = await this._getTokenFromContext();
      const url = `${this.baseURL}/${repositoryId}`;
      
      console.log('📡 Obteniendo detalles del repositorio:', repositoryId);
      
      const response = await apiService.get(url, token);
      return response;
    } catch (error) {
      console.error('Error al obtener detalles del repositorio:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Sincroniza repositorio con GitHub
   */
  async syncRepository(repositoryId) {
    try {
      const token = await this._getTokenFromContext();
      const url = `${this.baseURL}/${repositoryId}/sync`;
      
      console.log('🔄 Sincronizando repositorio:', repositoryId);
      
      const response = await apiService.post(url, {}, token);
      return response;
    } catch (error) {
      console.error('Error al sincronizar repositorio:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene commits del repositorio
   */
  async getRepositoryCommits(repositoryId, options = {}) {
    try {
      const token = await this._getTokenFromContext();
      const params = new URLSearchParams();
      
      if (options.limit) params.append('limit', options.limit);
      if (options.page) params.append('page', options.page);
      if (options.author) params.append('author', options.author);
      if (options.since) params.append('since', options.since);
      if (options.until) params.append('until', options.until);
      
      const queryString = params.toString();
      const url = `${this.baseURL}/${repositoryId}/commits${queryString ? '?' + queryString : ''}`;
      
      console.log('📡 Obteniendo commits del repositorio:', repositoryId);
      
      const response = await apiService.get(url, token);
      return response;
    } catch (error) {
      console.error('Error al obtener commits:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene pull requests del repositorio
   */
  async getRepositoryPullRequests(repositoryId, options = {}) {
    try {
      const token = await this._getTokenFromContext();
      const params = new URLSearchParams();
      
      if (options.limit) params.append('limit', options.limit);
      if (options.page) params.append('page', options.page);
      if (options.state) params.append('state', options.state);
      if (options.author) params.append('author', options.author);
      
      const queryString = params.toString();
      const url = `${this.baseURL}/${repositoryId}/pull-requests${queryString ? '?' + queryString : ''}`;
      
      console.log('📡 Obteniendo PRs del repositorio:', repositoryId);
      
      const response = await apiService.get(url, token);
      return response;
    } catch (error) {
      console.error('Error al obtener pull requests:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene estadísticas del repositorio
   */
  async getRepositoryStatistics(repositoryId) {
    try {
      const token = await this._getTokenFromContext();
      const url = `${this.baseURL}/${repositoryId}/statistics`;
      
      console.log('📡 Obteniendo estadísticas del repositorio:', repositoryId);
      
      const response = await apiService.get(url, token);
      return response;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene commits por desarrollador
   */
  async getDeveloperCommits(developerId, options = {}) {
    try {
      const token = await this._getTokenFromContext();
      const params = new URLSearchParams();
      
      params.append('author', developerId);
      if (options.limit) params.append('limit', options.limit);
      if (options.since) params.append('since', options.since);
      if (options.until) params.append('until', options.until);
      if (options.repositoryId) params.append('repositoryId', options.repositoryId);
      
      const queryString = params.toString();
      const url = `${this.baseURL}/commits${queryString ? '?' + queryString : ''}`;
      
      console.log('📡 Obteniendo commits del desarrollador:', developerId);
      
      const response = await apiService.get(url, token);
      return response;
    } catch (error) {
      console.error('Error al obtener commits del desarrollador:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Obtiene pull requests por desarrollador
   */
  async getDeveloperPullRequests(developerId, options = {}) {
    try {
      const token = await this._getTokenFromContext();
      const params = new URLSearchParams();
      
      params.append('author', developerId);
      if (options.limit) params.append('limit', options.limit);
      if (options.state) params.append('state', options.state);
      if (options.repositoryId) params.append('repositoryId', options.repositoryId);
      
      const queryString = params.toString();
      const url = `${this.baseURL}/pull-requests${queryString ? '?' + queryString : ''}`;
      
      console.log('📡 Obteniendo PRs del desarrollador:', developerId);
      
      const response = await apiService.get(url, token);
      return response;
    } catch (error) {
      console.error('Error al obtener PRs del desarrollador:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Formatea datos para uso en componentes
   */
  formatRepositoryData(repository) {
    return {
      id: repository._id,
      name: repository.name,
      description: repository.description,
      language: repository.language,
      status: repository.status,
      url: repository.url,
      provider: repository.provider,
      metrics: {
        commits: repository.metrics?.total_commits || 0,
        branches: repository.metrics?.total_branches || 0,
        lastCommit: repository.metrics?.last_commit_date
      },
      recentActivity: repository.lastActivity
    };
  }

  formatCommitData(commit) {
    return {
      id: commit._id,
      sha: commit.sha,
      message: commit.message,
      author: {
        name: commit.author.name,
        email: commit.author.email,
        avatar: commit.author.avatar_url,
        user: commit.author.user
      },
      date: commit.commit_date,
      url: commit.html_url,
      stats: {
        additions: commit.stats?.additions || 0,
        deletions: commit.stats?.deletions || 0,
        total: commit.stats?.total || 0
      },
      tags: commit.tags || []
    };
  }

  formatPullRequestData(pr) {
    return {
      id: pr._id,
      number: pr.number,
      title: pr.title,
      description: pr.description,
      state: pr.state,
      status: pr.status,
      author: {
        name: pr.github_author?.username || 'Unknown',
        avatar: pr.github_author?.avatar_url,
        user: pr.author
      },
      baseBranch: pr.base_branch,
      headBranch: pr.head_branch,
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      url: pr.github_data?.html_url,
      stats: {
        additions: pr.stats?.additions || 0,
        deletions: pr.stats?.deletions || 0,
        commits: pr.stats?.commits_count || 0,
        changedFiles: pr.stats?.changed_files || 0
      },
      reviewers: pr.reviewers || []
    };
  }
}

export const repositoryApiService = new RepositoryApiService();
