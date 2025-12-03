/**
 * ChatInput Component
 * Input de chat con funcionalidades avanzadas
 * - Envío con Enter
 * - Nueva línea con Shift+Enter
 * - Contador de caracteres
 * - Botón de adjuntar contexto
 * - Loading state
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ChatInput = ({ 
  onSendMessage, 
  onAttachContext,
  isLoading = false,
  placeholder = "Escribe tu mensaje...",
  maxLength = 2000,
  hasContext = false
}) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [message]);

  // Handler para enviar mensaje
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;

    onSendMessage(trimmedMessage);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Handler para teclas
  const handleKeyDown = (e) => {
    // Enter sin Shift = enviar
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handler para cambio de texto
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setMessage(newValue);
    }
  };

  // Calcular porcentaje de caracteres usados
  const charPercentage = (message.length / maxLength) * 100;
  const isNearLimit = charPercentage > 80;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Input Container */}
      <div className={`
        relative rounded-2xl border-2 transition-all
        ${theme === 'dark'
          ? 'bg-gray-700 border-gray-600 focus-within:border-purple-500'
          : 'bg-white border-gray-300 focus-within:border-purple-500'
        }
        ${isLoading ? 'opacity-50 pointer-events-none' : ''}
      `}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className={`
            w-full px-4 py-3 pr-24 resize-none rounded-2xl
            focus:outline-none transition-colors
            ${theme === 'dark'
              ? 'bg-transparent text-white placeholder-gray-500'
              : 'bg-transparent text-gray-900 placeholder-gray-400'
            }
          `}
          style={{ maxHeight: '200px', minHeight: '48px' }}
        />

        {/* Action Buttons */}
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          {/* Botón de adjuntar contexto */}
          <button
            type="button"
            onClick={onAttachContext}
            disabled={isLoading}
            className={`
              p-2 rounded-xl transition-all
              ${hasContext
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : theme === 'dark'
                  ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            title={hasContext ? 'Contexto adjunto' : 'Adjuntar contexto'}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Botón de enviar */}
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className={`
              p-2 rounded-xl transition-all transform
              ${message.trim() && !isLoading
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 hover:from-purple-600 hover:to-blue-600'
                : theme === 'dark'
                  ? 'bg-gray-600 text-gray-400'
                  : 'bg-gray-200 text-gray-400'
              }
              disabled:cursor-not-allowed disabled:transform-none
            `}
            title="Enviar mensaje (Enter)"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between px-2">
        {/* Hint */}
        <p className="text-xs text-gray-500">
          <kbd className={`px-1.5 py-0.5 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            Enter
          </kbd>
          {' '}para enviar •{' '}
          <kbd className={`px-1.5 py-0.5 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            Shift + Enter
          </kbd>
          {' '}para nueva línea
        </p>

        {/* Contador de caracteres */}
        <span className={`
          text-xs font-medium
          ${isNearLimit
            ? 'text-orange-500'
            : theme === 'dark'
              ? 'text-gray-500'
              : 'text-gray-400'
          }
        `}>
          {message.length} / {maxLength}
        </span>
      </div>

      {/* Advertencia si está cerca del límite */}
      {isNearLimit && (
        <div className={`
          text-xs px-3 py-2 rounded-lg
          ${theme === 'dark'
            ? 'bg-orange-900/20 text-orange-400 border border-orange-800'
            : 'bg-orange-50 text-orange-600 border border-orange-200'
          }
        `}>
          ⚠️ Llegando al límite de caracteres
        </div>
      )}
    </form>
  );
};
