import React from 'react';
import {
  BarChart3,
  Boxes,
  Package,
  Workflow,
  Plug,
  FileText,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Server,
  Database,
  Globe,
  Lock
} from 'lucide-react';

/**
 * OverviewTab - Dashboard con KPIs de la arquitectura
 */
const OverviewTab = ({ architecture, stats, theme = 'light' }) => {
  // Calcular métricas adicionales
  const getHealthStatus = () => {
    const score = stats?.completenessScore || 0;
    if (score >= 80) return { status: 'Excelente', color: 'text-green-600', bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100', icon: CheckCircle };
    if (score >= 50) return { status: 'Bueno', color: 'text-blue-600', bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100', icon: TrendingUp };
    if (score >= 25) return { status: 'En Progreso', color: 'text-yellow-600', bg: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100', icon: Clock };
    return { status: 'Inicial', color: theme === 'dark' ? 'text-gray-400' : 'text-gray-600', bg: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100', icon: AlertCircle };
  };

  const healthStatus = getHealthStatus();
  const HealthIcon = healthStatus.icon;

  // Obtener resumen del Tech Stack - compatible con ambos esquemas
  const techStackSummary = {
    frontend: architecture?.tech_stack?.frontend?.framework || 'No definido',
    backend: architecture?.tech_stack?.backend?.framework || 'No definido',
    database: architecture?.tech_stack?.database?.primary || architecture?.tech_stack?.database?.primary_db || 'No definido',
    infrastructure: architecture?.tech_stack?.infrastructure?.hosting_backend || architecture?.tech_stack?.infrastructure?.hosting || 'No definido'
  };

  // Obtener estado de seguridad
  const securityStatus = {
    hasAuth: !!architecture?.security?.authentication_method,
    hasEncryption: !!architecture?.security?.encryption,
    authMethod: architecture?.security?.authentication_method || 'No configurado'
  };

  // Obtener módulos recientes
  const recentModules = (architecture?.modules || []).slice(0, 3);
  
  // Obtener endpoints recientes
  const recentEndpoints = (architecture?.api_endpoints || []).slice(0, 5);

  // Obtener decisiones recientes
  const recentDecisions = (architecture?.architecture_decisions || []).slice(0, 3);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header con Health Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className={`text-lg md:text-2xl font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <BarChart3 className="text-blue-600 flex-shrink-0" size={20} />
            Dashboard de Arquitectura
          </h2>
          <p className={`mt-1 text-xs md:text-base hidden sm:block ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Resumen ejecutivo del estado de la arquitectura del proyecto
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full ${healthStatus.bg}`}>
          <HealthIcon className={healthStatus.color} size={16} />
          <span className={`font-semibold text-sm md:text-base ${healthStatus.color}`}>{healthStatus.status}</span>
        </div>
      </div>

      {/* Completeness Progress */}
      <div className={`rounded-xl p-4 md:p-6 border ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-800'
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100'
      }`}>
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className={`text-sm md:text-lg font-semibold ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>Completitud de Arquitectura</h3>
          <span className="text-2xl md:text-3xl font-bold text-blue-600">{stats?.completenessScore || 0}%</span>
        </div>
        <div className={`w-full rounded-full h-3 md:h-4 overflow-hidden ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div 
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${stats?.completenessScore || 0}%` }}
          />
        </div>
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 md:gap-2 mt-3 md:mt-4 text-[10px] md:text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <div className={`text-center p-1.5 md:p-2 rounded ${
            stats?.completenessScore >= 25 
              ? theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
              : ''
          }`}>
            Tech Stack (25%)
          </div>
          <div className={`text-center p-1.5 md:p-2 rounded ${
            stats?.totalModules > 0 
              ? theme === 'dark' ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-700'
              : ''
          }`}>
            Módulos (20%)
          </div>
          <div className={`text-center p-1.5 md:p-2 rounded ${
            stats?.totalEndpoints > 0 
              ? theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
              : ''
          }`}>
            Endpoints (15%)
          </div>
          <div className={`text-center p-1.5 md:p-2 rounded ${
            stats?.totalIntegrations > 0 
              ? theme === 'dark' ? 'bg-orange-900/50 text-orange-400' : 'bg-orange-100 text-orange-700'
              : ''
          }`}>
            Integraciones (15%)
          </div>
          <div className={`text-center p-1.5 md:p-2 rounded col-span-2 sm:col-span-1 ${
            stats?.totalDecisions > 0 
              ? theme === 'dark' ? 'bg-pink-900/50 text-pink-400' : 'bg-pink-100 text-pink-700'
              : ''
          }`}>
            Decisiones (10%)
          </div>
        </div>
      </div>

      {/* Tech Stack Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className={`rounded-xl border p-4 md:p-6 ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            <Boxes className="text-blue-600" size={18} />
            Tech Stack
          </h3>
          <div className="space-y-2 md:space-y-3">
            <div className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <Globe className="text-cyan-500" size={16} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Frontend</span>
              </div>
              <span className={`font-medium text-sm truncate ml-2 ${
                techStackSummary.frontend !== 'No definido' 
                  ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                  : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {techStackSummary.frontend}
              </span>
            </div>
            <div className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <Server className="text-green-500" size={16} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Backend</span>
              </div>
              <span className={`font-medium text-sm truncate ml-2 ${
                techStackSummary.backend !== 'No definido' 
                  ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                  : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {techStackSummary.backend}
              </span>
            </div>
            <div className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <Database className="text-blue-500" size={16} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Database</span>
              </div>
              <span className={`font-medium text-sm truncate ml-2 ${
                techStackSummary.database !== 'No definido' 
                  ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                  : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {techStackSummary.database}
              </span>
            </div>
            <div className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2">
                <Zap className="text-purple-500" size={16} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Infra</span>
              </div>
              <span className={`font-medium text-sm truncate ml-2 ${
                techStackSummary.infrastructure !== 'No definido' 
                  ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                  : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {techStackSummary.infrastructure}
              </span>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className={`rounded-xl border p-4 md:p-6 ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            <Shield className="text-green-600 flex-shrink-0" size={18} />
            <span className="truncate">Estado de Seguridad</span>
          </h3>
          <div className="space-y-2 md:space-y-3">
            <div className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <Lock className={`flex-shrink-0 ${securityStatus.hasAuth ? 'text-green-500' : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
                <span className={`text-sm truncate ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Autenticación</span>
              </div>
              <span className={`text-xs md:text-sm font-medium flex-shrink-0 ml-2 ${
                securityStatus.hasAuth 
                  ? 'text-green-600' 
                  : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {securityStatus.authMethod}
              </span>
            </div>
            <div className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <Shield className={`flex-shrink-0 ${securityStatus.hasEncryption ? 'text-green-500' : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
                <span className={`text-sm truncate ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Encriptación</span>
              </div>
              <span className={`text-xs md:text-sm font-medium flex-shrink-0 ml-2 ${
                securityStatus.hasEncryption 
                  ? 'text-green-600' 
                  : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {securityStatus.hasEncryption ? 'Configurado' : 'No config.'}
              </span>
            </div>
            
            <div className={`mt-3 md:mt-4 p-3 md:p-4 rounded-lg ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30'
                : 'bg-gradient-to-r from-green-50 to-blue-50'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle className={`flex-shrink-0 ${securityStatus.hasAuth ? 'text-green-500' : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                <span className={`text-xs md:text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {securityStatus.hasAuth ? 'Autenticación activa' : 'Configura auth en Security'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules & Endpoints Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Modules */}
        <div className={`rounded-xl border p-4 md:p-6 ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            <Package className="text-purple-600 flex-shrink-0" size={18} />
            <span className="truncate">Módulos ({stats?.totalModules || 0})</span>
          </h3>
          {recentModules.length > 0 ? (
            <div className="space-y-2">
              {recentModules.map((module, index) => (
                <div key={index} className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="min-w-0 flex-1 mr-2">
                    <span className={`text-sm md:text-base font-medium block truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>{module.name}</span>
                    <p className={`text-xs mt-0.5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>{module.type || 'core'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    module.status === 'active' 
                      ? theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                      : module.status === 'planned' 
                        ? theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
                        : theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {module.status || 'active'}
                  </span>
                </div>
              ))}
              {stats?.totalModules > 3 && (
                <p className={`text-sm text-center pt-2 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  +{stats.totalModules - 3} módulos más
                </p>
              )}
            </div>
          ) : (
            <div className={`text-center py-6 md:py-8 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              <Package size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay módulos definidos</p>
              <p className="text-xs mt-1 hidden sm:block">Ve a la pestaña Módulos para agregar</p>
            </div>
          )}
        </div>

        {/* Recent Endpoints */}
        <div className={`rounded-xl border p-4 md:p-6 ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            <Workflow className="text-green-600 flex-shrink-0" size={18} />
            <span className="truncate">Endpoints ({stats?.totalEndpoints || 0})</span>
          </h3>
          {recentEndpoints.length > 0 ? (
            <div className="space-y-2">
              {recentEndpoints.map((endpoint, index) => (
                <div key={index} className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
                    <span className={`text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded flex-shrink-0 ${
                      endpoint.method === 'GET' 
                        ? theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
                        : endpoint.method === 'POST' 
                          ? theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                          : endpoint.method === 'PUT' 
                            ? theme === 'dark' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                            : endpoint.method === 'DELETE' 
                              ? theme === 'dark' ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700'
                              : theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className={`font-mono text-xs md:text-sm truncate ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>{endpoint.path}</span>
                  </div>
                  {endpoint.auth_required && (
                    <Lock size={12} className={`flex-shrink-0 ml-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  )}
                </div>
              ))}
              {stats?.totalEndpoints > 5 && (
                <p className={`text-sm text-center pt-2 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  +{stats.totalEndpoints - 5} endpoints más
                </p>
              )}
            </div>
          ) : (
            <div className={`text-center py-6 md:py-8 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              <Workflow size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay endpoints definidos</p>
              <p className="text-xs mt-1 hidden sm:block">Ve a la pestaña Endpoints para agregar</p>
            </div>
          )}
        </div>
      </div>

      {/* Integrations & Decisions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Integrations Summary */}
        <div className={`rounded-xl border p-4 md:p-6 ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            <Plug className="text-orange-600 flex-shrink-0" size={18} />
            <span className="truncate">Integraciones ({stats?.totalIntegrations || 0})</span>
          </h3>
          {(architecture?.integrations || []).length > 0 ? (
            <div className="space-y-2">
              {(architecture?.integrations || []).slice(0, 4).map((integration, index) => (
                <div key={index} className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="min-w-0 flex-1 mr-2">
                    <span className={`text-sm md:text-base font-medium block truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>{integration.name}</span>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>{integration.type}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    integration.status === 'active' 
                      ? theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                      : integration.status === 'configured' 
                        ? theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
                        : theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {integration.status || 'pending'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-6 md:py-8 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              <Plug size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay integraciones</p>
              <p className="text-xs mt-1 hidden sm:block">Ve a la pestaña Integraciones para agregar</p>
            </div>
          )}
        </div>

        {/* Recent Decisions (ADRs) */}
        <div className={`rounded-xl border p-4 md:p-6 ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            <FileText className="text-pink-600 flex-shrink-0" size={18} />
            <span className="truncate">Decisiones ({stats?.totalDecisions || 0})</span>
          </h3>
          {recentDecisions.length > 0 ? (
            <div className="space-y-2">
              {recentDecisions.map((decision, index) => (
                <div key={index} className={`p-2 md:p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-sm md:text-base font-medium truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>{decision.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                      decision.status === 'accepted' 
                        ? theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                        : decision.status === 'proposed' 
                          ? theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
                          : decision.status === 'deprecated' 
                            ? theme === 'dark' ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700'
                            : theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {decision.status || 'proposed'}
                    </span>
                  </div>
                  <p className={`text-xs line-clamp-2 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>{decision.context}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-6 md:py-8 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              <FileText size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay decisiones</p>
              <p className="text-xs mt-1 hidden sm:block">Ve a la pestaña Decisiones para agregar ADRs</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className={`rounded-xl p-4 md:p-6 border ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-800'
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100'
      }`}>
        <h3 className={`text-base md:text-lg font-semibold mb-3 flex items-center gap-2 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`}>
          <TrendingUp className="text-blue-600 flex-shrink-0" size={18} />
          <span className="truncate">Próximos Pasos</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
          {stats?.completenessScore < 25 && (
            <div className={`p-2 md:p-3 rounded-lg border flex items-start gap-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-blue-800' 
                : 'bg-white border-blue-100'
            }`}>
              <Boxes className="text-blue-500 mt-0.5 flex-shrink-0" size={14} />
              <div className="min-w-0">
                <span className={`font-medium text-xs md:text-sm block truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Define el Tech Stack</span>
                <p className={`text-xs hidden sm:block ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>Configura las tecnologías</p>
              </div>
            </div>
          )}
          {stats?.totalModules === 0 && (
            <div className={`p-2 md:p-3 rounded-lg border flex items-start gap-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-purple-800' 
                : 'bg-white border-purple-100'
            }`}>
              <Package className="text-purple-500 mt-0.5 flex-shrink-0" size={14} />
              <div className="min-w-0">
                <span className={`font-medium text-xs md:text-sm block truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Agrega Módulos</span>
                <p className={`text-xs hidden sm:block ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>Define los componentes</p>
              </div>
            </div>
          )}
          {stats?.totalEndpoints === 0 && (
            <div className={`p-2 md:p-3 rounded-lg border flex items-start gap-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-green-800' 
                : 'bg-white border-green-100'
            }`}>
              <Workflow className="text-green-500 mt-0.5 flex-shrink-0" size={14} />
              <div className="min-w-0">
                <span className={`font-medium text-xs md:text-sm block truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Documenta Endpoints</span>
                <p className={`text-xs hidden sm:block ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>Lista los endpoints de tu API</p>
              </div>
            </div>
          )}
          {stats?.totalIntegrations === 0 && (
            <div className={`p-2 md:p-3 rounded-lg border flex items-start gap-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-orange-800' 
                : 'bg-white border-orange-100'
            }`}>
              <Plug className="text-orange-500 mt-0.5 flex-shrink-0" size={14} />
              <div className="min-w-0">
                <span className={`font-medium text-xs md:text-sm block truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Configura Integraciones</span>
                <p className={`text-xs hidden sm:block ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>Añade servicios externos</p>
              </div>
            </div>
          )}
          {stats?.totalDecisions === 0 && (
            <div className={`p-2 md:p-3 rounded-lg border flex items-start gap-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-pink-800' 
                : 'bg-white border-pink-100'
            }`}>
              <FileText className="text-pink-500 mt-0.5 flex-shrink-0" size={14} />
              <div className="min-w-0">
                <span className={`font-medium text-xs md:text-sm block truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Documenta Decisiones</span>
                <p className={`text-xs hidden sm:block ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>Registra ADRs importantes</p>
              </div>
            </div>
          )}
          {!securityStatus.hasAuth && (
            <div className={`p-2 md:p-3 rounded-lg border flex items-start gap-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-red-800' 
                : 'bg-white border-red-100'
            }`}>
              <Shield className="text-red-500 mt-0.5 flex-shrink-0" size={14} />
              <div className="min-w-0">
                <span className={`font-medium text-xs md:text-sm block truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Configura Seguridad</span>
                <p className={`text-xs hidden sm:block ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>Define autenticación</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
