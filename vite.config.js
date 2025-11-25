import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js'
  },
  esbuild: {
    logOverride: { 'css-syntax-error': 'silent' }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000, // Incrementar el límite a 1MB
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React y ReactDOM
          'react-vendor': ['react', 'react-dom'],
          
          // Separar router
          'router-vendor': ['react-router-dom'],
          
          // Separar Clerk
          'auth-vendor': ['@clerk/clerk-react'],
          
          // Separar Axios
          'http-vendor': ['axios'],
          
          // Separar iconos
          'icons-vendor': ['lucide-react'],
          
          // Componentes de Product Owner
          'product-owner': [
            './src/components/ProductOwner/Productos.jsx',
            './src/components/ProductOwner/ProductBacklog.jsx',
            './src/components/ProductOwner/Roadmap.jsx',
            './src/components/ProductOwner/Metricas.jsx'
          ],
          
          // Componentes de Scrum Master
          'scrum-master': [
            './src/components/ScrumMaster/SprintManagement.jsx',
            './src/components/ScrumMaster/SprintPlanning.jsx',
            './src/components/ScrumMaster/Ceremonies.jsx',
            './src/components/ScrumMaster/Metrics.jsx'
          ],
          
          // Componentes de Developers
          'developers': [
            './src/components/developers/SprintBoard.jsx',
            './src/components/developers/MyTasks.jsx',
            './src/components/developers/TimeTracking.jsx'
          ]
        }
      }
    }
  }
});
