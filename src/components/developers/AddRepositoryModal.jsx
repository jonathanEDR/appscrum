import React, { useState, useEffect } from 'react';
import { X, Github, Search, Plus, CheckCircle, AlertCircle, Loader, FolderGit2 } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

const AddRepositoryModal = ({ isOpen, onClose, onRepositoryAdded }) => {
  const { getToken } = useAuth();
  const [githubRepos, setGithubRepos] = useState([]);
  const [myRepos, setMyRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepos, setSelectedRepos] = useState(new Set());
  const [addingRepos, setAddingRepos] = useState(new Set());
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('github'); // 'github' o 'my-repos'

  useEffect(() => {
    if (isOpen) {
      fetchGitHubRepositories();
      fetchMyRepositories();
    }
  }, [isOpen]);

  const fetchGitHubRepositories = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const response = await fetch('/api/repos/github/available', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener repositorios de GitHub');
      }

      const data = await response.json();
      setGithubRepos(data.repositories || []);
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
      setError('No se pudieron cargar los repositorios de GitHub');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRepositories = async () => {
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
    }
  };

  const addRepository = async (githubRepo) => {
    setAddingRepos(prev => new Set(prev).add(githubRepo.id));
    setError('');

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const response = await fetch('/api/repos/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          githubRepository: githubRepo
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar repositorio');
      }

      const data = await response.json();
      
      // Actualizar listas
      setMyRepos(prev => [data.repository, ...prev]);
      setGithubRepos(prev => prev.filter(repo => repo.id !== githubRepo.id));
      setSelectedRepos(prev => {
        const newSet = new Set(prev);
        newSet.delete(githubRepo.id);
        return newSet;
      });

      // Notificar al componente padre
      if (onRepositoryAdded) {
        onRepositoryAdded(data.repository);
      }

    } catch (error) {
      console.error('Error adding repository:', error);
      setError(`Error al agregar ${githubRepo.name}: ${error.message}`);
    } finally {
      setAddingRepos(prev => {
        const newSet = new Set(prev);
        newSet.delete(githubRepo.id);
        return newSet;
      });
    }
  };

  const addSelectedRepositories = async () => {
    const selectedReposList = githubRepos.filter(repo => selectedRepos.has(repo.id));
    
    for (const repo of selectedReposList) {
      await addRepository(repo);
    }
  };

  const toggleRepoSelection = (repoId) => {
    setSelectedRepos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(repoId)) {
        newSet.delete(repoId);
      } else {
        newSet.add(repoId);
      }
      return newSet;
    });
  };

  const filteredGithubRepos = githubRepos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMyRepos = myRepos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderGit2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Gestionar Repositorios</h2>
              <p className="text-sm text-gray-600">Agrega y administra tus repositorios de código</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('github')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'github'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              Agregar desde GitHub ({filteredGithubRepos.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('my-repos')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'my-repos'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4" />
              Mis Repositorios ({filteredMyRepos.length})
            </div>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Search */}
        <div className="p-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar repositorios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'github' && (
            <div className="h-full flex flex-col">
              {/* Selected actions */}
              {selectedRepos.size > 0 && (
                <div className="mx-6 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700 text-sm">
                      {selectedRepos.size} repositorio(s) seleccionado(s)
                    </span>
                    <button
                      onClick={addSelectedRepositories}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar Seleccionados
                    </button>
                  </div>
                </div>
              )}

              {/* GitHub repos list */}
              <div className="flex-1 overflow-y-auto px-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600">Cargando repositorios...</span>
                  </div>
                ) : filteredGithubRepos.length === 0 ? (
                  <div className="text-center py-12">
                    <Github className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No se encontraron repositorios disponibles
                    </h3>
                    <p className="text-gray-600">
                      Todos los repositorios ya están agregados o no coinciden con la búsqueda
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pb-6">
                    {filteredGithubRepos.map((repo) => (
                      <div
                        key={repo.id}
                        className={`border rounded-lg p-4 transition-all cursor-pointer ${
                          selectedRepos.has(repo.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleRepoSelection(repo.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedRepos.has(repo.id)}
                              onChange={() => {}}
                              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                  {repo.name}
                                </h3>
                                {repo.private && (
                                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                    Privado
                                  </span>
                                )}
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
                                <span>⭐ {repo.stargazers_count}</span>
                                <span>🍴 {repo.forks_count}</span>
                                <span>Actualizado: {new Date(repo.updated_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addRepository(repo);
                            }}
                            disabled={addingRepos.has(repo.id)}
                            className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            {addingRepos.has(repo.id) ? (
                              <Loader className="w-3 h-3 animate-spin" />
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                            Agregar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'my-repos' && (
            <div className="h-full overflow-y-auto px-6">
              {filteredMyRepos.length === 0 ? (
                <div className="text-center py-12">
                  <FolderGit2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No tienes repositorios agregados
                  </h3>
                  <p className="text-gray-600">
                    Cambia a la pestaña "Agregar desde GitHub" para comenzar
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pb-6">
                  {filteredMyRepos.map((repo) => (
                    <div
                      key={repo._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {repo.name}
                            </h3>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                              Agregado
                            </span>
                            {repo.is_private && (
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                Privado
                              </span>
                            )}
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
                            <span>Agregado: {new Date(repo.createdAt).toLocaleDateString()}</span>
                            <span>Owner: {repo.owner}</span>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {activeTab === 'github' 
              ? `${filteredGithubRepos.length} repositorios disponibles`
              : `${filteredMyRepos.length} repositorios agregados`
            }
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRepositoryModal;
