/**
 * TypingIndicator - Indicador elegante de que SCRUM AI está escribiendo
 */

import { Sparkles } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/20 animate-pulse">
        <Sparkles className="w-5 h-5 text-white" />
      </div>

      {/* Typing animation */}
      <div className="max-w-[75%] md:max-w-[70%]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            SCRUM AI
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            está escribiendo...
          </span>
        </div>
        
        <div className="bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }}></div>
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.8s' }}></div>
              <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.8s' }}></div>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
              Analizando tu consulta...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
