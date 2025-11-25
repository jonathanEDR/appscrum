import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import { RoleProvider } from './context/RoleContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configuración del QueryClient con opciones optimizadas
// Tiempos alineados con el cache del backend para máxima eficiencia
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: Tiempo que los datos se consideran "frescos"
      // 30s coincide con el cache corto del backend (CACHE_DURATIONS.SHORT)
      staleTime: 30000, // 30 segundos
      
      // cacheTime: Tiempo que los datos inactivos permanecen en memoria
      cacheTime: 5 * 60 * 1000, // 5 minutos
      
      // refetchOnWindowFocus: No refetch automático al enfocar ventana
      // (reduce requests innecesarios)
      refetchOnWindowFocus: false,
      
      // refetchOnReconnect: Refetch al reconectar (útil para móviles)
      refetchOnReconnect: true,
      
      // retry: Número de reintentos en caso de error
      retry: 1,
      
      // retryDelay: Delay entre reintentos (exponencial)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // retry: No reintentar mutaciones automáticamente
      retry: false,
    },
  },
});

// Usando clerkPublishableKey consistentemente
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

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
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={clerkPublishableKey}>
          <ThemeProvider>
            <RoleProvider>
              <App />
            </RoleProvider>
          </ThemeProvider>
        </ClerkProvider>
        {/* React Query Devtools - Solo en desarrollo */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />}
      </QueryClientProvider>
    </StrictMode>,
  );
}