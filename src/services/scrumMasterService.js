// Servicios API para el módulo Scrum Master
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ScrumMasterService {
  // Métodos para impedimentos
  async getImpediments(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/impediments?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener impedimentos');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getImpediments:', error);
      throw error;
    }
  }

  async createImpediment(impedimentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/impediments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(impedimentData)
      });
      
      if (!response.ok) {
        throw new Error('Error al crear impedimento');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en createImpediment:', error);
      throw error;
    }
  }

  async updateImpediment(id, impedimentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/impediments/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(impedimentData)
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar impedimento');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en updateImpediment:', error);
      throw error;
    }
  }

  async deleteImpediment(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/impediments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar impedimento');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en deleteImpediment:', error);
      throw error;
    }
  }

  // Métodos para ceremonias
  async getCeremonies(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/ceremonies?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener ceremonias');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getCeremonies:', error);
      throw error;
    }
  }

  async createCeremony(ceremonyData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ceremonies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ceremonyData)
      });
      
      if (!response.ok) {
        throw new Error('Error al crear ceremonia');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en createCeremony:', error);
      throw error;
    }
  }

  async updateCeremony(id, ceremonyData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ceremonies/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ceremonyData)
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar ceremonia');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en updateCeremony:', error);
      throw error;
    }
  }

  // Métodos para métricas y reportes
  async getSprintMetrics(sprintId) {
    try {
      const response = await fetch(`${API_BASE_URL}/sprints/${sprintId}/metrics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener métricas del sprint');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getSprintMetrics:', error);
      throw error;
    }
  }

  async getTeamVelocity(timeframe = 'last_5_sprints') {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/velocity?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener velocidad del equipo');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getTeamVelocity:', error);
      throw error;
    }
  }

  async getBurndownData(sprintId) {
    try {
      const response = await fetch(`${API_BASE_URL}/sprints/${sprintId}/burndown`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener datos de burndown');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getBurndownData:', error);
      throw error;
    }
  }

  // Métodos para gestión del equipo
  async getTeamMembers() {
    try {
      const response = await fetch(`${API_BASE_URL}/team/members`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener miembros del equipo');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getTeamMembers:', error);
      throw error;
    }
  }

  async updateTeamMemberStatus(memberId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/team/members/${memberId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar estado del miembro');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en updateTeamMemberStatus:', error);
      throw error;
    }
  }

  // Métodos para exportación de reportes
  async exportImpedimentsReport(format = 'pdf', filters = {}) {
    try {
      const queryParams = new URLSearchParams({ format, ...filters });
      const response = await fetch(`${API_BASE_URL}/reports/impediments?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al exportar reporte de impedimentos');
      }
      
      // Crear y descargar archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `impedimentos_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Error en exportImpedimentsReport:', error);
      throw error;
    }
  }

  async exportSprintReport(sprintId, format = 'pdf') {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/sprints/${sprintId}?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al exportar reporte del sprint');
      }
      
      // Crear y descargar archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sprint_${sprintId}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Error en exportSprintReport:', error);
      throw error;
    }
  }
}

// Crear instancia singleton del servicio
const scrumMasterService = new ScrumMasterService();

export default scrumMasterService;
