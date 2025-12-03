/**
 * EmptyState - Estado vacío
 */

export const EmptyState = ({ icon, title, description }) => {
  return (
    <div className="text-center py-8">
      {icon && (
        <div className="text-6xl mb-4">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};
