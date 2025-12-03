/**
 * ChatContainer - Contenedor de mensajes con diseño moderno
 */

import { useRef, useEffect } from 'react';
import { Trash2, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { QuickStartActions } from './QuickStartActions';

export const ChatContainer = ({ messages, isTyping, onClearHistory, onOpenCanvas, onSendMessage, selectedProduct }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Mostrar Quick Actions cuando no hay mensajes
  const showQuickStart = messages.length === 0;

  // Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Detectar scroll para mostrar botón
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Manejar acciones rápidas desde QuickStartActions
  const handleQuickAction = (message, actionId) => {
    if (onSendMessage) {
      onSendMessage(message);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 md:px-8 py-6"
    >
      {/* Contenedor centrado con ancho máximo */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Quick Start Actions - Mostrar cuando no hay mensajes */}
        {showQuickStart && !isTyping && (
          <QuickStartActions 
            onAction={handleQuickAction}
            selectedProduct={selectedProduct}
          />
        )}

        {/* Mensajes del chat */}
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            onOpenCanvas={onOpenCanvas}
            onSendMessage={onSendMessage}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Botón scroll to bottom */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-32 right-8 p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-all duration-200"
          title="Ir al final"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      )}

      {/* Botón limpiar historial */}
      {messages.length > 1 && (
        <button
          onClick={onClearHistory}
          className="fixed bottom-32 left-8 p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 group"
          title="Limpiar historial"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
