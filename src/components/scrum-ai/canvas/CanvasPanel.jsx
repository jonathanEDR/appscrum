/**
 * CanvasPanel - Panel lateral para mostrar contenido estructurado
 * Se activa cuando SCRUM AI necesita mostrar listas, tablas, o datos estructurados
 */

import { useState } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Download,
  RefreshCw,
  LayoutGrid
} from 'lucide-react';
import { ProductsCanvas } from './ProductsCanvas';
import { BacklogCanvas } from './BacklogCanvas';
import { SprintsCanvas } from './SprintsCanvas';
import { TasksCanvas } from './TasksCanvas';
import { TeamCanvas } from './TeamCanvas';
import { GenericListCanvas } from './GenericListCanvas';
import { ArchitectureCanvas } from './ArchitectureCanvas';
import { StructureEditorCanvas } from './StructureEditorCanvas';
import { DatabaseEditorCanvas } from './DatabaseEditorCanvas';
import { EndpointsEditorCanvas } from './EndpointsEditorCanvas';
import { DetailModal } from './DetailModal';

// Mapeo de tipos de canvas a componentes
const CANVAS_COMPONENTS = {
  products: ProductsCanvas,
  backlog: BacklogCanvas,
  sprints: SprintsCanvas,
  tasks: TasksCanvas,
  team: TeamCanvas,
  architecture: ArchitectureCanvas,
  generic: GenericListCanvas
};

export const CanvasPanel = ({ 
  canvasData, 
  selectedProduct,
  onSelectProduct,
  onClose, 
  onRefresh,
  isLoading = false,
  editSection = null,  // Nueva prop para modo de edición de sección
  onArchitectureAction // Callback para acciones de arquitectura
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!canvasData) return null;

  const { type, title, data, metadata } = canvasData;
  
  // Determinar si estamos en modo de edición de sección específica
  const isStructureEditMode = editSection === 'structure' && type === 'architecture';
  const isDatabaseEditMode = editSection === 'database' && type === 'architecture';
  const isEndpointsEditMode = editSection === 'endpoints' && type === 'architecture';
  
  // Obtener la estructura del proyecto si existe
  const architecture = data?.[0];
  const projectStructure = architecture?.directory_structure || architecture?.project_structure;
  const databaseSchema = architecture?.database_schema;
  const apiEndpoints = architecture?.api_endpoints;
  
  const CanvasComponent = CANVAS_COMPONENTS[type] || GenericListCanvas;

  // Handler para abrir el modal de detalle
  const handleItemClick = (item, shouldOpenModal = false) => {
    // Si es un producto, seleccionarlo además de abrir modal
    if (type === 'products' && onSelectProduct) {
      onSelectProduct(item);
    }
    
    // Solo abrir modal si es doble clic (shouldOpenModal = true)
    if (shouldOpenModal) {
      setSelectedItem(item);
      setIsModalOpen(true);
    }
  };

  // Handler para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      {/* Overlay de fondo para móvil */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />

      <div 
        className={`
          flex flex-col
          bg-white dark:bg-gray-950
          border-l border-gray-200/60 dark:border-gray-800/60
          transition-all duration-300
          
          /* Móvil: fullscreen overlay */
          fixed inset-0 z-50
          md:relative md:inset-auto md:z-auto
          
          /* Desktop: panel lateral */
          md:h-full
          ${isExpanded ? 'md:w-[600px]' : 'md:w-[400px]'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200/60 dark:border-gray-800/60 bg-white dark:bg-gray-950">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isStructureEditMode 
                ? 'bg-gradient-to-br from-violet-500 to-purple-600' 
                : isDatabaseEditMode
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                : isEndpointsEditMode
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600'
            }`}>
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {isStructureEditMode 
                  ? 'Estructura del Proyecto' 
                  : isDatabaseEditMode 
                  ? 'Esquema de Base de Datos'
                  : isEndpointsEditMode
                  ? 'API Endpoints'
                  : (title || 'Canvas')}
              </h3>
              {(isStructureEditMode || isDatabaseEditMode || isEndpointsEditMode) ? (
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                  Modo edición • {isStructureEditMode ? 'Carpetas y archivos' : isDatabaseEditMode ? 'Tablas y campos' : 'Rutas HTTP'}
                </p>
              ) : metadata?.count !== undefined && (
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {metadata.count} elementos
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                title="Actualizar datos"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
            
            {/* Botón expandir solo en desktop */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isExpanded ? 'Reducir' : 'Expandir'}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4 text-gray-500" />
              ) : (
                <Maximize2 className="w-4 h-4 text-gray-500" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Cerrar canvas"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-emerald-500 animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-gray-500">Cargando datos...</p>
              </div>
            </div>
          ) : isStructureEditMode && projectStructure ? (
            // Modo de edición de estructura - mostrar solo el panel de estructura
            <StructureEditorCanvas 
              structure={projectStructure}
            />
          ) : isDatabaseEditMode && databaseSchema ? (
            // Modo de edición de base de datos - mostrar panel de BD
            <DatabaseEditorCanvas 
              schema={databaseSchema}
            />
          ) : isEndpointsEditMode && apiEndpoints ? (
            // Modo de edición de endpoints - mostrar panel de API
            <EndpointsEditorCanvas 
              endpoints={apiEndpoints}
            />
          ) : (
            <CanvasComponent 
              data={data} 
              metadata={metadata}
              isExpanded={isExpanded}
              selectedProduct={selectedProduct}
              onItemClick={handleItemClick}
              onArchitectureAction={onArchitectureAction}
            />
          )}
        </div>

        {/* Footer con metadata */}
        {metadata?.updatedAt && (
          <div className="px-4 py-2 border-t border-gray-200/60 dark:border-gray-800/60 bg-gray-50 dark:bg-gray-900/50">
            <p className="text-[10px] text-gray-400 text-center">
              Actualizado: {new Date(metadata.updatedAt).toLocaleString('es-ES')}
            </p>
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
        type={type}
      />
    </>
  );
};
