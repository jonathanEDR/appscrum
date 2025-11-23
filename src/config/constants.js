// Configuración de roles de la aplicación
// IMPORTANTE: Estos roles deben coincidir exactamente con los del backend
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  PRODUCT_OWNER: 'product_owner',
  SCRUM_MASTER: 'scrum_master',
  DEVELOPERS: 'developers',
  USER: 'user'
};

// Mapeo de variaciones de roles (para retrocompatibilidad)
export const ROLE_ALIASES = {
  'admin': 'super_admin',
  'developer': 'developers',
  'dev': 'developers',
  'sm': 'scrum_master',
  'po': 'product_owner'
};

// Configuración de rutas por rol
export const ROLE_ROUTES = {
  [ROLES.SUPER_ADMIN]: '/super_admin',
  [ROLES.PRODUCT_OWNER]: '/product_owner',
  [ROLES.SCRUM_MASTER]: '/scrum_master',
  [ROLES.DEVELOPERS]: '/developers',
  [ROLES.USER]: '/user'
};

// Permisos por rol (sincronizado con backend)
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    canManageUsers: true,
    canManageRoles: true,
    canDeleteNotes: true,
    canEditNotes: true,
    canCreateNotes: true,
    canViewAllNotes: true,
    canManageProjects: true,
    canManageBacklog: true,
    canManageSprints: true,
    canAccessAdminPanel: true
  },
  [ROLES.PRODUCT_OWNER]: {
    canManageUsers: false,
    canManageRoles: false,
    canDeleteNotes: false,
    canEditNotes: true,
    canCreateNotes: true,
    canViewAllNotes: true,
    canManageProjects: true,
    canManageBacklog: true,
    canManageSprints: true,
    canAccessAdminPanel: false
  },
  [ROLES.SCRUM_MASTER]: {
    canManageUsers: false,
    canManageRoles: false,
    canDeleteNotes: false,
    canEditNotes: true,
    canCreateNotes: true,
    canViewAllNotes: true,
    canManageProjects: false,
    canManageBacklog: true,
    canManageSprints: true,
    canAccessAdminPanel: false
  },
  [ROLES.DEVELOPERS]: {
    canManageUsers: false,
    canManageRoles: false,
    canDeleteNotes: false,
    canEditNotes: false,
    canCreateNotes: true,
    canViewAllNotes: false,
    canManageProjects: false,
    canManageBacklog: false,
    canManageSprints: false,
    canAccessAdminPanel: false,
    canViewOwnTasks: true,
    canEditOwnTasks: true,
    canTrackTime: true
  },
  [ROLES.USER]: {
    canManageUsers: false,
    canManageRoles: false,
    canDeleteNotes: false,
    canEditNotes: false,
    canCreateNotes: true,
    canViewAllNotes: false,
    canManageProjects: false,
    canManageBacklog: false,
    canManageSprints: false,
    canAccessAdminPanel: false,
    canViewOwnDashboard: true
  }
};

// Configuración de API
export const API_CONFIG = {
  BASE_URL: '/api',
  ENDPOINTS: {
    HEALTH: '/health',
    AUTH: {
      REGISTER: '/auth/register',
      PROFILE: '/auth/user-profile',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout'
    },
    NOTES: {
      BASE: '/notes',
      CREATE: '/notes',
      DELETE: (id) => `/notes/delete/${id}`,
      UPDATE: (id) => `/notes/${id}`
    },
    ADMIN: {
      USERS: '/admin/users',
      UPDATE_ROLE: (id) => `/admin/users/${id}/role`
    }
  }
};

// Configuración de la UI
export const UI_CONFIG = {
  LOADING_MESSAGES: {
    DASHBOARD: 'Cargando dashboard...',
    AUTH: 'Verificando autenticación...',
    DATA: 'Cargando datos...',
    SERVER: 'Conectando con el servidor...',
    PERMISSIONS: 'Verificando permisos...'
  },
  ERROR_MESSAGES: {
    SERVER_DOWN: 'El servidor no está disponible. Por favor, inicia el servidor backend.',
    NO_PERMISSIONS: 'No tienes permisos para realizar esta acción.',
    LOAD_FAILED: 'Error al cargar los datos.',
    NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.'
  }
};

// Utilidades para trabajar con roles
export const RoleUtils = {
  isAdmin: (role) => [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role),
  isSuperAdmin: (role) => role === ROLES.SUPER_ADMIN,
  canManageUsers: (role) => ROLE_PERMISSIONS[role]?.canManageUsers || false,
  canDeleteNotes: (role) => ROLE_PERMISSIONS[role]?.canDeleteNotes || false,
  canEditNotes: (role) => ROLE_PERMISSIONS[role]?.canEditNotes || false,
  canCreateNotes: (role) => ROLE_PERMISSIONS[role]?.canCreateNotes || false,
  canViewAllNotes: (role) => ROLE_PERMISSIONS[role]?.canViewAllNotes || false,
  canManageRoles: (role) => ROLE_PERMISSIONS[role]?.canManageRoles || false,
  
  getRoleDisplayName: (role) => {
    const roleNames = {
      [ROLES.SUPER_ADMIN]: 'Super Administrador',
      [ROLES.ADMIN]: 'Administrador',
      [ROLES.PRODUCT_OWNER]: 'Product Owner',
      [ROLES.SCRUM_MASTER]: 'Scrum Master',
      [ROLES.DEVELOPERS]: 'Desarrollador',
      [ROLES.USER]: 'Usuario'
    };
    return roleNames[role] || 'Usuario';
  },
  
  getRoleRoute: (role) => ROLE_ROUTES[role] || '/dashboard'
};
