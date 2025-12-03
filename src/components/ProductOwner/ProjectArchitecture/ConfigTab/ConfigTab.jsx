import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Zap,
  Server,
  Save,
  Lock,
  Key,
  Globe,
  Database,
  Cloud,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const AUTH_METHODS = [
  { value: 'jwt', label: 'JWT (JSON Web Tokens)' },
  { value: 'oauth2', label: 'OAuth 2.0' },
  { value: 'session', label: 'Session-based' },
  { value: 'api_key', label: 'API Key' },
  { value: 'clerk', label: 'Clerk' },
  { value: 'auth0', label: 'Auth0' },
  { value: 'firebase', label: 'Firebase Auth' },
  { value: 'cognito', label: 'AWS Cognito' },
  { value: 'none', label: 'Sin autenticación' }
];

const ENCRYPTION_OPTIONS = [
  { value: 'none', label: 'Sin encriptación' },
  { value: 'tls_transit', label: 'TLS en tránsito' },
  { value: 'tls_rest', label: 'TLS + Datos en reposo' },
  { value: 'e2e', label: 'End-to-End Encryption' }
];

const CACHE_STRATEGIES = [
  { value: 'none', label: 'Sin caché' },
  { value: 'memory', label: 'In-Memory (Node-cache)' },
  { value: 'redis', label: 'Redis' },
  { value: 'memcached', label: 'Memcached' },
  { value: 'cdn', label: 'CDN Edge Cache' }
];

/**
 * ConfigTab - Configuración de Security, Performance, Environments
 */
const ConfigTab = ({ architecture, onUpdateArchitecture, loading, theme = 'light' }) => {
  const [activeSection, setActiveSection] = useState('security');
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    security: {
      authentication_method: '',
      encryption: '',
      cors_origins: '',
      rate_limiting: false,
      rate_limit_requests: 100,
      rate_limit_window: 60,
      security_headers: true,
      csrf_protection: true
    },
    performance: {
      caching_strategy: '',
      cache_ttl: 300,
      compression: true,
      cdn_enabled: false,
      cdn_provider: '',
      lazy_loading: true,
      code_splitting: true,
      image_optimization: true
    },
    environments: {
      development: {
        url: '',
        database: '',
        features: ''
      },
      staging: {
        url: '',
        database: '',
        features: ''
      },
      production: {
        url: '',
        database: '',
        features: ''
      }
    }
  });

  // Cargar datos existentes
  useEffect(() => {
    if (architecture) {
      setFormData({
        security: {
          authentication_method: architecture.security?.authentication_method || '',
          encryption: architecture.security?.encryption || '',
          cors_origins: architecture.security?.cors_origins?.join(', ') || '',
          rate_limiting: architecture.security?.rate_limiting || false,
          rate_limit_requests: architecture.security?.rate_limit_requests || 100,
          rate_limit_window: architecture.security?.rate_limit_window || 60,
          security_headers: architecture.security?.security_headers !== false,
          csrf_protection: architecture.security?.csrf_protection !== false
        },
        performance: {
          caching_strategy: architecture.performance?.caching_strategy || '',
          cache_ttl: architecture.performance?.cache_ttl || 300,
          compression: architecture.performance?.compression !== false,
          cdn_enabled: architecture.performance?.cdn_enabled || false,
          cdn_provider: architecture.performance?.cdn_provider || '',
          lazy_loading: architecture.performance?.lazy_loading !== false,
          code_splitting: architecture.performance?.code_splitting !== false,
          image_optimization: architecture.performance?.image_optimization !== false
        },
        environments: {
          development: architecture.environments?.development || { url: '', database: '', features: '' },
          staging: architecture.environments?.staging || { url: '', database: '', features: '' },
          production: architecture.environments?.production || { url: '', database: '', features: '' }
        }
      });
    }
  }, [architecture]);

  const handleInputChange = (section, field, value) => {
    setHasChanges(true);
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleEnvironmentChange = (env, field, value) => {
    setHasChanges(true);
    setFormData(prev => ({
      ...prev,
      environments: {
        ...prev.environments,
        [env]: {
          ...prev.environments[env],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    try {
      // Preparar datos para guardar
      const updateData = {
        security: {
          ...formData.security,
          cors_origins: formData.security.cors_origins
            ? formData.security.cors_origins.split(',').map(s => s.trim()).filter(Boolean)
            : []
        },
        performance: formData.performance,
        environments: formData.environments
      };

      await onUpdateArchitecture(updateData);
      setHasChanges(false);
    } catch (err) {
      console.error('Error saving configuration:', err);
    }
  };

  const sections = [
    { id: 'security', label: 'Seguridad', icon: Shield, color: 'text-green-600' },
    { id: 'performance', label: 'Performance', icon: Zap, color: 'text-yellow-600' },
    { id: 'environments', label: 'Ambientes', icon: Server, color: 'text-blue-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Settings className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
            Configuración de Arquitectura
          </h2>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Configura seguridad, rendimiento y ambientes del proyecto
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading || !hasChanges}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
            hasChanges 
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : theme === 'dark' 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save size={18} />
          Guardar Cambios
        </button>
      </div>

      {/* Section Tabs */}
      <div className={`flex gap-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeSection === section.id
                  ? `${section.color} border-current`
                  : theme === 'dark' 
                    ? 'text-gray-400 border-transparent hover:text-gray-200'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Icon size={18} />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Security Section */}
      {activeSection === 'security' && (
        <div className={`rounded-xl border p-6 space-y-6 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-2 text-green-600 mb-4">
            <Shield size={24} />
            <h3 className="text-lg font-semibold">Configuración de Seguridad</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Authentication */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Lock size={16} className="inline mr-1" />
                Método de Autenticación
              </label>
              <select
                value={formData.security.authentication_method}
                onChange={(e) => handleInputChange('security', 'authentication_method', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Seleccionar...</option>
                {AUTH_METHODS.map(method => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>

            {/* Encryption */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Key size={16} className="inline mr-1" />
                Encriptación
              </label>
              <select
                value={formData.security.encryption}
                onChange={(e) => handleInputChange('security', 'encryption', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Seleccionar...</option>
                {ENCRYPTION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CORS Origins */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Globe size={16} className="inline mr-1" />
              CORS Origins (separados por coma)
            </label>
            <input
              type="text"
              value={formData.security.cors_origins}
              onChange={(e) => handleInputChange('security', 'cors_origins', e.target.value)}
              placeholder="https://example.com, https://app.example.com"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Rate Limiting */}
          <div className={`rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={formData.security.rate_limiting}
                onChange={(e) => handleInputChange('security', 'rate_limiting', e.target.checked)}
                className="w-5 h-5 rounded text-green-600 focus:ring-green-500"
              />
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Habilitar Rate Limiting</span>
            </label>

            {formData.security.rate_limiting && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Requests máximos</label>
                  <input
                    type="number"
                    value={formData.security.rate_limit_requests}
                    onChange={(e) => handleInputChange('security', 'rate_limit_requests', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ventana (segundos)</label>
                  <input
                    type="number"
                    value={formData.security.rate_limit_window}
                    onChange={(e) => handleInputChange('security', 'rate_limit_window', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Security Features */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.security.security_headers}
                onChange={(e) => handleInputChange('security', 'security_headers', e.target.checked)}
                className="w-5 h-5 rounded text-green-600 focus:ring-green-500"
              />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Security Headers (HSTS, CSP)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.security.csrf_protection}
                onChange={(e) => handleInputChange('security', 'csrf_protection', e.target.checked)}
                className="w-5 h-5 rounded text-green-600 focus:ring-green-500"
              />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>CSRF Protection</span>
            </label>
          </div>
        </div>
      )}

      {/* Performance Section */}
      {activeSection === 'performance' && (
        <div className={`rounded-xl border p-6 space-y-6 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-2 text-yellow-600 mb-4">
            <Zap size={24} />
            <h3 className="text-lg font-semibold">Configuración de Rendimiento</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Caching Strategy */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Database size={16} className="inline mr-1" />
                Estrategia de Caché
              </label>
              <select
                value={formData.performance.caching_strategy}
                onChange={(e) => handleInputChange('performance', 'caching_strategy', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Seleccionar...</option>
                {CACHE_STRATEGIES.map(strategy => (
                  <option key={strategy.value} value={strategy.value}>{strategy.label}</option>
                ))}
              </select>
            </div>

            {/* Cache TTL */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Cache TTL (segundos)
              </label>
              <input
                type="number"
                value={formData.performance.cache_ttl}
                onChange={(e) => handleInputChange('performance', 'cache_ttl', parseInt(e.target.value))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* CDN */}
          <div className={`rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={formData.performance.cdn_enabled}
                onChange={(e) => handleInputChange('performance', 'cdn_enabled', e.target.checked)}
                className="w-5 h-5 rounded text-yellow-600 focus:ring-yellow-500"
              />
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                <Cloud size={16} className="inline mr-1" />
                CDN Habilitado
              </span>
            </label>

            {formData.performance.cdn_enabled && (
              <input
                type="text"
                value={formData.performance.cdn_provider}
                onChange={(e) => handleInputChange('performance', 'cdn_provider', e.target.value)}
                placeholder="ej: Cloudflare, AWS CloudFront, Vercel Edge"
                className={`w-full px-3 py-2 border rounded-lg mt-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            )}
          </div>

          {/* Optimizations */}
          <div>
            <h4 className={`font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>Optimizaciones Frontend</h4>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.performance.compression}
                  onChange={(e) => handleInputChange('performance', 'compression', e.target.checked)}
                  className="w-5 h-5 rounded text-yellow-600 focus:ring-yellow-500"
                />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Compresión (gzip/brotli)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.performance.lazy_loading}
                  onChange={(e) => handleInputChange('performance', 'lazy_loading', e.target.checked)}
                  className="w-5 h-5 rounded text-yellow-600 focus:ring-yellow-500"
                />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Lazy Loading</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.performance.code_splitting}
                  onChange={(e) => handleInputChange('performance', 'code_splitting', e.target.checked)}
                  className="w-5 h-5 rounded text-yellow-600 focus:ring-yellow-500"
                />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Code Splitting</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.performance.image_optimization}
                  onChange={(e) => handleInputChange('performance', 'image_optimization', e.target.checked)}
                  className="w-5 h-5 rounded text-yellow-600 focus:ring-yellow-500"
                />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Optimización de Imágenes</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Environments Section */}
      {activeSection === 'environments' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600 mb-4">
            <Server size={24} />
            <h3 className="text-lg font-semibold">Configuración de Ambientes</h3>
          </div>

          {['development', 'staging', 'production'].map((env) => {
            const envLabels = {
              development: { 
                label: 'Desarrollo', 
                color: theme === 'dark' ? 'border-green-600 bg-green-900/30' : 'border-green-500 bg-green-50', 
                badge: theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700' 
              },
              staging: { 
                label: 'Staging', 
                color: theme === 'dark' ? 'border-yellow-600 bg-yellow-900/30' : 'border-yellow-500 bg-yellow-50', 
                badge: theme === 'dark' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-700' 
              },
              production: { 
                label: 'Producción', 
                color: theme === 'dark' ? 'border-red-600 bg-red-900/30' : 'border-red-500 bg-red-50', 
                badge: theme === 'dark' ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700' 
              }
            };
            const config = envLabels[env];

            return (
              <div key={env} className={`rounded-xl border-l-4 ${config.color} border p-5 ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-sm font-medium px-2 py-1 rounded ${config.badge}`}>
                    {config.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>URL</label>
                    <input
                      type="url"
                      value={formData.environments[env].url}
                      onChange={(e) => handleEnvironmentChange(env, 'url', e.target.value)}
                      placeholder={`https://${env === 'production' ? 'app' : env}.example.com`}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Base de Datos</label>
                    <input
                      type="text"
                      value={formData.environments[env].database}
                      onChange={(e) => handleEnvironmentChange(env, 'database', e.target.value)}
                      placeholder={`mongodb://${env}_db`}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Features/Notas</label>
                    <input
                      type="text"
                      value={formData.environments[env].features}
                      onChange={(e) => handleEnvironmentChange(env, 'features', e.target.value)}
                      placeholder="Debug mode, Mock data..."
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Environment Warning */}
          <div className={`rounded-lg p-4 flex items-start gap-3 border ${
            theme === 'dark' ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-50 border-amber-200'
          }`}>
            <AlertTriangle className={`flex-shrink-0 mt-0.5 ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            }`} size={20} />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-amber-300' : 'text-amber-800'}`}>
                <strong>Importante:</strong> No almacenes credenciales o secretos reales aquí. 
                Esta información es solo para documentación. Usa variables de entorno para datos sensibles.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Changes Indicator */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <AlertTriangle size={18} />
          <span>Tienes cambios sin guardar</span>
        </div>
      )}
    </div>
  );
};

export default ConfigTab;
