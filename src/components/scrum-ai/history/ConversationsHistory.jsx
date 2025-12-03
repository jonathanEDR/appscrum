/**
 * ConversationsHistory - Panel de historial con diseño moderno
 */

import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Star, 
  Search, 
  Trash2, 
  Clock, 
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { scrumAIService } from '../../../services/scrumAIService';

export const ConversationsHistory = ({ onClose, onSelectConversation }) => {
  const { getToken } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    let filtered = conversations;

    if (showFavoritesOnly) {
      filtered = filtered.filter(conv => conv.favorite);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.title?.toLowerCase().includes(query) ||
        conv.lastMessage?.toLowerCase().includes(query)
      );
    }

    setFilteredConversations(filtered);
  }, [conversations, searchQuery, showFavoritesOnly]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const data = await scrumAIService.getConversations(token);
      setConversations(data || []);
    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (conversationId) => {
    try {
      const token = await getToken();
      await scrumAIService.toggleFavorite(token, conversationId);
      
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, favorite: !conv.favorite }
            : conv
        )
      );
    } catch (error) {
      console.error('Error al marcar favorito:', error);
    }
  };

  const deleteConversation = async (conversationId) => {
    if (!confirm('¿Eliminar esta conversación?')) return;

    try {
      const token = await getToken();
      await scrumAIService.deleteConversation(token, conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Historial
              </h2>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                {conversations.length} conversaciones
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Búsqueda */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Filtro */}
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
            ${showFavoritesOnly 
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
        >
          <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          <span>Favoritos</span>
        </button>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-indigo-500 animate-spin mx-auto"></div>
            <p className="mt-3 text-xs text-gray-500">Cargando...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {searchQuery ? 'Sin resultados' : 'Sin conversaciones'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {searchQuery 
                ? 'Prueba con otros términos' 
                : 'Inicia un chat con SCRUM AI'
              }
            </p>
          </div>
        ) : (
          <div className="py-2">
            {filteredConversations.map(conversation => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onSelect={() => onSelectConversation?.(conversation)}
                onToggleFavorite={() => toggleFavorite(conversation.id)}
                onDelete={() => deleteConversation(conversation.id)}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ConversationItem = ({ conversation, onSelect, onToggleFavorite, onDelete, formatDate }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className="group px-3 py-1"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div 
        onClick={onSelect}
        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 cursor-pointer transition-all"
      >
        {/* Icono */}
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1">
              {conversation.title || 'Conversación'}
            </h3>
            {conversation.favorite && (
              <Star className="w-3 h-3 text-amber-500 fill-current flex-shrink-0" />
            )}
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-1.5">
            {conversation.lastMessage || 'Sin mensajes'}
          </p>
          
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(conversation.updatedAt || conversation.createdAt)}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span>{conversation.messageCount || 0} msgs</span>
          </div>
        </div>

        {/* Flecha */}
        <ChevronRight className={`w-4 h-4 text-gray-400 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Acciones */}
      {showActions && (
        <div className="flex items-center gap-1 pl-12 pb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`
              p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1
              ${conversation.favorite 
                ? 'text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/20' 
                : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            <Star className={`w-3 h-3 ${conversation.favorite ? 'fill-current' : ''}`} />
            <span className="text-[10px]">{conversation.favorite ? 'Quitar' : 'Favorito'}</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span className="text-[10px]">Eliminar</span>
          </button>
        </div>
      )}
    </div>
  );
};
