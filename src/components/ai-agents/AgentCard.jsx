/**
 * AgentCard Component
 * Card para mostrar información de un agente AI
 */

import React from 'react';
import { Bot, Check, Zap, Shield, ChevronRight, Eye } from 'lucide-react';

const AgentCard = ({ 
  agent, 
  hasDelegation = false,
  onDelegate, 
  onViewDetails,
  theme = 'light' 
}) => {
  // Mapeo de tipos de agente a colores
  const typeColors = {
    product_owner: {
      gradient: 'from-blue-500 to-cyan-500',
      bg: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
      border: theme === 'dark' ? 'border-blue-700' : 'border-blue-200',
      text: theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
    },
    scrum_master: {
      gradient: 'from-purple-500 to-pink-500',
      bg: theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50',
      border: theme === 'dark' ? 'border-purple-700' : 'border-purple-200',
      text: theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
    },
    developer: {
      gradient: 'from-green-500 to-emerald-500',
      bg: theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50',
      border: theme === 'dark' ? 'border-green-700' : 'border-green-200',
      text: theme === 'dark' ? 'text-green-400' : 'text-green-600'
    },
    tester: {
      gradient: 'from-orange-500 to-red-500',
      bg: theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50',
      border: theme === 'dark' ? 'border-orange-700' : 'border-orange-200',
      text: theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
    },
    custom: {
      gradient: 'from-gray-500 to-slate-500',
      bg: theme === 'dark' ? 'bg-gray-900/20' : 'bg-gray-50',
      border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
      text: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    }
  };

  const colors = typeColors[agent.type] || typeColors.custom;

  // Estados del agente
  const statusConfig = {
    active: {
      label: 'Activo',
      color: theme === 'dark' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-green-100 text-green-800 border-green-200',
      icon: '✓'
    },
    inactive: {
      label: 'Inactivo',
      color: theme === 'dark' ? 'bg-gray-700/30 text-gray-400 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-200',
      icon: '○'
    },
    training: {
      label: 'En Entrenamiento',
      color: theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' : 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: '⚡'
    },
    deprecated: {
      label: 'Obsoleto',
      color: theme === 'dark' ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-red-100 text-red-700 border-red-200',
      icon: '⚠'
    }
  };

  const status = statusConfig[agent.status] || statusConfig.inactive;

  return (
    <div 
      className={`relative rounded-2xl border-2 ${colors.border} ${colors.bg} overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group`}
    >
      {/* Header con gradiente */}
      <div className={`relative h-24 bg-gradient-to-r ${colors.gradient} p-6`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{agent.display_name}</h3>
              <p className="text-white/80 text-xs">v{agent.version || '1.0.0'}</p>
            </div>
          </div>
          
          {/* Badge de estado */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
            {status.icon} {status.label}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-4">
        {/* Descripción */}
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} line-clamp-3`}>
          {agent.description}
        </p>

        {/* Capabilities */}
        {agent.capabilities && agent.capabilities.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className={colors.text} size={16} />
              <span className={`text-xs font-semibold ${colors.text}`}>
                Capacidades ({agent.capabilities.length})
              </span>
            </div>
            <div className="space-y-1">
              {agent.capabilities.slice(0, 3).map((cap, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}`}></div>
                  <span className="line-clamp-1">{cap.name || cap.key}</span>
                </div>
              ))}
              {agent.capabilities.length > 3 && (
                <span className={`text-xs ${colors.text} font-medium`}>
                  +{agent.capabilities.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Estado de delegación */}
        {hasDelegation && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
            <Check className="text-green-500" size={16} />
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
              Permisos delegados
            </span>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onViewDetails(agent)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200 ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Eye size={16} />
            <span className="text-sm font-medium">Detalles</span>
          </button>

          {agent.status === 'active' && (
            <button
              onClick={() => onDelegate(agent)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 bg-gradient-to-r ${colors.gradient} text-white hover:shadow-lg hover:scale-[1.02] font-medium`}
            >
              {hasDelegation ? (
                <>
                  <Shield size={16} />
                  <span className="text-sm">Gestionar</span>
                </>
              ) : (
                <>
                  <Shield size={16} />
                  <span className="text-sm">Delegar</span>
                </>
              )}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Indicador de hover */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
    </div>
  );
};

export default AgentCard;
