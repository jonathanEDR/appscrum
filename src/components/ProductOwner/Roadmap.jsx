import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  Calendar, 
  Target, 
  Clock, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  PlayCircle, 
  CheckCircle,
  AlertCircle,
  Users,
  GitBranch,
  MoreVertical
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const Roadmap = () => {
  const { getToken } = useAuth();
  const [releases, setReleases] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [editingRelease, setEditingRelease] = useState(null);
  const [editingSprint, setEditingSprint] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); // timeline, kanban

  useEffect(() => {
    cargarDatos();
  }, [selectedProduct]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();

      // Cargar productos primero
      const productosRes = await fetch(`${API_BASE_URL}/api/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!productosRes.ok) throw new Error('Error al cargar productos');
      const productosData = await productosRes.json();
      setProductos(productosData.products || []);

      // Si hay un producto seleccionado, cargar sus releases y sprints
      if (selectedProduct) {
        console.log('Loading data for product:', selectedProduct);
        
        const [releasesRes, sprintsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/releases/roadmap/${selectedProduct}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/api/sprints?producto=${selectedProduct}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        console.log('Releases response:', releasesRes.status, releasesRes.ok);
        console.log('Sprints response:', sprintsRes.status, sprintsRes.ok);

        if (!releasesRes.ok) throw new Error('Error al cargar releases');
        if (!sprintsRes.ok) throw new Error('Error al cargar sprints');

        const releasesData = await releasesRes.json();
        const sprintsData = await sprintsRes.json();

        console.log('Releases data received:', releasesData);
        console.log('Sprints data received:', sprintsData);
        console.log('Number of releases:', releasesData.releases?.length || 0);
        console.log('Number of sprints:', sprintsData.sprints?.length || 0);

        setReleases(releasesData.releases || []);
        setSprints(sprintsData.sprints || []);
        
        console.log('State updated - releases:', releasesData.releases?.length || 0, 'sprints:', sprintsData.sprints?.length || 0);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar datos del roadmap');
    } finally {
      setLoading(false);
    }
  };

  const crearRelease = async (formData) => {
    try {
      console.log('=== Creating Release ===');
      console.log('Form data received:', formData);
      console.log('Selected product:', selectedProduct);
      
      // Validar que hay un producto seleccionado
      if (!selectedProduct) {
        throw new Error('Debe seleccionar un producto antes de crear un release');
      }
      
      const dataToSend = { ...formData, producto: selectedProduct };
      console.log('Data to send:', dataToSend);
      
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/releases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        throw new Error(errorData.error || 'Error al crear release');
      }

      const result = await response.json();
      console.log('Success response:', result);
      
      await cargarDatos();
      setShowReleaseModal(false);
    } catch (error) {
      console.error('Error creating release:', error);
      setError(error.message);
    }
  };

  const actualizarRelease = async (id, formData) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/releases/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar release');
      }

      await cargarDatos();
      setEditingRelease(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const eliminarRelease = async (id) => {
    if (!confirm('¿Está seguro de eliminar este release?')) return;

    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/releases/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar release');
      }

      await cargarDatos();
    } catch (error) {
      setError(error.message);
    }
  };

  const crearSprint = async (formData) => {
    try {
      console.log('=== Creating Sprint ===');
      console.log('Form data received:', formData);
      console.log('Selected product:', selectedProduct);
      
      // Validar que hay un producto seleccionado
      if (!selectedProduct) {
        throw new Error('Debe seleccionar un producto antes de crear un sprint');
      }
      
      const dataToSend = { ...formData, producto: selectedProduct };
      console.log('Data to send:', dataToSend);
      
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/sprints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        throw new Error(errorData.error || 'Error al crear sprint');
      }

      const result = await response.json();
      console.log('Success response:', result);
      
      console.log('Reloading data after sprint creation...');
      await cargarDatos();
      setShowSprintModal(false);
      console.log('Sprint creation completed successfully');
    } catch (error) {
      console.error('Error creating sprint:', error);
      setError(error.message);
    }
  };

  const cambiarEstadoSprint = async (sprintId, accion) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/sprints/${sprintId}/${accion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(accion === 'complete' ? { velocidad_real: 0 } : {})
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error al ${accion} sprint`);
      }

      await cargarDatos();
    } catch (error) {
      setError(error.message);
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      planificado: 'bg-blue-100 text-blue-800',
      en_desarrollo: 'bg-yellow-100 text-yellow-800',
      activo: 'bg-green-100 text-green-800',
      lanzado: 'bg-purple-100 text-purple-800',
      completado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Roadmap</h1>
              <p className="text-gray-600">Visualiza la hoja de ruta del producto</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Selector de vista */}
            <div className="flex rounded-lg border">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-2 text-sm font-medium rounded-l-lg ${
                  viewMode === 'timeline' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-2 text-sm font-medium rounded-r-lg ${
                  viewMode === 'kanban' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Kanban
              </button>
            </div>

            {selectedProduct && (
              <>
                <button
                  onClick={() => setShowSprintModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  Nuevo Sprint
                </button>
                <button
                  onClick={() => setShowReleaseModal(true)}
                  disabled={!selectedProduct}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedProduct 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  title={!selectedProduct ? 'Selecciona un producto primero' : ''}
                >
                  <Plus size={20} />
                  Nuevo Release
                </button>
              </>
            )}
          </div>
        </div>

        {/* Selector de producto */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Producto:</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Seleccionar producto</option>
            {productos.map(producto => (
              <option key={producto._id} value={producto._id}>
                {producto.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {selectedProduct ? (
        <>
          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Releases</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{releases.length}</div>
              <div className="text-sm text-gray-500">
                {releases.filter(r => r.estado === 'lanzado').length} lanzados
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <GitBranch className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Sprints</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{sprints.length}</div>
              <div className="text-sm text-gray-500">
                {sprints.filter(s => s.estado === 'activo').length} activo
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">En Desarrollo</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {releases.filter(r => r.estado === 'en_desarrollo').length}
              </div>
              <div className="text-sm text-gray-500">releases activos</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Progreso</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {releases.length > 0 
                  ? Math.round(releases.reduce((sum, r) => sum + r.progreso, 0) / releases.length)
                  : 0}%
              </div>
              <div className="text-sm text-gray-500">promedio</div>
            </div>
          </div>

          {/* Vista de roadmap */}
          {viewMode === 'timeline' ? (
            <TimelineView 
              releases={releases} 
              sprints={sprints}
              onEditRelease={setEditingRelease}
              onDeleteRelease={eliminarRelease}
              onEditSprint={setEditingSprint}
              onSprintAction={cambiarEstadoSprint}
              getEstadoColor={getEstadoColor}
              formatearFecha={formatearFecha}
            />
          ) : (
            <KanbanView 
              releases={releases}
              sprints={sprints}
              onEditRelease={setEditingRelease}
              onDeleteRelease={eliminarRelease}
              onEditSprint={setEditingSprint}
              onSprintAction={cambiarEstadoSprint}
              getEstadoColor={getEstadoColor}
              formatearFecha={formatearFecha}
            />
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12">
          <div className="text-center max-w-md mx-auto">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Selecciona un producto
            </h2>
            <p className="text-gray-500">
              Elige un producto del menú desplegable para ver su roadmap
            </p>
          </div>
        </div>
      )}

      {/* Modales */}
      {showReleaseModal && (
        <ReleaseModal
          onClose={() => setShowReleaseModal(false)}
          onSave={crearRelease}
        />
      )}

      {showSprintModal && (
        <SprintModal
          onClose={() => setShowSprintModal(false)}
          onSave={crearSprint}
          releases={releases}
        />
      )}

      {editingRelease && (
        <ReleaseModal
          release={editingRelease}
          onClose={() => setEditingRelease(null)}
          onSave={(data) => actualizarRelease(editingRelease._id, data)}
        />
      )}
    </div>
  );
};

// Componente TimelineView
const TimelineView = ({ 
  releases, 
  sprints,
  onEditRelease, 
  onDeleteRelease,
  onEditSprint,
  onSprintAction,
  getEstadoColor, 
  formatearFecha 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Vista Timeline</h3>
      
      <div className="space-y-8">
        {releases.map(release => (
          <div key={release._id} className="border-l-4 border-purple-200 pl-6 relative">
            {/* Línea temporal */}
            <div className="absolute left-0 top-0 w-3 h-3 bg-purple-600 rounded-full -translate-x-1.5"></div>
            
            {/* Contenido del release */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-gray-900">{release.nombre}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(release.estado)}`}>
                    {release.estado.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">v{release.version}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditRelease(release)}
                    className="p-1 text-gray-600 hover:text-blue-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteRelease(release._id)}
                    className="p-1 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-3">{release.descripcion}</p>
              
              <div className="flex items-center gap-6 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>Objetivo: {formatearFecha(release.fecha_objetivo)}</span>
                </div>
                {release.fecha_lanzamiento && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} />
                    <span>Lanzado: {formatearFecha(release.fecha_lanzamiento)}</span>
                  </div>
                )}
              </div>
              
              {/* Barra de progreso */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progreso</span>
                  <span>{release.progreso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${release.progreso}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Sprints del release */}
            <div className="ml-4 space-y-3">
              {sprints
                .filter(sprint => release.sprints?.includes(sprint._id))
                .map(sprint => (
                  <SprintCard 
                    key={sprint._id}
                    sprint={sprint}
                    onEdit={onEditSprint}
                    onAction={onSprintAction}
                    getEstadoColor={getEstadoColor}
                    formatearFecha={formatearFecha}
                  />
                ))}
            </div>
          </div>
        ))}
        
        {/* Sprints sin release asignado */}
        {sprints.filter(sprint => !releases.some(release => release.sprints?.includes(sprint._id))).length > 0 && (
          <div className="border-l-4 border-blue-200 pl-6 relative">
            <div className="absolute left-0 top-0 w-3 h-3 bg-blue-600 rounded-full -translate-x-1.5"></div>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Sprints Independientes</h4>
              <div className="space-y-3">
                {sprints
                  .filter(sprint => !releases.some(release => release.sprints?.includes(sprint._id)))
                  .map(sprint => (
                    <SprintCard 
                      key={sprint._id}
                      sprint={sprint}
                      onEdit={onEditSprint}
                      onAction={onSprintAction}
                      getEstadoColor={getEstadoColor}
                      formatearFecha={formatearFecha}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
        
        {releases.length === 0 && sprints.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay releases ni sprints creados aún</p>
          </div>
        )}
        
        {releases.length === 0 && sprints.length > 0 && (
          <div className="text-center py-8">
            <div className="border-l-4 border-blue-200 pl-6 relative max-w-2xl mx-auto">
              <div className="absolute left-0 top-0 w-3 h-3 bg-blue-600 rounded-full -translate-x-1.5"></div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Sprints Existentes</h4>
                <div className="space-y-3">
                  {sprints.map(sprint => (
                    <SprintCard 
                      key={sprint._id}
                      sprint={sprint}
                      onEdit={onEditSprint}
                      onAction={onSprintAction}
                      getEstadoColor={getEstadoColor}
                      formatearFecha={formatearFecha}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente KanbanView
const KanbanView = ({ 
  releases,
  sprints,
  onEditRelease, 
  onDeleteRelease,
  onEditSprint,
  onSprintAction,
  getEstadoColor, 
  formatearFecha 
}) => {
  const estados = ['planificado', 'en_desarrollo', 'lanzado'];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Vista Kanban</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {estados.map(estado => (
          <div key={estado} className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4 capitalize">
              {estado.replace('_', ' ')}
            </h4>
            
            <div className="space-y-3">
              {releases
                .filter(release => release.estado === estado)
                .map(release => (
                  <div key={release._id} className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">{release.nombre}</h5>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditRelease(release)}
                          className="p-1 text-gray-600 hover:text-blue-600"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteRelease(release._id)}
                          className="p-1 text-gray-600 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">v{release.version}</p>
                    <p className="text-xs text-gray-500 mb-3">{release.descripcion}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatearFecha(release.fecha_objetivo)}</span>
                      <span>{release.progreso}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                      <div 
                        className="bg-purple-600 h-1 rounded-full"
                        style={{ width: `${release.progreso}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              
              {releases.filter(r => r.estado === estado).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Target size={24} className="mx-auto mb-2" />
                  <p className="text-sm">No hay releases</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente SprintCard
const SprintCard = ({ 
  sprint, 
  onEdit, 
  onAction, 
  getEstadoColor, 
  formatearFecha 
}) => {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-blue-600" />
          <h5 className="font-medium text-gray-900">{sprint.nombre}</h5>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(sprint.estado)}`}>
            {sprint.estado}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {sprint.estado === 'planificado' && (
            <button
              onClick={() => onAction(sprint._id, 'start')}
              className="p-1 text-green-600 hover:text-green-700"
              title="Iniciar sprint"
            >
              <PlayCircle size={16} />
            </button>
          )}
          {sprint.estado === 'activo' && (
            <button
              onClick={() => onAction(sprint._id, 'complete')}
              className="p-1 text-blue-600 hover:text-blue-700"
              title="Completar sprint"
            >
              <CheckCircle size={16} />
            </button>
          )}
          <button
            onClick={() => onEdit(sprint)}
            className="p-1 text-gray-600 hover:text-blue-600"
          >
            <Edit size={14} />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{sprint.objetivo}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatearFecha(sprint.fecha_inicio)} - {formatearFecha(sprint.fecha_fin)}</span>
        <span>Velocidad: {sprint.velocidad_planificada}</span>
      </div>
    </div>
  );
};

// Modal de Release
const ReleaseModal = ({ release, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: release?.nombre || '',
    version: release?.version || '',
    descripcion: release?.descripcion || '',
    fecha_objetivo: release?.fecha_objetivo ? release.fecha_objetivo.split('T')[0] : '',
    prioridad: release?.prioridad || 'media',
    notas: release?.notas || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {release ? 'Editar Release' : 'Nuevo Release'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Versión
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Objetivo
            </label>
            <input
              type="date"
              value={formData.fecha_objetivo}
              onChange={(e) => setFormData({ ...formData, fecha_objetivo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad
            </label>
            <select
              value={formData.prioridad}
              onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {release ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de Sprint
const SprintModal = ({ sprint, releases, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: sprint?.nombre || '',
    objetivo: sprint?.objetivo || '',
    fecha_inicio: sprint?.fecha_inicio ? sprint.fecha_inicio.split('T')[0] : '',
    fecha_fin: sprint?.fecha_fin ? sprint.fecha_fin.split('T')[0] : '',
    velocidad_planificada: sprint?.velocidad_planificada || 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {sprint ? 'Editar Sprint' : 'Nuevo Sprint'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objetivo
            </label>
            <textarea
              value={formData.objetivo}
              onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Velocidad Planificada
            </label>
            <input
              type="number"
              value={formData.velocidad_planificada}
              onChange={(e) => setFormData({ ...formData, velocidad_planificada: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {sprint ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Roadmap;