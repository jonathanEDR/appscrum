import React, { useState, useEffect } from 'react';
import { X, Link, CheckCircle, AlertCircle, Loader, FolderGit2, Package } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

const AssignRepositoryModal = ({ isOpen, onClose, onRepositoryAssigned, productId, productName }) => {
  const { getToken } = useAuth();
  const [myRepos, setMyRepos] = useState([]);
  const [assignedRepos, setAssignedRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(new Set());
  const [error, setError] = useState('');
  const [selectedRepo, setSelectedRepo] = useState('');
  const [role, setRole] = useState('primary');
  const [permissions, setPermissions] = useState({
    read: true,
    write: false,
    admin: false
  });

  useEffect(() => {
    if (isOpen && productId) {
      fetchMyRepositories();
      fetchAssignedRepositories();
    }
  }, [isOpen, productId]);

  const fetchMyRepositories = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch('/api/repos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMyRepos(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching my repositories:', error);
      setError('Error al cargar repositorios');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedRepositories = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`/api/repos/product/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAssignedRepos(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching assigned repositories:', error);
    }
  };

  const assignRepository = async () => {
    if (!selectedRepo) {
      setError('Selecciona un repositorio');
      return;
    }

    setAssigning(prev => new Set(prev).add(selectedRepo));
    setError('');

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const response = await fetch(`/api/repos/${selectedRepo}/assign-to-product`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          role,
          permissions
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al asignar repositorio');
      }

      const data = await response.json();
      
      // Refresh assigned repositories
      await fetchAssignedRepositories();
      
      // Reset form
      setSelectedRepo('');
      setRole('primary');
      setPermissions({ read: true, write: false, admin: false });

      // Notify parent
      if (onRepositoryAssigned) {
        onRepositoryAssigned(data.assignment);
      }

    } catch (error) {
      console.error('Error assigning repository:', error);
      setError(error.message);
    } finally {
      setAssigning(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedRepo);
        return newSet;
      });
    }
  };

  const removeAssignment = async (repositoryId) => {
    setAssigning(prev => new Set(prev).add(repositoryId));
    setError('');

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const response = await fetch(`/api/repos/${repositoryId}/remove-from-product/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al remover repositorio');
      }

      // Refresh assigned repositories
      await fetchAssignedRepositories();

    } catch (error) {
      console.error('Error removing assignment:', error);
      setError(error.message);
    } finally {
      setAssigning(prev => {
        const newSet = new Set(prev);
        newSet.delete(repositoryId);
        return newSet;
      });
    }
  };

  // Filter out already assigned repositories
  const assignedRepoIds = assignedRepos.map(repo => repo._id);
  const availableRepos = myRepos.filter(repo => !assignedRepoIds.includes(repo._id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Link className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Asignar Repositorios</h2>
              <p className="text-sm text-gray-600">
                Conectar repositorios al producto: {productName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add New Assignment */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Asignar Nuevo Repositorio</h3>
            
            {availableRepos.length === 0 ? (
              <div className="text-center py-6">
                <FolderGit2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No hay repositorios disponibles para asignar</p>
                <p className="text-sm text-gray-500 mt-1">
                  Todos los repositorios ya están asignados a este producto
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Repository Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repositorio
                  </label>
                  <select
                    value={selectedRepo}
                    onChange={(e) => setSelectedRepo(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar repositorio...</option>
                    {availableRepos.map((repo) => (
                      <option key={repo._id} value={repo._id}>
                        {repo.name} - {repo.language}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol en el Producto
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="primary">Principal</option>
                    <option value="secondary">Secundario</option>
                    <option value="dependency">Dependencia</option>
                    <option value="tool">Herramienta</option>
                  </select>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permisos
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={permissions.read}
                        onChange={(e) => setPermissions(prev => ({...prev, read: e.target.checked}))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Lectura</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={permissions.write}
                        onChange={(e) => setPermissions(prev => ({...prev, write: e.target.checked}))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Escritura</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={permissions.admin}
                        onChange={(e) => setPermissions(prev => ({...prev, admin: e.target.checked}))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Administración</span>
                    </label>
                  </div>
                </div>

                {/* Assign Button */}
                <button
                  onClick={assignRepository}
                  disabled={!selectedRepo || assigning.has(selectedRepo) || loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {assigning.has(selectedRepo) ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Link className="w-4 h-4" />
                  )}
                  Asignar Repositorio
                </button>
              </div>
            )}
          </div>

          {/* Assigned Repositories */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Repositorios Asignados ({assignedRepos.length})
            </h3>
            
            {assignedRepos.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No hay repositorios asignados</p>
                <p className="text-sm text-gray-500 mt-1">
                  Asigna repositorios para comenzar a trabajar en este producto
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignedRepos.map((repo) => (
                  <div
                    key={repo._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {repo.name}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded ${
                            repo.assignment?.role === 'primary' ? 'bg-blue-100 text-blue-800' :
                            repo.assignment?.role === 'secondary' ? 'bg-green-100 text-green-800' :
                            repo.assignment?.role === 'dependency' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {repo.assignment?.role === 'primary' ? 'Principal' :
                             repo.assignment?.role === 'secondary' ? 'Secundario' :
                             repo.assignment?.role === 'dependency' ? 'Dependencia' :
                             'Herramienta'}
                          </span>
                          {repo.language && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {repo.language}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {repo.description || 'Sin descripción'}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Asignado: {new Date(repo.assignment?.assigned_at).toLocaleDateString()}</span>
                          <span>Por: {repo.assignment?.assigned_by?.email}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAssignment(repo._id)}
                        disabled={assigning.has(repo._id)}
                        className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                      >
                        {assigning.has(repo._id) ? (
                          <Loader className="w-3 h-3 animate-spin" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {assignedRepos.length} repositorio(s) asignado(s)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRepositoryModal;
