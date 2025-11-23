import { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Componente que actualiza dinámicamente el título y favicon de la página
 * basándose en la configuración del sistema
 */
const DynamicHead = () => {
  const { appName, logoSmall } = useTheme();

  useEffect(() => {
    // Actualizar título de la página
    if (appName) {
      document.title = appName;
    }
  }, [appName]);

  useEffect(() => {
    // Actualizar favicon
    if (logoSmall) {
      // Buscar el link del favicon existente o crear uno nuevo
      let favicon = document.querySelector("link[rel~='icon']");
      
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      
      // Actualizar href con la URL del logo pequeño
      favicon.href = logoSmall;
      
      // También actualizar apple-touch-icon si existe
      let appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']");
      if (!appleTouchIcon) {
        appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        document.head.appendChild(appleTouchIcon);
      }
      appleTouchIcon.href = logoSmall;
    }
  }, [logoSmall]);

  // Este componente no renderiza nada visible
  return null;
};

export default DynamicHead;
