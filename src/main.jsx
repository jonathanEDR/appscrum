import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import { RoleProvider } from './context/RoleContext.jsx';

// Usando clerkPublishableKey consistentemente
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log('Clerk Publishable Key:', clerkPublishableKey);
console.log('App is starting...');

if (!clerkPublishableKey) {
  console.error('VITE_CLERK_PUBLISHABLE_KEY is not defined');
  // Renderizar un mensaje de error en lugar de lanzar una excepción
  createRoot(document.getElementById('root')).render(
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Error de Configuración</h1>
      <p>VITE_CLERK_PUBLISHABLE_KEY is not defined</p>
      <p>Por favor, verifica tu archivo .env</p>
    </div>
  );
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <RoleProvider>
          <App />
        </RoleProvider>
      </ClerkProvider>
    </StrictMode>,
  );
}