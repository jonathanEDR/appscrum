import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.jsx';
import DynamicHead from './components/common/DynamicHead';
import './App.css';

function App() {
  try {
    return (
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <DynamicHead />
        <RouterProvider router={router} />
      </div>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-8 max-w-md w-full shadow-lg rounded-xl">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error en la Aplicación</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Error: {error.message}</p>
          <pre className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-40">
            {error.stack}
          </pre>
        </div>
      </div>
    );
  }
}

export default App;