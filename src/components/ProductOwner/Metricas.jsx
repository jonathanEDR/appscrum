import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import config from '../../config/config';
import ApiService from '../../services/apiService';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Download, 
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Calendar,
  Activity,
  Users
} from 'lucide-react';

// Base API URL (usar config central)
const API_BASE_URL = config.API_URL || '';
const apiService = new ApiService();

const Metricas = () => {
  const { getToken } = useAuth();
  const [metricas, setMetricas] = useState(null);
  const [velocityData, setVelocityData] = useState(null);
  const [burndownData, setBurndownData] = useState(null);
  const [productos, setProductos] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSprint, setSelectedSprint] = useState('');
  const [periodo, setPeriodo] = useState('30');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      cargarDatos();
      cargarSprints();
    }
  }, [selectedProduct, periodo]);

  useEffect(() => {
    if (selectedSprint) {
      cargarBurndown();
    }
  }, [selectedSprint]);

  const cargarProductos = async () => {
    try {
      console.log('Iniciando carga de productos...');
      setLoading(true);
      
      // Usar apiService para mejor manejo de errores
      const data = await apiService.get('/products', getToken);
      
      console.log('Datos productos recibidos:', data);
      setProductos(data.products || data.productos || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('Error al cargar productos');
    } finally {
      console.log('Finalizando carga de productos...');
      setLoading(false);
    }
  };

  const cargarSprints = async () => {
    try {
      const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/sprints?producto=${selectedProduct}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Error al cargar sprints');
      const data = await response.json();
      setSprints(data.sprints || []);
    } catch (error) {
      console.error('Error al cargar sprints:', error);
    }
  };

  const cargarDatos = async () => {
    try {
      console.log('Iniciando carga de datos para producto:', selectedProduct);
      setLoading(true);
      setError(null);

      // Usar rutas sin autenticación para testing
      const [dashboardRes, velocityRes] = await Promise.all([
  fetch(`${API_BASE_URL}/metricas/dashboard/${selectedProduct}?periodo=${periodo}`),
  fetch(`${API_BASE_URL}/metricas/velocity/${selectedProduct}`)
      ]);

      console.log('Respuesta dashboard:', dashboardRes.status, dashboardRes.ok);
      console.log('Respuesta velocity:', velocityRes.status, velocityRes.ok);

      if (!dashboardRes.ok) throw new Error('Error al cargar métricas del dashboard');
      if (!velocityRes.ok) throw new Error('Error al cargar datos de velocidad');

      const [dashboardData, velocityDataRes] = await Promise.all([
        dashboardRes.json(),
        velocityRes.json()
      ]);

      console.log('Datos dashboard recibidos:', dashboardData);
      console.log('Datos velocity recibidos:', velocityDataRes);

      setMetricas(dashboardData);
      setVelocityData(velocityDataRes);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError(error.message);
    } finally {
      console.log('Finalizando carga de datos...');
      setLoading(false);
    }
  };

  const cargarBurndown = async () => {
    try {
      const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/metricas/burndown/${selectedSprint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Error al cargar burndown');
      const data = await response.json();
      setBurndownData(data);
    } catch (error) {
      console.error('Error al cargar burndown:', error);
    }
  };

  const exportarMetricas = async (formato) => {
    try {
      const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/metricas/export/${selectedProduct}?formato=${formato}&periodo=${periodo}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al exportar métricas');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `metricas-${new Date().toISOString().split('T')[0]}.${formato}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError(error.message);
    }
  };

  const getTendenciaIcon = (tendencia) => {
    switch (tendencia) {
      case 'creciente':
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'decreciente':
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTendenciaColor = (tendencia) => {
    switch (tendencia) {
      case 'creciente':
        return 'text-green-600';
      case 'decreciente':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Métricas del Producto</h1>
              <p className="text-gray-600">Analiza el rendimiento y progreso del equipo</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={cargarDatos}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <RefreshCw size={20} />
              Actualizar
            </button>
            
            {selectedProduct && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportarMetricas('json')}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Download size={20} />
                  JSON
                </button>
                <button
                  onClick={() => exportarMetricas('csv')}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Download size={20} />
                  CSV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Producto:</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Seleccionar producto</option>
              {productos.map(producto => (
                <option key={producto._id} value={producto._id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Período:</label>
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="7">7 días</option>
                  <option value="30">30 días</option>
                  <option value="90">90 días</option>
                  <option value="180">6 meses</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sprint (Burndown):</label>
                <select
                  value={selectedSprint}
                  onChange={(e) => setSelectedSprint(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Seleccionar sprint</option>
                  {sprints.map(sprint => (
                    <option key={sprint._id} value={sprint._id}>
                      {sprint.nombre} ({sprint.estado})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {selectedProduct ? (
        <>
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'velocity', label: 'Velocidad', icon: TrendingUp },
                  { id: 'burndown', label: 'Burndown', icon: Activity }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'dashboard' && metricas && (
                <DashboardTab metricas={metricas} getTendenciaIcon={getTendenciaIcon} getTendenciaColor={getTendenciaColor} />
              )}
              
              {activeTab === 'velocity' && velocityData && (
                <VelocityTab velocityData={velocityData} getTendenciaIcon={getTendenciaIcon} getTendenciaColor={getTendenciaColor} />
              )}
              
              {activeTab === 'burndown' && (
                <BurndownTab 
                  burndownData={burndownData} 
                  selectedSprint={selectedSprint}
                  sprints={sprints}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12">
          <div className="text-center max-w-md mx-auto">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Selecciona un producto
            </h2>
            <p className="text-gray-500">
              Elige un producto del menú desplegable para ver sus métricas
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente Dashboard Tab
const DashboardTab = ({ metricas, getTendenciaIcon, getTendenciaColor }) => {
  return (
    <div className="space-y-6">
      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-200 rounded-lg">
                <Target className="h-5 w-5 text-green-700" />
              </div>
              <h3 className="font-semibold text-gray-900">Velocidad del Equipo</h3>
            </div>
            <div className={`flex items-center gap-1 ${getTendenciaColor(metricas.velocidad.tendencia)}`}>
              {getTendenciaIcon(metricas.velocidad.tendencia)}
              <span className="text-sm font-medium">{metricas.velocidad.tendencia}</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-700 mb-2">
            {Math.round(metricas.velocidad.promedio)}
          </div>
          <p className="text-sm text-green-600">
            Puntos por sprint • Último: {metricas.velocidad.ultimo_sprint}
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-200 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-700" />
            </div>
            <h3 className="font-semibold text-gray-900">Progreso General</h3>
          </div>
          <div className="text-3xl font-bold text-orange-700 mb-2">
            {Math.round(metricas.progreso.porcentaje)}%
          </div>
          <p className="text-sm text-orange-600">
            {metricas.progreso.historias_completadas} de {metricas.progreso.historias_totales} historias
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-200 rounded-lg">
              <Clock className="h-5 w-5 text-purple-700" />
            </div>
            <h3 className="font-semibold text-gray-900">Calidad</h3>
          </div>
          <div className="text-3xl font-bold text-purple-700 mb-2">
            {metricas.calidad.coberturaPruebas}%
          </div>
          <p className="text-sm text-purple-600">Cobertura de pruebas</p>
        </div>
      </div>

      {/* Gráficos de distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
          <div className="space-y-3">
            {metricas.distribucion.por_estado.map((item, index) => {
              const colors = ['bg-green-500', 'bg-orange-500', 'bg-gray-400', 'bg-blue-500'];
              const bgColors = ['bg-green-100', 'bg-orange-100', 'bg-gray-100', 'bg-blue-100'];
              const textColors = ['text-green-700', 'text-orange-700', 'text-gray-700', 'text-blue-700'];
              
              return (
                <div key={item.estado} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                    <span className="text-sm text-gray-600 capitalize">
                      {item.estado.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]}`}
                        style={{ 
                          width: `${metricas.progreso.historias_totales > 0 
                            ? (item.cantidad / metricas.progreso.historias_totales) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium w-8 text-right ${textColors[index % textColors.length]}`}>
                      {item.cantidad}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Prioridad</h3>
          <div className="space-y-3">
            {metricas.distribucion.por_prioridad.map((item, index) => {
              const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500'];
              const textColors = ['text-red-700', 'text-yellow-700', 'text-green-700'];
              
              return (
                <div key={item.prioridad} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                    <span className="text-sm text-gray-600 capitalize">
                      {item.prioridad}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]}`}
                        style={{ 
                          width: `${metricas.progreso.historias_totales > 0 
                            ? (item.cantidad / metricas.progreso.historias_totales) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium w-8 text-right ${textColors[index % textColors.length]}`}>
                      {item.cantidad}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Métricas adicionales de equipo y calidad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Sprints</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-lg font-bold text-blue-600">{metricas.sprints.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completados</span>
              <span className="text-lg font-bold text-green-600">{metricas.sprints.completados}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">En progreso</span>
              <span className="text-lg font-bold text-orange-600">{metricas.sprints.enProgreso}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Releases</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-lg font-bold text-purple-600">{metricas.releases.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completados</span>
              <span className="text-lg font-bold text-green-600">{metricas.releases.completados}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">En progreso</span>
              <span className="text-lg font-bold text-orange-600">{metricas.releases.enProgreso}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Activity className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Calidad</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Defectos</span>
              <span className="text-lg font-bold text-red-600">{metricas.calidad.defectos}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cobertura</span>
              <span className="text-lg font-bold text-green-600">{metricas.calidad.coberturaPruebas}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">T. Resolución</span>
              <span className="text-lg font-bold text-blue-600">{metricas.calidad.tiempoPromedioResolucion}d</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Velocity Tab
const VelocityTab = ({ velocityData, getTendenciaIcon, getTendenciaColor }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Histórico de Velocidad</h3>
        <div className={`flex items-center gap-2 ${getTendenciaColor(velocityData.trend)}`}>
          {getTendenciaIcon(velocityData.trend)}
          <span className="text-sm font-medium">
            Tendencia: {velocityData.trend}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {Math.round(velocityData.averageVelocity)}
          </div>
          <p className="text-gray-600">Velocidad promedio (puntos por sprint)</p>
        </div>

        {/* Gráfico de velocidad */}
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-2 h-64">
            {velocityData.velocityHistory.map((sprint, index) => {
              const maxVelocidad = Math.max(...velocityData.velocityHistory.map(s => Math.max(s.plannedPoints || 0, s.completedPoints || 0)));
              const alturaPlanificada = ((sprint.plannedPoints || 0) / maxVelocidad) * 100;
              const alturaReal = ((sprint.completedPoints || 0) / maxVelocidad) * 100;
              
              return (
                <div key={sprint.sprintName} className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex items-end gap-1 h-48">
                    <div 
                      className="bg-orange-300 w-4 rounded-t hover:bg-orange-400 transition-colors cursor-pointer"
                      style={{ height: `${alturaPlanificada}%` }}
                      title={`Planificada: ${sprint.plannedPoints} puntos`}
                    ></div>
                    <div 
                      className="bg-orange-600 w-4 rounded-t hover:bg-orange-700 transition-colors cursor-pointer"
                      style={{ height: `${alturaReal}%` }}
                      title={`Completada: ${sprint.completedPoints} puntos`}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    <div className="font-medium">{sprint.sprintName}</div>
                    <div className="text-gray-500">
                      {new Date(sprint.endDate).toLocaleDateString('es-ES', { month: 'short', day: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-300 rounded"></div>
              <span className="text-gray-600">Velocidad Planificada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded"></div>
              <span className="text-gray-600">Velocidad Completada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Burndown Tab
const BurndownTab = ({ burndownData, selectedSprint, sprints }) => {
  if (!selectedSprint) {
    return (
      <div className="text-center py-12">
        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Selecciona un Sprint
        </h3>
        <p className="text-gray-500">
          Elige un sprint del menú desplegable para ver su gráfico burndown
        </p>
      </div>
    );
  }

  if (!burndownData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const maxPuntos = Math.max(...burndownData.datos.map(d => d.puntos_ideales));

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Burndown Chart - {burndownData.sprint.nombre}
            </h3>
            <p className="text-gray-600">
              {new Date(burndownData.sprint.fecha_inicio).toLocaleDateString('es-ES')} - {new Date(burndownData.sprint.fecha_fin).toLocaleDateString('es-ES')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {burndownData.sprint.puntos_totales}
            </div>
            <div className="text-sm text-gray-600">Puntos totales</div>
          </div>
        </div>

        {/* Gráfico burndown */}
        <div className="relative">
          <div className="flex items-end justify-between gap-1 h-64 mb-4">
            {burndownData.datos.map((dia, index) => {
              const alturaIdeal = (dia.puntos_ideales / maxPuntos) * 100;
              const alturaReal = dia.puntos_reales !== null ? (dia.puntos_reales / maxPuntos) * 100 : null;
              
              return (
                <div key={dia.dia} className="flex flex-col items-center gap-1 flex-1">
                  <div className="flex items-end gap-1 h-56">
                    {/* Línea ideal */}
                    <div 
                      className="bg-gray-300 w-2 rounded-t"
                      style={{ height: `${alturaIdeal}%` }}
                      title={`Ideal: ${dia.puntos_ideales} puntos`}
                    ></div>
                    {/* Línea real */}
                    {alturaReal !== null && (
                      <div 
                        className={`w-2 rounded-t ${
                          dia.puntos_reales <= dia.puntos_ideales ? 'bg-green-600' : 'bg-red-600'
                        }`}
                        style={{ height: `${alturaReal}%` }}
                        title={`Real: ${dia.puntos_reales} puntos`}
                      ></div>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    <div>Día {dia.dia}</div>
                    <div className="text-gray-500">
                      {new Date(dia.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span className="text-gray-600">Burndown Ideal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span className="text-gray-600">En tiempo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded"></div>
              <span className="text-gray-600">Retrasado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metricas;

