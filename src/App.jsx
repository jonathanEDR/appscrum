import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.jsx';
import './App.css';

function App() {
  console.log('App component rendering...');
  
  try {
    return (
      <div className="min-h-screen bg-gradient-galaxy">
        <RouterProvider router={router} />
      </div>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div className="min-h-screen bg-gradient-galaxy flex items-center justify-center p-6">
        <div className="glass-card p-8 max-w-md w-full shadow-galaxy-enhanced">
          <h1 className="text-2xl font-bold text-gradient-galaxy mb-4">Error en la Aplicación</h1>
          <p className="text-primary-600 mb-4">Error: {error.message}</p>
          <pre className="text-sm text-neutral-600 bg-neutral-50 p-4 rounded-lg overflow-auto max-h-40">
            {error.stack}
          </pre>
        </div>
      </div>
    );
  }
}

export default App;