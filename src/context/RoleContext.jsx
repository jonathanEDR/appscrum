import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { apiService } from "../services/apiService";

export const RoleContext = createContext();
export const useRole = () => useContext(RoleContext);

export function RoleProvider({ children }) {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [role, setRole] = useState(undefined);
  const [isRoleLoaded, setIsRoleLoaded] = useState(false);
  const [serverRole, setServerRole] = useState(null);

  // Función para sincronizar rol con el servidor
  const syncRoleWithServer = useCallback(async () => {
    if (!user || !isLoaded) return;

    try {
      // Primero intentar obtener el perfil del servidor
      const token = await getToken();
      console.log('Token obtenido correctamente:', token ? 'Token presente' : 'Token ausente');
      
      const profileData = await apiService.getUserProfile(user.id, () => Promise.resolve(token));
      console.log('URL de la API:', apiService.baseURL);
      console.log('Profile data received:', profileData);
      
      if (profileData?.role) {
        setServerRole(profileData.role);
        setRole(profileData.role);
        setIsRoleLoaded(true);
        return;
      }
    } catch (error) {
      console.error('Error completo al obtener el rol:', error);
      console.warn('Could not fetch server role, using Clerk metadata:', error.message);
    }

    // Si no se puede obtener del servidor, usar metadata de Clerk
    const clerkRole = user?.publicMetadata?.role || 
                     user?.unsafeMetadata?.role || 
                     user?.role;
    
    if (!clerkRole) {
      console.warn('No se encontró rol en Clerk, verificando en el servidor...');
      try {
        // Intenta obtener el rol del servidor nuevamente
        const userData = await apiService.getUserByClerkId(user.id);
        if (userData?.role) {
          console.log('Rol encontrado en el servidor:', userData.role);
          setRole(userData.role);
        } else {
          console.warn('No se encontró rol en el servidor, usando rol por defecto');
          setRole('user');
        }
      } catch (error) {
        console.error('Error al obtener rol del servidor:', error);
        setRole('user');
      }
    } else {
      setRole(clerkRole);
    }
    setIsRoleLoaded(true);
  }, [user, isLoaded, getToken]);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      setRole(undefined);
      setServerRole(null);
      setIsRoleLoaded(true);
      return;
    }

    syncRoleWithServer();
  }, [user, isLoaded, syncRoleWithServer]);

  // Función para actualizar el rol
  const updateRole = useCallback((newRole) => {
    setRole(newRole);
    setServerRole(newRole);
  }, []);

  // Función para refrescar el rol desde el servidor
  const refreshRole = useCallback(async () => {
    if (user && isLoaded) {
      setIsRoleLoaded(false);
      await syncRoleWithServer();
    }
  }, [user, isLoaded, syncRoleWithServer]);

  const contextValue = {
    role,
    serverRole,
    isLoaded: isLoaded && isRoleLoaded,
    isRoleLoaded,
    updateRole,
    refreshRole,
    user
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
}