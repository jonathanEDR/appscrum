/**
 * LoadingCard - Card de carga
 */

export const LoadingCard = ({ message = 'Cargando...' }) => {
  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-8 shadow-sm">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-500 dark:border-t-indigo-400"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};
