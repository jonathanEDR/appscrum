import { useState, useEffect, useMemo } from 'react';
import cloudinaryService from '../services/cloudinaryService';

/**
 * Hook para manejar imágenes de Cloudinary con optimización automática
 * @param {string} url - URL de la imagen en Cloudinary
 * @param {Object} options - Opciones de optimización
 * @returns {Object} URLs optimizadas y estado de carga
 */
export const useCloudinaryImage = (url, options = {}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedSize, setLoadedSize] = useState(null);

  // Generar versiones optimizadas
  const versions = useMemo(() => {
    if (!url) return null;
    return cloudinaryService.getOptimizedVersions(url);
  }, [url]);

  // Obtener URL según el tamaño solicitado
  const getSizedUrl = useMemo(() => {
    const { size = 'medium', useWebp = true } = options;
    
    // Si no hay URL, retornar null
    if (!url) return null;
    
    // Si no hay versiones (URL no es de Cloudinary), usar URL original directamente
    if (!versions) return url;
    
    // Si el navegador soporta WebP y está habilitado, usar WebP
    const canUseWebp = useWebp && checkWebpSupport();
    
    if (canUseWebp && versions.webp) {
      return versions.webp;
    }

    return versions[size] || versions.original || url;
  }, [url, versions, options]);

  // Verificar soporte de WebP
  function checkWebpSupport() {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  }

  // Precargar imagen (SOLO para imágenes normales, NO para SVG/RAW)
  useEffect(() => {
    if (!getSizedUrl) {
      setLoading(false);
      return;
    }

    // Detectar si es SVG o archivo RAW
    const isSvgOrRaw = getSizedUrl.includes('.svg') || getSizedUrl.includes('/raw/upload/');
    
    if (isSvgOrRaw) {
      setLoading(false);
      setLoadedSize(options.size || 'medium');
      return;
    }
    setLoading(true);
    setError(null);

    const img = new Image();
    
    img.onload = () => {
      setLoadedSize(options.size || 'medium');
      setLoading(false);
    };

    img.onerror = () => {
      setError('Error al cargar la imagen');
      setLoading(false);
    };

    img.crossOrigin = 'anonymous';
    img.src = getSizedUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [getSizedUrl, options.size, url]);

  return {
    url: getSizedUrl,
    versions,
    loading,
    error,
    loadedSize,
    originalUrl: url
  };
};

export default useCloudinaryImage;
