import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
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

// Usar el proxy de Vite que redirige /api a http://localhost:5000
const API_BASE_URL = '';

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
      const token = await getToken();
      console.log('Token obtenido:', token ? 'Sí' : 'No');
      
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Respuesta productos:', response.status, response.ok);
      if (!response.ok) throw new Error('Error al cargar productos');
      
      const data = await response.json();
      console.log('Datos productos recibidos:', data);
      setProductos(data.products || []);
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
      const response = await fetch(`${API_BASE_URL}/api/sprints?producto=${selectedProduct}`, {
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

      const token = await getToken();
      console.log('Token para métricas obtenido:', token ? 'Sí' : 'No');

      const [dashboardRes, velocityRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/metricas/dashboard/${selectedProduct}?periodo=${periodo}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/metricas/velocity/${selectedProduct}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
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
      const response = await fetch(`${API_BASE_URL}/api/metricas/burndown/${selectedSprint}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/metricas/export/${selectedProduct}?formato=${formato}&periodo=${periodo}`, {
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

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-200 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-700" />
            </div>
            <h3 className="font-semibold text-gray-900">Progreso General</h3>
          </div>
          <div className="text-3xl font-bold text-blue-700 mb-2">
            {Math.round(metricas.progreso.porcentaje)}%
          </div>
          <p className="text-sm text-blue-600">
            {metricas.progreso.historias_completadas} de {metricas.progreso.historias_totales} historias
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-200 rounded-lg">
              <Clock className="h-5 w-5 text-purple-700" />
            </div>
            <h3 className="font-semibold text-gray-900">Precisión</h3>
          </div>
          <div className="text-3xl font-bold text-purple-700 mb-2">
            {Math.round(metricas.calidad.precision_estimacion * 100)}%
          </div>
          <p className="text-sm text-purple-600">Precisión de estimación</p>
        </div>
      </div>

      {/* Gráficos de distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
          <div className="space-y-3">
            {metricas.distribucion.por_estado.map(item => (
              <div key={item.estado} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {item.estado.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ 
                        width: `${metricas.progreso.historias_totales > 0 
                          ? (item.cantidad / metricas.progreso.historias_totales) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {item.cantidad}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Prioridad</h3>
          <div className="space-y-3">
            {metricas.distribucion.por_prioridad.map(item => (
              <div key={item.prioridad} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {item.prioridad}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ 
                        width: `${metricas.progreso.historias_totales > 0 
                          ? (item.cantidad / metricas.progreso.historias_totales) * 100 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {item.cantidad}
                  </span>
                </div>
              </div>
            ))}
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
        <div className={`flex items-center gap-2 ${getTendenciaColor(velocityData.tendencia)}`}>
          {getTendenciaIcon(velocityData.tendencia)}
          <span className="text-sm font-medium">
            Tendencia: {velocityData.tendencia}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {Math.round(velocityData.promedio)}
          </div>
          <p className="text-gray-600">Velocidad promedio (puntos por sprint)</p>
        </div>

        {/* Gráfico de velocidad */}
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-2 h-64">
            {velocityData.sprints.map((sprint, index) => {
              const maxVelocidad = Math.max(...velocityData.sprints.map(s => Math.max(s.velocidad_planificada || 0, s.velocidad_real || 0)));
              const alturaPlanificada = ((sprint.velocidad_planificada || 0) / maxVelocidad) * 100;
              const alturaReal = ((sprint.velocidad_real || 0) / maxVelocidad) * 100;
              
              return (
                <div key={sprint._id} className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex items-end gap-1 h-48">
                    <div 
                      className="bg-blue-300 w-4 rounded-t"
                      style={{ height: `${alturaPlanificada}%` }}
                      title={`Planificada: ${sprint.velocidad_planificada}`}
                    ></div>
                    <div 
                      className="bg-blue-600 w-4 rounded-t"
                      style={{ height: `${alturaReal}%` }}
                      title={`Real: ${sprint.velocidad_real}`}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    <div className="font-medium">{sprint.nombre}</div>
                    <div className="text-gray-500">
                      {new Date(sprint.fecha_fin).toLocaleDateString('es-ES', { month: 'short' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-300 rounded"></div>
              <span className="text-gray-600">Velocidad Planificada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-gray-600">Velocidad Real</span>
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

