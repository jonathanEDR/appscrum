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

    let token;
    try {
      token = await getToken();
      console.log('Token obtenido correctamente:', token ? 'Token presente' : 'Token ausente');

      // PRIMERO: Intentar obtener el usuario desde NUESTRA base de datos
      const userData = await apiService.request(`/auth/user/${user.id}`, {
        method: 'GET'
      }, () => Promise.resolve(token));

      console.log('User data from database:', userData);

      if (userData?.role) {
        setServerRole(userData.role);
        setRole(userData.role);
        setIsRoleLoaded(true);
        return;
      }
    } catch (error) {
      console.error('Error al obtener el rol de la base de datos:', error);
      console.warn('Intentando crear usuario en la base de datos...');

      // Si el usuario no existe, intentar el endpoint de perfil que lo crea automáticamente
      try {
        if (!token) {
          token = await getToken(); // Re-obtener token si no existe
        }

        const profileResponse = await apiService.request('/auth/user-profile', {
          method: 'GET'
        }, () => Promise.resolve(token));

        console.log('Profile response:', profileResponse);

        if (profileResponse?.user?.role) {
          setServerRole(profileResponse.user.role);
          setRole(profileResponse.user.role);
          setIsRoleLoaded(true);
          return;
        }
      } catch (createError) {
        console.error('Error al crear usuario:', createError);
      }
    }

    // ÚLTIMO RECURSO: Usar metadata de Clerk como fallback
    const clerkRole = user?.publicMetadata?.role ||
                     user?.unsafeMetadata?.role ||
                     user?.role ||
                     'user';

    console.warn('Using Clerk role as fallback:', clerkRole);
    setRole(clerkRole);
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