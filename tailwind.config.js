/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/Pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilitar modo oscuro con clase 'dark'
  theme: {
    extend: {
      // Sistema de colores "Azul Galaxia Luxury" - Premium
      colors: {
        // Paleta principal - Azul galaxia profundo
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',  // Azul galaxia principal
          600: '#475569',  // Azul galaxia oscuro
          700: '#334155',  // Azul galaxia profundo
          800: '#1e293b',  // Azul galaxia muy oscuro
          900: '#0f172a',  // Negro galaxia
          950: '#020617',
        },
        // Override automático de grises a paleta galaxia
        gray: {
          50: '#f8fafc',   // Mapeado a primary-50
          100: '#f1f5f9',  // Mapeado a primary-100
          200: '#e2e8f0',  // Mapeado a primary-200
          300: '#cbd5e1',  // Mapeado a primary-300
          400: '#94a3b8',  // Mapeado a primary-400
          500: '#64748b',  // Mapeado a primary-500
          600: '#475569',  // Mapeado a primary-600
          700: '#334155',  // Mapeado a primary-700
          800: '#1e293b',  // Mapeado a primary-800
          900: '#0f172a',  // Mapeado a primary-900
          950: '#020617',
        },
        // Paleta secundaria - Violeta premium
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',  // Violeta principal
          600: '#9333ea',  // Violeta intenso
          700: '#7c3aed',  // Violeta profundo
          800: '#6b21a8',  // Violeta oscuro
          900: '#581c87',  // Violeta muy oscuro
          950: '#3b0764',
        },
        // Acento - Cyan cristalino premium
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',  // Cyan cristalino principal
          500: '#06b6d4',  // Cyan brillante
          600: '#0891b2',  // Cyan profundo
          700: '#0e7490',  // Cyan oscuro
          800: '#155e75',  // Cyan muy oscuro
          900: '#164e63',  // Cyan noche
          950: '#083344',
        },
        // Éxito - Verde esmeralda
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // Verde esmeralda principal
          600: '#059669',  // Verde esmeralda oscuro
          700: '#047857',  // Verde esmeralda profundo
          800: '#065f46',  // Verde esmeralda muy oscuro
          900: '#064e3b',  // Verde esmeralda noche
          950: '#022c22',
        },
        // Advertencia - Ámbar suave
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',  // Ámbar suave principal
          500: '#f59e0b',  // Ámbar brillante
          600: '#d97706',  // Ámbar oscuro
          700: '#b45309',  // Ámbar profundo
          800: '#92400e',  // Ámbar muy oscuro
          900: '#78350f',  // Ámbar noche
          950: '#451a03',
        },
        // Error - Rosa coral elegante
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',  // Rosa coral principal
          500: '#ef4444',  // Rojo coral
          600: '#dc2626',  // Rojo oscuro
          700: '#b91c1c',  // Rojo profundo
          800: '#991b1b',  // Rojo muy oscuro
          900: '#7f1d1d',  // Rojo noche
          950: '#450a0a',
        },
        // Grises premium - Slate moderna
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',  // Gris galaxia principal
          600: '#475569',  // Gris galaxia oscuro
          700: '#334155',  // Gris galaxia profundo
          800: '#1e293b',  // Gris galaxia muy oscuro
          900: '#0f172a',  // Gris galaxia noche
          950: '#020617',
        },
        // Neutros cálidos para fondos
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        }
      },
      // Espaciado mejorado
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '128': '32rem',
      },
      // Breakpoints personalizados
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      // Container centrado
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        }
      },
      // Animaciones mejoradas
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', opacity: '1' },
          '50%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideIn: 'slideIn 0.3s ease-out',
        slideInRight: 'slideInRight 0.3s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
        bounce: 'bounce 1s infinite',
      },
      // Sombras premium con efecto galaxia
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px 0 rgba(15, 23, 42, 0.06)',
        'medium': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.06)',
        'large': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
        'xl': '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
        'premium': '0 25px 50px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'glow': '0 0 20px rgba(100, 116, 139, 0.15), 0 0 40px rgba(100, 116, 139, 0.1)',
        'galaxy': '0 8px 32px rgba(15, 23, 42, 0.12), 0 4px 16px rgba(100, 116, 139, 0.08)',
        'glass': '0 8px 32px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(15, 23, 42, 0.06)',
      },
      // Gradientes premium
      backgroundImage: {
        'gradient-galaxy': 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        'gradient-cosmic': 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #64748b 100%)',
        'gradient-aurora': 'linear-gradient(135deg, #334155 0%, #475569 25%, #64748b 50%, #94a3b8 100%)',
        'gradient-premium': 'linear-gradient(135deg, #a855f7 0%, #64748b 50%, #22d3ee 100%)',
        'gradient-luxury': 'linear-gradient(135deg, #7c3aed 0%, #475569 50%, #06b6d4 100%)',
        'gradient-surface': 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%)',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}
