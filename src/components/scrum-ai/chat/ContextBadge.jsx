/**
 * ContextBadge - Badge que muestra el contexto activo
 */

export const ContextBadge = ({ context }) => {
  if (!context) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full">
      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
        {context.product_name || 'Producto'} 
        {context.sprint_name && ` • ${context.sprint_name}`}
      </span>
    </div>
  );
};
