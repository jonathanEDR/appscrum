import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Botón para cambiar entre tema claro y oscuro
 * Simple y elegante, con animación suave
 */
const ThemeToggle = ({ className = '', size = 'medium', showLabel = false }) => {
  const { theme, toggleTheme, canToggleTheme, darkModeEnabled, isLoaded } = useTheme();
  
  // Si el modo oscuro no está habilitado, no mostrar el botón
  if (!darkModeEnabled || !canToggleTheme || !isLoaded) {
    return null;
  }
  
  const sizes = {
    small: {
      button: 'w-10 h-10',
      icon: 18
    },
    medium: {
      button: 'w-12 h-12',
      icon: 20
    },
    large: {
      button: 'w-14 h-14',
      icon: 24
    }
  };
  
  const sizeConfig = sizes[size] || sizes.medium;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
        </span>
      )}
      
      <button
        onClick={toggleTheme}
        className={`
          ${sizeConfig.button}
          relative rounded-xl
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          group
          hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-offset-2
        `}
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #1e293b, #334155)'
            : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          boxShadow: theme === 'dark'
            ? '0 4px 14px rgba(0, 0, 0, 0.4)'
            : '0 4px 14px rgba(251, 191, 36, 0.4)',
          color: theme === 'dark' ? '#fbbf24' : '#ffffff',
          border: theme === 'dark' ? '1px solid rgba(251, 191, 36, 0.2)' : '1px solid rgba(255, 255, 255, 0.2)'
        }}
        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {/* Animación de rotación */}
        <div className="relative transition-transform duration-500 group-hover:rotate-180">
          {theme === 'dark' ? (
            <Moon 
              size={sizeConfig.icon} 
              className="animate-pulse"
              strokeWidth={2}
            />
          ) : (
            <Sun 
              size={sizeConfig.icon}
              className="animate-pulse"
              strokeWidth={2}
            />
          )}
        </div>
        
        {/* Efecto de brillo */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle at center, rgba(251, 191, 36, 0.15), transparent)'
              : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.25), transparent)'
          }}
        />
      </button>
    </div>
  );
};

export default ThemeToggle;
