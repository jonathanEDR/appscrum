import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Error Boundary Component
 * 
 * Captura errores de JavaScript en cualquier componente hijo,
 * registra esos errores y muestra una UI de respaldo en lugar
 * de que toda la aplicación se rompa.
 * 
 * Uso:
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <ComponenteQuePuedeRomper />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para que el siguiente render muestre la UI de respaldo
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Registrar el error en un servicio de logging (ej: Sentry, LogRocket)
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Aquí puedes enviar el error a un servicio externo
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Si se proporciona una función de reset personalizada
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Si se proporciona un fallback personalizado
      if (this.props.fallback) {
        return React.cloneElement(this.props.fallback, {
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          onReset: this.handleReset
        });
      }

      // UI de error por defecto
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ¡Oops! Algo salió mal
                </h1>
                <p className="text-gray-600 mt-1">
                  Lo sentimos, encontramos un error inesperado
                </p>
              </div>
            </div>

            {/* Error Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-900 mb-2">Detalles del Error:</h3>
              <p className="text-sm text-red-700 font-mono">
                {this.state.error?.toString()}
              </p>
            </div>

            {/* Error Details (solo en desarrollo) */}
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  Stack Trace (modo desarrollo)
                </summary>
                <pre className="text-xs text-gray-600 overflow-auto max-h-64 mt-2">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            {/* Sugerencias */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">¿Qué puedes hacer?</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Intenta recargar la página o volver a intentar la acción</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Verifica tu conexión a internet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Si el problema persiste, contacta al equipo de soporte</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw className="h-5 w-5" />
                Intentar de Nuevo
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                <Home className="h-5 w-5" />
                Ir al Inicio
              </button>
            </div>

            {/* Error Count */}
            {this.state.errorCount > 1 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Este error ha ocurrido {this.state.errorCount} veces
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook para usar con componentes funcionales (complemento)
 * Nota: Los Error Boundaries solo funcionan con componentes de clase,
 * pero este hook puede usarse para manejo de errores asíncronos
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
};

export default ErrorBoundary;
