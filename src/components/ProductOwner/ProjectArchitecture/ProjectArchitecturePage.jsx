import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  Boxes, 
  Package, 
  Workflow, 
  Plug, 
  FileText, 
  Settings,
  AlertCircle,
  Loader2,
  FolderTree
} from 'lucide-react';
import useProjectArchitecture from '../../../hooks/useProjectArchitecture';
import { useAuth } from '@clerk/clerk-react';
import { useTheme } from '../../../context/ThemeContext';
import TechStackEditor from './TechStackTab/TechStackEditor';
import { OverviewTab } from './OverviewTab';
import { ModulesTab } from './ModulesTab';
import { EndpointsTab } from './EndpointsTab';
import { IntegrationsTab } from './IntegrationsTab';
import { DecisionsTab } from './DecisionsTab';
import { ConfigTab } from './ConfigTab';
import { DirectoryStructureTab } from './DirectoryStructureTab';
import { apiService } from '../../../services/apiService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProjectArchitecturePage = () => {
  const { productId: urlProductId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { theme } = useTheme();
  
  const [selectedProductId, setSelectedProductId] = useState(urlProductId || '');
  const [productos, setProductos] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const {
    architecture,
    loading,
    error,
    successMessage,
    stats,
    createArchitecture,
    updateArchitecture,
    checkExists,
    updateTechStack,
    addModule,
    updateModule,
    deleteModule,
    addEndpoint,
    updateEndpoints,
    addIntegration,
    addDecision
  } = useProjectArchitecture(selectedProductId, getToken);

  // Cargar productos usando apiService
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await apiService.request('/products', { method: 'GET' }, getToken);
        setProductos(data.products || data || []);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductos();
  }, [getToken]);

  // Actualizar URL cuando cambia el producto seleccionado
  useEffect(() => {
    if (selectedProductId && selectedProductId !== urlProductId) {
      navigate(`/product_owner/architecture/${selectedProductId}`, { replace: true });
    }
  }, [selectedProductId, urlProductId, navigate]);

  // Crear arquitectura inicial si no existe
  const handleCreateArchitecture = async () => {
    try {
      await createArchitecture({
        general: {
          project_name: productos.find(p => p._id === selectedProductId)?.nombre || 'Nuevo Proyecto',
          project_type: 'web_app',
          description: '',
          scale: 'small'
        }
      });
    } catch (err) {
      console.error('Error al crear arquitectura:', err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tech-stack', label: 'Tech Stack', icon: Boxes },
    { id: 'structure', label: 'Estructura', icon: FolderTree },
    { id: 'modules', label: 'Módulos', icon: Package },
    { id: 'endpoints', label: 'Endpoints', icon: Workflow },
    { id: 'integrations', label: 'Integraciones', icon: Plug },
    { id: 'decisions', label: 'Decisiones', icon: FileText },
    { id: 'config', label: 'Configuración', icon: Settings }
  ];

  const getCompletenessColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const selectedProduct = productos.find(p => p._id === selectedProductId);

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <button
            onClick={() => navigate('/product_owner/productos')}
            className={`flex items-center mb-3 md:mb-4 transition-colors text-sm md:text-base ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-gray-200' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft size={18} className="mr-1.5 md:mr-2" />
            <span className="hidden sm:inline">Volver a Productos</span>
            <span className="sm:hidden">Volver</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className={`text-xl md:text-3xl font-bold flex items-center gap-2 md:gap-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Boxes className="text-blue-600 flex-shrink-0" size={24} />
                <span className="hidden sm:inline">Arquitectura del Proyecto</span>
                <span className="sm:hidden">Arquitectura</span>
              </h1>
              <p className={`mt-1 text-sm md:text-base hidden sm:block ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Gestiona la arquitectura técnica completa de tu proyecto
              </p>
            </div>
          </div>
        </div>

        {/* Selector de Producto */}
        <div className={`rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-6 border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Seleccionar Producto
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className={`w-full px-3 md:px-4 py-2.5 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            disabled={loadingProducts}
          >
            <option value="">Seleccione un producto...</option>
            {productos.map((producto) => (
              <option key={producto._id} value={producto._id}>
                {producto.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Mensajes */}
        {successMessage && (
          <div className={`px-4 py-3 rounded-lg mb-4 flex items-center gap-2 ${
            theme === 'dark'
              ? 'bg-green-900/30 border border-green-800 text-green-400'
              : 'bg-green-50 border border-green-200 text-green-800'
          }`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {successMessage}
          </div>
        )}

        {error && (
          <div className={`px-4 py-3 rounded-lg mb-4 flex items-center gap-2 ${
            theme === 'dark'
              ? 'bg-red-900/30 border border-red-800 text-red-400'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Contenido Principal */}
        {!selectedProductId ? (
          <div className={`rounded-xl shadow-md p-12 text-center border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <Boxes size={64} className={`mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Selecciona un Producto
            </h3>
            <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
              Elige un producto para gestionar su arquitectura
            </p>
          </div>
        ) : loading ? (
          <div className={`rounded-xl shadow-md p-12 text-center border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <Loader2 size={48} className="mx-auto text-blue-600 animate-spin mb-4" />
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Cargando arquitectura...</p>
          </div>
        ) : !architecture ? (
          <div className={`rounded-xl shadow-md p-12 text-center border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <Boxes size={64} className={`mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              No hay arquitectura definida
            </h3>
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Este producto aún no tiene una arquitectura configurada
            </p>
            <button
              onClick={handleCreateArchitecture}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Crear Arquitectura
            </button>
          </div>
        ) : (
          <>
            {/* Stats Header */}
            <div className={`rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-6 border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
                {/* Completeness Score */}
                <div className={`text-center p-2 md:p-4 rounded-lg col-span-3 md:col-span-1 ${
                  theme === 'dark'
                    ? 'bg-blue-900/30'
                    : 'bg-gradient-to-br from-blue-50 to-blue-100'
                }`}>
                  <div className={`text-2xl md:text-3xl font-bold ${getCompletenessColor(stats.completenessScore)}`}>
                    {stats.completenessScore}%
                  </div>
                  <div className={`text-xs md:text-sm mt-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Completitud</div>
                </div>

                {/* Módulos */}
                <div className={`text-center p-2 md:p-4 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-purple-900/30'
                    : 'bg-gradient-to-br from-purple-50 to-purple-100'
                }`}>
                  <div className="text-xl md:text-3xl font-bold text-purple-600">
                    {stats.totalModules}
                  </div>
                  <div className={`text-[10px] md:text-sm mt-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Módulos</div>
                </div>

                {/* Endpoints */}
                <div className={`text-center p-2 md:p-4 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-green-900/30'
                    : 'bg-gradient-to-br from-green-50 to-green-100'
                }`}>
                  <div className="text-xl md:text-3xl font-bold text-green-600">
                    {stats.totalEndpoints}
                  </div>
                  <div className={`text-[10px] md:text-sm mt-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Endpoints</div>
                </div>

                {/* Integraciones */}
                <div className={`text-center p-2 md:p-4 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-orange-900/30'
                    : 'bg-gradient-to-br from-orange-50 to-orange-100'
                }`}>
                  <div className="text-xl md:text-3xl font-bold text-orange-600">
                    {stats.totalIntegrations}
                  </div>
                  <div className={`text-[10px] md:text-sm mt-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Integraciones</div>
                </div>

                {/* Decisiones */}
                <div className={`text-center p-2 md:p-4 rounded-lg hidden md:block ${
                  theme === 'dark'
                    ? 'bg-pink-900/30'
                    : 'bg-gradient-to-br from-pink-50 to-pink-100'
                }`}>
                  <div className="text-xl md:text-3xl font-bold text-pink-600">
                    {stats.totalDecisions}
                  </div>
                  <div className={`text-[10px] md:text-sm mt-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Decisiones</div>
                </div>
              </div>

              {/* Metadata */}
              <div className={`mt-3 md:mt-4 pt-3 md:pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs md:text-sm ${
                theme === 'dark' 
                  ? 'border-gray-700 text-gray-400' 
                  : 'border-gray-200 text-gray-600'
              }`}>
                <div className="truncate max-w-full">
                  <span className="font-medium">Proyecto:</span> {selectedProduct?.nombre}
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <div>
                    <span className="font-medium">Estado:</span>{' '}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${
                      architecture.general?.status === 'active' 
                        ? theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800'
                        : architecture.general?.status === 'draft' 
                          ? theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-800'
                          : theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {architecture.general?.status || 'draft'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="font-medium">v</span>{architecture.general?.version || '1.0.0'}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className={`rounded-t-xl shadow-md border border-b-0 overflow-x-auto scrollbar-hide ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-3 md:py-4 font-medium transition-all whitespace-nowrap text-xs md:text-sm ${
                        activeTab === tab.id
                          ? theme === 'dark'
                            ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-900/30'
                            : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className={`rounded-b-xl shadow-md p-3 md:p-6 border min-h-[300px] md:min-h-[400px] ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              {activeTab === 'overview' && (
                <OverviewTab 
                  architecture={architecture}
                  stats={stats}
                  theme={theme}
                />
              )}
              {activeTab === 'tech-stack' && (
                <TechStackEditor 
                  architecture={architecture}
                  onSave={updateTechStack}
                  loading={loading}
                  theme={theme}
                />
              )}
              {activeTab === 'structure' && (
                <DirectoryStructureTab 
                  architecture={architecture}
                  onSave={updateArchitecture}
                  loading={loading}
                  theme={theme}
                />
              )}
              {activeTab === 'modules' && (
                <ModulesTab 
                  architecture={architecture}
                  onAddModule={addModule}
                  onUpdateModule={updateModule}
                  onDeleteModule={deleteModule}
                  loading={loading}
                  theme={theme}
                />
              )}
              {activeTab === 'endpoints' && (
                <EndpointsTab 
                  architecture={architecture}
                  onAddEndpoint={addEndpoint}
                  onUpdateEndpoints={updateEndpoints}
                  loading={loading}
                  theme={theme}
                />
              )}
              {activeTab === 'integrations' && (
                <IntegrationsTab 
                  architecture={architecture}
                  onAddIntegration={addIntegration}
                  onUpdateArchitecture={updateArchitecture}
                  loading={loading}
                  theme={theme}
                />
              )}
              {activeTab === 'decisions' && (
                <DecisionsTab 
                  architecture={architecture}
                  onAddDecision={addDecision}
                  onUpdateArchitecture={updateArchitecture}
                  loading={loading}
                  theme={theme}
                />
              )}
              {activeTab === 'config' && (
                <ConfigTab 
                  architecture={architecture}
                  onUpdateArchitecture={updateArchitecture}
                  loading={loading}
                  theme={theme}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectArchitecturePage;
