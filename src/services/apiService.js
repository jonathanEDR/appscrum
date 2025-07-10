// Servicio centralizado para manejar todas las llamadas a la API
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
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
}

// Exportar una instancia única del servicio
export const apiService = new ApiService();
export default apiService;
