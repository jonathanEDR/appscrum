// Script de diagnóstico para probar conectividad desde el navegador
const runDiagnostics = async () => {
  console.log('🔍 Iniciando diagnóstico de conectividad...');

  const baseURL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://appscrum-backend.onrender.com';

  console.log('📡 Probando conectividad con:', baseURL);

  const endpoints = [
    { path: '/', description: 'Root endpoint' },
    { path: '/api/health', description: 'Health check' },
    { path: '/health', description: 'Health check (alternative)' },
    { path: '/api/test', description: 'Test endpoint' },
    { path: '/api/diagnostic', description: 'Diagnostic endpoint' }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`🔄 Probando ${endpoint.description} (${endpoint.path})...`);

      const startTime = Date.now();
      const response = await fetch(`${baseURL}${endpoint.path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        mode: 'cors'
      });
      const endTime = Date.now();

      const result = {
        endpoint: endpoint.path,
        description: endpoint.description,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        responseTime: `${endTime - startTime}ms`,
        headers: Object.fromEntries(response.headers.entries())
      };

      if (response.ok) {
        try {
          result.data = await response.json();
        } catch (e) {
          result.data = 'No JSON response';
        }
      } else {
        result.error = await response.text();
      }

      results.push(result);

      if (response.ok) {
        console.log(`✅ ${endpoint.description}: ${response.status} (${endTime - startTime}ms)`);
      } else {
        console.log(`❌ ${endpoint.description}: ${response.status} ${response.statusText}`);
      }

    } catch (error) {
      console.log(`❌ ${endpoint.description}: Error de red - ${error.message}`);
      results.push({
        endpoint: endpoint.path,
        description: endpoint.description,
        error: error.message,
        type: 'network_error'
      });
    }
  }

  console.log('📊 Resumen de resultados:');
  console.table(results.map(r => ({
    Endpoint: r.endpoint,
    Status: r.ok ? '✅' : '❌',
    'Response Time': r.responseTime || 'N/A',
    Details: r.ok ? 'OK' : (r.statusText || r.error || 'Error')
  })));

  // Verificar si hay problemas comunes
  const failedEndpoints = results.filter(r => !r.ok);
  if (failedEndpoints.length > 0) {
    console.log('⚠️ Endpoints con problemas:');
    failedEndpoints.forEach(endpoint => {
      console.log(`  - ${endpoint.endpoint}: ${endpoint.status || 'Network error'}`);
    });

    // Sugerencias de solución
    console.log('💡 Sugerencias de solución:');
    console.log('  1. Verificar que el backend esté ejecutándose');
    console.log('  2. Comprobar la configuración de CORS');
    console.log('  3. Verificar las variables de entorno en Render');
    console.log('  4. Revisar los logs del servidor en Render');
  } else {
    console.log('🎉 Todos los endpoints están funcionando correctamente!');
  }

  return results;
};

// Función para probar con autenticación
const testWithAuth = async () => {
  console.log('🔐 Probando endpoints con autenticación...');

  // Esta función requiere que el usuario esté autenticado
  try {
    const token = await window.Clerk?.session?.getToken();
    if (!token) {
      console.log('❌ No hay token de autenticación disponible');
      return;
    }

    const baseURL = window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://appscrum-backend.onrender.com';

    const response = await fetch(`${baseURL}/api/auth/user-profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      mode: 'cors'
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Endpoint de perfil funciona:', data);
    } else {
      console.log(`❌ Endpoint de perfil: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log('❌ Error probando autenticación:', error.message);
  }
};

// Exponer funciones globalmente para usar en la consola del navegador
window.runDiagnostics = runDiagnostics;
window.testWithAuth = testWithAuth;

console.log('🔧 Funciones de diagnóstico disponibles:');
console.log('  - runDiagnostics(): Ejecuta pruebas de conectividad');
console.log('  - testWithAuth(): Prueba endpoints con autenticación');
console.log('💡 Ejecuta runDiagnostics() para comenzar las pruebas');
