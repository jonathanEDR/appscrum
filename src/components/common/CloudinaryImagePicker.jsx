import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { X, Upload, Image as ImageIcon, CheckCircle, Loader, Trash2, Search } from 'lucide-react';
import CloudinaryImage from './CloudinaryImage';
import cloudinaryService from '../../services/cloudinaryService';

/**
 * Componente reutilizable para seleccionar imágenes de Cloudinary
 * Permite ver imágenes existentes, seleccionar una o subir una nueva
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback al cerrar
 * @param {Function} props.onSelect - Callback al seleccionar imagen (recibe objeto con url, publicId, etc)
 * @param {string} props.folder - Carpeta de Cloudinary a mostrar ('all', 'branding', 'bug-reports')
 * @param {string} props.title - Título del modal
 * @param {string} props.currentImage - URL de la imagen actualmente seleccionada
 * @param {Array} props.acceptFormats - Formatos permitidos ['jpg', 'png', 'svg', 'webp']
 * @param {number} props.maxSize - Tamaño máximo en bytes (default 5MB)
 */
const CloudinaryImagePicker = ({
  isOpen,
  onClose,
  onSelect,
  folder = 'branding',
  title = 'Seleccionar Imagen',
  currentImage = null,
  acceptFormats = ['jpg', 'jpeg', 'png', 'svg', 'webp'],
  maxSize = 5 * 1024 * 1024
}) => {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' o 'upload'
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Cargar imágenes existentes
   */
  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/cloudinary/files/${folder}${cacheBuster}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar imágenes');
      }

      const data = await response.json();
      setImages(data.files || []);
    } catch (err) {
      setError('Error al cargar imágenes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cargar imágenes al abrir el modal
   */
  useEffect(() => {
    if (isOpen) {
      loadImages();
      // Si hay imagen actual, pre-seleccionarla
      if (currentImage) {
        setSelectedImage(currentImage);
      }
    } else {
      // Reset al cerrar
      setActiveTab('existing');
      setSearchTerm('');
      setUploadPreview(null);
      setUploadFile(null);
      setError(null);
      setUploadProgress(0);
    }
  }, [isOpen, currentImage]);

  /**
   * Filtrar imágenes por búsqueda
   */
  const filteredImages = images.filter(img => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      img.filename?.toLowerCase().includes(search) ||
      img.public_id?.toLowerCase().includes(search) ||
      img.originalName?.toLowerCase().includes(search)
    );
  });

  /**
   * Manejar selección de archivo para upload
   */
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar formato
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!acceptFormats.includes(fileExtension)) {
      setError(`Formato no permitido. Use: ${acceptFormats.join(', ')}`);
      return;
    }

    // Validar tamaño
    if (file.size > maxSize) {
      setError(`El archivo es demasiado grande. Máximo ${cloudinaryService.formatFileSize(maxSize)}`);
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadPreview(reader.result);
      setUploadFile(file);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Subir nueva imagen
   */
  const handleUpload = async () => {
    if (!uploadFile) return;

    try {
      setUploading(true);
      setError(null);

      const result = await cloudinaryService.uploadFile(
        uploadFile,
        getToken,
        {
          endpoint: '/cloudinary/admin-upload',
          fieldName: 'file',
          onProgress: (progress) => {
            setUploadProgress(progress);
          }
        }
      );

      if (result.success) {
        // Recargar imágenes
        await loadImages();
        
        // Seleccionar la imagen recién subida
        setActiveTab('existing');
        setUploadPreview(null);
        setUploadFile(null);
        setUploadProgress(0);
        
        // Auto-seleccionar la nueva imagen
        if (onSelect) {
          onSelect({
            url: result.file.url,
            publicId: result.file.publicId,
            format: result.file.format,
            size: result.file.size,
            originalName: result.file.originalName
          });
        }
        onClose();
      }
    } catch (err) {
      setError('Error al subir imagen: ' + err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Seleccionar imagen existente
   */
  const handleSelectImage = (image) => {
    if (onSelect) {
      onSelect({
        url: image.secure_url || image.url,
        publicId: image.public_id,
        format: image.format,
        size: image.bytes,
        originalName: image.filename || image.originalName
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-1 p-2">
            <button
              onClick={() => setActiveTab('existing')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'existing'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Imágenes Existentes ({images.length})
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'upload'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Subir Nueva
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
            <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'existing' ? (
            <div className="space-y-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar imágenes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Grid de imágenes */}
              {loading ? (
                <div className="text-center py-12">
                  <Loader className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Cargando imágenes...</p>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm ? 'No se encontraron imágenes' : 'No hay imágenes disponibles'}
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Subir primera imagen
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredImages.map((image, index) => (
                    <div
                      key={index}
                      className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        selectedImage === image.secure_url || selectedImage === image.url
                          ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                      onClick={() => handleSelectImage(image)}
                    >
                      {/* Preview con patrón de transparencia */}
                      <div 
                        className="aspect-square bg-white dark:bg-gray-800 flex items-center justify-center"
                        style={{
                          backgroundImage: `repeating-conic-gradient(#f3f4f6 0% 25%, #e5e7eb 0% 50%)`,
                          backgroundPosition: '0 0, 10px 10px',
                          backgroundSize: '20px 20px'
                        }}
                      >
                        <CloudinaryImage
                          src={image.secure_url || image.url}
                          alt={image.filename || image.public_id}
                          size="thumbnail"
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      
                      {/* Info */}
                      <div className="p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {image.filename || image.originalName || image.public_id.split('/').pop()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {cloudinaryService.formatFileSize(image.bytes || image.size || 0)}
                        </p>
                      </div>
                      
                      {/* Check si está seleccionada */}
                      {(selectedImage === image.secure_url || selectedImage === image.url) && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Zona de upload */}
              {!uploadPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Click para seleccionar</span> o arrastra un archivo
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Formatos: {acceptFormats.join(', ').toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Máximo: {cloudinaryService.formatFileSize(maxSize)}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept={acceptFormats.map(f => `.${f}`).join(',')}
                    onChange={handleFileSelect}
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="relative border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <button
                      onClick={() => {
                        setUploadPreview(null);
                        setUploadFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div 
                      className="w-full h-64 flex items-center justify-center"
                      style={{
                        backgroundImage: `repeating-conic-gradient(#f3f4f6 0% 25%, #e5e7eb 0% 50%)`,
                        backgroundPosition: '0 0, 10px 10px',
                        backgroundSize: '20px 20px'
                      }}
                    >
                      <img
                        src={uploadPreview}
                        alt="Preview"
                        className="max-w-full max-h-64 object-contain"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {uploadFile?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {cloudinaryService.formatFileSize(uploadFile?.size || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {uploading && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Botón de upload */}
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {uploading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Subiendo... {Math.round(uploadProgress)}%
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Subir Imagen
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloudinaryImagePicker;
