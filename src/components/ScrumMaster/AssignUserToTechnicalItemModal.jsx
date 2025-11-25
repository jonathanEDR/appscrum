import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  X, 
  User, 
  UserPlus,
  AlertCircle, 
  CheckCircle, 
  CheckSquare,
  Bug,
  Settings,
  Loader2
} from 'lucide-react';

const AssignUserToTechnicalItemModal = ({ 
  isOpen, 
  onClose, 
  technicalItem, 
  onAssignSuccess 
}) => {
  const { getToken } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDevelopers, setFetchingDevelopers] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchDevelopers();
      // Pre-seleccionar el usuario actual si existe
      setSelectedUserId(technicalItem?.asignado_a?._id || '');
      setError('');
    }
  }, [isOpen, technicalItem]);

  const fetchDevelopers = async () => {
    try {
      setFetchingDevelopers(true);
      const token = await getToken();
      const API_URL = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${API_URL}/team/members`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Filtrar solo developers
        const devs = (data.members || [])
          .filter(member => member.role === 'developer' || member.role === 'developers')
          .map(member => ({
            _id: member.user._id,
            nombre_negocio: member.user.nombre_negocio || member.user.email,
            email: member.user.email,
            role: member.role
          }));
        
        setDevelopers(devs);
      } else {
        const errorData = await response.json();
        console.error('Error cargando developers:', errorData);
        setError('Error al cargar la lista de developers');
      }
    } catch (error) {
      console.error('Error fetching developers:', error);
      setError('Error al cargar la lista de developers');
    } finally {
      setFetchingDevelopers(false);
    }
  };

  const handleAssign = async () => {
    if (!technicalItem) return;

    try {
      setLoading(true);
      setError('');

      const token = await getToken();
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(
        `${API_URL}/backlog/${technicalItem._id}/assign-user`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: selectedUserId || null
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al asignar usuario');
      }

      // Notificar éxito y cerrar modal
      onAssignSuccess(result);
      onClose();

    } catch (error) {
      console.error('Error asignando usuario:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getItemTypeInfo = (type) => {
    switch (type) {
      case 'tarea':
        return { 
          label: 'Tarea', 
          icon: CheckSquare,
          color: 'text-purple-600', 
          bgColor: 'bg-purple-100' 
        };
      case 'bug':
        return { 
          label: 'Bug', 
          icon: Bug,
          color: 'text-red-600', 
          bgColor: 'bg-red-100' 
        };
      case 'mejora':
        return { 
          label: 'Mejora', 
          icon: Settings,
          color: 'text-green-600', 
          bgColor: 'bg-green-100' 
        };
      default:
        return { 
          label: 'Item', 
          icon: CheckSquare,
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100' 
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critica':
      case 'muy_alta':
        return 'text-red-700';
      case 'alta':
        return 'text-orange-600';
      case 'media':
        return 'text-yellow-600';
      case 'baja':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'critica': return 'Crítica';
      case 'muy_alta': return 'Muy Alta';
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
      default: return 'Media';
    }
  };

  if (!isOpen || !technicalItem) return null;

  const typeInfo = getItemTypeInfo(technicalItem.tipo);
  const TypeIcon = typeInfo.icon;
  const currentUser = developers.find(dev => dev._id === technicalItem.asignado_a?._id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${typeInfo.bgColor}`}>
              <TypeIcon className={`h-6 w-6 ${typeInfo.color}`} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Asignar Usuario a {typeInfo.label}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Selecciona un developer para asignar este item técnico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Información del item técnico */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-orange-500" />
              Item Técnico
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${typeInfo.bgColor} ${typeInfo.color}`}>
                  {typeInfo.label}
                </span>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900">{technicalItem.titulo}</h5>
                  <p className="text-sm text-gray-600 mt-1">{technicalItem.descripcion}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Prioridad:</span>
                  <span className={`font-medium ${getPriorityColor(technicalItem.prioridad)}`}>
                    {getPriorityText(technicalItem.prioridad)}
                  </span>
                </div>
                
                {technicalItem.producto && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Producto:</span>
                    <span className="font-medium text-gray-700">
                      {technicalItem.producto.nombre}
                    </span>
                  </div>
                )}
                
                {technicalItem.historia_padre && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Historia:</span>
                    <span className="font-medium text-blue-600 truncate max-w-xs">
                      {technicalItem.historia_padre.titulo}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {currentUser && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Actualmente asignado a: {currentUser.nombre_negocio}
                </p>
              </div>
            )}
          </div>

          {/* Selector de Developer */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-orange-500" />
              Seleccionar Developer
            </label>
            
            {fetchingDevelopers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                <span className="ml-2 text-gray-600">Cargando developers...</span>
              </div>
            ) : developers.length === 0 ? (
              <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                <p className="text-yellow-800 font-medium">No hay developers disponibles</p>
                <p className="text-sm text-yellow-600 mt-1">
                  Agrega miembros con rol Developer al equipo
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {/* Opción para des-asignar */}
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="developer"
                    value=""
                    checked={selectedUserId === ''}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <X className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Sin asignar</div>
                        <p className="text-sm text-gray-500">
                          Des-asignar este item (volverá a estar disponible)
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Opciones de developers */}
                {developers.map(developer => {
                  const isCurrentlyAssigned = developer._id === technicalItem.asignado_a?._id;
                  
                  return (
                    <label 
                      key={developer._id} 
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedUserId === developer._id
                          ? 'border-orange-500 bg-orange-50'
                          : isCurrentlyAssigned
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="developer"
                        value={developer._id}
                        checked={selectedUserId === developer._id}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                            {developer.nombre_negocio.charAt(0).toUpperCase()}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-gray-900">
                                {developer.nombre_negocio}
                              </div>
                              {isCurrentlyAssigned && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                  Actual
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{developer.email}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Error</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleAssign}
            disabled={loading || fetchingDevelopers || (developers.length === 0 && selectedUserId !== '')}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Asignando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                {selectedUserId ? 'Asignar Usuario' : 'Des-asignar'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignUserToTechnicalItemModal;
