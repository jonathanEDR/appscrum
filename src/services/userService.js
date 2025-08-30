import { apiService } from './apiService';

class UserService {
  constructor() {
    this.currentUser = null;
    this.isLoading = false;
  }

  // Obtener el perfil del usuario actual
  async getCurrentUser(token) {
    try {
      if (this.isLoading) return null;
      this.isLoading = true;

      const profile = await apiService.request('/auth/profile', {
        method: 'GET'
      }, () => Promise.resolve(token));

      this.currentUser = profile;
      return profile;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Actualizar el rol del usuario
  async updateUserRole(userId, role, token) {
    try {
      return await apiService.request('/auth/role', {
        method: 'PUT',
        body: JSON.stringify({ role })
      }, () => Promise.resolve(token));
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Verificar estado de autenticación
  async checkAuth(token) {
    try {
      return await apiService.request('/auth/check', {
        method: 'GET'
      }, () => Promise.resolve(token));
    } catch (error) {
      console.error('Error checking auth:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
