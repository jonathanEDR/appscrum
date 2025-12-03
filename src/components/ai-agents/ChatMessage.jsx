/**
 * ChatMessage Component
 * Componente para renderizar mensajes individuales en el chat
 * Soporta mensajes de usuario y agente con markdown
 */

import { useState } from 'react';
import { Bot, User, Clock, CheckCheck, AlertCircle, Copy, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ReactMarkdown from 'react-markdown';

export const ChatMessage = ({ message, isUser = false, timestamp, status = 'sent', agentName = 'Orchestrator' }) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  // Formatear timestamp
  const formatTime = (time) => {
    if (!time) return '';
    const date = new Date(time);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Copiar mensaje
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  // Icono de estado
  const StatusIcon = () => {
    if (status === 'sending') {
      return (
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      );
    }
    if (status === 'error') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (status === 'sent') {
      return <CheckCheck className="w-4 h-4 text-green-500" />;
    }
    return null;
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Avatar */}
      <div className={`
        flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
        ${isUser
          ? 'bg-gradient-to-br from-purple-500 to-blue-500'
          : theme === 'dark'
            ? 'bg-gray-700 border border-gray-600'
            : 'bg-gray-200 border border-gray-300'
        }
      `}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
        )}
      </div>

      {/* Contenido del mensaje */}
      <div className={`flex-1 ${isUser ? 'flex flex-col items-end' : ''}`}>
        {/* Header con nombre y timestamp */}
        <div className={`flex items-center gap-2 mb-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {isUser ? 'Tú' : agentName}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{formatTime(timestamp)}</span>
            {isUser && <StatusIcon />}
          </div>
        </div>

        {/* Burbuja del mensaje */}
        <div className={`
          relative max-w-3xl rounded-2xl px-4 py-3
          ${isUser
            ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
            : theme === 'dark'
              ? 'bg-gray-700 border border-gray-600 text-gray-100'
              : 'bg-white border border-gray-200 text-gray-900'
          }
          ${status === 'error' ? 'border-red-500 border-2' : ''}
        `}>
          {/* Contenido con markdown */}
          <div className={`
            prose prose-sm max-w-none
            ${isUser ? 'prose-invert' : theme === 'dark' ? 'prose-invert' : ''}
          `}>
            <ReactMarkdown
              components={{
                // Personalizar renderizado de código
                code: ({ node, inline, className, children, ...props }) => {
                  return inline ? (
                    <code className={`px-1.5 py-0.5 rounded ${isUser ? 'bg-white/20' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`} {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className={`overflow-x-auto rounded-lg p-3 ${isUser ? 'bg-white/20' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <code {...props}>{children}</code>
                    </pre>
                  );
                },
                // Links con target blank
                a: ({ node, children, ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={isUser ? 'text-white underline' : 'text-purple-500 hover:text-purple-600'}
                  >
                    {children}
                  </a>
                ),
                // Listas con mejor espaciado
                ul: ({ node, children, ...props }) => (
                  <ul className="my-2 space-y-1" {...props}>{children}</ul>
                ),
                ol: ({ node, children, ...props }) => (
                  <ol className="my-2 space-y-1" {...props}>{children}</ol>
                ),
              }}
            >
              {message}
            </ReactMarkdown>
          </div>

          {/* Botón de copiar (solo visible en hover para mensajes del agente) */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className={`
                absolute top-2 right-2 p-1.5 rounded-lg
                opacity-0 group-hover:opacity-100 transition-all
                ${theme === 'dark'
                  ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                }
              `}
              title="Copiar mensaje"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Mensaje de error */}
        {status === 'error' && (
          <div className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Error al enviar el mensaje. Intenta nuevamente.</span>
          </div>
        )}
      </div>
    </div>
  );
};
