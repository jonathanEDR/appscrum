/**
 * ScrumAILayout - Layout principal del módulo SCRUM AI
 * Diseño moderno con soporte para Canvas
 */

import { useState } from 'react';
import { 
  History, 
  Plus, 
  Sparkles,
  MessageSquare,
  Zap,
  LayoutGrid,
  ChevronDown,
  Package,
  FileCode,
  Users,
  Layers,
  ListChecks
} from 'lucide-react';
import { ChatPanel } from './ChatPanel';
import { ConversationsHistory } from '../history/ConversationsHistory';
import { CanvasPanel } from '../canvas/CanvasPanel';
import { useScrumAIChat } from '../../../hooks/useScrumAIChat';

export const ScrumAILayout = () => {
  const chatHook = useScrumAIChat();
  const { 
    loadConversation, 
    startNewConversation, 
    activeConversation,
    canvasData,
    selectedProduct,
    selectProduct,
    closeCanvas,
    refreshCanvas,
    isLoading,
    openCanvas,            // ✅ Función para abrir canvas
    activeEditSection,     // ✅ Sección activa de edición
    sendMessage            // ✅ Función para enviar mensajes
  } = chatHook;
  const [showHistory, setShowHistory] = useState(false);
  const [showCanvasMenu, setShowCanvasMenu] = useState(false);  // ✅ Nuevo estado

  const handleSelectConversation = async (conversation) => {
    try {
      await loadConversation(conversation.id);
      setShowHistory(false);
    } catch (error) {
      console.error('Error al cargar conversación:', error);
    }
  };

  const handleNewConversation = () => {
    startNewConversation();
    setShowHistory(false);
  };

  // Handler para acciones de arquitectura desde ProductsCanvas
  const handleArchitectureAction = (product, action) => {
    // Primero seleccionamos el producto
    if (product && selectProduct) {
      selectProduct(product);
    }
    
    // Luego enviamos el mensaje correspondiente
    const messages = {
      'create': `Quiero crear la arquitectura para el producto ${product.nombre}`,
      'view': `Muéstrame la arquitectura del producto ${product.nombre}`,
      'edit': `Quiero editar la arquitectura del producto ${product.nombre}`
    };
    
    if (messages[action] && sendMessage) {
      sendMessage(messages[action]);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20">
      {/* History Panel - Sidebar izquierdo */}
      <div
        className={`
          ${showHistory ? 'w-80' : 'w-0'} 
          transition-all duration-300 ease-out
          border-r border-gray-200/60 dark:border-gray-800/60
          bg-white/80 dark:bg-gray-950/80
          backdrop-blur-xl
          overflow-hidden
          flex-shrink-0
        `}
      >
        {showHistory && (
          <ConversationsHistory
            onClose={() => setShowHistory(false)}
            onSelectConversation={handleSelectConversation}
          />
        )}
      </div>

      {/* Chat Panel - Centro */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Premium */}
        <header className="h-18 border-b border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Botones de acción */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100/80 dark:bg-gray-800/80">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`
                  p-2.5 rounded-lg transition-all duration-200
                  ${showHistory 
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                    : 'hover:bg-white/60 dark:hover:bg-gray-700/60 text-gray-600 dark:text-gray-400'
                  }
                `}
                title="Historial de conversaciones"
              >
                <History className="w-5 h-5" />
              </button>

              <button
                onClick={handleNewConversation}
                className="p-2.5 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/60 text-gray-600 dark:text-gray-400 transition-all duration-200"
                title="Nueva conversación"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-950 animate-pulse"></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                    SCRUM AI
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                    Beta
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  Asistente inteligente de Scrum
                </p>
              </div>
            </div>
          </div>

          {/* Status y canvas indicator */}
          <div className="flex items-center gap-4">
            {/* ✅ NUEVO: Botón menú para abrir canvas */}
            <div className="relative">
              <button
                onClick={() => setShowCanvasMenu(!showCanvasMenu)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all
                  ${canvasData 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                title="Abrir canvas"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-xs font-medium hidden md:inline">
                  {canvasData ? 'Canvas activo' : 'Ver Canvas'}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showCanvasMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showCanvasMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowCanvasMenu(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Abrir Canvas
                    </p>
                    
                    <button
                      onClick={() => {
                        openCanvas({ message: 'productos' });
                        setShowCanvasMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Package className="w-4 h-4 text-blue-500" />
                      <span>Productos</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        openCanvas({ message: 'backlog historias' });
                        setShowCanvasMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ListChecks className="w-4 h-4 text-amber-500" />
                      <span>Backlog</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        openCanvas({ message: 'sprints' });
                        setShowCanvasMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Layers className="w-4 h-4 text-purple-500" />
                      <span>Sprints</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        openCanvas({ message: 'equipo miembros' });
                        setShowCanvasMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Users className="w-4 h-4 text-green-500" />
                      <span>Equipo</span>
                    </button>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                    
                    <button
                      onClick={() => {
                        openCanvas({ message: 'arquitectura módulos tech_stack' });
                        setShowCanvasMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <FileCode className="w-4 h-4 text-indigo-500" />
                      <span>Arquitectura</span>
                      {selectedProduct && (
                        <span className="ml-auto text-xs text-gray-400">
                          ({selectedProduct.nombre?.substring(0, 15)}...)
                        </span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {activeConversation && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200/60 dark:border-indigo-800/60">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300 max-w-32 truncate">
                  {activeConversation.title}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200/60 dark:border-green-800/60">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                En línea
              </span>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <ChatPanel chatHook={chatHook} />
      </div>

      {/* Canvas Panel - Sidebar derecho */}
      {canvasData && (
        <CanvasPanel
          canvasData={canvasData}
          selectedProduct={selectedProduct}
          onSelectProduct={selectProduct}
          onClose={closeCanvas}
          onRefresh={refreshCanvas}
          isLoading={isLoading}
          editSection={activeEditSection}
          onArchitectureAction={handleArchitectureAction}
        />
      )}
    </div>
  );
};
