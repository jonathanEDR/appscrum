/**
 * ProductsCanvas - Canvas para mostrar productos del sistema
 * Usado por el agente Product Owner
 */

import { useState, useRef, useEffect } from 'react';
import { 
  Package, 
  Calendar, 
  User, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Check,
  FolderTree,
  Sparkles,
  Layers
} from 'lucide-react';

const STATUS_CONFIG = {
  activo: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100 dark:bg-emerald-900/20',
    label: 'Activo'
  },
  inactivo: {
    icon: Clock,
    color: 'text-amber-500',
    bg: 'bg-amber-100 dark:bg-amber-900/20',
    label: 'Inactivo'
  },
  completado: {
    icon: XCircle,
    color: 'text-gray-500',
    bg: 'bg-gray-100 dark:bg-gray-900/20',
    label: 'Completado'
  }
};

export const ProductsCanvas = ({ data = [], metadata, isExpanded, selectedProduct, onItemClick, onArchitectureAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [architectureStatus, setArchitectureStatus] = useState({}); // Cache de estado de arquitectura

  // Verificar arquitectura de productos seleccionados
  useEffect(() => {
    const checkProductArchitecture = async () => {
      if (selectedProduct?._id && !architectureStatus[selectedProduct._id]) {
        try {
          // La verificación real se hace en el hook, aquí solo marcamos como verificado
          // Por ahora asumimos que no tiene hasta que se verifique
          setArchitectureStatus(prev => ({
            ...prev,
            [selectedProduct._id]: { checked: true, hasArchitecture: selectedProduct.hasArchitecture || false }
          }));
        } catch (error) {
          console.error('Error checking architecture:', error);
        }
      }
    };
    checkProductArchitecture();
  }, [selectedProduct]);

  const filteredProducts = data.filter(product => {
    const matchesSearch = product.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || product.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sin productos
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No hay productos registrados en el sistema
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-3 border-b border-gray-200/60 dark:border-gray-800/60 space-y-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="flex gap-1">
            {['all', 'activo', 'inactivo', 'completado'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  px-2.5 py-1 rounded-md text-xs font-medium transition-all
                  ${filterStatus === status
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {status === 'all' ? 'Todos' : STATUS_CONFIG[status]?.label || status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No se encontraron productos</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard 
              key={product._id || product.id} 
              product={product}
              isExpanded={isExpanded}
              formatDate={formatDate}
              isSelected={selectedProduct?._id === product._id}
              onItemClick={onItemClick}
              onArchitectureAction={onArchitectureAction}
            />
          ))
        )}
      </div>

      {/* Summary Footer */}
      <div className="p-3 border-t border-gray-200/60 dark:border-gray-800/60 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Mostrando {filteredProducts.length} de {data.length}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {data.filter(p => p.estado === 'activo').length} activos
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {data.filter(p => p.estado === 'inactivo').length} inactivos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, isExpanded, formatDate, isSelected, onItemClick, onArchitectureAction }) => {
  const statusConfig = STATUS_CONFIG[product.estado] || STATUS_CONFIG.activo;
  const StatusIcon = statusConfig.icon;
  const clickTimeoutRef = useRef(null);
  const clickCountRef = useRef(0);
  
  // Verificar si el producto tiene arquitectura (viene del backend o del estado)
  const hasArchitecture = product.hasArchitecture || product.has_architecture || false;

  const handleClick = (e) => {
    e.stopPropagation();
    
    clickCountRef.current += 1;

    // Si ya hay un timeout, significa que es el segundo clic
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      clickCountRef.current = 0;
      
      // Doble clic - abrir modal
      onItemClick?.(product, true); // true = abrir modal
    } else {
      // Primer clic - seleccionar producto
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        clickCountRef.current = 0;
        onItemClick?.(product, false); // false = solo seleccionar
      }, 300);
    }
  };

  const handleArchitectureClick = (e, action) => {
    e.stopPropagation();
    if (onArchitectureAction) {
      onArchitectureAction(product, action);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        p-3 rounded-xl border transition-all cursor-pointer relative
        ${isSelected 
          ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 shadow-md ring-2 ring-emerald-200 dark:ring-emerald-800' 
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md'
        }
      `}
    >
      {/* Checkbox Indicator */}
      <div className={`
        absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all
        ${isSelected 
          ? 'bg-emerald-500 dark:bg-emerald-600 shadow-lg' 
          : 'bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
        }
      `}>
        {isSelected && (
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        )}
      </div>

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-emerald-900 dark:text-emerald-100' : 'text-gray-900 dark:text-white'}`}>
              {product.nombre}
            </h4>
            <div className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConfig.bg} ${statusConfig.color}`}>
              {statusConfig.label}
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
            {product.descripcion || 'Sin descripción'}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {product.responsable_nombre || product.responsable?.nombre || product.responsable?.email || 'Sin asignar'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(product.fecha_inicio)}
            </span>
          </div>

          {/* Expanded Details */}
          {isSelected && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800 space-y-3">
              {product.fecha_fin && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Fecha fin:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(product.fecha_fin)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Creado:</span>
                <span className="text-gray-900 dark:text-white">{formatDate(product.createdAt)}</span>
              </div>
              
              {/* Architecture Status & Actions */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Arquitectura:</span>
                  {hasArchitecture ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                      <Layers className="w-3 h-3" />
                      Definida
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                      <Sparkles className="w-3 h-3" />
                      Sin definir
                    </span>
                  )}
                </div>
                
                {/* Architecture Action Button */}
                {hasArchitecture ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleArchitectureClick(e, 'view')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <FolderTree className="w-3.5 h-3.5" />
                      Ver Arquitectura
                    </button>
                    <button 
                      onClick={(e) => handleArchitectureClick(e, 'edit')}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Editar
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={(e) => handleArchitectureClick(e, 'create')}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-medium hover:from-purple-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Crear Arquitectura
                  </button>
                )}
              </div>
              
              {/* Other Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  Ver detalle
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
