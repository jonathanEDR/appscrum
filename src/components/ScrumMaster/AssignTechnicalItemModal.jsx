import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  X, 
  Target, 
  ArrowRight, 
  Check, 
  AlertCircle 
} from 'lucide-react';

const AssignTechnicalItemModal = ({ 
  isOpen, 
  onClose, 
  technicalItem, 
  availableStories, 
  onAssignSuccess 
}) => {
  const { getToken } = useAuth();
  const [selectedStoryId, setSelectedStoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && technicalItem) {
      // Si el item ya tiene historia padre, seleccionarla
      setSelectedStoryId(technicalItem.historia_padre?._id || '');
      setError('');
    }
  }, [isOpen, technicalItem]);

  const handleAssign = async () => {
    if (!technicalItem) return;

    try {
      setLoading(true);
      setError('');

      const token = await getToken();
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(
        `${API_URL}/backlog/${technicalItem._id}/assign-to-story`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            historia_id: selectedStoryId || null
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al asignar item');
      }

      const result = await response.json();
      console.log('Item asignado exitosamente:', result);

      // Notificar éxito y cerrar modal
      onAssignSuccess(result);
      onClose();

    } catch (error) {
      console.error('Error asignando item:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getItemTypeInfo = (type) => {
    switch (type) {
      case 'tarea':
        return { label: 'Tarea', color: 'text-purple-600', bgColor: 'bg-purple-100' };
      case 'bug':
        return { label: 'Bug', color: 'text-red-600', bgColor: 'bg-red-100' };
      case 'mejora':
        return { label: 'Mejora', color: 'text-green-600', bgColor: 'bg-green-100' };
      default:
        return { label: 'Item', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  if (!isOpen || !technicalItem) return null;

  const typeInfo = getItemTypeInfo(technicalItem.tipo);
  const currentStory = availableStories.find(story => 
    story._id === technicalItem.historia_padre?._id
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${typeInfo.bgColor} ${typeInfo.color}`}>
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Asignar {typeInfo.label} a Historia
              </h3>
              <p className="text-sm text-gray-500">
                {technicalItem.titulo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Item actual */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Item a asignar:</h4>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.bgColor} ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
              <span className="font-medium">{technicalItem.titulo}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{technicalItem.descripcion}</p>
            
            {currentStory && (
              <div className="mt-3 p-3 bg-blue-50 rounded border">
                <p className="text-sm font-medium text-blue-700">
                  Actualmente asignado a: {currentStory.titulo}
                </p>
              </div>
            )}
          </div>

          {/* Selector de historia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Seleccionar Historia de Destino:
            </label>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {/* Opción para desasignar */}
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="historia"
                  value=""
                  checked={selectedStoryId === ''}
                  onChange={(e) => setSelectedStoryId(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                      Sin asignar
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    No asignar a ninguna historia
                  </p>
                </div>
              </label>

              {/* Opciones de historias */}
              {availableStories.map(story => (
                <label 
                  key={story._id} 
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="historia"
                    value={story._id}
                    checked={selectedStoryId === story._id}
                    onChange={(e) => setSelectedStoryId(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded font-medium">
                        Historia
                      </span>
                      <span className="font-medium">{story.titulo}</span>
                      {story.puntos_historia && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded font-medium">
                          {story.puntos_historia} SP
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate">
                      {story.descripcion}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>Producto: {story.producto?.nombre}</span>
                      {story.asignado_a && (
                        <span>Asignado: {story.asignado_a.nombre_negocio || story.asignado_a.email}</span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {availableStories.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No hay historias disponibles en este sprint</p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Error</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAssign}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Check className="h-4 w-4" />
                {selectedStoryId ? 'Asignar' : 'Desasignar'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTechnicalItemModal;
