/**
 * MobileMenu - Menú flotante para pantallas móviles
 * Botón flotante en esquina inferior derecha con acceso rápido a todas las funciones
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
  X,
  Menu,
  Zap
} from 'lucide-react';

export const MobileMenu = ({ 
  showHistory,
  onToggleHistory,
  onNewConversation,
  onOpenCanvas,
  activeConversation,
  selectedProduct
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const canvasActions = [
    { id: 'products', icon: Package, label: 'Productos', color: 'bg-emerald-500', message: 'productos' },
    { id: 'backlog', icon: ListTodo, label: 'Backlog', color: 'bg-amber-500', message: 'backlog historias' },
    { id: 'sprints', icon: Layers, label: 'Sprints', color: 'bg-purple-500', message: 'sprints' },
    { id: 'team', icon: Users, label: 'Equipo', color: 'bg-blue-500', message: 'equipo miembros' },
    { id: 'architecture', icon: FileCode, label: 'Arquitectura', color: 'bg-indigo-500', message: 'arquitectura módulos tech_stack' },
  ];

  const handleAction = (action) => {
    onOpenCanvas({ message: action.message });
    setIsOpen(false);
  };

  const handleNewConversation = () => {
    onNewConversation();
    setIsOpen(false);
  };

  const handleToggleHistory = () => {
    onToggleHistory();
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay de fondo */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menú expandido */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 md:hidden">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-72 animate-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-900 dark:text-white">SCRUM AI</h2>
                  <span className="px-1.5 py-0.5 text-[8px] font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                    Beta
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-500" />
                  Asistente inteligente
                </p>
              </div>
            </div>

            {/* Acciones principales */}
            <div className="space-y-2 mb-3">
              <button
                onClick={handleNewConversation}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva conversación</span>
              </button>

              <button
                onClick={handleToggleHistory}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  showHistory 
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Ver historial</span>
              </button>
            </div>

            {/* Canvas Actions */}
            <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Abrir Canvas
            </p>
            <div className="grid grid-cols-3 gap-2">
              {canvasActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    title={action.label}
                  >
                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Producto seleccionado */}
            {selectedProduct && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase">
                    Producto activo
                  </p>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 truncate">
                    {selectedProduct.nombre}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botón flotante principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50 md:hidden
          w-14 h-14 rounded-full
          ${isOpen 
            ? 'bg-gray-800 dark:bg-gray-200' 
            : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
          }
          flex items-center justify-center
          shadow-2xl shadow-indigo-500/40
          transition-all duration-300
          hover:scale-105 active:scale-95
        `}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white dark:text-gray-900" />
        ) : (
          <div className="relative">
            <Sparkles className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
        )}
      </button>
    </>
  );
};
