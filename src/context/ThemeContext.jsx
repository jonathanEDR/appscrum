import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { apiService } from "../services/apiService";

export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const { getToken, isLoaded: isAuthLoaded } = useAuth();
  
  // Estados principales
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'
  const [systemConfig, setSystemConfig] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Cargar configuración del sistema desde el backend
  const loadSystemConfig = useCallback(async () => {
    try {
      console.log('🎨 ThemeContext: Cargando configuración del sistema...');
      
      const token = await getToken();
      if (!token) {
        console.warn('⚠️ ThemeContext: No hay token disponible');
        // Usar valores por defecto
        setDefaultConfig();
        return;
      }

      const response = await apiService.request('/system-config/config', {
        method: 'GET'
      }, () => Promise.resolve(token));

      console.log('✅ ThemeContext: Configuración cargada:', response);

      if (response?.status === 'success' && response?.config) {
        setSystemConfig(response.config);
        
        // Aplicar tema del sistema
        const themeMode = response.config.theme?.mode || 'light';
        setTheme(themeMode);
        applyThemeToDOM(themeMode);
        
        // Guardar en localStorage
        localStorage.setItem('appscrum-theme', themeMode);
        localStorage.setItem('appscrum-config', JSON.stringify(response.config));
        
        setIsLoaded(true);
        setError(null);
      } else {
        throw new Error('Respuesta de configuración inválida');
      }
    } catch (err) {
      console.error('❌ ThemeContext: Error al cargar configuración:', err);
      setError(err.message);
      
      // Intentar cargar desde localStorage como fallback
      try {
        const cachedTheme = localStorage.getItem('appscrum-theme');
        const cachedConfig = localStorage.getItem('appscrum-config');
        
        if (cachedTheme) {
          setTheme(cachedTheme);
          applyThemeToDOM(cachedTheme);
        }
        
        if (cachedConfig) {
          setSystemConfig(JSON.parse(cachedConfig));
        } else {
          setDefaultConfig();
        }
      } catch (storageErr) {
        console.error('❌ ThemeContext: Error al leer localStorage:', storageErr);
        setDefaultConfig();
      }
      
      setIsLoaded(true);
    }
  }, [getToken]);

  // Configuración por defecto
  const setDefaultConfig = () => {
    const defaultConfig = {
      branding: {
        appName: 'AppScrum',
        logo: null,
        logoSmall: null,
        description: 'Sistema de gestión ágil de proyectos'
      },
      theme: {
        mode: 'light',
        defaultMode: 'light',
        allowUserToggle: true,
        lightColors: {
          primary: '#64748b',
          secondary: '#a855f7',
          accent: '#22d3ee',
          success: '#10b981',
          warning: '#fbbf24',
          error: '#f87171',
          background: '#f8fafc',
          surface: '#ffffff',
          text: '#0f172a'
        },
        darkColors: {
          primary: '#94a3b8',
          secondary: '#c084fc',
          accent: '#67e8f9',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
          background: '#0f172a',
          surface: '#1e293b',
          text: '#f8fafc'
        }
      },
      features: {
        enableDarkMode: true,
        enableCustomColors: false
      }
    };
    
    setSystemConfig(defaultConfig);
    setTheme('light');
    applyThemeToDOM('light');
  };

  // Aplicar tema al DOM
  const applyThemeToDOM = (themeMode) => {
    const root = document.documentElement;
    
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    
    // Aplicar colores personalizados si existen
    if (systemConfig?.theme) {
      const colors = themeMode === 'dark' 
        ? systemConfig.theme.darkColors 
        : systemConfig.theme.lightColors;
      
      if (colors) {
        Object.entries(colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value);
        });
      }
    }
  };

  // Cambiar tema
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyThemeToDOM(newTheme);
    
    // Guardar en localStorage
    localStorage.setItem('appscrum-theme', newTheme);
    
    console.log('🔄 ThemeContext: Tema cambiado a:', newTheme);
  }, [theme, systemConfig]);

  // Establecer tema específico
  const setSpecificTheme = useCallback((newTheme) => {
    if (!['light', 'dark'].includes(newTheme)) {
      console.error('❌ ThemeContext: Tema inválido:', newTheme);
      return;
    }
    
    setTheme(newTheme);
    applyThemeToDOM(newTheme);
    localStorage.setItem('appscrum-theme', newTheme);
    
    console.log('🔄 ThemeContext: Tema establecido a:', newTheme);
  }, [systemConfig]);

  // Refrescar configuración desde el servidor
  const refreshConfig = useCallback(async () => {
    console.log('🔄 ThemeContext: Refrescando configuración...');
    setIsLoaded(false);
    await loadSystemConfig();
  }, [loadSystemConfig]);

  // Actualizar configuración local cuando cambia systemConfig
  useEffect(() => {
    if (systemConfig?.theme) {
      applyThemeToDOM(theme);
    }
  }, [systemConfig, theme]);

  // Cargar configuración inicial
  useEffect(() => {
    if (isAuthLoaded) {
      // Intentar cargar tema guardado primero
      const savedTheme = localStorage.getItem('appscrum-theme');
      if (savedTheme) {
        setTheme(savedTheme);
        applyThemeToDOM(savedTheme);
      }
      
      // Luego cargar configuración completa del servidor
      loadSystemConfig();
    }
  }, [isAuthLoaded, loadSystemConfig]);

  // Escuchar cambios de tema del sistema operativo
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Solo aplicar si el usuario no ha establecido preferencia
      const savedTheme = localStorage.getItem('appscrum-theme');
      if (!savedTheme && systemConfig?.theme?.allowUserToggle) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyThemeToDOM(newTheme);
        console.log('🌓 ThemeContext: Tema del sistema detectado:', newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [systemConfig]);

  const contextValue = {
    // Estados
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    systemConfig,
    isLoaded,
    error,
    
    // Branding helpers
    appName: systemConfig?.branding?.appName || 'AppScrum',
    logo: systemConfig?.branding?.logo || null,
    logoSmall: systemConfig?.branding?.logoSmall || null,
    description: systemConfig?.branding?.description || 'Sistema de gestión ágil de proyectos',
    
    // Theme helpers
    canToggleTheme: systemConfig?.theme?.allowUserToggle !== false,
    darkModeEnabled: systemConfig?.features?.enableDarkMode !== false,
    
    // Funciones
    toggleTheme,
    setTheme: setSpecificTheme,
    refreshConfig,
    applyThemeToDOM
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
