/**
 * ScrumAILayout - Layout principal del módulo SCRUM AI
 * Nuevo diseño con sidebar lateral y chat siempre visible
 * Responsive: En móvil muestra botón flotante
 */

import { useState } from 'react';
import { 
  Package,
  X
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { MobileMenu } from './MobileMenu';
import { ChatContainer } from '../chat/ChatContainer';
import { ChatInput } from '../chat/ChatInput';
import { ConversationsHistory } from '../history/ConversationsHistory';
import { CanvasPanel } from '../canvas/CanvasPanel';
import { useScrumAIChat } from '../../../hooks/useScrumAIChat';

export const ScrumAILayout = () => {
  const chatHook = useScrumAIChat();
  const { 
    messages,
    isLoading,
    isTyping,
    loadConversation, 
    startNewConversation, 
    activeConversation,
    canvasData,
    selectedProduct,
    selectedSprint,
    selectProduct,
    selectSprint,
    closeCanvas,
    refreshCanvas,
    openCanvas,
    activeEditSection,
    sendMessage,
    clearHistory
  } = chatHook;

  const [showHistory, setShowHistory] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const handleArchitectureAction = (product, action) => {
    if (product && selectProduct) {
      selectProduct(product);
    }
    
    const actionMessages = {
      'create': `Quiero crear la arquitectura para el producto ${product.nombre}`,
      'view': `Muéstrame la arquitectura del producto ${product.nombre}`,
      'edit': `Quiero editar la arquitectura del producto ${product.nombre}`
    };
    
    if (actionMessages[action] && sendMessage) {
      sendMessage(actionMessages[action]);
    }
  };

  const handleOpenCanvas = (options) => {
    if (openCanvas) {
      openCanvas(options);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20">
      {/* Sidebar - Izquierdo (oculto en móvil) */}
      <div className="hidden md:block">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          showHistory={showHistory}
          onToggleHistory={() => setShowHistory(!showHistory)}
          onNewConversation={handleNewConversation}
          onOpenCanvas={handleOpenCanvas}
          activeConversation={activeConversation}
          selectedProduct={selectedProduct}
        />
      </div>

      {/* Mobile Menu - Solo visible en móvil */}
      <MobileMenu
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory(!showHistory)}
        onNewConversation={handleNewConversation}
        onOpenCanvas={handleOpenCanvas}
        activeConversation={activeConversation}
        selectedProduct={selectedProduct}
      />

      {/* History Panel - Overlay cuando está activo */}
      {showHistory && (
        <div className="absolute left-0 md:left-16 lg:left-64 top-0 bottom-0 z-40 w-80 bg-white dark:bg-gray-950 border-r border-gray-200/60 dark:border-gray-800/60 shadow-2xl">
          <ConversationsHistory
            onClose={() => setShowHistory(false)}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      )}

      {/* Overlay de fondo cuando hay historial */}
      {showHistory && (
        <div 
          className="absolute inset-0 bg-black/20 z-30"
          onClick={() => setShowHistory(false)}
        />
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Producto seleccionado banner - Más discreto */}
        {selectedProduct && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm shadow-lg">
              <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {selectedProduct.nombre}
              </span>
              <button
                onClick={() => selectProduct(null)}
                className="ml-1 p-0.5 rounded-full hover:bg-emerald-500/20 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <ChatContainer
          messages={messages}
          isTyping={isTyping}
          onClearHistory={clearHistory}
          onOpenCanvas={handleOpenCanvas}
          onSendMessage={sendMessage}
          selectedProduct={selectedProduct}
          selectedSprint={selectedSprint}
        />

        {/* Chat Input - Siempre visible */}
        <div className="border-t border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Canvas Panel - Derecho */}
      {canvasData && (
        <CanvasPanel
          canvasData={canvasData}
          selectedProduct={selectedProduct}
          selectedSprint={selectedSprint}
          onSelectProduct={selectProduct}
          onSelectSprint={selectSprint}
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
