// Servicio centralizado para manejar todas las llamadas a la API
class ApiService {
  constructor() {
    this.baseURL = '/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
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
}

// Exportar una instancia única del servicio
export const apiService = new ApiService();
export default apiService;
