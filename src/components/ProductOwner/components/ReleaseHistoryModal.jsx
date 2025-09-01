import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const ReleaseHistoryModal = ({ release, onClose }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  // Definir API_BASE_URL localmente como en Roadmap.jsx
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/releases/${release._id}/historial`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setHistorial(data.historial);
        }
      } catch (error) {
        console.error('Error al cargar historial:', error);
      } finally {
        setLoading(false);
      }
    };

    if (release?._id) {
      fetchHistorial();
    }
  }, [release, getToken]);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccionColor = (accion) => {
    const colores = {
      'creacion': 'bg-blue-100 text-blue-800',
      'cambio_estado': 'bg-yellow-100 text-yellow-800',
      'actualizacion': 'bg-green-100 text-green-800',
      'sprint_completado': 'bg-purple-100 text-purple-800'
    };
    return colores[accion] || 'bg-gray-100 text-gray-800';
  };

  const getAccionTexto = (entrada) => {
    switch(entrada.accion) {
      case 'creacion':
        return 'Release creado';
      case 'cambio_estado':
        return `Estado: ${entrada.estado_anterior} → ${entrada.estado_nuevo}`;
      case 'actualizacion':
        return 'Release actualizado';
      case 'sprint_completado':
        return 'Sprint completado';
      default:
        return entrada.accion;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Historial - {release.nombre} v{release.version}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando historial...</p>
            </div>
          ) : historial.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay historial disponible
            </div>
          ) : (
            <div className="space-y-4">
              {historial.map((entrada, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4 py-3 bg-gray-50 rounded-r">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccionColor(entrada.accion)}`}>
                        {getAccionTexto(entrada)}
                      </span>
                      {entrada.progreso_anterior !== undefined && entrada.progreso_nuevo !== undefined && (
                        <span className="text-sm text-gray-600">
                          Progreso: {entrada.progreso_anterior}% → {entrada.progreso_nuevo}%
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatearFecha(entrada.fecha)}
                    </span>
                  </div>
                  
                  {entrada.usuario && (
                    <p className="text-sm text-gray-600 mb-1">
                      Por: {entrada.usuario.firstName} {entrada.usuario.lastName}
                    </p>
                  )}
                  
                  {entrada.notas && (
                    <p className="text-sm text-gray-700 italic">
                      "{entrada.notas}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReleaseHistoryModal;
