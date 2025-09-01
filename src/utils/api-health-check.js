// Utilidad para verificar la salud del API y endpoints críticos
import config from '../config/config.js';

class ApiHealthChecker {
  constructor() {
    this.baseURL = config.API_URL;
    this.criticalEndpoints = [
      '/health',
      '/products',
      '/releases',
      '/sprints'
    ];
  }

  async checkEndpoint(endpoint, requiresAuth = false) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log(`🔍 Verificando endpoint: ${url}`);
      
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      // Para endpoints que requieren auth, solo verificar que no sea 404
      const response = await fetch(url, {
        method: 'HEAD',
        headers
      });

      const result = {
        endpoint,
        url,
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type') || 'no-content-type'
      };

      if (response.status === 404) {
        result.error = 'Endpoint no encontrado (404)';
      } else if (requiresAuth && response.status === 401) {
        result.info = 'Endpoint requiere autenticación (correcto)';
      } else if (!response.ok) {
        result.error = `Error HTTP: ${response.status}`;
      }

      return result;
    } catch (error) {
      return {
        endpoint,
        url: `${this.baseURL}${endpoint}`,
        error: error.message,
        status: 'network-error'
      };
    }
  }

  async checkAllEndpoints() {
    console.log('🚀 Iniciando verificación de salud del API...');
    console.log(`📡 Base URL: ${this.baseURL}`);
    
    const results = [];
    
    // Verificar /health (no requiere auth)
    results.push(await this.checkEndpoint('/health', false));
    
    // Verificar endpoints que requieren auth
    for (const endpoint of ['/products', '/releases', '/sprints']) {
      results.push(await this.checkEndpoint(endpoint, true));
    }

    // Resumir resultados
    console.log('\n📊 Resumen de verificación:');
    results.forEach(result => {
      const emoji = result.error ? '❌' : (result.status === 401 ? '🔐' : '✅');
      console.log(`${emoji} ${result.endpoint}: ${result.status} ${result.error || result.info || 'OK'}`);
    });

    return results;
  }

  // Verificar si hay URLs duplicadas en la configuración
  checkConfiguration() {
    console.log('\n🔧 Verificando configuración:');
    console.log(`- config.API_URL: ${config.API_URL}`);
    console.log(`- import.meta.env.VITE_API_URL: ${import.meta.env.VITE_API_URL}`);
    console.log(`- import.meta.env.PROD: ${import.meta.env.PROD}`);
    console.log(`- import.meta.env.DEV: ${import.meta.env.DEV}`);
    
    const potentialIssues = [];
    
    if (this.baseURL.includes('/api/api')) {
      potentialIssues.push('⚠️ URL contiene /api/api (duplicación)');
    }
    
    if (!this.baseURL) {
      potentialIssues.push('❌ No se encontró URL base del API');
    }
    
    if (potentialIssues.length > 0) {
      console.log('\n🚨 Problemas potenciales encontrados:');
      potentialIssues.forEach(issue => console.log(issue));
    } else {
      console.log('\n✅ Configuración parece correcta');
    }
    
    return potentialIssues;
  }
}

export default ApiHealthChecker;

// Función de conveniencia para usar en desarrollo
export const runHealthCheck = async () => {
  const checker = new ApiHealthChecker();
  checker.checkConfiguration();
  return await checker.checkAllEndpoints();
};
