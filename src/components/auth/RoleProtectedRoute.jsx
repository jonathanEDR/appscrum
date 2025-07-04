import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext.jsx';

function RoleProtectedRoute({ allowedRoles, children }) {
  const { role, isLoaded } = useRole();
  
  // Mostrar loading mientras se carga el rol
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no hay rol, redirigir al login
  if (!role) return <Navigate to="/sign-in" replace />;
  
  // Si el rol no está permitido, redirigir al dashboard
  if (!allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;

  return children;

  return children;
}

export default RoleProtectedRoute;
