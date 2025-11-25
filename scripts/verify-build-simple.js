#!/usr/bin/env node

// Script de verificación simple para Vercel
console.log('🔍 Verificando configuración para build de producción...');
console.log(`📦 Node version: ${process.version}`);

// En Vercel, solo verificamos lo esencial
if (process.env.VERCEL) {
  console.log('🌐 Ejecutando en Vercel');
  
  // Verificar que estamos en el entorno correcto
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
  }
  
  console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV}`);
  console.log('✅ Configuración básica verificada');
} else {
  console.log('🏠 Ejecutando en local');
  
  // Verificaciones locales más estrictas si es necesario
  const requiredVars = ['VITE_CLERK_PUBLISHABLE_KEY', 'VITE_API_URL'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.warn('⚠️ Variables faltantes en local:', missing);
    // En local solo advertir, no fallar
  }
}

console.log('🚀 Listo para build!');