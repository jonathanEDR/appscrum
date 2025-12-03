/**
 * ChatPanel - Panel principal de chat con diseño premium
 */

import { X, Package } from 'lucide-react';
import { ChatContainer } from '../chat/ChatContainer';
import { ChatInput } from '../chat/ChatInput';
import { QuickActions } from '../chat/QuickActions';

export const ChatPanel = ({ chatHook }) => {
  const {
    messages,
    isLoading,
    isTyping,
    selectedProduct,
    selectProduct,
    sendMessage,
    clearHistory,
    openCanvas,
    hasArchitecture,
    showEditSections,
    toggleEditSections,
    checkArchitecture,
    setEditSection  // Nueva función para establecer sección de edición
  } = chatHook;

  // Manejar acciones rápidas
  const handleQuickAction = (message, actionId) => {
    if (actionId === 'toggle_sections') {
      toggleEditSections();
      return;
    }
    
    // Mapear actionId a sección de edición
    const sectionMap = {
      'edit_structure': 'structure',
      'edit_database': 'database',
      'edit_endpoints': 'endpoints',
      'edit_modules': 'modules'
    };
    
    // Si es una acción de edición de sección, activar la sección
    if (sectionMap[actionId] && setEditSection) {
      setEditSection(sectionMap[actionId]);
    }
    
    // Enviar mensaje al chat
    sendMessage(message);
    
    // Si se creó/editó arquitectura, refrescar estado
    if (actionId.includes('architecture') || actionId.includes('edit')) {
      setTimeout(() => {
        if (selectedProduct?._id) {
          checkArchitecture(selectedProduct._id);
        }
      }, 3000);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-transparent via-white/30 to-white/50 dark:from-transparent dark:via-gray-900/30 dark:to-gray-900/50">
      {/* Selected Product Banner */}
      {selectedProduct && (
        <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 border-b border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                <Package className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-900 dark:text-emerald-100">
                  Producto seleccionado:
                </p>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {selectedProduct.nombre}
                </p>
              </div>
            </div>
            <button
              onClick={() => selectProduct(null)}
              className="p-1 rounded hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
              title="Deseleccionar producto"
            >
              <X className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <ChatContainer
        messages={messages}
        isTyping={isTyping}
        onClearHistory={clearHistory}
        onOpenCanvas={openCanvas}
        onSendMessage={sendMessage}
        selectedProduct={selectedProduct}
      />

      {/* Quick Actions - Solo si hay producto seleccionado */}
      <QuickActions
        hasArchitecture={hasArchitecture}
        showEditSections={showEditSections}
        selectedProduct={selectedProduct}
        onAction={handleQuickAction}
      />

      {/* Chat Input */}
      <ChatInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
