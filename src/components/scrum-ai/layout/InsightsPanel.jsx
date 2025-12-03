/**
 * InsightsPanel - Panel izquierdo con contexto e insights
 */

import { ProjectContextCard } from '../insights/ProjectContextCard';
import { MetricsWidget } from '../insights/MetricsWidget';
import { SuggestionsCard } from '../insights/SuggestionsCard';
import { QuickActionsGrid } from '../insights/QuickActionsGrid';

export const InsightsPanel = () => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Contexto del Proyecto */}
      <ProjectContextCard />

      {/* Métricas Rápidas */}
      <MetricsWidget />

      {/* Sugerencias AI */}
      <SuggestionsCard />

      {/* Acciones Rápidas */}
      <QuickActionsGrid />
    </div>
  );
};
