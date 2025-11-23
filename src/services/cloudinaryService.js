/**
 * Servicio centralizado de Cloudinary para el frontend
 * Maneja todas las operaciones con Cloudinary de forma consistente
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Clase principal del servicio de Cloudinary
 */
class CloudinaryService {
  /**
   * Verifica la configuración de Cloudinary
   * @param {Function} getToken - Función para obtener el token de Clerk
   * @returns {Promise<Object>} Estado de la configuración
   */
  async verifyConnection(getToken) {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/cloudinary/test`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error verificando Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Sube un archivo a Cloudinary
   * @param {File} file - Archivo a subir
   * @param {Function} getToken - Función para obtener el token
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} Información del archivo subido
   */
  async uploadFile(file, getToken, options = {}) {
    try {
      const {
        endpoint = '/cloudinary/admin-upload', // Endpoint de producción
        fieldName = 'file', // Nombre del campo correcto
        onProgress = null
      } = options;

      const token = await getToken();
      const formData = new FormData();
      formData.append(fieldName, file);

      // Añadir datos adicionales si existen
      if (options.metadata) {
        Object.keys(options.metadata).forEach(key => {
          formData.append(key, options.metadata[key]);
        });
      }

      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        // Manejar progreso
        if (onProgress) {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percentComplete = (e.loaded / e.total) * 100;
              onProgress(percentComplete);
            }
          });
        }

        // Manejar respuesta
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error('Error al parsear respuesta del servidor'));
            }
          } else {
            reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
          }
        });

        // Manejar errores
        xhr.addEventListener('error', () => {
          reject(new Error('Error de red al subir archivo'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Subida cancelada'));
        });

        // Enviar petición
        xhr.open('POST', `${API_BASE_URL}${endpoint}`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      throw error;
    }
  }

  /**
   * Elimina un archivo de Cloudinary
   * @param {string} publicId - ID público del archivo
   * @param {Function} getToken - Función para obtener el token
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteFile(publicId, getToken) {
    try {
      const token = await getToken();
      const encodedPublicId = encodeURIComponent(publicId);
      const url = `${API_BASE_URL}/cloudinary/delete/${encodedPublicId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error eliminando archivo:', error);
      throw error;
    }
  }

  /**
   * Obtiene versiones optimizadas de una imagen
   * @param {string} url - URL original de Cloudinary
   * @returns {Object} URLs optimizadas
   */
  getOptimizedVersions(url) {
    if (!url || !url.includes('cloudinary.com')) {
      return null;
    }

    // Si es SVG, archivo raw, o tiene extensiones que requieren preservar transparencia
    const isSvg = url.includes('.svg') || url.toLowerCase().includes('svg');
    const isRaw = url.includes('/raw/upload/');
    const isPngWithTransparency = url.includes('.png');
    
    if (isSvg || isRaw) {
      // Para SVG, si tiene /image/upload/, cambiar a /raw/upload/
      let finalUrl = url;
      if (isSvg && url.includes('/image/upload/') && !url.includes('/raw/upload/')) {
        finalUrl = url.replace('/image/upload/', '/raw/upload/');
      }
      
      return {
        original: finalUrl,
        thumbnail: finalUrl,
        small: finalUrl,
        medium: finalUrl,
        large: finalUrl,
        webp: finalUrl
      };
    }
    
    // Para PNG, usar transformaciones que preserven transparencia
    if (isPngWithTransparency) {
      const urlParts = url.split('/upload/');
      if (urlParts.length < 2) {
        return {
          original: url,
          thumbnail: url,
          small: url,
          medium: url,
          large: url,
          webp: url
        };
      }
      const baseUrl = urlParts[0] + '/upload/';
      const publicIdAndFormat = urlParts[1];
      
      return {
        original: url,
        thumbnail: `${baseUrl}w_100,h_100,c_fill,f_auto,q_auto,fl_preserve_transparency/${publicIdAndFormat}`,
        small: `${baseUrl}w_300,h_300,c_limit,f_auto,q_auto,fl_preserve_transparency/${publicIdAndFormat}`,
        medium: `${baseUrl}w_600,h_600,c_limit,f_auto,q_auto,fl_preserve_transparency/${publicIdAndFormat}`,
        large: `${baseUrl}w_1200,c_limit,f_auto,q_auto,fl_preserve_transparency/${publicIdAndFormat}`,
        webp: `${baseUrl}f_webp,q_auto,fl_preserve_transparency/${publicIdAndFormat}`
      };
    }

    // Extraer public_id de la URL
    const urlParts = url.split('/upload/');
    
    if (urlParts.length < 2) {
      // Si no podemos parsear, devolver URL original
      return {
        original: url,
        thumbnail: url,
        small: url,
        medium: url,
        large: url,
        webp: url
      };
    }

    const baseUrl = urlParts[0] + '/upload/';
    const publicIdAndFormat = urlParts[1];

    const optimized = {
      original: url,
      thumbnail: `${baseUrl}w_100,h_100,c_fill,f_auto,q_auto/${publicIdAndFormat}`,
      small: `${baseUrl}w_300,h_300,c_limit,f_auto,q_auto/${publicIdAndFormat}`,
      medium: `${baseUrl}w_600,h_600,c_limit,f_auto,q_auto/${publicIdAndFormat}`,
      large: `${baseUrl}w_1200,c_limit,f_auto,q_auto/${publicIdAndFormat}`,
      webp: `${baseUrl}f_webp,q_auto/${publicIdAndFormat}`
    };
    
    return optimized;
  }

  /**
   * Valida un archivo antes de subirlo
   * @param {File} file - Archivo a validar
   * @param {Object} rules - Reglas de validación
   * @returns {Object} Resultado de la validación
   */
  validateFile(file, rules = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB por defecto
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    } = rules;

    const errors = [];

    // Validar tamaño
    if (file.size > maxSize) {
      errors.push(`El archivo excede el tamaño máximo permitido (${(maxSize / 1024 / 1024).toFixed(2)} MB)`);
    }

    // Validar tipo MIME
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Tipo de archivo no permitido. Tipos aceptados: ${allowedExtensions.join(', ')}`);
    }

    // Validar extensión
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      errors.push(`Extensión de archivo no permitida. Extensiones aceptadas: ${allowedExtensions.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Formatea el tamaño de archivo
   * @param {number} bytes - Tamaño en bytes
   * @returns {string} Tamaño formateado
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Obtiene el tipo de archivo
   * @param {string} mimetype - Tipo MIME del archivo
   * @returns {string} Tipo de archivo
   */
  getFileType(mimetype) {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype === 'application/pdf') return 'pdf';
    if (mimetype.startsWith('text/')) return 'text';
    if (mimetype.startsWith('video/')) return 'video';
    return 'file';
  }

  /**
   * Genera un thumbnail placeholder mientras carga
   * @param {File} file - Archivo
   * @returns {Promise<string>} URL del thumbnail
   */
  async generateThumbnail(file) {
    if (!file.type.startsWith('image/')) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// Exportar instancia única (Singleton)
const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
