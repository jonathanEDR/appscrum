// Configuración de roles de la aplicación
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  PRODUCT_OWNER: 'product_owner',
  SCRUM_MASTER: 'scrum_master',
  DEVELOPERS: 'developers',
  USER: 'user'
};

// Configuración de rutas por rol
export const ROLE_ROUTES = {
  [ROLES.SUPER_ADMIN]: '/dashboard',
  [ROLES.ADMIN]: '/dashboard',
  [ROLES.PRODUCT_OWNER]: '/dashboard',
  [ROLES.SCRUM_MASTER]: '/dashboard',
  [ROLES.DEVELOPERS]: '/dashboard',
  [ROLES.USER]: '/dashboard'
};

// Permisos por rol
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    canManageUsers: true,
    canDeleteNotes: true,
    canEditNotes: true,
    canCreateNotes: true,
    canViewAllNotes: true,
    canManageRoles: true
  },
  [ROLES.ADMIN]: {
    canManageUsers: true,
    canDeleteNotes: true,
    canEditNotes: true,
    canCreateNotes: true,
    canViewAllNotes: true,
    canManageRoles: false
  },
  [ROLES.PRODUCT_OWNER]: {
    canManageUsers: false,
    canDeleteNotes: false,
    canEditNotes: true,
    canCreateNotes: true,
    canViewAllNotes: true,
    canManageRoles: false
  },
  [ROLES.SCRUM_MASTER]: {
    canManageUsers: false,
    canDeleteNotes: false,
    canEditNotes: true,
    canCreateNotes: true,
    canViewAllNotes: true,
    canManageRoles: false
  },
  [ROLES.DEVELOPERS]: {
    canManageUsers: false,
    canDeleteNotes: false,
    canEditNotes: false,
    canCreateNotes: true,
    canViewAllNotes: false,
    canManageRoles: false
  },
  [ROLES.USER]: {
    canManageUsers: false,
    canDeleteNotes: false,
    canEditNotes: false,
    canCreateNotes: true,
    canViewAllNotes: false,
    canManageRoles: false
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
