/**
 * ContextSelector Component
 * Selector de contexto para proporcionar información al orquestador
 * Permite seleccionar producto, sprint y elementos del backlog
 */

import { useState, useEffect } from 'react';
import { X, Package, Target, ListChecks, Search, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '@clerk/clerk-react';
import { apiService } from '../../services/apiService';

export const ContextSelector = ({ isOpen, onClose, onSelectContext, initialContext = {} }) => {
  const { theme } = useTheme();
  const { getToken } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [backlogItems, setBacklogItems] = useState([]);
  
  const [selectedContext, setSelectedContext] = useState({
    product_id: initialContext?.product_id || null,
    sprint_id: initialContext?.sprint_id || null,
    backlog_items: initialContext?.backlog_items || [],
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Cargar productos al abrir
  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  // Cargar sprints cuando se selecciona un producto
  useEffect(() => {
    if (selectedContext?.product_id) {
      loadSprints(selectedContext.product_id);
      loadBacklogItems(selectedContext.product_id);
    } else {
      setSprints([]);
      setBacklogItems([]);
    }
  }, [selectedContext?.product_id]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/products', getToken);
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSprints = async (productId) => {
    try {
      const response = await apiService.get(`/sprints?product_id=${productId}`, getToken);
      setSprints(response.sprints || []);
    } catch (error) {
      console.error('Error al cargar sprints:', error);
      setSprints([]);
    }
  };

  const loadBacklogItems = async (productId) => {
    try {
      const response = await apiService.get(`/backlog?product_id=${productId}`, getToken);
      setBacklogItems(response.items || []);
    } catch (error) {
      console.error('Error al cargar backlog:', error);
      setBacklogItems([]);
    }
  };

  const handleProductChange = (productId) => {
    setSelectedContext({
      product_id: productId,
      sprint_id: null,
      backlog_items: []
    });
  };

  const handleSprintChange = (sprintId) => {
    setSelectedContext(prev => ({
      ...prev,
      sprint_id: sprintId
    }));
  };

  const handleBacklogItemToggle = (itemId) => {
    setSelectedContext(prev => ({
      ...prev,
      backlog_items: (prev?.backlog_items || []).includes(itemId)
        ? (prev?.backlog_items || []).filter(id => id !== itemId)
        : [...(prev?.backlog_items || []), itemId]
    }));
  };

  const handleConfirm = () => {
    onSelectContext(selectedContext);
    onClose();
  };

  const filteredBacklogItems = backlogItems.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`
            relative w-full max-w-2xl transform overflow-hidden rounded-2xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
            shadow-2xl transition-all
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`
            flex items-center justify-between p-6 border-b
            ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Seleccionar Contexto
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Proporciona información relevante al orquestador
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`
                p-2 rounded-xl transition-colors
                ${theme === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Producto */}
                <div className="space-y-3">
                  <label className={`
                    flex items-center space-x-2 text-sm font-medium
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    <Package className="w-4 h-4" />
                    <span>Producto</span>
                  </label>
                  <select
                    value={selectedContext?.product_id || ''}
                    onChange={(e) => handleProductChange(e.target.value || null)}
                    className={`
                      w-full px-4 py-3 rounded-xl border transition-colors
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                      focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                    `}
                  >
                    <option value="">Ninguno seleccionado</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sprint (solo si hay producto seleccionado) */}
                {selectedContext?.product_id && (
                  <div className="space-y-3">
                    <label className={`
                      flex items-center space-x-2 text-sm font-medium
                      ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                    `}>
                      <Target className="w-4 h-4" />
                      <span>Sprint (opcional)</span>
                    </label>
                    <select
                      value={selectedContext?.sprint_id || ''}
                      onChange={(e) => handleSprintChange(e.target.value || null)}
                      className={`
                        w-full px-4 py-3 rounded-xl border transition-colors
                        ${theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                        }
                        focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                      `}
                    >
                      <option value="">Ninguno seleccionado</option>
                      {sprints.map(sprint => (
                        <option key={sprint._id} value={sprint._id}>
                          {sprint.name} - {sprint.status}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Elementos del Backlog */}
                {selectedContext?.product_id && backlogItems.length > 0 && (
                  <div className="space-y-3">
                    <label className={`
                      flex items-center space-x-2 text-sm font-medium
                      ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                    `}>
                      <ListChecks className="w-4 h-4" />
                      <span>Elementos del Backlog (opcional)</span>
                    </label>

                    {/* Búsqueda */}
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar elementos..."
                        className={`
                          w-full pl-10 pr-4 py-2 rounded-lg border text-sm transition-colors
                          ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                          }
                          focus:outline-none focus:border-purple-500
                        `}
                      />
                    </div>

                    {/* Lista de elementos */}
                    <div className={`
                      max-h-48 overflow-y-auto rounded-lg border
                      ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    `}>
                      {filteredBacklogItems.length === 0 ? (
                        <div className={`p-4 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          No se encontraron elementos
                        </div>
                      ) : (
                        filteredBacklogItems.map(item => (
                          <label
                            key={item._id}
                            className={`
                              flex items-start space-x-3 p-3 cursor-pointer transition-colors
                              ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                              border-b last:border-b-0
                              ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
                            `}
                          >
                            <div className="relative flex items-center justify-center mt-0.5">
                              <input
                                type="checkbox"
                                checked={(selectedContext?.backlog_items || []).includes(item._id)}
                                onChange={() => handleBacklogItemToggle(item._id)}
                                className="sr-only"
                              />
                              <div className={`
                                w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                                ${(selectedContext?.backlog_items || []).includes(item._id)
                                  ? 'bg-purple-500 border-purple-500'
                                  : theme === 'dark'
                                    ? 'border-gray-600'
                                    : 'border-gray-300'
                                }
                              `}>
                                {(selectedContext?.backlog_items || []).includes(item._id) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {item.title}
                              </p>
                              {item.description && (
                                <p className={`text-xs mt-0.5 truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {item.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`
                                  text-xs px-2 py-0.5 rounded-full
                                  ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}
                                `}>
                                  {item.type || 'User Story'}
                                </span>
                                {item.priority && (
                                  <span className={`
                                    text-xs px-2 py-0.5 rounded-full
                                    ${item.priority === 'high'
                                      ? 'bg-red-500/20 text-red-500'
                                      : item.priority === 'medium'
                                        ? 'bg-yellow-500/20 text-yellow-500'
                                        : 'bg-green-500/20 text-green-500'
                                    }
                                  `}>
                                    {item.priority}
                                  </span>
                                )}
                              </div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>

                    {(selectedContext?.backlog_items || []).length > 0 && (
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {(selectedContext?.backlog_items || []).length} elemento(s) seleccionado(s)
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className={`
            flex items-center justify-end space-x-3 p-6 border-t
            ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <button
              onClick={onClose}
              className={`
                px-6 py-2.5 rounded-xl font-medium transition-colors
                ${theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }
              `}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedContext?.product_id}
              className={`
                px-6 py-2.5 rounded-xl font-medium text-white transition-all transform
                ${selectedContext?.product_id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:scale-105'
                  : 'bg-gray-400 cursor-not-allowed'
                }
              `}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
