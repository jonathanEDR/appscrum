import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  Cloud,
  Upload,
  Trash2,
  RefreshCw,
  FolderOpen,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Search,
  Filter,
  Download
} from 'lucide-react';
import CloudinaryUploadModal from '../components/common/CloudinaryUploadModal';
import CloudinaryImage from '../components/common/CloudinaryImage';
import cloudinaryService from '../services/cloudinaryService';

const CloudinaryManagement = () => {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('files'); // files, config
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  /**
   * Verifica la conexión al cargar
   */
  useEffect(() => {
    // Cargar archivos automáticamente al montar el componente
    loadFiles(selectedFolder);
  }, []);

  /**
   * Verifica la conexión con Cloudinary
   */
  const verifyConnection = async () => {
    try {
      setLoading(true);
      // Intentar cargar archivos como prueba de conexión
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/cloudinary/list/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setConnectionStatus({ connected: true, message: 'Conectado a Cloudinary' });
        showNotification('Conectado a Cloudinary exitosamente', 'success');
      } else {
        throw new Error('No se pudo conectar');
      }
    } catch (error) {
      console.error('Error verificando conexión:', error);
      showNotification('Error al verificar conexión con Cloudinary', 'error');
      setConnectionStatus({ connected: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga archivos de una carpeta
   */
  const loadFiles = async (folder = 'all') => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const endpoint = folder === 'all' 
        ? '/cloudinary/files/all'
        : `/cloudinary/files/${folder}`;

      // Agregar timestamp para evitar cache
      const cacheBuster = `?t=${Date.now()}`;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${endpoint}${cacheBuster}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar archivos');
      }

      const data = await response.json();
      setFiles(data.files || []);
      
      // Establecer conexión como exitosa
      setConnectionStatus({ connected: true, message: 'Conectado' });
      
    } catch (error) {
      console.error('Error cargando archivos:', error);
      showNotification('Error al cargar archivos', 'error');
      setConnectionStatus({ connected: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina un archivo
   */
  const handleDeleteFile = async (publicId) => {
    if (!confirm('¿Estás seguro de eliminar este archivo?')) {
      return;
    }

    try {
      setLoading(true);
      
      const result = await cloudinaryService.deleteFile(publicId, getToken);
      
      if (result.success) {
        // Actualizar estado local inmediatamente
        setFiles(prevFiles => prevFiles.filter(file => file.public_id !== publicId));
        showNotification('Archivo eliminado exitosamente de Cloudinary', 'success');
      } else {
        showNotification(`Error: ${result.message || 'No se pudo eliminar'}`, 'error');
      }
      
    } catch (error) {
      console.error('❌ Error eliminando archivo:', error);
      console.error('   Error stack:', error.stack);
      showNotification(`Error al eliminar archivo: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Muestra notificación temporal
   */
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  /**
   * Filtra archivos por búsqueda
   */
  const filteredFiles = files.filter(file => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      file.public_id?.toLowerCase().includes(searchLower) ||
      file.filename?.toLowerCase().includes(searchLower) ||
      file.format?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Gestión de Cloudinary
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Administra todos los archivos y recursos de tu proyecto
                </p>
              </div>
            </div>

            {/* Estado de conexión */}
            {connectionStatus && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                connectionStatus.connected
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              }`}>
                {connectionStatus.connected ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Conectado</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Desconectado</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notificación */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : notification.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-2">
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setActiveTab('files');
                    if (files.length === 0) {
                      loadFiles(selectedFolder);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'files'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FolderOpen className="w-4 h-4" />
                  Explorar Archivos
                </button>

                <button
                  onClick={() => setActiveTab('config')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'config'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  Información
                </button>
              </div>

              {/* Botón para abrir modal de upload */}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                Subir Archivos
              </button>
            </div>
          </div>

          {/* Contenido de tabs */}
          <div className="p-6">
            {/* Tab: Explorar archivos */}
            {activeTab === 'files' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Archivos en Cloudinary
                  </h3>
                  
                  <button
                    onClick={() => loadFiles(selectedFolder)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Recargar
                  </button>
                </div>

                {/* Filtros */}
                <div className="flex gap-3 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar archivos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <select
                    value={selectedFolder}
                    onChange={(e) => {
                      setSelectedFolder(e.target.value);
                      loadFiles(e.target.value);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">Todas las carpetas</option>
                    <option value="bug-reports">Bug Reports</option>
                    <option value="branding">Branding</option>
                    <option value="temp">Temporal</option>
                  </select>
                </div>

                {/* Lista de archivos */}
                {loading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Cargando archivos...</p>
                  </div>
                ) : filteredFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchTerm ? 'No se encontraron archivos' : 'No hay archivos en esta carpeta'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredFiles.map((file, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"
                      >
                        {/* Preview con patron de tablero ajedrez para transparencias */}
                        <div className="aspect-square bg-white dark:bg-gray-800 flex items-center justify-center relative" 
                             style={{
                               backgroundImage: `repeating-conic-gradient(#f3f4f6 0% 25%, #e5e7eb 0% 50%)`,
                               backgroundPosition: '0 0, 10px 10px',
                               backgroundSize: '20px 20px'
                             }}>
                          {(file.resource_type === 'image' || file.format === 'svg') ? (
                            <CloudinaryImage
                              src={file.secure_url}
                              alt={file.filename || file.public_id}
                              size="thumbnail"
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <FileText className="w-12 h-12 text-gray-400" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                            {file.filename || file.public_id}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            {cloudinaryService.formatFileSize(file.bytes || 0)}
                          </p>

                          {/* Acciones */}
                          <div className="flex gap-2">
                            <a
                              href={file.secure_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors"
                            >
                              <Download className="w-3 h-3" />
                              Ver
                            </a>
                            <button
                              onClick={() => handleDeleteFile(file.public_id)}
                              className="flex items-center justify-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Información */}
            {activeTab === 'config' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Información de Cloudinary
                </h3>
                
                {connectionStatus && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Estado de Conexión
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                          <span className={connectionStatus.connected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {connectionStatus.connected ? 'Conectado' : 'Desconectado'}
                          </span>
                        </div>
                        {connectionStatus.cloudName && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Cloud Name:</span>
                            <span className="text-gray-900 dark:text-white font-mono">
                              {connectionStatus.cloudName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">
                        Funcionalidades Disponibles
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                        <li>✓ Subida automática de archivos</li>
                        <li>✓ Optimización automática de imágenes</li>
                        <li>✓ Generación de múltiples versiones</li>
                        <li>✓ CDN global para entrega rápida</li>
                        <li>✓ Transformaciones on-the-fly</li>
                        <li>✓ Almacenamiento persistente</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Upload */}
      <CloudinaryUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={(result) => {
          showNotification('Archivo subido exitosamente', 'success');
          // Recargar archivos
          loadFiles(selectedFolder);
        }}
        multiple={true}
        accept="image/*"
        maxSize={10 * 1024 * 1024}
        title="Subir Archivos a Cloudinary"
        description="Arrastra archivos o haz clic para seleccionar (JPG, PNG, GIF, WebP, SVG)"
      />
    </div>
  );
};

export default CloudinaryManagement;
