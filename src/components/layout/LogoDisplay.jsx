import React from 'react';
import { Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Componente para mostrar el logo del sistema
 * Si hay logo configurado, lo muestra; sino muestra el icono por defecto
 */
const LogoDisplay = ({ size = 'medium', showText = true, className = '', iconClassName = '' }) => {
  const { logo, appName, isLoaded } = useTheme();
  
  const sizes = {
    small: {
      container: 'w-8 h-8',
      icon: 20,
      text: 'text-base'
    },
    medium: {
      container: 'w-12 h-12',
      icon: 24,
      text: 'text-xl'
    },
    large: {
      container: 'w-16 h-16',
      icon: 32,
      text: 'text-2xl'
    }
  };
  
  const sizeConfig = sizes[size] || sizes.medium;
  
  // Si hay logo configurado, mostrarlo
  if (isLoaded && logo) {
    // En desarrollo: http://localhost:5000 + /uploads/...
    // En producción: https://appscrum-backend.onrender.com + /uploads/...
    const baseUrl = import.meta.env.PROD 
      ? (import.meta.env.VITE_API_URL || 'https://appscrum-backend.onrender.com')
      : 'http://localhost:5000';
    const logoUrl = logo.startsWith('http') ? logo : `${baseUrl}${logo}`;
    
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img 
          src={logoUrl} 
          alt={`${appName} logo`}
          className={`${sizeConfig.container} object-contain ${iconClassName}`}
          onError={(e) => {
            // Si falla la carga, mostrar icono por defecto
            e.target.style.display = 'none';
            e.target.nextSibling?.classList.remove('hidden');
          }}
        />
        {/* Fallback icon (oculto por defecto) */}
        <div 
          className={`${sizeConfig.container} rounded-2xl flex items-center justify-center shadow-medium hidden ${iconClassName}`}
          style={{
            background: 'linear-gradient(135deg, #d97706, #f59e0b)'
          }}
        >
          <Shield className="text-white" size={sizeConfig.icon} />
        </div>
        {showText && (
          <div>
            <h2 className={`${sizeConfig.text} font-bold`}>{appName}</h2>
          </div>
        )}
      </div>
    );
  }
  
  // Logo por defecto (icono Shield)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className={`${sizeConfig.container} rounded-2xl flex items-center justify-center shadow-medium ${iconClassName}`}
        style={{
          background: 'linear-gradient(135deg, #d97706, #f59e0b)'
        }}
      >
        <Shield className="text-white" size={sizeConfig.icon} />
      </div>
      {showText && (
        <div>
          <h2 className={`${sizeConfig.text} font-bold`}>{appName}</h2>
        </div>
      )}
    </div>
  );
};

export default LogoDisplay;
