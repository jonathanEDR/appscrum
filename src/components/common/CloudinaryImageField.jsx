import React, { useState } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import CloudinaryImagePicker from './CloudinaryImagePicker';
import CloudinaryImage from './CloudinaryImage';

/**
 * Campo de imagen con integración de Cloudinary
 * Componente simplificado para usar en formularios
 * 
 * @param {Object} props
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.value - URL de la imagen actual
 * @param {Function} props.onChange - Callback cuando cambia la imagen (recibe objeto con url, publicId, etc)
 * @param {Function} props.onDelete - Callback cuando se elimina la imagen
 * @param {string} props.folder - Carpeta de Cloudinary ('branding', 'all', etc)
 * @param {string} props.description - Texto descriptivo
 * @param {string} props.size - Tamaño del preview ('small', 'medium', 'large')
 * @param {Array} props.acceptFormats - Formatos permitidos
 * @param {number} props.maxSize - Tamaño máximo en bytes
 */
const CloudinaryImageField = ({
  label,
  value,
  onChange,
  onDelete,
  folder = 'branding',
  description = 'PNG, JPG, SVG, WebP (máx. 5MB)',
  size = 'medium',
  acceptFormats = ['jpg', 'jpeg', 'png', 'svg', 'webp'],
  maxSize = 5 * 1024 * 1024
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const sizeClasses = {
    small: 'h-12 w-12',
    medium: 'h-16 w-16',
    large: 'h-20 w-20'
  };

  const handleSelect = (imageData) => {
    if (onChange) {
      onChange(imageData);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
      
      <div className="flex items-center gap-3">
        {/* Preview actual */}
        <div className="relative flex-shrink-0">
          <div 
            className={`${sizeClasses[size]} border-2 ${
              value 
                ? 'border-gray-200 dark:border-gray-600' 
                : 'border-dashed border-gray-300 dark:border-gray-600'
            } rounded-lg overflow-hidden bg-white dark:bg-gray-700 flex items-center justify-center`}
            style={value ? {
              backgroundImage: `repeating-conic-gradient(#f3f4f6 0% 25%, #e5e7eb 0% 50%)`,
              backgroundPosition: '0 0, 8px 8px',
              backgroundSize: '16px 16px'
            } : {}}
          >
            {value ? (
              <CloudinaryImage
                src={value}
                alt={label}
                size="thumbnail"
                className="max-w-full max-h-full object-contain p-1"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-gray-300 dark:text-gray-600" />
            )}
          </div>
          {value && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="absolute -top-1.5 -right-1.5 bg-red-500 dark:bg-red-600 text-white rounded-full p-1 hover:bg-red-600 dark:hover:bg-red-700 transition-colors shadow-md"
              title="Eliminar imagen"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Botón de selección compacto */}
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {value ? 'Cambiar imagen' : 'Seleccionar imagen'}
              </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">{description}</span>
          </div>
        </button>
      </div>

      {/* Modal de selección */}
      <CloudinaryImagePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleSelect}
        folder={folder}
        title={`Seleccionar ${label}`}
        currentImage={value}
        acceptFormats={acceptFormats}
        maxSize={maxSize}
      />
    </div>
  );
};

export default CloudinaryImageField;
