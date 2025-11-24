// Servicio centralizado para manejar todas las llamadas a la API
class ApiService {
  constructor() {
    // Debug: Verificar variables de entorno
// Environment debug disabled for production    // En desarrollo, usar URL relativa para aprovechar el proxy de Vite
    // En producción, usar la URL completa
    this.baseURL = import.meta.env.PROD 
      ? (import.meta.env.VITE_API_URL || 'https://appscrum-backend.onrender.com/api')
      : ''; // URL relativa para desarrollo (usará el proxy de Vite)
    
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // ✅ Sistema de deduplicación de peticiones
    this.pendingRequests = new Map(); // Peticiones en curso
    this.requestCache = new Map();    // Caché de respuestas (corta duración)
    this.CACHE_DURATION = 30000;      // 30 segundos para caché de API
  }

  async getHeaders(getToken) {
    const headers = { ...this.defaultHeaders };
    
    if (getToken) {
      try {
        let token;

        if (typeof getToken === 'function') {
          token = await getToken();
        } else if (typeof getToken === 'string') {
          token = getToken;
        } else if (getToken && typeof getToken.then === 'function') {
          token = await getToken;
        } else {
          console.warn('apiService.getHeaders: getToken provided is not a function, string, or promise:', getToken);
        }

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error al obtener el token:', error);
      }
    }
    
    return headers;
  }

  // Método genérico para hacer peticiones CON token de Clerk
  async request(endpoint, options = {}, getToken = null) {
    const method = options.method || 'GET';
    const cacheKey = `${method}:${endpoint}:${JSON.stringify(options.body || '')}`;
    
    // ✅ Deduplicación: Si ya hay una petición pendiente idéntica, esperar a que termine
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // ✅ Verificar caché de API (solo para GET)
    if (method === 'GET') {
      const cached = this.requestCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return Promise.resolve(cached.data);
      }
    }

    // Crear la promesa de petición
    const requestPromise = this._executeRequest(endpoint, options, getToken)
      .then(data => {
        // Guardar en caché solo si es GET y exitoso
        if (method === 'GET') {
          this.requestCache.set(cacheKey, {
            data,
            timestamp: Date.now()
          });
        }
        return data;
      })
      .finally(() => {
        // Limpiar de peticiones pendientes
        this.pendingRequests.delete(cacheKey);
      });

    // Guardar como pendiente
    this.pendingRequests.set(cacheKey, requestPromise);
    
    return requestPromise;
  }

  // Método privado que ejecuta la petición real
  async _executeRequest(endpoint, options = {}, getToken = null) {
    try {
      const headers = await this.getHeaders(getToken);
      
      // Si estamos en desarrollo y baseURL está vacío, agregar /api al endpoint
      let finalEndpoint = endpoint;
      if (!this.baseURL && !endpoint.startsWith('/api') && !endpoint.startsWith('http')) {
        finalEndpoint = `/api${endpoint}`;
      }
      
      const url = finalEndpoint.startsWith('http') ? finalEndpoint : `${this.baseURL}${finalEndpoint}`;

      const config = {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        },
        credentials: 'include'
      };

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      // Verificar que la respuesta sea JSON antes de parsearlo
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Respuesta no es JSON. Content-Type:', contentType);
        console.error('Contenido de respuesta:', text.substring(0, 500));
        throw new Error(`La respuesta del servidor no es JSON. Content-Type: ${contentType}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Invalidar caché de API por patrón
   * @param {string} pattern - Patrón para buscar en las claves
   */
  invalidateApiCache(pattern) {
    console.log(`🗑️ Invalidando caché API: ${pattern}`);
    for (const key of this.requestCache.keys()) {
      if (key.includes(pattern)) {
        this.requestCache.delete(key);
        console.log(`   - Eliminado: ${key}`);
      }
    }
  }

  /**
   * Limpiar todo el caché de API
   */
  clearApiCache() {
    console.log('🧹 Limpiando caché API completo');
    this.requestCache.clear();
  }

  // Métodos HTTP genéricos que trabajan con tokens de Clerk
  async get(endpoint, getToken = null) {
    return this.request(endpoint, { method: 'GET' }, getToken);
  }

  async post(endpoint, data, getToken = null) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }, getToken);
  }

  async put(endpoint, data, getToken = null) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, getToken);
  }

  async delete(endpoint, getToken = null) {
    return this.request(endpoint, { method: 'DELETE' }, getToken);
  }

  // Obtener miembros del equipo (requiere autenticación)
  async getTeamMembers(getToken) {
    return this.get('/team/members', getToken);
  }

  // Método para obtener headers con token
  async getAuthHeaders(getToken) {
    const token = await getToken();
    return {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`
    };
  }

  // Verificar conexión con el servidor
  async checkServerHealth() {
    return this.request('/health');
  }

  // Autenticación y usuario
  async registerUser(userData, getToken) {
    return this.post('/auth/register', userData, getToken);
  }

  async getUserProfile(getToken) {
    return this.get('/auth/user-profile', getToken);
  }

  // Eliminados métodos de gestión de notas

  // Gestión de usuarios (para admins)
  async getAllUsers(getToken) {
    return this.get('/admin/users', getToken);
  }

  async updateUserRole(userId, newRole, getToken) {
    return this.put(`/admin/users/${userId}/role`, { role: newRole }, getToken);
  }

  // Gestión de ceremonias
  async getCeremonies(getToken) {
    return this.get('/ceremonies', getToken);
  }

  async createCeremony(ceremonyData, getToken) {
    return this.post('/ceremonies', ceremonyData, getToken);
  }

  async updateCeremony(ceremonyId, ceremonyData, getToken) {
    return this.put(`/ceremonies/${ceremonyId}`, ceremonyData, getToken);
  }

  // Método para obtener miembros del equipo con fallback a datos mock
  async getTeamMembersWithFallback(getToken) {
    try {
      return await this.getTeamMembers(getToken);
    } catch (error) {
      console.warn('Using mock team members data:', error.message);
      
      // Datos mock para development/testing
      return {
        members: [
          {
            _id: '1',
            user: {
              firstName: 'Ana',
              lastName: 'García',
              email: 'ana.garcia@example.com'
            },
            role: 'scrum_master',
            status: 'active'
          },
          {
            _id: '2',
            user: {
              firstName: 'Carlos',
              lastName: 'López',
              email: 'carlos.lopez@example.com'
            },
            role: 'developer',
            status: 'active'
          },
          {
            _id: '3',
            user: {
              firstName: 'María',
              lastName: 'Rodríguez',
              email: 'maria.rodriguez@example.com'
            },
            role: 'developer',
            status: 'active'
          },
          {
            _id: '4',
            user: {
              firstName: 'David',
              lastName: 'Chen',
              email: 'david.chen@example.com'
            },
            role: 'product_owner',
            status: 'active'
          }
        ]
      };
    }
  }

  // ========== PANEL DE USUARIO APIs ==========
  
  // Obtener dashboard del usuario
  async getUserDashboard(userId, getToken) {
    return this.get(`/users/dashboard/${userId}`, getToken);
  }

  // Obtener proyectos del usuario
  async getUserProjects(userId, getToken) {
    return this.get(`/users/projects/${userId}`, getToken);
  }

  // Obtener actividades del usuario
  async getUserActivities(userId, getToken, page = 1, limit = 10) {
    return this.request(`/users/activities/${userId}?page=${page}&limit=${limit}`, {}, getToken);
  }

  // Obtener perfil del usuario
  async getUserProfile(userId, getToken) {
    return this.get(`/users/profile/${userId}`, getToken);
  }

  // Actualizar perfil del usuario
  async updateUserProfile(userId, profileData, getToken) {
    return this.put(`/users/profile/${userId}`, profileData, getToken);
  }
}

// Exportar una instancia única del servicio
export const apiService = new ApiService();
export default apiService;
