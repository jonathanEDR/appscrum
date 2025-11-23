import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

/**
 * Componente para probar la integración de Cloudinary
 * Ubicación sugerida: src/components/admin/CloudinaryTest.jsx
 */
const CloudinaryTest = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Verificar configuración
  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const response = await fetch('http://localhost:5000/api/cloudinary/test', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error en testConnection:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Subir archivo
  const uploadFile = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona un archivo primero');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      console.log('Subiendo archivo:', selectedFile.name);
      
      const formData = new FormData();
      formData.append('testImage', selectedFile);

      const response = await fetch('http://localhost:5000/api/cloudinary/test-upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText.substring(0, 200)}`);
      }

      const data = await response.json();
      console.log('Upload result:', data);
      
      if (data.success) {
        setResult(data);
        setUploadedFiles([...uploadedFiles, data.file]);
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
      } else {
        setError(data.error || 'Error desconocido al subir archivo');
      }
    } catch (err) {
      console.error('Error en uploadFile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar archivo
  const deleteFile = async (publicId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const encodedPublicId = encodeURIComponent(publicId);
      console.log('Eliminando archivo:', publicId);
      
      const response = await fetch(`http://localhost:5000/api/cloudinary/test-delete/${encodedPublicId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Delete result:', data);
      
      if (data.success) {
        setResult(data);
        setUploadedFiles(uploadedFiles.filter(f => f.publicId !== publicId));
      } else {
        setError(data.error || 'Error desconocido al eliminar archivo');
      }
    } catch (err) {
      console.error('Error en deleteFile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🧪 Prueba de Cloudinary</h1>

      {/* Test Connection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">1. Verificar Configuración</h2>
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Verificar Conexión'}
        </button>
      </div>

      {/* Upload File */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">2. Subir Archivo</h2>
        <div className="space-y-4">
          <div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {selectedFile && (
            <div className="text-sm text-gray-600">
              Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </div>
          )}
          <button
            onClick={uploadFile}
            disabled={loading || !selectedFile}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Subiendo...' : 'Subir a Cloudinary'}
          </button>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">3. Archivos Subidos</h2>
          <div className="space-y-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="border rounded p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{file.originalName}</p>
                    <p className="text-sm text-gray-500">Public ID: {file.publicId}</p>
                    <p className="text-sm text-gray-500">Size: {(file.size / 1024).toFixed(2)} KB</p>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Ver en Cloudinary →
                    </a>
                  </div>
                  {file.mimetype?.startsWith('image/') && (
                    <img
                      src={file.url}
                      alt={file.originalName}
                      className="w-32 h-32 object-cover rounded ml-4"
                    />
                  )}
                </div>
                <button
                  onClick={() => deleteFile(file.publicId)}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 Resultado</h2>
          <div className="bg-gray-50 rounded p-4 overflow-auto">
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-semibold mb-2">❌ Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-blue-800 font-semibold mb-2">💡 Instrucciones</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Verifica que la conexión con Cloudinary esté activa</li>
          <li>Selecciona una imagen para subir</li>
          <li>Haz clic en "Subir a Cloudinary"</li>
          <li>Verifica que la imagen se muestre correctamente</li>
          <li>Prueba eliminar el archivo si lo deseas</li>
        </ol>
        <div className="mt-4 text-sm text-blue-600">
          <p>✅ Los archivos se suben a: <code>appscrum/bug-reports/</code></p>
          <p>✅ Las imágenes tienen versiones optimizadas automáticas</p>
          <p>✅ Las URLs son servidas desde el CDN de Cloudinary</p>
        </div>
      </div>
    </div>
  );
};

export default CloudinaryTest;
