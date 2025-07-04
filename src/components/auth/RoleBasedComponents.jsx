import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext.jsx';

// Mapeo de roles a rutas de dashboard
const ROLE_DASHBOARD_ROUTES = {
  super_admin: '/super_admin',
  admin: '/super_admin',
  product_owner: '/product_owner',
  scrum_master: '/scrum_master',
  developers: '/developers',
  user: '/user'
};

// Componente para proteger rutas basado en roles
export function RoleProtectedRoute({ allowedRoles, children, redirectTo = null }) {
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
  if (!role) {
    return <Navigate to="/sign-in" replace />;
  }

  // Si el rol no está permitido, redirigir al dashboard del usuario
  if (allowedRoles && !allowedRoles.includes(role)) {
    const userDashboard = ROLE_DASHBOARD_ROUTES[role] || '/user';
    return <Navigate to={redirectTo || userDashboard} replace />;
  }

  return children;
}

// Componente para redirigir automáticamente basado en el rol
export function RoleBasedRedirect() {
  const { role, isLoaded } = useRole();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!role) {
    return <Navigate to="/sign-in" replace />;
  }

  // Redirigir al dashboard correspondiente
  const dashboardRoute = ROLE_DASHBOARD_ROUTES[role] || '/user/dashboard';
  return <Navigate to={dashboardRoute} replace />;
}

// Componente para mostrar contenido basado en el rol
export function RoleBasedContent({ role, children, fallback = null }) {
  const { role: userRole } = useRole();
  
  if (userRole === role) {
    return children;
  }
  
  return fallback;
}

// Hook para verificar permisos
export function usePermissions() {
  const { role } = useRole();

  const hasRole = (requiredRole) => role === requiredRole;
  
  const hasAnyRole = (requiredRoles) => requiredRoles.includes(role);
  
  const isAdmin = () => ['admin', 'super_admin'].includes(role);
  
  const isSuperAdmin = () => role === 'super_admin';
  
  const canManageUsers = () => ['admin', 'super_admin'].includes(role);
  
  const canDeleteNotes = () => ['admin', 'super_admin'].includes(role);
  
  const canEditNotes = () => ['admin', 'super_admin', 'product_owner', 'scrum_master'].includes(role);

  return {
    role,
    hasRole,
    hasAnyRole,
    isAdmin,
    isSuperAdmin,
    canManageUsers,
    canDeleteNotes,
    canEditNotes
  };
}
