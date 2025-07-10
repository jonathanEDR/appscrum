import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext.jsx';
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  Menu, 
  X, 
  User,
  Shield,
  LogOut,
  BarChart3,
  Calendar,
  Target,
  Code,
  Briefcase
} from 'lucide-react';
import LogoutButton from '../auth/LogoutButton';

// Configuración de navegación por rol
const getRoleNavigation = (role) => {
  const baseItems = [
    {
      name: 'Dashboard',
      path: `/${role}`,
      icon: Home,
      show: true
    },
    {
      name: 'Mi Perfil',
      path: `/${role}/perfil`,
      icon: User,
      show: true
    }
  ];

  // Elementos específicos por rol
  const roleSpecificItems = {
    super_admin: [
      {
        name: 'Gestión de Usuarios',
        path: `/super_admin/usuarios`,
        icon: Users,
        show: true
      },
      {
        name: 'Colaboradores',
        path: `/super_admin/colaboradores`,
        icon: Users,
        show: true
      },
      {
        name: 'Panel Admin',
        path: `/super_admin/admin`,
        icon: Shield,
        show: true
      },
      {
        name: 'Configuración',
        path: `/super_admin/configuracion`,
        icon: Settings,
        show: true
      }
    ],
    product_owner: [
      {
        name: 'Productos',
        path: `/product_owner/productos`,
        icon: Briefcase,
        show: true
      },
      {
        name: 'Product Backlog',
        path: `/product_owner/backlog`,
        icon: Target,
        show: true
      },
      {
        name: 'Roadmap',
        path: `/product_owner/roadmap`,
        icon: Calendar,
        show: true
      },
      {
        name: 'Métricas',
        path: `/product_owner/metricas`,
        icon: BarChart3,
        show: true
      }
    ],
    scrum_master: [
      {
        name: 'Sprints',
        path: `/scrum_master/sprints`,
        icon: Target,
        show: true
      },
      {
        name: 'Impedimentos',
        path: `/scrum_master/impedimentos`,
        icon: Shield,
        show: true
      },
      {
        name: 'Ceremonias',
        path: `/scrum_master/ceremonias`,
        icon: Calendar,
        show: true
      },
      {
        name: 'Equipo',
        path: `/scrum_master/equipo`,
        icon: Users,
        show: true
      },
      {
        name: 'Métricas',
        path: `/scrum_master/metricas`,
        icon: BarChart3,
        show: true
      }
    ],
    developers: [
      {
        name: 'Mis Tareas',
        path: `/developers/tareas`,
        icon: Target,
        show: true
      },
      {
        name: 'Sprint Board',
        path: `/developers/sprint-board`,
        icon: Calendar,
        show: true
      },
      {
        name: 'Time Tracking',
        path: `/developers/time-tracking`,
        icon: BarChart3,
        show: true
      },
      {
        name: 'Código',
        path: `/developers/codigo`,
        icon: Code,
        show: true
      }
    ],
    user: [
      {
        name: 'Mis Actividades',
        path: `/user/actividades`,
        icon: BarChart3,
        show: true
      }
    ]
  };

  return [...baseItems, ...(roleSpecificItems[role] || [])];
};

// Mapeo de títulos por rol
const getRoleTitle = (role) => {
  const titles = {
    super_admin: 'Panel Super Administrador',
    product_owner: 'Panel Product Owner',
    scrum_master: 'Panel Scrum Master',
    developers: 'Panel Desarrollador',
    user: 'Panel Usuario'
  };
  return titles[role] || 'Dashboard';
};

// Componente de navegación lateral
const Sidebar = ({ isOpen, onClose, role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationItems = getRoleNavigation(role);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">AppScrum</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Indicador de rol */}
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            {getRoleTitle(role)}
          </p>
        </div>

        <nav className="mt-4 px-4">
          <div className="space-y-2">
            {navigationItems.filter(item => item.show).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors text-sm
                    ${isActive(item.path)
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Información del usuario y logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Rol actual:</p>
            <p className="text-sm font-medium text-gray-800 capitalize">
              {role?.replace('_', ' ')}
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </>
  );
};

// Header del dashboard
const DashboardHeader = ({ onMenuClick, title }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="ml-4 text-2xl font-semibold text-gray-800 lg:ml-0">
            {title}
          </h2>
        </div>
      </div>
    </header>
  );
};

// Mapeo de rutas a títulos
const getPageTitle = (pathname, role) => {
  const pathSegments = pathname.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  
  const titles = {
    // Rutas base de dashboard
    super_admin: 'Dashboard Super Admin',
    product_owner: 'Dashboard Product Owner',
    scrum_master: 'Dashboard Scrum Master',
    developers: 'Dashboard Developers',
    user: 'Dashboard Usuario',
    
    // Páginas específicas
    perfil: 'Mi Perfil',
    usuarios: 'Gestión de Usuarios',
    colaboradores: 'Gestión de Colaboradores',
    admin: 'Panel de Administración',
    configuracion: 'Configuración',
    
    // Product Owner
    productos: 'Gestión de Productos',
    backlog: 'Product Backlog',
    roadmap: 'Roadmap',
    metricas: 'Métricas de Producto',
    
    // Scrum Master
    equipos: 'Gestión de Equipos',
    sprints: 'Gestión de Sprints',
    ceremonias: 'Ceremonias Scrum',
    impedimentos: 'Gestión de Impedimentos',
    
    // Developers
    tareas: 'Mis Tareas',
    'sprint-board': 'Sprint Board',
    'time-tracking': 'Seguimiento de Tiempo',
    codigo: 'Repositorios de Código',
    
    // User
    actividades: 'Mis Actividades'
  };
  
  return titles[lastSegment] || titles[role] || getRoleTitle(role);
};

// Layout principal del dashboard
const RoleBasedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, isLoaded } = useRole();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const pageTitle = getPageTitle(location.pathname, role);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        role={role}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(true)}
          title={pageTitle}
        />

        {/* Área de contenido */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoleBasedLayout;
