import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.jsx';
import './App.css';

function App() {
  console.log('App component rendering...');
  
  try {
    return <RouterProvider router={router} />;
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Error en la Aplicación</h1>
        <p>Error: {error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }
}

export default App;