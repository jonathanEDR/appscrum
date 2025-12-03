/**
 * ChatInput - Input de mensajes con diseño moderno
 */

import { useState, useRef } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

export const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 pb-6 md:pb-4">
      <div 
        className={`
          relative flex items-end gap-2 md:gap-3 p-2 rounded-2xl transition-all duration-300
          ${isFocused 
            ? 'bg-white dark:bg-gray-900 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/50' 
            : 'bg-gray-100/80 dark:bg-gray-800/80'
          }
        `}
      >
        {/* Ícono decorativo - Oculto en móvil */}
        <div className="hidden md:flex flex-shrink-0 p-2">
          <Sparkles className={`w-5 h-5 transition-colors ${isFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
        </div>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Pregunta sobre Scrum..."
            disabled={isLoading}
            className="
              w-full px-2 py-2
              bg-transparent
              text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none
              resize-none
              max-h-36
              disabled:opacity-50 disabled:cursor-not-allowed
              text-sm md:text-[15px] leading-relaxed
            "
            rows={1}
            style={{ minHeight: '44px' }}
          />
        </div>

        {/* Character count */}
        {message.length > 100 && (
          <span className={`absolute bottom-3 right-16 text-xs hidden md:block ${message.length > 1800 ? 'text-red-500' : 'text-gray-400'}`}>
            {message.length}/2000
          </span>
        )}

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`
            flex-shrink-0 p-2.5 md:p-3 rounded-xl transition-all duration-200
            ${message.trim() && !isLoading
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }
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

      {/* Hints - Ocultos en móvil */}
      <div className="hidden md:flex items-center justify-between mt-3 px-2">
        <p className="text-[11px] text-gray-400 dark:text-gray-500">
          <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono text-[10px]">Enter</kbd>
          {' '}para enviar • {' '}
          <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono text-[10px]">Shift + Enter</kbd>
          {' '}nueva línea
        </p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500">
          Powered by GPT-4o
        </p>
      </div>
    </form>
  );
};
