#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Script de verificación pre-build para producción
console.log('🔍 Verificando configuración para build de producción...');

// Verificar Node version
console.log(`📦 Node version: ${process.version}`);

// En Vercel, las variables se configuran en el dashboard, no en .env
console.log('📝 Verificando variables críticas...');

// Solo verificar variables críticas si estamos en local (desarrollo)
if (!process.env.VERCEL) {
  const requiredEnvVars = ['VITE_CLERK_PUBLISHABLE_KEY', 'VITE_API_URL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missingVars);
    process.exit(1);
  }
  console.log('✅ Variables de entorno verificadas');
} else {
  console.log('🌐 Ejecutando en Vercel - variables configuradas en dashboard');
}

// Verificar dependencias críticas
try {
  const packageJsonPath = join(__dirname, '..', 'package.json');
  const packageJsonContent = readFileSync(packageJsonPath, 'utf8');
  const pkg = JSON.parse(packageJsonContent);
  
  console.log(`📦 React version: ${pkg.dependencies.react}`);
  console.log(`📦 React-DOM version: ${pkg.dependencies['react-dom']}`);
  console.log(`📦 Clerk version: ${pkg.dependencies['@clerk/clerk-react']}`);
  
  console.log('✅ Dependencias verificadas');
  
} catch (error) {
  console.error('❌ Error verificando package.json:', error.message);
  process.exit(1);
}

console.log('🚀 Todo listo para build de producción!');
