/**
 * WelcomeChat - Pantalla de bienvenida mejorada
 * Se muestra cuando no hay mensajes en el chat
 */

import { 
  Sparkles, 
  Package, 
  GitBranch, 
  ListTodo, 
  Users,
  Zap,
  ArrowRight
} from 'lucide-react';

const QUICK_PROMPTS = [
  {
    id: 'products',
    icon: Package,
    label: 'Mis Productos',
    prompt: 'Muéstrame los productos disponibles',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'sprints',
    icon: GitBranch,
    label: 'Sprints Activos',
    prompt: 'Muéstrame los sprints activos',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'backlog',
    icon: ListTodo,
    label: 'Product Backlog',
    prompt: 'Muéstrame el backlog del producto',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'team',
    icon: Users,
    label: 'Equipo',
    prompt: 'Muéstrame los miembros del equipo',
    color: 'from-pink-500 to-rose-600'
  }
];

export const WelcomeChat = ({ onSendMessage }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-gradient-to-r from-indigo-500/3 via-purple-500/3 to-pink-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Logo animado */}
        <div className="relative inline-flex mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <div className="absolute -inset-1 rounded-2xl md:rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-lg animate-pulse"></div>
        </div>

        {/* Título principal */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            ¡Hola! Soy SCRUM AI
          </span>
        </h1>
        
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 md:mb-8 max-w-md mx-auto px-4">
          Tu asistente inteligente para gestión ágil. 
          <span className="text-indigo-600 dark:text-indigo-400 font-medium"> Pregúntame lo que necesites</span> o selecciona una acción rápida.
        </p>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8 px-2">
          {QUICK_PROMPTS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSendMessage(item.prompt)}
                className={`
                  group relative flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl
                  bg-white dark:bg-gray-800/80 
                  border border-gray-200 dark:border-gray-700
                  hover:border-transparent
                  shadow-sm hover:shadow-xl
                  transform transition-all duration-300
                  hover:scale-[1.02] hover:-translate-y-1
                  overflow-hidden
                `}
              >
                {/* Gradient overlay on hover */}
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-100
                  bg-gradient-to-br ${item.color}
                  transition-opacity duration-300
                `} />
                
                {/* Icon */}
                <div className={`
                  relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl
                  bg-gradient-to-br ${item.color}
                  flex items-center justify-center
                  shadow-lg group-hover:shadow-white/25
                  transition-all duration-300
                  group-hover:scale-110
                `}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                
                {/* Label */}
                <span className="relative z-10 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tip */}
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" />
          <span className="text-xs md:text-sm text-amber-700 dark:text-amber-300">
            Escribe directamente en el chat
          </span>
          <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500 hidden md:block" />
        </div>
      </div>
    </div>
  );
};
