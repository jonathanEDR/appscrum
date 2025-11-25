import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useTheme } from '../../context/ThemeContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Target,
  Activity 
} from 'lucide-react';
import config from '../../config/config';

const API_BASE_URL = config.API_URL || import.meta.env.VITE_API_URL || '';

const BurndownChart = ({ sprintId, onClose }) => {
  const { getToken } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [burndownData, setBurndownData] = useState(null);

  useEffect(() => {
    if (sprintId) {
      cargarBurndownData();
    }
  }, [sprintId]);

  const cargarBurndownData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await getToken();
      
      const response = await fetch(`${API_BASE_URL}/sprints/${sprintId}/burndown-data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Burndown data received:', data);
        setBurndownData(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar datos de burndown');
      }
    } catch (error) {
      console.error('Error loading burndown:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Custom tooltip para el gráfico
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`border rounded-lg shadow-lg p-4 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-300'
        }`}>
          <p className={`font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>Día {label}</p>
          <p className={`text-sm mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>{data.date}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Ideal:</span>
              <span className={`font-semibold ml-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>{data.ideal} pts</span>
            </p>
            <p className="text-sm">
              <span className="text-blue-600">Real:</span>
              <span className="font-semibold text-blue-700 ml-2">{data.actual} pts</span>
            </p>
            {data.prediction !== undefined && (
              <p className="text-sm">
                <span className="text-orange-500">Predicción:</span>
                <span className="font-semibold text-orange-600 ml-2">{data.prediction} pts</span>
              </p>
            )}
            <p className="text-sm border-t pt-1 mt-1">
              <span className="text-green-600">Completado:</span>
              <span className="font-semibold text-green-700 ml-2">{data.completed} pts</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Iconos según tendencia
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'ahead':
        return <TrendingDown className="h-5 w-5 text-green-600" />;
      case 'behind':
        return <TrendingUp className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTrendText = (trend) => {
    switch (trend) {
      case 'ahead':
        return { text: 'Adelantado', color: 'text-green-600', bg: 'bg-green-100' };
      case 'behind':
        return { text: 'Retrasado', color: 'text-red-600', bg: 'bg-red-100' };
      default:
        return { text: 'En camino', color: 'text-blue-600', bg: 'bg-blue-100' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className={`ml-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>Cargando burndown chart...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className={`flex items-center gap-3 border rounded-lg p-4 ${
          theme === 'dark'
            ? 'bg-red-900/20 border-red-800'
            : 'bg-red-50 border-red-200'
        }`}>
          <AlertCircle className={`h-6 w-6 flex-shrink-0 ${
            theme === 'dark' ? 'text-red-400' : 'text-red-600'
          }`} />
          <div>
            <p className={`font-semibold ${
              theme === 'dark' ? 'text-red-400' : 'text-red-800'
            }`}>Error al cargar burndown</p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-red-500' : 'text-red-600'
            }`}>{error}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`mt-4 px-4 py-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Cerrar
          </button>
        )}
      </div>
    );
  }

  if (!burndownData || burndownData.totalPoints === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className={`border-2 rounded-xl p-8 shadow-lg ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700'
            : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 rounded-full ${
              theme === 'dark' ? 'bg-blue-900/40' : 'bg-blue-100'
            }`}>              <Activity className="h-8 w-8 text-blue-600" />            </div>            <div className="flex-1">              <h3 className={`text-xl font-bold mb-2 ${                theme === 'dark' ? 'text-white' : 'text-gray-800'              }`}>                Burndown Chart - Sin Datos Disponibles              </h3>              <p className={`mb-4 ${                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'              }`}>                Este sprint a\u00fan no tiene suficiente informaci\u00f3n para mostrar el gr\u00e1fico de burndown.              </p>            </div>          </div>          <div className={`rounded-lg p-6 mb-6 border ${            theme === 'dark'              ? 'bg-gray-800/50 border-blue-800'              : 'bg-white border-blue-100'          }`}>
            <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              <AlertCircle className="h-5 w-5 text-blue-600" />
              ¿Qué necesitas para ver el burndown?
            </h4>
            <ul className={`space-y-3 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <li className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                <div>
                  <p className="font-medium">Asignar historias al sprint</p>
                  <p className="text-gray-600">Ve a <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">Sprint Planning</span> y arrastra historias del backlog al sprint</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                <div>
                  <p className="font-medium">Asegúrate que las historias tengan story points</p>
                  <p className="text-gray-600">Cada historia debe tener un valor estimado en puntos</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                <div>
                  <p className="font-medium">Iniciar el sprint</p>
                  <p className="text-gray-600">Cambia el estado del sprint a <span className="font-mono bg-green-100 text-green-700 px-2 py-0.5 rounded">Activo</span></p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">4</span>
                <div>
                  <p className="font-medium">Completar historias</p>
                  <p className="text-gray-600">A medida que completes historias, el gráfico se actualizará automáticamente</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-800 mb-1">Estado actual del sprint:</p>
              <p className="text-yellow-700">
                {!burndownData ? 'No hay datos disponibles' : 
                 burndownData.totalPoints === 0 ? 'Sprint sin story points asignados' : 
                 'Sprint sin progreso registrado'}
              </p>
            </div>
          </div>
        </div>

        {onClose && (
          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-lg transition-colors font-medium ${                theme === 'dark'                  ? 'bg-gray-600 hover:bg-gray-700 text-white'                  : 'bg-gray-600 hover:bg-gray-700 text-white'              }`}            >              Cerrar            </button>          </div>        )}
      </div>
    );
  }

  const { 
    data, 
    totalPoints, 
    pointsCompleted, 
    pointsRemaining, 
    totalDays,
    daysElapsed,
    daysRemaining,
    currentVelocity,
    percentComplete,
    trend,
    prediction,
    sprint
  } = burndownData;

  const trendInfo = getTrendText(trend);

  return (
    <div className="space-y-6">
      {/* Header con información del sprint */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-2xl font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            <Activity className="h-6 w-6 text-blue-600" />
            Burndown Chart
          </h3>
          <p className={`text-sm mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>{sprint.nombre}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${trendInfo.bg}`}>
          {getTrendIcon(trend)}
          <span className={`font-semibold ${trendInfo.color}`}>{trendInfo.text}</span>
        </div>
      </div>

      {/* Métricas clave */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`border rounded-lg p-4 ${
          theme === 'dark'
            ? 'bg-blue-900/20 border-blue-800'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-blue-600" />
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>Total Points</span>
          </div>
          <p className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-900'
          }`}>{totalPoints}</p>
        </div>

        <div className={`border rounded-lg p-4 ${
          theme === 'dark'
            ? 'bg-green-900/20 border-green-800'
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>Completado</span>
          </div>
          <p className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-green-300' : 'text-green-900'
          }`}>
            {pointsCompleted} <span className={`text-sm ${
              theme === 'dark' ? 'text-green-500' : 'text-green-600'
            }`}>({percentComplete}%)</span>
          </p>
        </div>

        <div className={`border rounded-lg p-4 ${
          theme === 'dark'
            ? 'bg-orange-900/20 border-orange-800'
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
            }`}>Restante</span>
          </div>
          <p className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-orange-300' : 'text-orange-900'
          }`}>{pointsRemaining}</p>
        </div>

        <div className={`border rounded-lg p-4 ${
          theme === 'dark'
            ? 'bg-purple-900/20 border-purple-800'
            : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>Velocidad</span>
          </div>
          <p className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-purple-300' : 'text-purple-900'
          }`}>
            {currentVelocity} <span className={`text-sm ${
              theme === 'dark' ? 'text-purple-500' : 'text-purple-600'
            }`}>pts/día</span>
          </p>
        </div>
      </div>

      {/* Gráfico de burndown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              label={{ value: 'Días del Sprint', position: 'insideBottom', offset: -5 }}
              stroke="#6b7280"
            />
            <YAxis 
              label={{ value: 'Story Points', angle: -90, position: 'insideLeft' }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="line"
            />
            
            {/* Línea de hoy */}
            {daysElapsed >= 0 && daysElapsed <= totalDays && (
              <ReferenceLine 
                x={daysElapsed} 
                stroke="#94a3b8" 
                strokeDasharray="5 5"
                label={{ value: 'Hoy', position: 'top', fill: '#64748b' }}
              />
            )}
            
            {/* Líneas del gráfico */}
            <Line 
              type="monotone" 
              dataKey="ideal" 
              stroke="#94a3b8" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Línea Ideal"
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Línea Real"
            />
            {data.some(d => d.prediction !== undefined) && (
              <Line 
                type="monotone" 
                dataKey="prediction" 
                stroke="#f97316" 
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
                name="Predicción"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Predicción y estado */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Predicción de completación */}
        <div className={`border rounded-lg p-4 ${
          prediction.willComplete 
            ? (theme === 'dark' ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200')
            : (theme === 'dark' ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200')
        }`}>
          <div className="flex items-start gap-3">
            {prediction.willComplete ? (
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <p className={`font-semibold ${
                prediction.willComplete 
                  ? (theme === 'dark' ? 'text-green-400' : 'text-green-800')
                  : (theme === 'dark' ? 'text-red-400' : 'text-red-800')
              }`}>
                Predicción de Completación
              </p>
              <p className={`text-sm mt-1 ${
                prediction.willComplete 
                  ? (theme === 'dark' ? 'text-green-500' : 'text-green-700')
                  : (theme === 'dark' ? 'text-red-500' : 'text-red-700')
              }`}>
                {prediction.message}
              </p>
              <p className={`text-xs mt-2 ${
                prediction.willComplete 
                  ? (theme === 'dark' ? 'text-green-600' : 'text-green-600')
                  : (theme === 'dark' ? 'text-red-600' : 'text-red-600')
              }`}>
                Fecha estimada: {new Date(prediction.estimatedCompletionDate).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>

        {/* Información temporal */}
        <div className={`border rounded-lg p-4 ${
          theme === 'dark'
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-start gap-3">
            <Clock className={`h-6 w-6 flex-shrink-0 mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <div className="flex-1">
              <p className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>Progreso Temporal</p>
              <div className={`mt-2 space-y-1 text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <p>Días totales: <span className="font-semibold">{totalDays}</span></p>
                <p>Días transcurridos: <span className="font-semibold">{daysElapsed}</span></p>
                <p>Días restantes: <span className="font-semibold">{Math.max(0, daysRemaining)}</span></p>
              </div>
              <div className={`mt-3 rounded-full h-2 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${Math.min(100, (daysElapsed / totalDays) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón cerrar */}
      {onClose && (
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2 font-medium rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default BurndownChart;
