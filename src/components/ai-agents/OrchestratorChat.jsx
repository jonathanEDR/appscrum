/**
 * OrchestratorChat Component
 * Interfaz de chat para interactuar con el orquestador AI
 * - Historial de conversación persistente
 * - Envío de mensajes con contexto
 * - Indicador de typing
 * - Auto-scroll
 * - Mensajes de bienvenida
 */

import { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Info, AlertCircle, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useTheme } from '../../context/ThemeContext';
import { aiAgentsService } from '../../services/aiAgentsService';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ContextSelector } from './ContextSelector';

export const OrchestratorChat = () => {
  const { theme } = useTheme();
  const { getToken } = useAuth();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Estados
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState(null);
  const [showContextSelector, setShowContextSelector] = useState(false);
  const [error, setError] = useState(null);

  // Cargar historial del localStorage al montar
  useEffect(() => {
    const savedMessages = localStorage.getItem('orchestrator_chat_history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (error) {
        console.error('Error al cargar historial:', error);
      }
    } else {
      // Mensaje de bienvenida inicial
      setMessages([
        {
          id: 'welcome',
          message: `¡Hola! 👋 Soy el **Orquestador de AppScrum**.

Puedo ayudarte con:
- 📋 Crear y gestionar historias de usuario
- 🎯 Priorizar el backlog
- 📊 Analizar métricas del sprint
- 🔄 Coordinar tareas entre agentes especializados
- 💡 Sugerir mejoras en tus procesos Scrum

Para comenzar, puedes adjuntar contexto (producto, sprint) usando el botón 📎 o simplemente escribe tu pregunta.`,
          isUser: false,
          timestamp: new Date().toISOString(),
          status: 'sent'
        }
      ]);
    }
  }, []);

  // Guardar historial en localStorage cuando cambie
  useEffect(() => {
    if (messages.length > 0 && messages[0].id !== 'welcome') {
      localStorage.setItem('orchestrator_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll al final
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Enviar mensaje
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: `user-${Date.now()}`,
      message: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      // Enviar al backend
      const response = await aiAgentsService.sendChatMessage(
        messageText,
        context || {},
        getToken
      );

      // Actualizar estado del mensaje del usuario
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id
            ? { ...msg, status: 'sent' }
            : msg
        )
      );

      // Agregar respuesta del orquestador
      const agentMessage = {
        id: `agent-${Date.now()}`,
        message: response.response || 'Lo siento, no pude procesar tu solicitud.',
        isUser: false,
        timestamp: new Date().toISOString(),
        status: 'sent',
        metadata: response.metadata
      };

      // Simular typing delay
      setTimeout(() => {
        setMessages(prev => [...prev, agentMessage]);
        setIsTyping(false);
      }, 800);

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      // Marcar mensaje de usuario como error
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id
            ? { ...msg, status: 'error' }
            : msg
        )
      );

      // Mostrar mensaje de error
      setError(error.message || 'Error al comunicarse con el orquestador');
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Adjuntar contexto
  const handleAttachContext = () => {
    setShowContextSelector(true);
  };

  // Seleccionar contexto
  const handleSelectContext = (selectedContext) => {
    setContext(selectedContext);
    
    // Agregar mensaje del sistema informando del contexto
    const contextMessage = {
      id: `system-${Date.now()}`,
      message: `✅ Contexto actualizado: ${getContextDescription(selectedContext)}`,
      isUser: false,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, contextMessage]);
  };

  // Limpiar conversación
  const handleClearChat = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar el historial del chat?')) {
      setMessages([
        {
          id: 'welcome',
          message: `Historial limpiado. ¿En qué puedo ayudarte?`,
          isUser: false,
          timestamp: new Date().toISOString(),
          status: 'sent'
        }
      ]);
      setContext(null);
      localStorage.removeItem('orchestrator_chat_history');
    }
  };

  // Reintentar mensaje fallido
  const handleRetry = () => {
    const lastUserMessage = messages.filter(m => m.isUser).pop();
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.message);
    }
  };

  // Obtener descripción del contexto
  const getContextDescription = (ctx) => {
    if (!ctx) return 'Ninguno';
    
    const parts = [];
    if (ctx.product_id) parts.push('Producto seleccionado');
    if (ctx.sprint_id) parts.push('Sprint seleccionado');
    if (ctx.backlog_items?.length > 0) parts.push(`${ctx.backlog_items.length} elemento(s) del backlog`);
    
    return parts.length > 0 ? parts.join(', ') : 'Ninguno';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`
        flex items-center justify-between p-4 border-b
        ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
          </div>
          <div>
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Orquestador AI
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Activo y listo para ayudar</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Indicador de contexto */}
          {context && (
            <div className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
              ${theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}
            `}>
              <Info className="w-3 h-3" />
              <span>Contexto: {getContextDescription(context)}</span>
            </div>
          )}

          {/* Botón limpiar */}
          <button
            onClick={handleClearChat}
            className={`
              p-2 rounded-xl transition-colors
              ${theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }
            `}
            title="Limpiar conversación"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={chatContainerRef}
        className={`
          flex-1 overflow-y-auto p-4 space-y-4
          ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}
        `}
      >
        {/* Mensajes */}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.message}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
            status={msg.status}
            agentName="Orquestador"
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              ${theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-200 border border-gray-300'}
            `}>
              <Bot className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div className={`
              flex items-center space-x-2 px-4 py-3 rounded-2xl
              ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}
            `}>
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-600'}`} style={{ animationDelay: '0ms' }} />
                <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-600'}`} style={{ animationDelay: '150ms' }} />
                <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-600'}`} style={{ animationDelay: '300ms' }} />
              </div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Orquestador está escribiendo...
              </span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className={`
            flex items-start gap-3 p-4 rounded-xl border-2
            ${theme === 'dark'
              ? 'bg-red-900/20 border-red-800 text-red-400'
              : 'bg-red-50 border-red-200 text-red-600'
            }
          `}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Error al procesar el mensaje</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={handleRetry}
                className={`
                  flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${theme === 'dark'
                    ? 'bg-red-800 hover:bg-red-700 text-white'
                    : 'bg-red-100 hover:bg-red-200 text-red-700'
                  }
                `}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reintentar</span>
              </button>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`
        p-4 border-t
        ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        <ChatInput
          onSendMessage={handleSendMessage}
          onAttachContext={handleAttachContext}
          isLoading={isLoading}
          hasContext={!!context}
          placeholder="Pregunta al orquestador..."
        />
      </div>

      {/* Context Selector Modal */}
      <ContextSelector
        isOpen={showContextSelector}
        onClose={() => setShowContextSelector(false)}
        onSelectContext={handleSelectContext}
        initialContext={context}
      />
    </div>
  );
};
