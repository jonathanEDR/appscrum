/**
 * SpecialtyBadge - Badge de especialidad (Product Owner, Scrum Master, Developer)
 */

export const SpecialtyBadge = ({ specialty }) => {
  const specialties = {
    product_owner: {
      icon: '📋',
      label: 'Product Owner',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    },
    scrum_master: {
      icon: '🎭',
      label: 'Scrum Master',
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
    },
    developer: {
      icon: '💻',
      label: 'Developer',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
    },
    unified_system: {
      icon: '🤖',
      label: 'SCRUM AI',
      color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
    }
  };

  const config = specialties[specialty] || specialties.unified_system;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};
