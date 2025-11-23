import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useTheme } from '../../context/ThemeContext';
import { apiService } from '../../services/apiService';
import ThemeToggle from '../layout/ThemeToggle';
import CloudinaryImageField from '../common/CloudinaryImageField';
import { 
  Save, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Settings,
  Palette,
  Type,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const SystemConfigPanel = () => {
  const { getToken } = useAuth();
  const { systemConfig, refreshConfig, appName, logo, logoSmall } = useTheme();
  
  // Estados
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    appName: '',
    description: '',
    logo: null,
    logoSmall: null,
    themeMode: 'light',
    defaultMode: 'light',
    allowUserToggle: true,
    enableDarkMode: true
  });
  
  // Cargar configuración actual
  useEffect(() => {
    if (systemConfig) {
      setFormData({
        appName: systemConfig.branding?.appName || 'AppScrum',
        description: systemConfig.branding?.description || '',
        logo: systemConfig.branding?.logo || null,
        logoSmall: systemConfig.branding?.logoSmall || null,
        themeMode: systemConfig.theme?.mode || 'light',
        defaultMode: systemConfig.theme?.defaultMode || 'light',
        allowUserToggle: systemConfig.theme?.allowUserToggle !== false,
        enableDarkMode: systemConfig.features?.enableDarkMode !== false
      });
    }
  }, [systemConfig]);
  
  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar selección de logo desde Cloudinary
  const handleLogoSelect = (imageData) => {
    setFormData(prev => ({
      ...prev,
      logo: imageData.url
    }));
  };

  // Manejar selección de logo pequeño desde Cloudinary
  const handleLogoSmallSelect = (imageData) => {
    setFormData(prev => ({
      ...prev,
      logoSmall: imageData.url
    }));
  };

  // Eliminar logo
  const handleDeleteLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null
    }));
  };

  // Eliminar logo pequeño
  const handleDeleteLogoSmall = () => {
    setFormData(prev => ({
      ...prev,
      logoSmall: null
    }));
  };
  
  // Guardar configuración
  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      
      const token = await getToken();
      
      // Actualizar configuración con las URLs de Cloudinary
      const updateData = {
        branding: {
          appName: formData.appName,
          description: formData.description,
          logo: formData.logo,
          logoSmall: formData.logoSmall,
          // Enviar versiones del logo (todas apuntan a la misma URL por ahora)
          logoVersions: formData.logo ? {
            original: formData.logo,
            thumbnail: formData.logo,
            medium: formData.logo,
            large: formData.logo
          } : undefined,
          logoSmallVersions: formData.logoSmall ? {
            original: formData.logoSmall,
            thumbnail: formData.logoSmall,
            medium: formData.logoSmall,
            large: formData.logoSmall
          } : undefined
        },
        theme: {
          mode: formData.themeMode,
          defaultMode: formData.defaultMode,
          allowUserToggle: formData.allowUserToggle,
          // Preservar colores existentes
          lightColors: systemConfig.theme.lightColors || {
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
          darkColors: systemConfig.theme.darkColors || {
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
          enableDarkMode: formData.enableDarkMode
        }
      };
      
      const response = await apiService.request('/system-config/config', {
        method: 'PUT',
        body: JSON.stringify(updateData)
      }, () => Promise.resolve(token));
      
      // Refrescar configuración desde el backend
      await refreshConfig();
      
      setMessage('Configuración guardada exitosamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error guardando configuración:', err);
      setError(err.message || 'Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };
  
  // Restablecer configuración
  const handleReset = async () => {
    if (!confirm('¿Está seguro de que desea restablecer la configuración a valores por defecto?')) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const token = await getToken();
      await apiService.request('/system-config/reset', {
        method: 'POST'
      }, () => Promise.resolve(token));
      
      await refreshConfig();
      setMessage('Configuración restablecida exitosamente');
    } catch (err) {
      setError(err.message || 'Error al restablecer configuración');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 rounded-lg shadow-lg text-white p-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Settings className="h-8 w-8" />
          Configuración del Sistema
        </h1>
        <p className="text-purple-100 dark:text-purple-200">
          Personaliza la apariencia y configuración global de la aplicación
        </p>
      </div>
      
      {/* Mensajes */}
      {message && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-green-800 dark:text-green-300">{message}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Type className="h-5 w-5" />
            Branding
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda: Textos */}
            <div className="space-y-4">
              {/* Nombre de la aplicación */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nombre de la Aplicación
                </label>
                <input
                  type="text"
                  name="appName"
                  value={formData.appName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  placeholder="AppScrum"
                />
              </div>
              
              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent resize-none"
                  placeholder="Sistema de gestión ágil de proyectos"
                />
              </div>
            </div>
            
            {/* Columna derecha: Imágenes */}
            <div className="space-y-4">
              {/* Logo Principal */}
              <CloudinaryImageField
                label="Logo Principal"
                value={formData.logo}
                onChange={handleLogoSelect}
                onDelete={handleDeleteLogo}
                folder="branding"
                description="PNG, JPG, SVG, WebP (máx. 5MB)"
                size="large"
              />
              
              {/* Logo Pequeño */}
              <CloudinaryImageField
                label="Logo Pequeño (Favicon)"
                value={formData.logoSmall}
                onChange={handleLogoSmallSelect}
                onDelete={handleDeleteLogoSmall}
                folder="branding"
                description="64x64px recomendado"
                size="small"
              />
            </div>
          </div>
        </div>
        
        {/* Tema */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Tema y Apariencia
          </h2>
          
          <div className="space-y-4">
            {/* Preview del tema actual */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Vista previa del tema actual:</span>
              <ThemeToggle size="medium" showLabel />
            </div>
            
            {/* Modo por defecto */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tema por Defecto para Nuevos Usuarios
              </label>
              <select
                name="defaultMode"
                value={formData.defaultMode}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>
            
            {/* Habilitar modo oscuro */}
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Habilitar Modo Oscuro</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Permitir que el sistema use modo oscuro</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, enableDarkMode: !prev.enableDarkMode }))}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${formData.enableDarkMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${formData.enableDarkMode ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
            
            {/* Permitir toggle de usuarios */}
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Permitir a Usuarios Cambiar Tema</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Los usuarios pueden elegir entre tema claro y oscuro</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, allowUserToggle: !prev.allowUserToggle }))}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${formData.allowUserToggle ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${formData.allowUserToggle ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Restablecer
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-800 dark:hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Guardar Configuración
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemConfigPanel;
