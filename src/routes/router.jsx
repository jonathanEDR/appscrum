import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

// Páginas principales
import Home from '../Pages/Home.jsx';

// Componentes de autenticación
import { SignIn, SignUp } from '@clerk/clerk-react';
import { RoleProtectedRoute, RoleBasedRedirect } from '../components/auth/RoleBasedComponents.jsx';

// Layout principal para dashboards
import RoleBasedLayout from '../components/layout/RoleBasedLayout.jsx';

// Dashboards específicos por rol
import SuperAdminDashboard from '../components/layout/dashboard/SuperAdminDashboard.jsx';
import ProfileManagement from '../components/auth/ProfileManagement.jsx';
import ProductOwnerDashboard from '../components/layout/dashboard/ProductOwnerDashboard.jsx';
import ScrumMasterDashboard from '../components/layout/dashboard/ScrumMasterDashboard.jsx';
import DevelopersDashboard from '../components/layout/dashboard/DevelopersDashboard.jsx';
import UserDashboard from '../components/layout/dashboard/UserDashboard.jsx';

// Componentes de submódulos
import MyProfile from '../components/auth/MyProfile.jsx';

// Páginas de gestión
import CollaboratorsManagement from '../Pages/CollaboratorsManagement.jsx';

// Componentes de Product Owner
import Productos from '../components/ProductOwner/Productos.jsx';
import ProductBacklog from '../components/ProductOwner/ProductBacklog.jsx';
import Roadmap from '../components/ProductOwner/Roadmap.jsx';
import Metricas from '../components/ProductOwner/Metricas.jsx';

// Componentes de Scrum Master
import Impediments from '../components/ScrumMaster/Impediments.jsx';
import Ceremonies from '../components/ScrumMaster/Ceremonies.jsx';
import SprintManagement from '../components/ScrumMaster/SprintManagement.jsx';
import TeamOverview from '../components/ScrumMaster/TeamOverview.jsx';
import Metrics from '../components/ScrumMaster/Metrics.jsx';

// Componentes de Developers
import { MyTasks, SprintBoard, TimeTracking, CodeRepositories } from '../components/developers/index.js';

// Componentes de User
import { MyActivities } from '../components/users/index.js';


// Layout wrapper para páginas de autenticación
const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md w-full">
      {children}
    </div>
  </div>
);

// Componente para páginas en construcción
const UnderConstruction = ({ module }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">En Construcción</h2>
      <p className="text-gray-500">El módulo "{module}" estará disponible pronto.</p>
    </div>
  </div>
);

// Configuración de rutas
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/sign-in',
    element: (
      <AuthLayout>
        <SignIn 
          path="/sign-in" 
          routing="path" 
          signUpUrl="/sign-up"
          afterSignInUrl="/redirect"
        />
      </AuthLayout>
    ),
  },
  {
    path: '/sign-up',
    element: (
      <AuthLayout>
        <SignUp 
          path="/sign-up" 
          routing="path" 
          signInUrl="/sign-in"
          afterSignUpUrl="/redirect"
        />
      </AuthLayout>
    ),
  },
  // Ruta de redirección automática basada en rol
  {
    path: '/redirect',
    element: <RoleBasedRedirect />,
  },
  // Dashboard para Super Admin
  {
    path: '/super_admin',
    element: (
      <RoleProtectedRoute allowedRoles={['super_admin']}>
        <RoleBasedLayout />
      </RoleProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <SuperAdminDashboard />,
      },
      {
        path: 'usuarios',
        element: <ProfileManagement userRole="super_admin" />,
      },
      {
        path: 'colaboradores',
        element: <CollaboratorsManagement />,
      },
      {
        path: 'perfil',
        element: <MyProfile />,
      },
      {
        path: 'admin',
        element: <UnderConstruction module="Panel Admin" />,
      },
      {
        path: 'configuracion',
        element: <UnderConstruction module="Configuración" />,
      },
    ],
  },
  // Dashboard para Product Owner
  {
    path: '/product_owner',
    element: (
      <RoleProtectedRoute allowedRoles={['product_owner']}>
        <RoleBasedLayout />
      </RoleProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <ProductOwnerDashboard />,
      },
      {
        path: 'perfil',
        element: <MyProfile />,
      },
      {
        path: 'productos',
        element: <Productos />,
      },
      {
        path: 'backlog',
        element: <ProductBacklog />,
      },
      {
        path: 'roadmap',
        element: <Roadmap />,
      },
      {
        path: 'metricas',
        element: <Metricas />,
      },
    ],
  },
  // Dashboard para Scrum Master
  {
    path: '/scrum_master',
    element: (
      <RoleProtectedRoute allowedRoles={['scrum_master']}>
        <RoleBasedLayout />
      </RoleProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <ScrumMasterDashboard />,
      },
      {
        path: 'perfil',
        element: <MyProfile />,
      },
      {
        path: 'sprints',
        element: <SprintManagement />,
      },
      {
        path: 'impedimentos',
        element: <Impediments />,
      },
      {
        path: 'ceremonias',
        element: <Ceremonies />,
      },
      {
        path: 'equipo',
        element: <TeamOverview />,
      },
      {
        path: 'metricas',
        element: <Metrics />,
      },
    ],
  },
  // Dashboard para Developers
  {
    path: '/developers',
    element: (
      <RoleProtectedRoute allowedRoles={['developers']}>
        <RoleBasedLayout />
      </RoleProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <DevelopersDashboard />,
      },
      {
        path: 'perfil',
        element: <MyProfile />,
      },
      {
        path: 'tareas',
        element: <MyTasks />,
      },
      {
        path: 'sprint-board',
        element: <SprintBoard />,
      },
      {
        path: 'time-tracking',
        element: <TimeTracking />,
      },
      {
        path: 'codigo',
        element: <CodeRepositories />,
      },
    ],
  },
  // Dashboard para User (rol básico)
  {
    path: '/user',
    element: (
      <RoleProtectedRoute allowedRoles={['user']}>
        <RoleBasedLayout />
      </RoleProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <UserDashboard />,
      },
      {
        path: 'perfil',
        element: <MyProfile />,
      },
      {
        path: 'actividades',
        element: <MyActivities />,
      },
    ],
  },
  // Rutas de compatibilidad (redirects para URLs legacy)
  {
    path: '/dashboard',
    element: <RoleBasedRedirect />,
  },
  {
    path: '/super-admin/dashboard',
    element: <Navigate to="/super_admin" replace />,
  },
  {
    path: '/admin/dashboard',
    element: <Navigate to="/super_admin" replace />,
  },
  {
    path: '/product-owner/dashboard',
    element: <Navigate to="/product_owner" replace />,
  },
  {
    path: '/scrum-master/dashboard',
    element: <Navigate to="/scrum_master" replace />,
  },
  {
    path: '/developers/dashboard',
    element: <Navigate to="/developers" replace />,
  },
  {
    path: '/user/dashboard',
    element: <Navigate to="/user" replace />,
  },
  // Ruta catch-all para redirigir a home
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
