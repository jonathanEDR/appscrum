import React, { useState, useEffect } from 'react';
import { X, Github, Search, Plus, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

const ConnectRepositoryModal = ({ isOpen, onClose, onRepositoryConnected, projectId }) => {
  const { getToken } = useAuth();
  const [githubRepos, setGithubRepos] = useState([]);
  const [connectedRepos, setConnectedRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepos, setSelectedRepos] = useState(new Set());
  const [connectingRepos, setConnectingRepos] = useState(new Set());
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchGitHubRepositories();
      fetchConnectedRepositories();
    }
  }, [isOpen, projectId]);

  const fetchGitHubRepositories = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const response = await fetch('/api/repositories/github/available', {
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

  const fetchConnectedRepositories = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`/api/repositories/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConnectedRepos(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching connected repositories:', error);
    }
  };
       

  const connectRepository = async (githubRepo) => {
    setConnectingRepos(prev => new Set(prev).add(githubRepo.id));
    setError('');

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const response = await fetch('/api/repositories/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          githubRepository: {
            id: githubRepo.id,
            name: githubRepo.name,
            full_name: githubRepo.full_name,
            description: githubRepo.description,
            html_url: githubRepo.html_url,
            clone_url: githubRepo.clone_url,
            ssh_url: githubRepo.ssh_url,
            owner: githubRepo.owner.login,
            private: githubRepo.private,
            language: githubRepo.language,
            default_branch: githubRepo.default_branch
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al conectar repositorio');
      }

      const data = await response.json();
      
      // Actualizar listas
      setConnectedRepos(prev => [...prev, data.repository]);
      setSelectedRepos(prev => {
        const newSet = new Set(prev);
        newSet.delete(githubRepo.id);
        return newSet;
      });

      // Notificar al componente padre
      if (onRepositoryConnected) {
        onRepositoryConnected(data.repository);
      }

    } catch (error) {
      console.error('Error connecting repository:', error);
      setError(`Error al conectar ${githubRepo.name}: ${error.message}`);
    } finally {
      setConnectingRepos(prev => {
        const newSet = new Set(prev);
        newSet.delete(githubRepo.id);
        return newSet;
      });
    }
  };

  const connectSelectedRepositories = async () => {
    const selectedReposList = githubRepos.filter(repo => selectedRepos.has(repo.id));
    
    for (const repo of selectedReposList) {
      await connectRepository(repo);
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

  const filteredRepos = githubRepos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const notConnected = !connectedRepos.some(connected => connected.repo_id === repo.id.toString());
    return matchesSearch && notConnected;
  });

  const isRepoConnected = (repoId) => {
    return connectedRepos.some(repo => repo.repo_id === repoId.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Github className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Conectar Repositorios</h2>
                <p className="text-blue-100">Selecciona repositorios de GitHub para agregar al proyecto</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar repositorios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          {selectedRepos.size > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-blue-700">
                  {selectedRepos.size} repositorio{selectedRepos.size !== 1 ? 's' : ''} seleccionado{selectedRepos.size !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={connectSelectedRepositories}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Conectar Seleccionados</span>
                </button>
              </div>
            </div>
          )}

          {/* Repository List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-8 w-8 text-blue-600 animate-spin" />
                <span className="ml-2 text-gray-600">Cargando repositorios...</span>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Github className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No se encontraron repositorios disponibles</p>
                <p className="text-sm">Todos los repositorios ya están conectados o no coinciden con la búsqueda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRepos.map((repo) => {
                  const isConnecting = connectingRepos.has(repo.id);
                  const isSelected = selectedRepos.has(repo.id);
                  const isConnectedRepo = isRepoConnected(repo.id);

                  return (
                    <div
                      key={repo.id}
                      className={`border rounded-lg p-4 transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      } ${isConnectedRepo ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleRepoSelection(repo.id)}
                              disabled={isConnectedRepo || isConnecting}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">{repo.name}</h3>
                                {repo.private && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    Privado
                                  </span>
                                )}
                                {repo.language && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    {repo.language}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mt-1">
                                {repo.description || 'Sin descripción'}
                              </p>
                              <p className="text-gray-400 text-xs mt-1">
                                {repo.full_name} • Actualizado: {new Date(repo.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {isConnectedRepo ? (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="h-5 w-5" />
                              <span className="text-sm">Conectado</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => connectRepository(repo)}
                              disabled={isConnecting}
                              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                            >
                              {isConnecting ? (
                                <>
                                  <Loader className="h-4 w-4 animate-spin" />
                                  <span>Conectando...</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4" />
                                  <span>Conectar</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {connectedRepos.length} repositorio{connectedRepos.length !== 1 ? 's' : ''} conectado{connectedRepos.length !== 1 ? 's' : ''} al proyecto
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={fetchGitHubRepositories}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectRepositoryModal;
