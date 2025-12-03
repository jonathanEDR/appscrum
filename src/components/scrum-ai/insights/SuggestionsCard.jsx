/**
 * SuggestionsCard - Sugerencias inteligentes de SCRUM AI
 */

import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

export const SuggestionsCard = () => {
  // TODO: Obtener sugerencias reales del backend
  const suggestions = [
    {
      id: 1,
      type: 'warning',
      icon: AlertTriangle,
      title: 'Historias sin estimar',
      message: '3 historias de alta prioridad necesitan estimación',
      color: 'text-orange-500'
    },
    {
      id: 2,
      type: 'suggestion',
      icon: Lightbulb,
      title: 'Momento de retrospectiva',
      message: 'El sprint termina en 2 días. ¿Preparamos la retro?',
      color: 'text-indigo-500'
    },
    {
      id: 3,
      type: 'success',
      icon: TrendingUp,
      title: 'Buen avance',
      message: 'El equipo completó 8 de 12 tareas esta semana',
      color: 'text-green-500'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span>💡</span>
        SUGERENCIAS AI
      </h3>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
          >
            <div className="flex gap-2">
              <suggestion.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${suggestion.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {suggestion.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {suggestion.message}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
