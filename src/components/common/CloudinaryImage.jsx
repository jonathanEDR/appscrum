import React, { useState } from 'react';
import { Image as ImageIcon, Loader } from 'lucide-react';
import { useCloudinaryImage } from '../../hooks/useCloudinaryImage';

/**
 * Componente para mostrar imágenes de Cloudinary con optimización automática
 * @param {Object} props - Props del componente
 */
const CloudinaryImage = ({
  src,
  alt = '',
  size = 'medium', // thumbnail, small, medium, large, original
  useWebp = true,
  className = '',
  fallback = null,
  showLoader = true,
  onClick = null,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  
  const { url, loading, error } = useCloudinaryImage(src, {
    size,
    useWebp
  });

  /**
   * Maneja errores de carga de imagen
   */
  const handleError = () => {
    // Para archivos SVG/RAW, intentar cargar la URL original sin transformaciones
    const isSvgOrRaw = src?.includes('.svg') || src?.includes('/raw/upload/');
    if (isSvgOrRaw && url !== src) {
      // No marcar como error aún, el navegador intentará con la URL original
      return;
    }
    
    setImageError(true);
  };

  /**
   * Renderiza el fallback
   */
  const renderFallback = () => {
    if (fallback) {
      return fallback;
    }

    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}>
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  };

  /**
   * Renderiza el loader
   */
  const renderLoader = () => {
    if (!showLoader) return null;

    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
        <Loader className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  };

  // Si hay error o no hay src, mostrar fallback
  if (error || imageError || !src) {
    return renderFallback();
  }

  // Si está cargando, mostrar loader
  if (loading) {
    return renderLoader();
  }

  // Para SVG y archivos RAW, usar siempre la URL original directamente
  const isSvgOrRaw = src?.includes('.svg') || src?.includes('/raw/upload/');
  const finalUrl = isSvgOrRaw ? src : url;
  
  // Configurar props de la imagen
  const imgProps = {
    src: finalUrl,
    alt,
    className,
    onError: handleError,
    onClick,
    loading: "lazy",
    ...props
  };
  
  // Solo añadir crossOrigin para imágenes que NO sean SVG/RAW
  if (!isSvgOrRaw) {
    imgProps.crossOrigin = "anonymous";
  }
  
  return <img {...imgProps} />;
};

export default CloudinaryImage;
