/**
 * Sidebar - Barra lateral del módulo SCRUM AI
 * Contiene navegación, acciones rápidas y historial
 */

import { useState } from 'react';
import { 
  Sparkles, 
  History, 
  Plus, 
  Package, 
  ListTodo, 
  Users,
  Layers,
  FileCode,
  ChevronLeft,
  ChevronRight,
  Zap,
  LayoutGrid,
  MessageSquare,
  Settings,
  HelpCircle
} from 'lucide-react';

export const Sidebar = ({ 
  isCollapsed, 
  onToggleCollapse,
  showHistory,
  onToggleHistory,
  onNewConversation,
  onOpenCanvas,
  activeConversation,
  selectedProduct
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const canvasActions = [
    { id: 'products', icon: Package, label: 'Productos', color: 'text-emerald-500', message: 'productos' },
    { id: 'backlog', icon: ListTodo, label: 'Backlog', color: 'text-amber-500', message: 'backlog historias' },
    { id: 'sprints', icon: Layers, label: 'Sprints', color: 'text-purple-500', message: 'sprints' },
    { id: 'team', icon: Users, label: 'Equipo', color: 'text-blue-500', message: 'equipo miembros' },
    { id: 'architecture', icon: FileCode, label: 'Arquitectura', color: 'text-indigo-500', message: 'arquitectura módulos tech_stack' },
  ];

  return (
    <aside 
      className={`
        ${isCollapsed ? 'w-16' : 'w-64'} 
        h-full flex flex-col
        bg-white dark:bg-gray-950
        border-r border-gray-200/60 dark:border-gray-800/60
        transition-all duration-300 ease-out
        flex-shrink-0
      `}
    >
      {/* Header con Logo */}
      <div className={`
        h-16 flex items-center gap-3 px-4
        border-b border-gray-200/60 dark:border-gray-800/60
      `}>
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-950"></div>
        </div>
        
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                SCRUM AI
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                Beta
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
              <Zap className="w-2.5 h-2.5 text-amber-500" />
              Asistente inteligente
            </p>
          </div>
        )}
      </div>

      {/* Acciones principales */}
      <div className="p-3 space-y-1.5 border-b border-gray-200/60 dark:border-gray-800/60">
        {/* Nueva conversación */}
        <button
          onClick={onNewConversation}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            bg-gradient-to-r from-indigo-500 to-purple-600
            text-white font-medium text-sm
            hover:from-indigo-600 hover:to-purple-700
            transition-all duration-200 shadow-md hover:shadow-lg
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title="Nueva conversación"
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span>Nueva conversación</span>}
        </button>

        {/* Historial */}
        <button
          onClick={onToggleHistory}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            ${showHistory 
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }
            transition-all duration-200 text-sm
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title="Historial"
        >
          <History className="w-4 h-4" />
          {!isCollapsed && <span>Historial</span>}
        </button>
      </div>

      {/* Canvas Actions */}
      <div className="flex-1 p-3 overflow-y-auto">
        {!isCollapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Canvas
          </p>
        )}
        
        <div className="space-y-1">
          {canvasActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onOpenCanvas({ message: action.message })}
                onMouseEnter={() => setHoveredItem(action.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg
                  text-gray-700 dark:text-gray-300 text-sm
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  transition-all duration-200
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={action.label}
              >
                <Icon className={`w-4 h-4 ${action.color}`} />
                {!isCollapsed && <span>{action.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Producto Seleccionado */}
      {selectedProduct && !isCollapsed && (
        <div className="p-3 border-t border-gray-200/60 dark:border-gray-800/60">
          <div className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Producto activo
            </p>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 truncate">
              {selectedProduct.nombre}
            </p>
          </div>
        </div>
      )}

      {/* Conversación activa */}
      {activeConversation && !isCollapsed && (
        <div className="p-3 border-t border-gray-200/60 dark:border-gray-800/60">
          <div className="px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3 h-3 text-indigo-500" />
              <p className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Conversación
              </p>
            </div>
            <p className="text-xs text-indigo-800 dark:text-indigo-200 truncate mt-0.5">
              {activeConversation.title}
            </p>
          </div>
        </div>
      )}

      {/* Footer - Toggle collapse */}
      <div className="p-3 border-t border-gray-200/60 dark:border-gray-800/60">
        <button
          onClick={onToggleCollapse}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg
            text-gray-500 dark:text-gray-400 text-sm
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Expandir' : 'Contraer'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Contraer</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
