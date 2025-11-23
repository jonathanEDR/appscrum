import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import cloudinaryService from '../services/cloudinaryService';

/**
 * Hook personalizado para manejar subidas a Cloudinary
 * @param {Object} options - Opciones de configuración
 * @returns {Object} Estado y funciones para manejar uploads
 */
export const useCloudinaryUpload = (options = {}) => {
  const { getToken } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  /**
   * Valida un archivo antes de subirlo
   */
  const validateFile = useCallback((file) => {
    const validation = cloudinaryService.validateFile(file, options.validation);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return false;
    }
    return true;
  }, [options.validation]);

  /**
   * Sube un archivo a Cloudinary
   */
  const uploadFile = useCallback(async (file) => {
    try {
      // Resetear estado
      setError(null);
      setProgress(0);
      setUploadedFile(null);

      // Validar archivo
      if (!validateFile(file)) {
        return null;
      }

      setUploading(true);

      // Subir archivo
      const result = await cloudinaryService.uploadFile(file, getToken, {
        ...options,
        onProgress: (percent) => {
          setProgress(Math.round(percent));
        }
      });

      setUploadedFile(result.file);
      setProgress(100);
      
      // Callback de éxito
      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || 'Error al subir archivo';
      setError(errorMessage);
      
      // Callback de error
      if (options.onError) {
        options.onError(err);
      }

      return null;
    } finally {
      setUploading(false);
    }
  }, [getToken, validateFile, options]);

  /**
   * Sube múltiples archivos
   */
  const uploadMultiple = useCallback(async (files) => {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const result = await uploadFile(files[i]);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }, [uploadFile]);

  /**
   * Resetea el estado
   */
  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setUploadedFile(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadedFile,
    uploadFile,
    uploadMultiple,
    reset,
    validateFile
  };
};

export default useCloudinaryUpload;
