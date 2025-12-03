/**
 * AgentDetailsModal Component
 * Modal para mostrar detalles completos de un agente AI
 */

import { X, Bot, Shield, Code, Settings, Info, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AgentDetailsModal = ({ agent, isOpen, onClose, onDelegate }) => {
  const { theme } = useTheme();

  if (!isOpen || !agent) return null;

  // Colores según el tipo de agente
  const typeColors = {
    'product-owner': { 
      bg: 'bg-purple-100 dark:bg-purple-900/30', 
      text: 'text-purple-700 dark:text-purple-300',
      badge: 'bg-purple-500'
    },
    'scrum-master': { 
      bg: 'bg-blue-100 dark:bg-blue-900/30', 
      text: 'text-blue-700 dark:text-blue-300',
      badge: 'bg-blue-500'
    },
    'developer': { 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      text: 'text-green-700 dark:text-green-300',
      badge: 'bg-green-500'
    },
    'orchestrator': { 
      bg: 'bg-orange-100 dark:bg-orange-900/30', 
      text: 'text-orange-700 dark:text-orange-300',
      badge: 'bg-orange-500'
    }
  };

  const colors = typeColors[agent.type] || typeColors['developer'];

  // Formatear nombres de permisos
  const formatPermission = (permission) => {
    return permission
      .split('.')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' > ');
  };

  // Determinar nivel de complejidad
  const getComplexityLevel = () => {
    const permCount = agent.requiredPermissions?.length || 0;
    if (permCount >= 10) return { label: 'Alta', color: 'text-red-600 dark:text-red-400' };
    if (permCount >= 5) return { label: 'Media', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Baja', color: 'text-green-600 dark:text-green-400' };
  };

  const complexity = getComplexityLevel();

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className={`
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden
          flex flex-col
        `}
      >
        {/* Header */}
        <div className={`${colors.bg} px-6 py-4 flex items-start justify-between border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-start space-x-4">
            <div className={`${colors.badge} p-3 rounded-lg`}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {agent.name}
              </h2>
              <p className={`text-sm ${colors.text} font-medium mt-1`}>
                {agent.type.replace('-', ' ').toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`
              p-2 rounded-lg transition-colors
              ${theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}
            `}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Descripción */}
          <section>
            <div className="flex items-center space-x-2 mb-3">
              <Info className={`w-5 h-5 ${colors.text}`} />
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Descripción
              </h3>
            </div>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {agent.description}
            </p>
          </section>

          {/* Capacidades */}
          {agent.capabilities && agent.capabilities.length > 0 && (
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <Zap className={`w-5 h-5 ${colors.text}`} />
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Capacidades
                </h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {agent.capabilities.map((capability, index) => (
                  <li 
                    key={index}
                    className={`
                      flex items-start space-x-2 p-3 rounded-lg
                      ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                    `}
                  >
                    <CheckCircle className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        {typeof capability === 'string' ? capability : capability.name || capability.description}
                      </span>
                      {typeof capability === 'object' && capability.description && capability.name && (
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {capability.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Permisos Requeridos */}
          {agent.requiredPermissions && agent.requiredPermissions.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Shield className={`w-5 h-5 ${colors.text}`} />
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Permisos Requeridos
                  </h3>
                </div>
                <span className={`text-sm font-medium ${complexity.color}`}>
                  Complejidad: {complexity.label}
                </span>
              </div>
              <div className={`
                p-4 rounded-lg border-2 border-dashed
                ${theme === 'dark' ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-300'}
              `}>
                <div className="flex items-start space-x-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Este agente necesita los siguientes permisos para funcionar correctamente
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {agent.requiredPermissions.map((permission, index) => (
                    <div 
                      key={index}
                      className={`
                        flex items-center space-x-2 px-3 py-2 rounded-md
                        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
                      `}
                    >
                      <div className={`w-2 h-2 rounded-full ${colors.badge}`} />
                      <span className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {formatPermission(permission)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Configuración */}
          {agent.configuration && Object.keys(agent.configuration).length > 0 && (
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <Settings className={`w-5 h-5 ${colors.text}`} />
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Configuración
                </h3>
              </div>
              <div className={`
                rounded-lg p-4
                ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
              `}>
                <dl className="space-y-2">
                  {Object.entries(agent.configuration).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </dt>
                      <dd className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          )}

          {/* Ejemplos de Uso */}
          {agent.usageExamples && agent.usageExamples.length > 0 && (
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <Code className={`w-5 h-5 ${colors.text}`} />
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Ejemplos de Uso
                </h3>
              </div>
              <ul className="space-y-3">
                {agent.usageExamples.map((example, index) => (
                  <li 
                    key={index}
                    className={`
                      p-3 rounded-lg border-l-4 ${colors.badge}
                      ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                    `}
                  >
                    <p className={`text-sm italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      "{example}"
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className={`
          px-6 py-4 border-t flex items-center justify-between
          ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}
        `}>
          <button
            onClick={onClose}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'}
            `}
          >
            Cerrar
          </button>
          <button
            onClick={() => onDelegate(agent)}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all
              flex items-center space-x-2
              ${colors.badge} text-white hover:opacity-90
              shadow-lg hover:shadow-xl
            `}
          >
            <Shield className="w-4 h-4" />
            <span>Delegar Permisos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
