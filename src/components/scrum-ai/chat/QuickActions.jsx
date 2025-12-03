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
  Sparkles
} from 'lucide-react';

// Configuración de acciones rápidas
const QUICK_ACTIONS = {
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
  selectedProduct 
}) => {
  // No mostrar si no hay producto seleccionado
  if (!selectedProduct) {
    return null;
  }

  // Determinar qué acciones mostrar
  let actionsToShow = [];
  
  if (showEditSections) {
    actionsToShow = QUICK_ACTIONS.editSections;
  } else if (hasArchitecture) {
    actionsToShow = QUICK_ACTIONS.withArchitecture;
  } else {
    actionsToShow = QUICK_ACTIONS.noArchitecture;
  }

  const handleClick = (action) => {
    if (onAction) {
      onAction(action.message, action.id);
    }
  };

  return (
    <div className="px-4 pb-2">
      <div className="max-w-4xl mx-auto">
        {/* Título de sección */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {showEditSections ? '¿Qué sección deseas editar?' : 'Acciones rápidas'}
          </span>
          {hasArchitecture && !showEditSections && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              ✓ Arquitectura definida
            </span>
          )}
        </div>
        
        {/* Botones de acciones */}
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
          
          {/* Botón para mostrar/ocultar secciones de edición */}
          {hasArchitecture && !showEditSections && (
            <button
              onClick={() => onAction && onAction('__toggle_sections__', 'toggle_sections')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl
                bg-gray-100 dark:bg-gray-800 
                text-gray-600 dark:text-gray-300 text-sm font-medium
                hover:bg-gray-200 dark:hover:bg-gray-700
                transition-all duration-200"
              title="Ver opciones de edición por sección"
            >
              <Plus className="w-4 h-4" />
              <span>Más opciones</span>
            </button>
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
    </div>
  );
};

export default QuickActions;
