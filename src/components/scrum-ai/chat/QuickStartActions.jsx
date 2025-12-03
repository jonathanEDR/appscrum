/**
 * QuickStartActions - Accesos rápidos para inicio del chat
 * Muestra opciones frecuentes cuando el chat está vacío
 */

import { 
  Package, 
  LayoutDashboard, 
  ListTodo, 
  Users, 
  Calendar,
  GitBranch,
  Bug,
  Clock,
  TrendingUp,
  FolderTree,
  Sparkles,
  Zap,
  Target,
  FileText,
  Layers
} from 'lucide-react';

// Categorías de accesos rápidos
const QUICK_START_CATEGORIES = [
  {
    id: 'consultas',
    title: '📊 Consultas Rápidas',
    description: 'Información del proyecto',
    actions: [
      {
        id: 'show_products',
        icon: Package,
        label: 'Mis Productos',
        message: 'Muéstrame los productos disponibles',
        color: 'from-emerald-500 to-teal-600',
        description: 'Ver lista de productos'
      },
      {
        id: 'show_sprints',
        icon: GitBranch,
        label: 'Sprints Activos',
        message: 'Muéstrame los sprints activos del producto',
        color: 'from-blue-500 to-indigo-600',
        description: 'Ver sprints en curso'
      },
      {
        id: 'show_backlog',
        icon: ListTodo,
        label: 'Product Backlog',
        message: 'Muéstrame el backlog del producto',
        color: 'from-violet-500 to-purple-600',
        description: 'Historias de usuario'
      },
      {
        id: 'show_team',
        icon: Users,
        label: 'Equipo',
        message: 'Muéstrame los miembros del equipo',
        color: 'from-pink-500 to-rose-600',
        description: 'Ver el equipo Scrum'
      }
    ]
  },
  {
    id: 'arquitectura',
    title: '🏗️ Arquitectura',
    description: 'Gestión de arquitectura del proyecto',
    actions: [
      {
        id: 'create_architecture',
        icon: FolderTree,
        label: 'Crear Arquitectura',
        message: 'Quiero crear la arquitectura para mi producto',
        color: 'from-amber-500 to-orange-600',
        description: 'Definir estructura del proyecto'
      },
      {
        id: 'edit_architecture',
        icon: Layers,
        label: 'Editar Arquitectura',
        message: 'Quiero editar la arquitectura',
        color: 'from-cyan-500 to-blue-600',
        description: 'Modificar arquitectura existente'
      }
    ]
  },
  {
    id: 'metricas',
    title: '📈 Métricas y Reportes',
    description: 'Análisis del proyecto',
    actions: [
      {
        id: 'show_metrics',
        icon: TrendingUp,
        label: 'Métricas',
        message: 'Muéstrame las métricas del sprint actual',
        color: 'from-green-500 to-emerald-600',
        description: 'Velocidad y progreso'
      },
      {
        id: 'show_bugs',
        icon: Bug,
        label: 'Bugs Reportados',
        message: 'Muéstrame los bugs reportados del producto',
        color: 'from-red-500 to-rose-600',
        description: 'Lista de defectos'
      },
      {
        id: 'show_ceremonies',
        icon: Calendar,
        label: 'Ceremonias',
        message: 'Muéstrame las próximas ceremonias Scrum',
        color: 'from-indigo-500 to-violet-600',
        description: 'Reuniones programadas'
      },
      {
        id: 'show_impediments',
        icon: Target,
        label: 'Impedimentos',
        message: 'Muéstrame los impedimentos actuales',
        color: 'from-orange-500 to-red-600',
        description: 'Bloqueos del equipo'
      }
    ]
  },
  {
    id: 'tareas',
    title: '✅ Gestión de Tareas',
    description: 'Crear y gestionar trabajo',
    actions: [
      {
        id: 'create_story',
        icon: FileText,
        label: 'Nueva Historia',
        message: 'Quiero crear una nueva historia de usuario',
        color: 'from-purple-500 to-indigo-600',
        description: 'Agregar al backlog'
      },
      {
        id: 'show_my_tasks',
        icon: Clock,
        label: 'Mis Tareas',
        message: 'Muéstrame mis tareas pendientes',
        color: 'from-teal-500 to-cyan-600',
        description: 'Trabajo asignado'
      }
    ]
  }
];

// Componente para cada acción rápida
const QuickStartButton = ({ action, onClick, compact = false }) => {
  const Icon = action.icon;
  
  if (compact) {
    return (
      <button
        onClick={() => onClick(action.message, action.id)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl
          bg-gradient-to-r ${action.color}
          text-white text-sm font-medium
          transform transition-all duration-200
          hover:scale-[1.03] hover:shadow-lg
          active:scale-[0.98]
        `}
        title={action.description}
      >
        <Icon className="w-4 h-4" />
        <span>{action.label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick(action.message, action.id)}
      className={`
        group relative flex flex-col items-center gap-2 p-4 rounded-2xl
        bg-white dark:bg-gray-800/80 
        border border-gray-200 dark:border-gray-700
        hover:border-transparent
        shadow-sm hover:shadow-xl
        transform transition-all duration-300
        hover:scale-[1.03] hover:-translate-y-1
        active:scale-[0.98]
        overflow-hidden
      `}
    >
      {/* Gradient overlay on hover */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100
        bg-gradient-to-br ${action.color}
        transition-opacity duration-300
      `} />
      
      {/* Icon */}
      <div className={`
        relative z-10 w-12 h-12 rounded-xl
        bg-gradient-to-br ${action.color}
        flex items-center justify-center
        shadow-lg group-hover:shadow-xl
        group-hover:scale-110
        transition-all duration-300
      `}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      
      {/* Label */}
      <span className="relative z-10 text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-white transition-colors duration-300">
        {action.label}
      </span>
      
      {/* Description */}
      <span className="relative z-10 text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/80 transition-colors duration-300 text-center">
        {action.description}
      </span>
    </button>
  );
};

// Componente para categoría
const QuickStartCategory = ({ category, onAction, expanded = true }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {category.title}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          — {category.description}
        </span>
      </div>
      
      <div className={`grid gap-3 ${
        expanded 
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' 
          : 'flex flex-wrap'
      }`}>
        {category.actions.map((action) => (
          <QuickStartButton
            key={action.id}
            action={action}
            onClick={onAction}
            compact={!expanded}
          />
        ))}
      </div>
    </div>
  );
};

// Componente principal
export const QuickStartActions = ({ onAction, selectedProduct }) => {
  // Filtrar categorías según si hay producto seleccionado
  const filteredCategories = selectedProduct 
    ? QUICK_START_CATEGORIES 
    : QUICK_START_CATEGORIES.filter(c => c.id === 'consultas');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-purple-500/25">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          ¡Hola! Soy SCRUM AI
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Tu asistente inteligente para gestión ágil. 
          {selectedProduct 
            ? ` Trabajando con: ${selectedProduct.nombre}`
            : ' Selecciona un producto o elige una acción rápida para comenzar.'
          }
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-6">
        {filteredCategories.map((category) => (
          <QuickStartCategory
            key={category.id}
            category={category}
            onAction={onAction}
            expanded={true}
          />
        ))}
      </div>

      {/* Tip */}
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Tip: También puedes escribir directamente lo que necesitas en el chat</span>
        </p>
      </div>
    </div>
  );
};

export default QuickStartActions;
