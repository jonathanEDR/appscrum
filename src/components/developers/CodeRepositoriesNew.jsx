import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  GitBranch, 
  GitCommit, 
  FileText, 
  RefreshCw, 
  Plus, 
  Settings, 
  Eye, 
  AlertCircle,
  Clock,
  User,
  ExternalLink,
  Search,
  Filter,
  Download,
  Link,
  FolderGit2,
  Package
} from 'lucide-react';
import AddRepositoryModal from './AddRepositoryModal';
import AssignRepositoryModal from './AssignRepositoryModal';

const CodeRepositories = () => {
  const { user, getToken } = useAuth();
  const [repositories, setRepositories] = useState([]);
  const [myRepos, setMyRepos] = useState([]);
  const [selectedRepository, setSelectedRepository] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('project');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  // Mock data for project - en una implementación real, esto vendría del contexto o props
  const currentProject = {
    id: '6897e7de3edc217764f5f510', // ID del producto que creamos
    name: 'Repositorios GitHub'
  };

  useEffect(() => {
    if (activeTab === 'project') {
      fetchProjectRepositories();
    } else {
      fetchMyRepositories();
    }
  }, [activeTab]);

  const fetchProjectRepositories = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`/api/repos/product/${currentProject.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRepositories(data.data || []);
      } else {
        throw new Error('Error al cargar repositorios del proyecto');
      }
    } catch (error) {
      console.error('Error fetching project repositories:', error);
      setError('Error al cargar repositorios del proyecto');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRepositories = async () => {
    setLoading(true);
    setError('');
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
      } else {
        throw new Error('Error al cargar mis repositorios');
      }
    } catch (error) {
      console.error('Error fetching my repositories:', error);
      setError('Error al cargar mis repositorios');
    } finally {
      setLoading(false);
    }
  };

  const handleRepositoryAdded = (newRepo) => {
    setMyRepos(prev => [newRepo, ...prev]);
    if (activeTab === 'my-repos') {
      fetchMyRepositories();
    }
  };

  const handleRepositoryAssigned = () => {
    fetchProjectRepositories();
  };

  const syncRepository = async (repoId) => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`/api/repos/${repoId}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh the current view
        if (activeTab === 'project') {
          fetchProjectRepositories();
        } else {
          fetchMyRepositories();
        }
      }
    } catch (error) {
      console.error('Error syncing repository:', error);
    }
  };

  const currentRepos = activeTab === 'project' ? repositories : myRepos;
  const filteredRepos = currentRepos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOverallStats = () => {
    if (activeTab === 'project') {
      return {
        totalRepos: repositories.length,
        totalCommits: repositories.reduce((sum, repo) => sum + (repo.metrics?.total_commits || 0), 0),
        totalBranches: repositories.reduce((sum, repo) => sum + (repo.metrics?.total_branches || 0), 0),
        activeRepos: repositories.filter(repo => repo.status === 'active').length
      };
    } else {
      return {
        totalRepos: myRepos.length,
        totalCommits: myRepos.reduce((sum, repo) => sum + (repo.metrics?.total_commits || 0), 0),
        totalBranches: myRepos.reduce((sum, repo) => sum + (repo.metrics?.total_branches || 0), 0),
        activeRepos: myRepos.filter(repo => repo.status === 'active').length
      };
    }
  };

  const stats = getOverallStats();

  if (loading && currentRepos.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Cargando repositorios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Repositorios de Código</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y monitorea tus repositorios de código
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Repositorio
          </button>
          {activeTab === 'project' && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Link className="w-4 h-4" />
              Asignar al Proyecto
            </button>
          )}
          <button
            onClick={() => activeTab === 'project' ? fetchProjectRepositories() : fetchMyRepositories()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('project')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'project'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Package className="w-4 h-4" />
            Del Proyecto ({repositories.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('my-repos')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'my-repos'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FolderGit2 className="w-4 h-4" />
            Mis Repositorios ({myRepos.length})
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Repositorios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRepos}</p>
            </div>
            <GitBranch className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Commits</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCommits}</p>
            </div>
            <GitCommit className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Branches</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBranches}</p>
            </div>
            <GitBranch className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeRepos}</p>
            </div>
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Search */}
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

      {/* Repository List */}
      <div className="space-y-4">
        {filteredRepos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FolderGit2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentRepos.length === 0 
                ? `No hay repositorios ${activeTab === 'project' ? 'en el proyecto' : 'agregados'}`
                : 'No se encontraron repositorios'
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {currentRepos.length === 0
                ? activeTab === 'project' 
                  ? 'Asigna repositorios a este proyecto para comenzar'
                  : 'Agrega repositorios desde GitHub para comenzar'
                : 'Intenta cambiar los filtros de búsqueda'
              }
            </p>
            {currentRepos.length === 0 && (
              <button
                onClick={() => activeTab === 'project' ? setShowAssignModal(true) : setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                {activeTab === 'project' ? 'Asignar Repositorio' : 'Agregar Repositorio'}
              </button>
            )}
          </div>
        ) : (
          filteredRepos.map((repo) => (
            <div
              key={repo._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {repo.name}
                    </h3>
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
                    <span className={`px-2 py-1 text-xs rounded ${
                      repo.status === 'active' ? 'bg-green-100 text-green-800' :
                      repo.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {repo.status === 'active' ? 'Activo' :
                       repo.status === 'maintenance' ? 'Mantenimiento' :
                       'Archivado'}
                    </span>
                    {activeTab === 'project' && repo.assignment && (
                      <span className={`px-2 py-1 text-xs rounded ${
                        repo.assignment.role === 'primary' ? 'bg-blue-100 text-blue-800' :
                        repo.assignment.role === 'secondary' ? 'bg-green-100 text-green-800' :
                        repo.assignment.role === 'dependency' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {repo.assignment.role === 'primary' ? 'Principal' :
                         repo.assignment.role === 'secondary' ? 'Secundario' :
                         repo.assignment.role === 'dependency' ? 'Dependencia' :
                         'Herramienta'}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {repo.description || 'Sin descripción'}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <GitCommit className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">
                        {repo.metrics?.total_commits || 0} commits
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">
                        {repo.metrics?.total_branches || 0} branches
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        {repo.owner}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-gray-600">
                        {repo.metrics?.last_commit_date 
                          ? new Date(repo.metrics.last_commit_date).toLocaleDateString()
                          : 'Sin actividad'
                        }
                      </span>
                    </div>
                  </div>

                  {activeTab === 'project' && repo.assignment && (
                    <div className="text-xs text-gray-500 mb-2">
                      Asignado el {new Date(repo.assignment.assigned_at).toLocaleDateString()} por {repo.assignment.assigned_by?.email}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => syncRepository(repo._id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Sincronizar"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Ver en GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setSelectedRepository(repo)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <AddRepositoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onRepositoryAdded={handleRepositoryAdded}
      />

      <AssignRepositoryModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onRepositoryAssigned={handleRepositoryAssigned}
        productId={currentProject.id}
        productName={currentProject.name}
      />
    </div>
  );
};

export default CodeRepositories;
