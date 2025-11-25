import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target, 
  Users, 
  CheckCircle,
  Download,
  Zap,
  AlertTriangle,
  Award,
  Minus
} from 'lucide-react';

const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => {
  const { theme } = useTheme();
  
  const colorClasses = {
    blue: theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600',
    green: theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600',
    red: theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600',
    yellow: theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-600',
    purple: theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className={`p-6 rounded-lg border ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>{title}</p>
            {trend && getTrendIcon()}
          </div>
          <p className={`text-2xl font-bold mt-1 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{value}</p>
          {subtitle && <p className={`text-sm mt-1 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

const VelocityChart = ({ data = [] }) => {
  const { theme } = useTheme();
  
  if (!data.length) {
    return (
      <div className={`h-64 flex items-center justify-center ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
      }`}>
        No hay datos de velocidad disponibles
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.storyPoints || 0, d.taskCount || 0)));

  return (
    <div className="h-64 flex items-end justify-between space-x-2 p-4">
      {data.map((sprint, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="flex flex-col items-center w-full mb-2" style={{ height: '200px' }}>
            <div className="flex justify-center w-full h-full items-end space-x-1">
              <div
                className="bg-blue-500 rounded-t min-w-[20px]"
                style={{ 
                  height: `${((sprint.storyPoints || 0) / maxValue) * 100}%`,
                  minHeight: sprint.storyPoints ? '4px' : '0px'
                }}
                title={`Story Points: ${sprint.storyPoints || 0}`}
              />
              <div
                className="bg-green-500 rounded-t min-w-[20px]"
                style={{ 
                  height: `${((sprint.taskCount || 0) / maxValue) * 100}%`,
                  minHeight: sprint.taskCount ? '4px' : '0px'
                }}
                title={`Tareas: ${sprint.taskCount || 0}`}
              />
            </div>
          </div>
          <div className={`text-xs text-center mt-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className="font-medium">{sprint.sprintName || `Sprint ${index + 1}`}</div>
            <div className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
              {sprint.storyPoints || 0} SP
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Metrics = () => {
  const { theme } = useTheme();
  const [metricsData, setMetricsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const mockMetrics = {
    sprintCompletion: { value: 85, trend: 'up' },
    velocity: { value: 42, trend: 'up' },
    burndownRate: { value: 0.85, trend: 'down' },
    teamEfficiency: { value: 92, trend: 'up' },
    blockers: { value: 3, trend: 'down' },
    codeQuality: { value: 8.5, trend: 'up' }
  };

  const mockVelocityData = [
    { sprintName: 'Sprint 18', storyPoints: 32, taskCount: 18 },
    { sprintName: 'Sprint 19', storyPoints: 38, taskCount: 22 },
    { sprintName: 'Sprint 20', storyPoints: 35, taskCount: 20 },
    { sprintName: 'Sprint 21', storyPoints: 42, taskCount: 24 },
    { sprintName: 'Sprint 22', storyPoints: 39, taskCount: 21 }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMetricsData(mockMetrics);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Métricas del Proyecto</h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Visualiza el rendimiento y progreso del equipo
          </p>
        </div>
        
        <div className="flex gap-2">
          <select className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}>
            <option value="30">Últimos 30 días</option>
            <option value="60">Últimos 60 días</option>
            <option value="90">Últimos 90 días</option>
          </select>
          <button className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            theme === 'dark'
              ? 'text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}>
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className={`border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Vista General', icon: BarChart3 },
            { id: 'velocity', name: 'Velocidad', icon: TrendingUp },
            { id: 'quality', name: 'Calidad', icon: CheckCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : theme === 'dark'
                      ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <MetricCard
              title="Completitud Sprint"
              value={`${metricsData.sprintCompletion?.value || 0}%`}
              icon={Target}
              color="green"
              trend={metricsData.sprintCompletion?.trend}
            />
            <MetricCard
              title="Velocidad"
              value={`${metricsData.velocity?.value || 0} SP`}
              subtitle="Story Points"
              icon={Zap}
              color="blue"
              trend={metricsData.velocity?.trend}
            />
            <MetricCard
              title="Burndown Rate"
              value={metricsData.burndownRate?.value?.toFixed(2) || '0.00'}
              icon={TrendingDown}
              color="purple"
              trend={metricsData.burndownRate?.trend}
            />
            <MetricCard
              title="Eficiencia"
              value={`${metricsData.teamEfficiency?.value || 0}%`}
              icon={Award}
              color="green"
              trend={metricsData.teamEfficiency?.trend}
            />
            <MetricCard
              title="Impedimentos"
              value={metricsData.blockers?.value || 0}
              icon={AlertTriangle}
              color="red"
              trend={metricsData.blockers?.trend}
            />
            <MetricCard
              title="Calidad Código"
              value={metricsData.codeQuality?.value || 0}
              subtitle="/10"
              icon={CheckCircle}
              color="blue"
              trend={metricsData.codeQuality?.trend}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Velocidad del Equipo</h3>
              <VelocityChart data={mockVelocityData} />
            </div>
            <div className={`p-6 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Burndown Chart</h3>
              <div className={`h-64 flex items-center justify-center ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Gráfica de burndown en desarrollo...
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'velocity' && (
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Análisis de Velocidad</h3>
          <VelocityChart data={mockVelocityData} />
          <div className={`mt-6 text-center ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Análisis detallado de velocidad en desarrollo...
          </div>
        </div>
      )}

      {activeTab === 'quality' && (
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Métricas de Calidad</h3>
          <div className={`text-center py-8 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Gráficas de calidad en desarrollo...
          </div>
        </div>
      )}
    </div>
  );
};

export default Metrics;
