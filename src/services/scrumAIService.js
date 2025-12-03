/**
 * scrumAIService - Service dedicado para SCRUM AI
 * ACTUALIZADO: Ahora usa las rutas directas /api/ai-agents/scrum-ai/* (sin orquestador)
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ScrumAIService {
  /**
   * Enviar mensaje al chat de SCRUM AI (RUTA DIRECTA - sin orquestador)
   */
  async chat(token, { message, context = {}, session_id = null }) {
    const response = await fetch(`${API_URL}/ai-agents/scrum-ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message,
        context,
        session_id
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al comunicarse con SCRUM AI');
    }

    return response.json();
  }

  /**
   * Obtener insights del proyecto actual
   */
  async getInsights(token, { product_id, sprint_id } = {}) {
    const params = new URLSearchParams();
    if (product_id) params.append('product_id', product_id);
    if (sprint_id) params.append('sprint_id', sprint_id);

    const response = await fetch(
      `${API_URL}/scrum-ai/insights?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener insights');
    }

    return response.json();
  }

  /**
   * Obtener métricas rápidas
   */
  async getQuickMetrics(token) {
    const response = await fetch(`${API_URL}/scrum-ai/quick-metrics`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener métricas');
    }

    return response.json();
  }

  /**
   * Ejecutar acción rápida
   */
  async executeQuickAction(token, action, params = {}) {
    const response = await fetch(`${API_URL}/scrum-ai/execute-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        action,
        params
      })
    });

    if (!response.ok) {
      throw new Error('Error al ejecutar acción');
    }

    return response.json();
  }

  /**
   * Obtener historial de conversaciones (RUTA DIRECTA)
   */
  async getConversations(token) {
    const response = await fetch(`${API_URL}/ai-agents/scrum-ai/conversations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener conversaciones');
    }

    return response.json();
  }

  /**
   * Marcar/desmarcar conversación como favorita (RUTA DIRECTA)
   */
  async toggleFavorite(token, conversationId) {
    const response = await fetch(`${API_URL}/ai-agents/scrum-ai/conversations/${conversationId}/favorite`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al actualizar favorito');
    }

    return response.json();
  }

  /**
   * Eliminar conversación (RUTA DIRECTA)
   */
  async deleteConversation(token, conversationId) {
    const response = await fetch(`${API_URL}/ai-agents/scrum-ai/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al eliminar conversación');
    }

    return response.json();
  }

  /**
   * Cargar una conversación específica (RUTA DIRECTA)
   */
  async loadConversation(token, conversationId) {
    const response = await fetch(`${API_URL}/ai-agents/scrum-ai/conversations/${conversationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al cargar conversación');
    }

    return response.json();
  }

  /**
   * Obtener datos para el canvas
   */
  async getCanvasData(token, type, context = {}) {
    const params = new URLSearchParams({ type });
    if (context.product_id) params.append('product_id', context.product_id);

    const response = await fetch(`${API_URL}/ai-agents/scrum-ai/canvas?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos del canvas');
    }

    return response.json();
  }
}

export const scrumAIService = new ScrumAIService();
