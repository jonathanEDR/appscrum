import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

// Páginas principales - inmediata
import Home from '../Pages/Home.jsx';

// Componentes de autenticación - inmediata
import { SignIn, SignUp } from '@clerk/clerk-react';
import { RoleProtectedRoute, RoleBasedRedirect } from '../components/auth/RoleBasedComponents.jsx';

// Layout principal para dashboards - inmediata
import RoleBasedLayout from '../components/layout/RoleBasedLayout.jsx';

// Dashboards específicos por rol - inmediata
import SuperAdminDashboard from '../components/layout/dashboard/SuperAdminDashboard.jsx';
import ProfileManagement from '../components/auth/ProfileManagement.jsx';
import ProductOwnerDashboard from '../components/layout/dashboard/ProductOwnerDashboard.jsx';
import ScrumMasterDashboard from '../components/layout/dashboard/ScrumMasterDashboard.jsx';
import DevelopersDashboard from '../components/layout/dashboard/DevelopersDashboard.jsx';
import UserDashboard from '../components/layout/dashboard/UserDashboard.jsx';

// Componentes de submódulos - inmediata
import MyProfile from '../components/auth/MyProfile.jsx';

// Páginas de gestión - inmediata
import CollaboratorsManagement from '../Pages/CollaboratorsManagement.jsx';

// Componentes de Product Owner - lazy loading
const Productos = lazy(() => import('../components/ProductOwner/Productos.jsx'));
const ProductBacklog = lazy(() => import('../components/ProductOwner/ProductBacklog.jsx'));
const Roadmap = lazy(() => import('../components/ProductOwner/Roadmap.jsx'));
const Metricas = lazy(() => import('../components/ProductOwner/Metricas.jsx'));

// Componentes de Scrum Master - lazy loading
const Impediments = lazy(() => import('../components/ScrumMaster/Impediments.jsx'));
const Ceremonies = lazy(() => import('../components/ScrumMaster/Ceremonies.jsx'));
const SprintManagement = lazy(() => import('../components/ScrumMaster/SprintManagement.jsx'));
const SprintPlanning = lazy(() => import('../components/ScrumMaster/SprintPlanning.jsx'));
const TeamOverview = lazy(() => import('../components/ScrumMaster/TeamOverview.jsx'));
const Metrics = lazy(() => import('../components/ScrumMaster/Metrics.jsx'));
const ScrumMasterBacklog = lazy(() => import('../components/ScrumMaster/ScrumMasterBacklog.jsx'));

// Componentes de Developers - lazy loading
const MyTasks = lazy(() => import('../components/developers/MyTasks.jsx'));
const SprintBoard = lazy(() => import('../components/developers/SprintBoard.jsx'));
const TimeTracking = lazy(() => import('../components/developers/TimeTracking.jsx'));
const CodeRepositories = lazy(() => import('../components/developers/CodeRepositories.jsx'));
const Projects = lazy(() => import('../components/developers/Projects.jsx'));

// Componentes de User - lazy loading
const MyActivities = lazy(() => import('../components/users/MyActivities.jsx'));


// Layout wrapper para páginas de autenticación
const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-galaxy flex items-center justify-center">
    <div className="max-w-md w-full">
      {children}
    </div>
  </div>
);

// Componente para páginas en construcción
const UnderConstruction = ({ module }) => (
  <div className="flex items-center justify-center h-64">
    <div className="glass-card p-8 text-center shadow-galaxy-enhanced hover-lift animate-fadeIn">
      <div className="text-6xl mb-4 animate-galaxy-pulse">🚧</div>
      <h2 className="text-2xl font-semibold text-gradient-galaxy mb-2 animate-float">En Construcción</h2>
      <p className="text-primary-600 opacity-80">El módulo "{module}" estará disponible pronto.</p>
    </div>
  </div>
);

// Componente de Loading para lazy components
const LazyLoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="glass-card p-8 text-center shadow-galaxy-enhanced">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p className="text-primary-600 opacity-80">Cargando módulo...</p>
    </div>
  </div>
);

// Wrapper para componentes lazy con suspense
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<LazyLoadingSpinner />}>
    {children}
  </Suspense>
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
        element: <LazyWrapper><Productos /></LazyWrapper>,
      },
      {
        path: 'backlog',
        element: <LazyWrapper><ProductBacklog /></LazyWrapper>,
      },
      {
        path: 'roadmap',
        element: <LazyWrapper><Roadmap /></LazyWrapper>,
      },
      {
        path: 'metricas',
        element: <LazyWrapper><Metricas /></LazyWrapper>,
      },
      {
        path: 'colaboradores',
        element: <CollaboratorsManagement />,
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
        element: <LazyWrapper><SprintManagement /></LazyWrapper>,
      },
      {
        path: 'sprint-planning',
        element: <LazyWrapper><SprintPlanning /></LazyWrapper>,
      },
      {
        path: 'impedimentos',
        element: <LazyWrapper><Impediments /></LazyWrapper>,
      },
      {
        path: 'ceremonias',
        element: <LazyWrapper><Ceremonies /></LazyWrapper>,
      },
      {
        path: 'equipo',
        element: <LazyWrapper><TeamOverview /></LazyWrapper>,
      },
      {
        path: 'metricas',
        element: <LazyWrapper><Metrics /></LazyWrapper>,
      },
      {
        path: 'backlog-tecnico',
        element: <LazyWrapper><ScrumMasterBacklog /></LazyWrapper>,
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
        element: <LazyWrapper><MyTasks /></LazyWrapper>,
      },
      {
        path: 'proyectos',
        element: <LazyWrapper><Projects /></LazyWrapper>,
      },
      {
        path: 'sprint-board',
        element: <LazyWrapper><SprintBoard /></LazyWrapper>,
      },
      {
        path: 'time-tracking',
        element: <LazyWrapper><TimeTracking /></LazyWrapper>,
      },
      {
        path: 'codigo',
        element: <LazyWrapper><CodeRepositories /></LazyWrapper>,
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
        element: <LazyWrapper><MyActivities /></LazyWrapper>,
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
