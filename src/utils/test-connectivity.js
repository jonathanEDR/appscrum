// Script para probar la conectividad del frontend con el backend
const testConnectivity = async () => {
  const baseURL = import.meta.env.PROD
    ? 'https://appscrum-backend.onrender.com'
    : 'http://localhost:5000';

  console.log('Testing connectivity to:', baseURL);

  const endpoints = [
    '/',
    '/api/health',
    '/health',
    '/api/test',
    '/api/diagnostic'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint}:`, data);
      } else {
        console.log(`❌ ${endpoint}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: Error - ${error.message}`);
    }
  }
};

// Ejecutar la prueba
testConnectivity();
