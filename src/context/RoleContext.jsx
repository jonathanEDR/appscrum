import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { apiService } from "../services/apiService";
import { ROLES, ROLE_PERMISSIONS } from "../config/constants";

export const RoleContext = createContext();
export const useRole = () => useContext(RoleContext);

export function RoleProvider({ children }) {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [role, setRole] = useState(undefined);
  const [isRoleLoaded, setIsRoleLoaded] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [roleInfo, setRoleInfo] = useState(null);
  const [syncError, setSyncError] = useState(null);

  // Función para sincronizar rol con el servidor (ÚNICA FUENTE DE VERDAD)
  const syncRoleWithServer = useCallback(async () => {
    if (!user || !isLoaded) {
      console.log('RoleContext: Usuario o Clerk no cargado aún');
      return;
    }

    setSyncError(null);
    let token;

    try {
      token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      console.log('🔐 RoleContext: Obteniendo perfil de usuario desde servidor...');

      // FUENTE ÚNICA DE VERDAD: Backend con middleware authenticate
      // Este endpoint garantiza que el usuario existe y tiene un rol válido
      const response = await apiService.request('/auth/user-profile', {
        method: 'GET'
      }, () => Promise.resolve(token));

      console.log('✅ RoleContext: Respuesta del servidor:', response);

      if (response?.status === 'success' && response?.user) {
        const userData = response.user;
        
        // Validar que el rol sea válido
        if (!Object.values(ROLES).includes(userData.role)) {
          console.warn(`⚠️ Rol inválido recibido: ${userData.role}, usando USER por defecto`);
          setRole(ROLES.USER);
          setPermissions(ROLE_PERMISSIONS[ROLES.USER]);
        } else {
          setRole(userData.role);
          // Usar permisos del servidor si están disponibles, sino usar los del frontend
          setPermissions(userData.permissions || ROLE_PERMISSIONS[userData.role] || {});
          setRoleInfo(userData.roleInfo || null);
        }
        
        setIsRoleLoaded(true);
        console.log('✅ RoleContext: Rol sincronizado correctamente:', userData.role);
        return;
      }

      throw new Error('Respuesta del servidor inválida');

    } catch (error) {
      console.error('❌ RoleContext: Error al sincronizar rol:', error);
      setSyncError(error.message);

      // FALLBACK: Intentar obtener de metadata de Clerk solo si falla completamente
      try {
        const clerkRole = user?.publicMetadata?.role;
        if (clerkRole && Object.values(ROLES).includes(clerkRole)) {
          console.warn('⚠️ RoleContext: Usando rol de Clerk como fallback:', clerkRole);
          setRole(clerkRole);
          setPermissions(ROLE_PERMISSIONS[clerkRole] || {});
          setIsRoleLoaded(true);
          return;
        }
      } catch (clerkError) {
        console.error('❌ RoleContext: Error al obtener rol de Clerk:', clerkError);
      }

      // ÚLTIMO RECURSO: Rol de usuario por defecto
      console.warn('⚠️ RoleContext: Usando rol USER por defecto debido a errores');
      setRole(ROLES.USER);
      setPermissions(ROLE_PERMISSIONS[ROLES.USER]);
      setIsRoleLoaded(true);
    }
  }, [user, isLoaded, getToken]);

  useEffect(() => {
    if (!isLoaded) {
      console.log('RoleContext: Esperando a que Clerk se cargue...');
      return;
    }

    if (!user) {
      console.log('RoleContext: No hay usuario autenticado');
      setRole(undefined);
      setPermissions({});
      setRoleInfo(null);
      setIsRoleLoaded(true);
      return;
    }

    syncRoleWithServer();
  }, [user, isLoaded, syncRoleWithServer]);

  // Función para actualizar el rol (solo usar cuando el servidor confirme el cambio)
  const updateRole = useCallback((newRole) => {
    if (!Object.values(ROLES).includes(newRole)) {
      console.error('❌ RoleContext: Intento de establecer rol inválido:', newRole);
      return;
    }
    
    console.log('🔄 RoleContext: Actualizando rol a:', newRole);
    setRole(newRole);
    setPermissions(ROLE_PERMISSIONS[newRole] || {});
  }, []);

  // Función para refrescar el rol desde el servidor
  const refreshRole = useCallback(async () => {
    if (user && isLoaded) {
      console.log('🔄 RoleContext: Refrescando rol...');
      setIsRoleLoaded(false);
      await syncRoleWithServer();
    }
  }, [user, isLoaded, syncRoleWithServer]);

  // Función helper para verificar permisos
  const hasPermission = useCallback((permissionName) => {
    return permissions[permissionName] === true;
  }, [permissions]);

  // Función helper para verificar si tiene alguno de los roles
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(role);
  }, [role]);

  // Función helper para verificar si es admin
  const isAdmin = useCallback(() => {
    return role === ROLES.SUPER_ADMIN;
  }, [role]);

  const contextValue = {
    role,
    permissions,
    roleInfo,
    isLoaded: isLoaded && isRoleLoaded,
    isRoleLoaded,
    syncError,
    updateRole,
    refreshRole,
    hasPermission,
    hasAnyRole,
    isAdmin,
    user
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
}
