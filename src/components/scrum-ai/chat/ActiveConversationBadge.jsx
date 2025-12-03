/**
 * ActiveConversationBadge - Badge que muestra la conversación activa
 */

import { MessageSquare, X } from 'lucide-react';

export const ActiveConversationBadge = ({ title, onClose }) => {
  if (!title) return null;

  return (
    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-indigo-50 dark:bg-indigo-900/10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100 truncate">
            {title}
          </span>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors flex-shrink-0"
            title="Cerrar conversación"
          >
            <X className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </button>
        )}
      </div>
    </div>
  );
};
