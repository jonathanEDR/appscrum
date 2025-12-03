/**
 * DatabaseSchemaPage
 * Página principal para gestionar esquemas de base de datos
 * 
 * @module components/ProductOwner/DatabaseSchema/DatabaseSchemaPage
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useTheme } from '../../../context/ThemeContext';
import { useDatabaseSchema } from '../../../hooks/useDatabaseSchema';
import { 
  Database, 
  Layers, 
  GitBranch, 
  Settings, 
  Plus, 
  Download, 
  RefreshCw,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

// Componentes
import EntityList from './EntityList';
import ImportCodeModal from './ImportCodeModal';
import EntityDetailsModal from './EntityDetailsModal';
import RelationshipDiagram from './RelationshipDiagram';
import SchemaConfiguration from './SchemaConfiguration';

const DatabaseSchemaPage = () => {
  const { productId: urlProductId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { theme } = useTheme();
  
  // Estado local
  const [activeTab, setActiveTab] = useState('entities');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEntityDetails, setShowEntityDetails] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Hook del schema
  const {
    productId,
    schema,
    entities,
    selectedEntity,
    relationshipMap,
    stats,
    loading,
    importing,
    error,
    successMessage,
    setProductId,
    fetchEntity,
    fetchRelationshipMap,
    setSelectedEntity,
    importCode,
    deleteEntity,
    generateCode,
    downloadSchema,
    updateSchemaConfig,
    refresh,
    clearMessages
  } = useDatabaseSchema(urlProductId);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Cargar productos disponibles
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/products`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || data || []);
        }
      } catch (err) {
        console.error('Error al cargar productos:', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [getToken, API_URL]);

  // Sincronizar productId desde URL
  useEffect(() => {
    if (urlProductId && urlProductId !== productId) {
      setProductId(urlProductId);
    }
  }, [urlProductId, productId, setProductId]);

  // Limpiar mensajes después de un tiempo
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, clearMessages]);

  // Handlers
  const handleProductChange = (e) => {
    const newProductId = e.target.value;
    if (newProductId) {
      navigate(`/product_owner/database-schema/${newProductId}`);
      setProductId(newProductId);
    }
  };

  const handleViewEntity = async (entityName) => {
    await fetchEntity(entityName);
    setShowEntityDetails(true);
  };

  const handleDeleteEntity = async (entityName) => {
    if (window.confirm(`¿Estás seguro de eliminar la entidad "${entityName}"?`)) {
      await deleteEntity(entityName);
    }
  };

  const handleImportSuccess = () => {
    setShowImportModal(false);
    refresh();
  };

  const handleExport = async () => {
    const product = products.find(p => p._id === productId);
    await downloadSchema(product?.nombre || productId);
  };

  const handleSaveConfig = async (config) => {
    return await updateSchemaConfig(config);
  };

  // Tabs
  const tabs = [
    { id: 'entities', label: 'Entidades', icon: Layers, count: stats.total_entities },
    { id: 'diagram', label: 'Diagrama', icon: GitBranch },
    { id: 'config', label: 'Configuración', icon: Settings }
  ];

  // Cargar mapa de relaciones al cambiar a tab de diagrama
  useEffect(() => {
    if (activeTab === 'diagram' && productId) {
      fetchRelationshipMap();
    }
  }, [activeTab, productId, fetchRelationshipMap]);

  // Producto seleccionado
  const selectedProduct = products.find(p => p._id === productId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg shadow-sm p-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Título y selector de producto */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Database className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Database Schema
              </h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Gestiona la estructura de base de datos del proyecto
              </p>
            </div>
          </div>

          {/* Selector de producto */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={productId || ''}
                onChange={handleProductChange}
                disabled={loadingProducts}
                className={`appearance-none pl-4 pr-10 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px] ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Seleccionar producto...</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.nombre}
                  </option>
                ))}
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
          </div>
        </div>

        {/* Stats */}
        {productId && schema && (
          <div className={`mt-6 pt-6 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-indigo-500" />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  <strong>{stats.total_entities}</strong> Entidades
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Database size={18} className="text-green-500" />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  <strong>{stats.total_fields}</strong> Campos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GitBranch size={18} className="text-blue-500" />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  <strong>{stats.total_relationships}</strong> Relaciones
                </span>
              </div>
              {schema.version && (
                <div className={`px-2 py-1 rounded text-sm ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  v{schema.version}
                </div>
              )}
              {schema.status && (
                <div className={`px-2 py-1 rounded text-sm capitalize ${
                  schema.status === 'active' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : schema.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {schema.status}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mensajes de error/éxito */}
      {(error || successMessage) && (
        <div className={`flex items-center justify-between p-4 rounded-lg ${
          error
            ? theme === 'dark'
              ? 'bg-red-900/30 text-red-400 border border-red-800'
              : 'bg-red-50 text-red-700 border border-red-200'
            : theme === 'dark'
              ? 'bg-green-900/30 text-green-400 border border-green-800'
              : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          <div className="flex items-center gap-2">
            {error ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span>{error || successMessage}</span>
          </div>
          <button onClick={clearMessages} className="p-1 hover:opacity-70">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Contenido principal */}
      {!productId ? (
        <div className={`rounded-lg shadow-sm p-12 text-center ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Database className={`mx-auto h-16 w-16 mb-4 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h2 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Selecciona un Producto
          </h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Elige un producto del selector superior para ver y gestionar su esquema de base de datos.
          </p>
        </div>
      ) : loading ? (
        <div className={`rounded-lg shadow-sm p-12 text-center ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Cargando esquema de base de datos...
          </p>
        </div>
      ) : (
        <div className={`rounded-lg shadow-sm overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Tabs y acciones */}
          <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {/* Tabs */}
            <div className="flex gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : tab.disabled
                      ? theme === 'dark'
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-gray-400 cursor-not-allowed'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.5 text-xs rounded ${
                      activeTab === tab.id
                        ? 'bg-indigo-500 text-white'
                        : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="px-1.5 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <button
                onClick={refresh}
                disabled={loading}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Actualizar
              </button>
              <button
                onClick={handleExport}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Download size={18} />
                Exportar
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus size={18} />
                Importar Código
              </button>
            </div>
          </div>

          {/* Contenido del tab */}
          <div className="p-4">
            {activeTab === 'entities' && (
              <EntityList
                entities={entities}
                loading={loading}
                onView={handleViewEntity}
                onDelete={handleDeleteEntity}
                onGenerateCode={generateCode}
              />
            )}
            
            {activeTab === 'diagram' && (
              <RelationshipDiagram
                relationshipMap={relationshipMap}
                loading={loading}
                onNodeClick={handleViewEntity}
              />
            )}
            
            {activeTab === 'config' && (
              <SchemaConfiguration
                productId={productId}
                schema={schema}
                onSave={handleSaveConfig}
                loading={loading}
              />
            )}
          </div>
        </div>
      )}

      {/* Modal de importación */}
      <ImportCodeModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={importCode}
        importing={importing}
        productId={productId}
      />

      {/* Modal de detalles de entidad */}
      <EntityDetailsModal
        isOpen={showEntityDetails}
        onClose={() => {
          setShowEntityDetails(false);
          setSelectedEntity(null);
        }}
        entity={selectedEntity}
        productId={productId}
        onGenerateCode={generateCode}
      />
    </div>
  );
};

export default DatabaseSchemaPage;
