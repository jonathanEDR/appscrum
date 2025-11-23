import { apiService } from './apiService';

/**
 * Servicio para manejar operaciones de CV/Perfil
 */
class ProfileService {
  /**
   * Obtener CV del usuario autenticado
   */
  async getMyCV(getToken) {
    return await apiService.request('/profile/my-cv', {
      method: 'GET'
    }, getToken);
  }

  /**
   * Obtener CV de un usuario específico (solo super_admin)
   */
  async getUserCV(userId, getToken) {
    return await apiService.request(`/profile/cv/${userId}`, {
      method: 'GET'
    }, getToken);
  }

  /**
   * Actualizar información personal
   */
  async updatePersonalInfo(data, getToken) {
    return await apiService.request('/profile/personal-info', {
      method: 'PUT',
      body: JSON.stringify(data)
    }, getToken);
  }

  /**
   * Actualizar información profesional
   */
  async updateProfessionalInfo(data, getToken) {
    return await apiService.request('/profile/professional-info', {
      method: 'PUT',
      body: JSON.stringify(data)
    }, getToken);
  }

  /**
   * Actualizar foto de perfil
   */
  async updatePhoto(photoUrl, photoPublicId, getToken) {
    return await apiService.request('/profile/photo', {
      method: 'PUT',
      body: JSON.stringify({ photoUrl, photoPublicId })
    }, getToken);
  }

  // ==================== SKILLS ====================
  
  async addSkill(data, getToken) {
    return await apiService.request('/profile/skills', {
      method: 'POST',
      body: JSON.stringify(data)
    }, getToken);
  }

  async updateSkill(skillId, data, getToken) {
    return await apiService.request(`/profile/skills/${skillId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, getToken);
  }

  async deleteSkill(skillId, getToken) {
    return await apiService.request(`/profile/skills/${skillId}`, {
      method: 'DELETE'
    }, getToken);
  }

  // ==================== EXPERIENCE ====================
  
  async addExperience(data, getToken) {
    return await apiService.request('/profile/experience', {
      method: 'POST',
      body: JSON.stringify(data)
    }, getToken);
  }

  async updateExperience(expId, data, getToken) {
    return await apiService.request(`/profile/experience/${expId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, getToken);
  }

  async deleteExperience(expId, getToken) {
    return await apiService.request(`/profile/experience/${expId}`, {
      method: 'DELETE'
    }, getToken);
  }

  // ==================== EDUCATION ====================
  
  async addEducation(data, getToken) {
    return await apiService.request('/profile/education', {
      method: 'POST',
      body: JSON.stringify(data)
    }, getToken);
  }

  async updateEducation(eduId, data, getToken) {
    return await apiService.request(`/profile/education/${eduId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, getToken);
  }

  async deleteEducation(eduId, getToken) {
    return await apiService.request(`/profile/education/${eduId}`, {
      method: 'DELETE'
    }, getToken);
  }

  // ==================== PROJECTS ====================
  
  async addProject(data, getToken) {
    return await apiService.request('/profile/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    }, getToken);
  }

  async updateProject(projectId, data, getToken) {
    return await apiService.request(`/profile/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, getToken);
  }

  async deleteProject(projectId, getToken) {
    return await apiService.request(`/profile/projects/${projectId}`, {
      method: 'DELETE'
    }, getToken);
  }

  // ==================== CERTIFICATIONS ====================
  
  async addCertification(data, getToken) {
    return await apiService.request('/profile/certifications', {
      method: 'POST',
      body: JSON.stringify(data)
    }, getToken);
  }

  async updateCertification(certId, data, getToken) {
    return await apiService.request(`/profile/certifications/${certId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, getToken);
  }

  async deleteCertification(certId, getToken) {
    return await apiService.request(`/profile/certifications/${certId}`, {
      method: 'DELETE'
    }, getToken);
  }
}

export const profileService = new ProfileService();
