// Configuración centralizada de la aplicación

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// URLs y endpoints de la API
export const API_CONFIG = {
  BASE_URL: API_URL,
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',
      USER_PROFILE: '/auth/user-profile',
      UPDATE_ROLE: '/auth/update-role'
    },
    NOTES: {
      GET_ALL: '/notes',
      CREATE: '/notes/create',
      DELETE: '/notes/delete',
      UPDATE: '/notes/update'
    },
    ADMIN: {
      GET_ALL_USERS: '/admin/users',
      UPDATE_USER_ROLE: '/admin/update-user-role',
      DELETE_USER: '/admin/delete-user'
    },
    HEALTH: '/health'
  }
};

// Configuración de roles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  PRODUCT_OWNER: 'product_owner',
  SCRUM_MASTER: 'scrum_master',
  DEVELOPERS: 'developers',
  USER: 'user'
};

// Mapeo de roles a rutas de dashboard
export const ROLE_DASHBOARD_ROUTES = {
  [ROLES.SUPER_ADMIN]: '/dashboard',
  [ROLES.ADMIN]: '/dashboard',
  [ROLES.PRODUCT_OWNER]: '/dashboard',
  [ROLES.SCRUM_MASTER]: '/dashboard',
  [ROLES.DEVELOPERS]: '/dashboard',
  [ROLES.USER]: '/dashboard'
};

// Permisos por rol
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    'manage_users',
    'manage_roles',
    'view_all_notes',
    'create_notes',
    'edit_notes',
    'delete_notes',
    'view_analytics'
  ],
  [ROLES.ADMIN]: [
    'manage_users',
    'view_all_notes',
    'create_notes',
    'edit_notes',
    'delete_notes'
  ],
  [ROLES.PRODUCT_OWNER]: [
    'view_team_notes',
    'create_notes',
    'edit_own_notes',
    'delete_own_notes'
  ],
  [ROLES.SCRUM_MASTER]: [
    'view_team_notes',
    'create_notes',
    'edit_own_notes',
    'delete_own_notes'
  ],
  [ROLES.DEVELOPERS]: [
    'view_own_notes',
    'create_notes',
    'edit_own_notes'
  ],
  [ROLES.USER]: [
    'view_own_notes',
    'create_notes',
    'edit_own_notes'
  ]
};

// Configuración de la UI
export const UI_CONFIG = {
  LOADING_DELAY: 300,
  AUTO_REFRESH_INTERVAL: 30000,
  MAX_NOTES_PER_PAGE: 10,
  TOAST_DURATION: 3000
};

// Configuración de validación
export const VALIDATION_CONFIG = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NOTE_TITLE_LENGTH: 100,
  MAX_NOTE_CONTENT_LENGTH: 5000,
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  MAX_FILE_SIZE: 5 * 1024 * 1024 // 5MB
};

export default {
  API_URL,
  API_CONFIG,
  ROLES,
  ROLE_DASHBOARD_ROUTES,
  ROLE_PERMISSIONS,
  UI_CONFIG,
  VALIDATION_CONFIG
};
