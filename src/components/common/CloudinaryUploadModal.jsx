import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';
import cloudinaryService from '../../services/cloudinaryService';

/**
 * Modal para subir archivos a Cloudinary
 */
const CloudinaryUploadModal = ({
  isOpen,
  onClose,
  onUploadComplete,
  multiple = true,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024,
  title = 'Subir Archivos a Cloudinary',
  description = 'Selecciona los archivos que deseas subir'
}) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const {
    uploading,
    progress,
    error,
    uploadFile,
    uploadMultiple,
    reset
  } = useCloudinaryUpload({
    endpoint: '/cloudinary/admin-upload',
    fieldName: 'file',
    validation: { maxSize },
    onSuccess: (result) => {
      if (onUploadComplete) {
        onUploadComplete(result);
      }
      // Limpiar y cerrar después de 1.5 segundos
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  });

  /**
   * Maneja la selección de archivos
   */
  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setSelectedFiles(fileArray);

    // Generar previews
    const previewPromises = fileArray.map(file => 
      cloudinaryService.generateThumbnail(file)
    );
    const generatedPreviews = await Promise.all(previewPromises);
    setPreviews(generatedPreviews);
  };

  /**
   * Maneja el cambio del input
   */
  const handleInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

  /**
   * Maneja drag & drop
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  /**
   * Maneja la subida
   */
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    if (multiple) {
      await uploadMultiple(selectedFiles);
    } else {
      await uploadFile(selectedFiles[0]);
    }
  };

  /**
   * Cierra el modal y limpia
   */
  const handleClose = () => {
    setSelectedFiles([]);
    setPreviews([]);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  /**
   * Elimina un archivo de la selección
   */
  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
          />

          {/* Área de Drop */}
          {selectedFiles.length === 0 && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Upload className={`w-16 h-16 mx-auto mb-4 ${
                isDragging ? 'text-blue-500' : 'text-gray-400'
              }`} />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isDragging ? '¡Suelta los archivos aquí!' : 'Arrastra archivos aquí'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                o haz clic para seleccionar
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                <Upload className="w-4 h-4" />
                Seleccionar {multiple ? 'archivos' : 'archivo'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Formatos: JPG, PNG, GIF, WebP, SVG • Máximo: {cloudinaryService.formatFileSize(maxSize)}
              </p>
            </div>
          )}

          {/* Archivos seleccionados */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedFiles.length} {selectedFiles.length === 1 ? 'archivo seleccionado' : 'archivos seleccionados'}
                </p>
                {!uploading && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Cambiar selección
                  </button>
                )}
              </div>

              {/* Lista de archivos */}
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative group bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
                  >
                    {/* Preview */}
                    <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      {previews[index] ? (
                        <img
                          src={previews[index]}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : cloudinaryService.getFileType(file.type) === 'image' ? (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      ) : (
                        <FileText className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {cloudinaryService.formatFileSize(file.size)}
                      </p>
                    </div>

                    {/* Botón eliminar */}
                    {!uploading && (
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Barra de progreso */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subiendo archivos...</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Mensajes */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {progress === 100 && !error && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">¡Archivos subidos exitosamente!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Subir a Cloudinary
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloudinaryUploadModal;
