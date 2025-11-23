import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';
import cloudinaryService from '../../services/cloudinaryService';

/**
 * Componente reutilizable para subir archivos a Cloudinary
 * @param {Object} props - Props del componente
 */
const CloudinaryUploader = ({
  onUploadComplete,
  onUploadError,
  multiple = false,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  validation = {},
  endpoint = '/cloudinary/admin-upload',
  fieldName = 'file',
  metadata = {},
  showPreview = true,
  className = ''
}) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const {
    uploading,
    progress,
    error,
    uploadFile,
    uploadMultiple,
    reset
  } = useCloudinaryUpload({
    endpoint,
    fieldName,
    metadata,
    validation: {
      maxSize,
      ...validation
    },
    onSuccess: (result) => {
      if (onUploadComplete) {
        onUploadComplete(result);
      }
      // Limpiar después de subida exitosa
      setTimeout(() => {
        handleClear();
      }, 2000);
    },
    onError: (err) => {
      if (onUploadError) {
        onUploadError(err);
      }
    }
  });

  /**
   * Maneja la selección de archivos
   */
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles(files);

    // Generar previews para imágenes
    if (showPreview) {
      const previewPromises = files.map(file => 
        cloudinaryService.generateThumbnail(file)
      );
      const generatedPreviews = await Promise.all(previewPromises);
      setPreviews(generatedPreviews);
    }
  };

  /**
   * Maneja la subida de archivos
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
   * Limpia la selección
   */
  const handleClear = () => {
    setSelectedFiles([]);
    setPreviews([]);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Elimina un archivo de la selección
   */
  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);

    if (newFiles.length === 0) {
      reset();
    }
  };

  /**
   * Abre el selector de archivos
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`cloudinary-uploader ${className}`}>
      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Área de selección */}
      {selectedFiles.length === 0 && (
        <div
          onClick={handleClick}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Haz clic para seleccionar {multiple ? 'archivos' : 'un archivo'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Tamaño máximo: {cloudinaryService.formatFileSize(maxSize)}
          </p>
        </div>
      )}

      {/* Vista previa de archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          {/* Lista de archivos */}
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                {/* Preview o icono */}
                <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {previews[index] ? (
                    <img
                      src={previews[index]}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : cloudinaryService.getFileType(file.type) === 'image' ? (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  ) : (
                    <FileText className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Info del archivo */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
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
                    className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Barra de progreso */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subiendo...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Mensajes de error o éxito */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {progress === 100 && !error && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">¡Archivo subido exitosamente!</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {uploading ? 'Subiendo...' : 'Subir a Cloudinary'}
            </button>
            
            {!uploading && (
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploader;
