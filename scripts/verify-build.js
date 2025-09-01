#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
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
  const packageLockPath = join(__dirname, '..', 'package-lock.json');
  
  if (!existsSync(packageJsonPath)) {
    console.error('❌ package.json no encontrado');
    process.exit(1);
  }

  if (!existsSync(packageLockPath)) {
    console.error('❌ package-lock.json no encontrado - dependencias no bloqueadas');
    process.exit(1);
  }

  const packageJsonContent = readFileSync(packageJsonPath, 'utf8');
  const packageLockContent = readFileSync(packageLockPath, 'utf8');
  const pkg = JSON.parse(packageJsonContent);
  const lock = JSON.parse(packageLockContent);
  
  // Verificar versiones exactas críticas
  const criticalDeps = {
    'react': '18.3.1',
    'react-dom': '18.3.1',
    '@clerk/clerk-react': '5.32.4',
    'react-router-dom': '6.28.0'
  };

  for (const [dep, expectedVersion] of Object.entries(criticalDeps)) {
    const lockVersion = lock.packages?.[`node_modules/${dep}`]?.version;
    console.log(`📦 ${dep} version: ${lockVersion || 'not found'}`);
    
    if (!lockVersion) {
      console.error(`❌ ${dep} no encontrado en package-lock.json`);
      process.exit(1);
    }

    if (lockVersion !== expectedVersion) {
      console.error(`❌ ${dep} version mismatch: expected ${expectedVersion}, got ${lockVersion}`);
      console.error('💡 Ejecutar: rm -rf node_modules package-lock.json && npm install');
      process.exit(1);
    }
  }
  
  console.log('✅ Dependencias verificadas');
  
} catch (error) {
  console.error('❌ Error verificando package.json:', error.message);
  process.exit(1);
}

console.log('🚀 Todo listo para build de producción!');
