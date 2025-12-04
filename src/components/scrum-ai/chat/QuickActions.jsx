/**
 * QuickActions - Botones de acceso rápido para el chat
 * Mejora la UX permitiendo acciones comunes con un solo clic
 */

import { 
  FolderTree, 
  Database, 
  GitBranch, 
  Boxes, 
  Eye,
  Pencil,
  Plus,
  Sparkles,
  FileText,
  Calendar,
  ListTodo,
  Package
} from 'lucide-react';

// Configuración de acciones rápidas
const QUICK_ACTIONS = {
  // Acciones principales del producto (cuando está seleccionado)
  productActions: [
    {
      id: 'create_story',
      label: 'Crear Historia',
      icon: FileText,
      message: 'Quiero crear una nueva historia de usuario',
      color: 'from-blue-500 to-cyan-600',
      description: 'Crear historia de usuario'
    },
    {
      id: 'create_sprint',
      label: 'Crear Sprint',
      icon: Calendar,
      message: 'Quiero crear un nuevo sprint',
      color: 'from-emerald-500 to-teal-600',
      description: 'Crear un nuevo sprint'
    },
    {
      id: 'view_backlog',
      label: 'Ver Backlog',
      icon: ListTodo,
      message: 'Muéstrame el backlog del producto',
      color: 'from-amber-500 to-orange-600',
      description: 'Ver historias del backlog'
    },
    {
      id: 'view_sprints',
      label: 'Ver Sprints',
      icon: Calendar,
      message: 'Muéstrame los sprints del producto',
      color: 'from-violet-500 to-purple-600',
      description: 'Ver sprints del producto'
    }
  ],
  
  // Acciones para cuando hay un sprint seleccionado
  sprintActions: [
    {
      id: 'create_task',
      label: 'Crear Tarea',
      icon: ListTodo,
      message: 'Quiero crear una tarea técnica para el sprint',
      color: 'from-blue-500 to-indigo-600',
      description: 'Crear tarea técnica'
    },
    {
      id: 'create_bug',
      label: 'Reportar Bug',
      icon: FileText,
      message: 'Quiero reportar un bug para el sprint',
      color: 'from-red-500 to-rose-600',
      description: 'Reportar un bug'
    },
    {
      id: 'create_improvement',
      label: 'Mejora',
      icon: Sparkles,
      message: 'Quiero crear una mejora técnica para el sprint',
      color: 'from-purple-500 to-violet-600',
      description: 'Crear mejora técnica'
    },
    {
      id: 'view_sprint_backlog',
      label: 'Ver Backlog Sprint',
      icon: ListTodo,
      message: 'Muéstrame el backlog del sprint actual',
      color: 'from-amber-500 to-orange-600',
      description: 'Ver items del sprint'
    }
  ],
  
  // Acciones cuando NO hay arquitectura
  noArchitecture: [
    {
      id: 'create_architecture',
      label: 'Crear Arquitectura',
      icon: Sparkles,
      message: 'Quiero crear la arquitectura del proyecto',
      color: 'from-purple-500 to-indigo-600',
      description: 'Inicia el flujo de creación'
    }
  ],
  
  // Acciones cuando SÍ hay arquitectura
  withArchitecture: [
    {
      id: 'view_architecture',
      label: 'Ver Arquitectura',
      icon: Eye,
      message: 'Muéstrame la arquitectura del proyecto',
      color: 'from-blue-500 to-cyan-500',
      description: 'Ver arquitectura completa'
    },
    {
      id: 'edit_architecture',
      label: 'Editar',
      icon: Pencil,
      message: 'Quiero editar la arquitectura',
      color: 'from-amber-500 to-orange-500',
      description: 'Modificar arquitectura'
    }
  ],
  
  // Acciones de edición por sección
  editSections: [
    {
      id: 'edit_structure',
      label: 'Estructura',
      icon: FolderTree,
      message: 'Quiero editar la estructura del proyecto',
      color: 'from-violet-500 to-purple-500',
      description: 'Carpetas y organización'
    },
    {
      id: 'edit_database',
      label: 'Base de Datos',
      icon: Database,
      message: 'Quiero editar la base de datos',
      color: 'from-emerald-500 to-teal-500',
      description: 'Tablas y entidades'
    },
    {
      id: 'edit_endpoints',
      label: 'APIs',
      icon: GitBranch,
      message: 'Quiero editar los endpoints de la API',
      color: 'from-amber-500 to-yellow-500',
      description: 'Rutas y métodos'
    },
    {
      id: 'edit_modules',
      label: 'Módulos',
      icon: Boxes,
      message: 'Quiero editar los módulos del sistema',
      color: 'from-rose-500 to-pink-500',
      description: 'Componentes del sistema'
    }
  ]
};

export const QuickActions = ({ 
  hasArchitecture = false, 
  showEditSections = false,
  onAction,
  selectedProduct,
  selectedSprint,  // Nuevo: sprint seleccionado
  onDeselectSprint, // Nuevo: callback para deseleccionar sprint
  showProductActions = true // Nuevo prop para controlar si mostrar acciones de producto
}) => {
  // No mostrar si no hay producto seleccionado
  if (!selectedProduct) {
    return null;
  }

  // Determinar qué acciones mostrar
  let actionsToShow = [];
  let showArchitectureActions = false;
  let showSprintActions = false;
  
  if (showEditSections) {
    // Modo: edición de secciones de arquitectura
    actionsToShow = QUICK_ACTIONS.editSections;
  } else if (selectedSprint) {
    // Modo: acciones del sprint seleccionado
    actionsToShow = QUICK_ACTIONS.sprintActions;
    showSprintActions = true;
  } else if (showProductActions) {
    // Modo: acciones principales del producto (crear historia, sprint, etc.)
    actionsToShow = QUICK_ACTIONS.productActions;
    showArchitectureActions = true; // Mostrar también acciones de arquitectura
  } else if (hasArchitecture) {
    actionsToShow = QUICK_ACTIONS.withArchitecture;
  } else {
    actionsToShow = QUICK_ACTIONS.noArchitecture;
  }

  const handleClick = (action) => {
    if (onAction) {
      // Si hay sprint seleccionado y es una acción de sprint, incluir el nombre
      let message = action.message;
      if (selectedSprint && showSprintActions) {
        // Reemplazar "el sprint" o "sprint actual" con el nombre real
        message = message
          .replace('para el sprint', `para el sprint "${selectedSprint.nombre}"`)
          .replace('del sprint actual', `del sprint "${selectedSprint.nombre}"`)
          .replace('el sprint actual', `el sprint "${selectedSprint.nombre}"`);
      }
      onAction(message, action.id);
    }
  };

  return (
    <div className="px-4 pb-2">
      <div className="max-w-4xl mx-auto">
        {/* Título de sección */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {showEditSections 
              ? '¿Qué sección deseas editar?' 
              : showSprintActions 
              ? `Sprint: ${selectedSprint.nombre}` 
              : showProductActions 
              ? `Acciones para ${selectedProduct.nombre}` 
              : 'Acciones rápidas'}
          </span>
          {selectedSprint && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              🏃 Sprint activo
            </span>
          )}
          {hasArchitecture && !showEditSections && !selectedSprint && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              ✓ Arquitectura definida
            </span>
          )}
        </div>
        
        {/* Botones de acciones principales del producto */}
        <div className="flex flex-wrap gap-2">
          {actionsToShow.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleClick(action)}
                className={`
                  group flex items-center gap-2 px-3 py-2 rounded-xl
                  bg-gradient-to-r ${action.color}
                  text-white text-sm font-medium
                  shadow-md hover:shadow-lg
                  transform hover:scale-105 active:scale-95
                  transition-all duration-200
                `}
                title={action.description}
              >
                <Icon className="w-4 h-4" />
                <span>{action.label}</span>
              </button>
            );
          })}
          
          {/* Botón volver cuando hay sprint seleccionado */}
          {showSprintActions && (
            <button
              onClick={() => onDeselectSprint && onDeselectSprint()}
              className="flex items-center gap-2 px-3 py-2 rounded-xl
                bg-gray-100 dark:bg-gray-800 
                text-gray-600 dark:text-gray-300 text-sm font-medium
                hover:bg-gray-200 dark:hover:bg-gray-700
                transition-all duration-200"
            >
              <span>← Volver a producto</span>
            </button>
          )}
        </div>
        
        {/* Botones de arquitectura (cuando showArchitectureActions es true) */}
        {showArchitectureActions && (
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Arquitectura
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {hasArchitecture ? (
                <>
                  <button
                    onClick={() => handleClick({ message: 'Muéstrame la arquitectura del proyecto', id: 'view_architecture' })}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                      bg-gradient-to-r from-purple-500 to-indigo-600
                      text-white text-xs font-medium
                      shadow-sm hover:shadow-md
                      transform hover:scale-105 active:scale-95
                      transition-all duration-200"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Arquitectura</span>
                  </button>
                  <button
                    onClick={() => handleClick({ message: 'Quiero editar la arquitectura', id: 'edit_architecture' })}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                      bg-gradient-to-r from-amber-500 to-orange-600
                      text-white text-xs font-medium
                      shadow-sm hover:shadow-md
                      transform hover:scale-105 active:scale-95
                      transition-all duration-200"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => onAction && onAction('__toggle_sections__', 'toggle_sections')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                      bg-gray-100 dark:bg-gray-800 
                      text-gray-600 dark:text-gray-300 text-xs font-medium
                      hover:bg-gray-200 dark:hover:bg-gray-700
                      transition-all duration-200"
                    title="Ver opciones de edición por sección"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Más opciones</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleClick({ message: 'Quiero crear la arquitectura del proyecto', id: 'create_architecture' })}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                    bg-gradient-to-r from-purple-500 to-indigo-600
                    text-white text-xs font-medium
                    shadow-sm hover:shadow-md
                    transform hover:scale-105 active:scale-95
                    transition-all duration-200"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Crear Arquitectura</span>
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Botón volver cuando está en modo secciones */}
        {showEditSections && (
          <div className="mt-2">
            <button
              onClick={() => onAction && onAction('__toggle_sections__', 'toggle_sections')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl
                bg-gray-100 dark:bg-gray-800 
                text-gray-600 dark:text-gray-300 text-sm font-medium
                hover:bg-gray-200 dark:hover:bg-gray-700
                transition-all duration-200"
            >
              <span>← Volver</span>
            </button>
          </div>
        )}
          
          {/* Botón para volver si estamos en modo secciones */}
          {showEditSections && (
            <button
              onClick={() => onAction && onAction('__toggle_sections__', 'toggle_sections')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl
                bg-gray-100 dark:bg-gray-800 
                text-gray-600 dark:text-gray-300 text-sm font-medium
                hover:bg-gray-200 dark:hover:bg-gray-700
                transition-all duration-200"
            >
              <span>← Volver</span>
            </button>
          )}
        </div>
      </div>
  );
};

export default QuickActions;
