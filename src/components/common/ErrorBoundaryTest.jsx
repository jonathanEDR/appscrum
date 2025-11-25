import React, { useState } from 'react';
import { Bug, AlertCircle } from 'lucide-react';

/**
 * Componente de prueba para Error Boundary
 * 
 * Este componente puede usarse para probar que el ErrorBoundary
 * captura errores correctamente. Incluye varios tipos de errores
 * para simular diferentes escenarios.
 */
const ErrorBoundaryTest = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [errorType, setErrorType] = useState('render');

  // Simular error en render
  if (shouldThrow && errorType === 'render') {
    throw new Error('💥 Error de prueba en render - ErrorBoundary debería capturar esto');
  }

  // Simular error en evento
  const handleEventError = () => {
    throw new Error('💥 Error de prueba en evento - ErrorBoundary debería capturar esto');
  };

  // Simular error async (estos NO son capturados por ErrorBoundary)
  const handleAsyncError = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new Error('💥 Error async - ErrorBoundary NO captura estos (necesita try-catch)');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Bug className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Prueba de Error Boundary
            </h2>
            <p className="text-sm text-gray-600">
              Usa estos botones para probar que el ErrorBoundary captura errores correctamente
            </p>
          </div>
        </div>

        {/* Información */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">¿Qué errores captura un Error Boundary?</p>
              <ul className="space-y-1 ml-4">
                <li>✅ Errores en el método render</li>
                <li>✅ Errores en métodos del ciclo de vida</li>
                <li>✅ Errores en el constructor</li>
                <li>❌ Errores en event handlers (necesitan try-catch)</li>
                <li>❌ Errores asíncronos</li>
                <li>❌ Errores en el propio Error Boundary</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botones de prueba */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">✅ Errores que SÍ captura:</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setErrorType('render');
                  setShouldThrow(true);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Lanzar Error en Render
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">❌ Errores que NO captura (requieren manejo manual):</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  try {
                    handleEventError();
                  } catch (error) {
                    alert(`Error capturado manualmente en event handler:\n${error.message}`);
                  }
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Error en Event Handler
              </button>

              <button
                onClick={async () => {
                  try {
                    await handleAsyncError();
                  } catch (error) {
                    alert(`Error async capturado manualmente:\n${error.message}`);
                  }
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Error Asíncrono
              </button>
            </div>
          </div>
        </div>

        {/* Estado actual */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Estado:</span> {shouldThrow ? 'Error lanzado 💥' : 'Normal ✅'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-semibold">Tipo de error:</span> {errorType}
          </p>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">📝 Instrucciones de prueba:</h4>
          <ol className="text-sm text-green-800 space-y-1 ml-4">
            <li>1. Haz clic en "Lanzar Error en Render"</li>
            <li>2. Verás la pantalla de error del ErrorBoundary</li>
            <li>3. Haz clic en "Intentar de Nuevo" para recuperar la app</li>
            <li>4. Prueba los otros botones para ver cómo se manejan diferentes tipos de errores</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryTest;
