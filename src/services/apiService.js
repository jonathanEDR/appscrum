// Servicio centralizado para manejar todas las llamadas a la API
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async getHeaders(getToken) {
    const headers = { ...this.defaultHeaders };
    
    if (getToken) {
      try {
        const token = await getToken();
        headers['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error al obtener el token:', error);
      }
    }
    
    return headers;
  }

  // Método genérico para hacer peticiones CON token de Clerk
  async request(endpoint, options = {}, getToken = null) {
    try {
      const headers = await this.getHeaders(getToken);
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
      
      console.log('Haciendo petición a:', url);
      console.log('Headers:', headers);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
    
    // Verificar si hay un token en las headers, si no hay, lanzar error específico
    if (!options.headers || !options.headers['Authorization']) {
      throw new Error('Token no proporcionado');
    }
    
    const config = {
      headers: this.defaultHeaders,
      credentials: 'include',
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Métodos HTTP genéricos que trabajan con tokens de Clerk
  async get(endpoint, token = null) {
    const headers = { ...this.defaultHeaders };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return this.request(endpoint, { 
      method: 'GET',
      headers 
    });
  }

  async post(endpoint, data, token = null) {
    const headers = { ...this.defaultHeaders };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data, token = null) {
    const headers = { ...this.defaultHeaders };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return this.request(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint, token = null) {
    const headers = { ...this.defaultHeaders };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return this.request(endpoint, { 
      method: 'DELETE',
      headers 
    });
  }

  // Obtener miembros del equipo (requiere autenticación)
  async getTeamMembers(getToken) {
    try {
      const headers = await this.getAuthHeaders(getToken);
      const response = await fetch(`${this.baseURL}/team/members`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch team members: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
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
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: this.defaultHeaders,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error connecting to server:', error);
      throw error;
    }
  }

  // Autenticación y usuario
  async registerUser(userData, getToken) {
    try {
      const headers = await this.getAuthHeaders(getToken);
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async getUserProfile(getToken) {
    try {
      const headers = await this.getAuthHeaders(getToken);
      const response = await fetch(`${this.baseURL}/auth/user-profile`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Eliminados métodos de gestión de notas

  // Gestión de usuarios (para admins)
  async getAllUsers(getToken) {
    try {
      const headers = await this.getAuthHeaders(getToken);
      const response = await fetch(`${this.baseURL}/admin/users`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async updateUserRole(userId, newRole, getToken) {
    try {
      const headers = await this.getAuthHeaders(getToken);
      const response = await fetch(`${this.baseURL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ role: newRole }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating user role');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Gestión de ceremonias
  async getCeremonies(getToken) {
    try {
      const headers = await this.getAuthHeaders(getToken);
      const response = await fetch(`${this.baseURL}/ceremonies`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ceremonies: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching ceremonies:', error);
      throw error;
    }
  }

  async createCeremony(ceremonyData, getToken) {
    try {
      const headers = await this.getAuthHeaders(getToken);
      const response = await fetch(`${this.baseURL}/ceremonies`, {
        method: 'POST',
        headers,
        body: JSON.stringify(ceremonyData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating ceremony');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating ceremony:', error);
      throw error;
    }
  }

  async updateCeremony(ceremonyId, ceremonyData, getToken) {
    try {
      const headers = await this.getAuthHeaders(getToken);
      const response = await fetch(`${this.baseURL}/ceremonies/${ceremonyId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(ceremonyData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating ceremony');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating ceremony:', error);
      throw error;
    }
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
    try {
      const headers = await this.getAuthHeaders(getToken);
      const response = await fetch(`${this.baseURL}/users/dashboard/${userId}`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user dashboard: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user dashboard:', error);
      throw error;
    }
  }

  // Obtener proyectos del usuario
  async getUserProjects(userId, getToken) {
    try {
      const headers = await this.getAuthHeaders(getToken);
      const response = await fetch(`${this.baseURL}/users/projects/${userId}`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user projects: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user projects:', error);
      throw error;
    }
  }

  // Obtener actividades del usuario
  async getUserActivities(userId, getToken, page = 1, limit = 10) {
    try {
      const headers = await this.getAuthHeaders(getToken);
      const response = await fetch(`${this.baseURL}/users/activities/${userId}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user activities: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }
  }

  // Obtener perfil del usuario
  async getUserProfile(userId, getToken) {
    try {
      const headers = await this.getAuthHeaders(getToken);
      const response = await fetch(`${this.baseURL}/users/profile/${userId}`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Actualizar perfil del usuario
  async updateUserProfile(userId, profileData, getToken) {
    try {
      const headers = await this.getAuthHeaders(getToken);
      const response = await fetch(`${this.baseURL}/users/profile/${userId}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update user profile: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

// Exportar una instancia única del servicio
export const apiService = new ApiService();
export default apiService;
