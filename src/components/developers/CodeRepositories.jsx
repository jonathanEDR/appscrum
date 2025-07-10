import React, { useState } from 'react';
import { 
  Code, 
  GitBranch, 
  GitCommit, 
  GitPullRequest,
  GitMerge,
  Github,
  ExternalLink,
  Calendar,
  User,
  FileCode,
  Plus,
  Minus
} from 'lucide-react';

const CodeRepositories = () => {
  const [selectedRepo, setSelectedRepo] = useState('appscrum-frontend');

  const repositories = [
    {
      id: 'appscrum-frontend',
      name: 'appscrum-frontend',
      description: 'Frontend de la aplicación AppScrum desarrollado en React',
      language: 'JavaScript',
      lastCommit: '2025-01-09T10:30:00Z',
      commits: 127,
      branches: 8,
      pullRequests: 3,
      status: 'active'
    },
    {
      id: 'appscrum-backend',
      name: 'appscrum-backend',
      description: 'API backend de AppScrum desarrollado en Node.js',
      language: 'JavaScript',
      lastCommit: '2025-01-08T16:45:00Z',
      commits: 89,
      branches: 5,
      pullRequests: 1,
      status: 'active'
    },
    {
      id: 'appscrum-docs',
      name: 'appscrum-docs',
      description: 'Documentación técnica y guías del proyecto',
      language: 'Markdown',
      lastCommit: '2025-01-07T09:15:00Z',
      commits: 24,
      branches: 2,
      pullRequests: 0,
      status: 'maintenance'
    }
  ];

  const recentCommits = [
    {
      id: '1',
      message: 'feat: Implementar panel de desarrolladores con métricas',
      author: 'Tu',
      date: '2025-01-09T10:30:00Z',
      hash: 'a1b2c3d',
      additions: 245,
      deletions: 18
    },
    {
      id: '2',
      message: 'fix: Corregir validación en formulario de login',
      author: 'Tu',
      date: '2025-01-09T08:15:00Z',
      hash: 'e4f5g6h',
      additions: 12,
      deletions: 8
    },
    {
      id: '3',
      message: 'refactor: Optimizar consultas de base de datos',
      author: 'Tu',
      date: '2025-01-08T14:20:00Z',
      hash: 'i7j8k9l',
      additions: 67,
      deletions: 134
    },
    {
      id: '4',
      message: 'test: Agregar tests unitarios para componentes auth',
      author: 'Tu',
      date: '2025-01-08T11:45:00Z',
      hash: 'm0n1o2p',
      additions: 189,
      deletions: 3
    }
  ];

  const pullRequests = [
    {
      id: 1,
      title: 'Implementar sistema de autenticación JWT',
      status: 'open',
      author: 'Tu',
      created: '2025-01-08',
      commits: 8,
      additions: 456,
      deletions: 23,
      reviewers: ['Carlos López', 'Ana García']
    },
    {
      id: 2,
      title: 'Agregar validaciones de formularios',
      status: 'review',
      author: 'María Rodríguez',
      created: '2025-01-07',
      commits: 5,
      additions: 123,
      deletions: 45,
      reviewers: ['Tu', 'Carlos López']
    },
    {
      id: 3,
      title: 'Optimización de rendimiento en dashboard',
      status: 'approved',
      author: 'Carlos López',
      created: '2025-01-06',
      commits: 12,
      additions: 234,
      deletions: 67,
      reviewers: ['Tu', 'Ana García']
    }
  ];

  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': 'bg-yellow-400',
      'TypeScript': 'bg-blue-400',
      'Python': 'bg-green-400',
      'Markdown': 'bg-gray-400',
      'CSS': 'bg-purple-400'
    };
    return colors[language] || 'bg-gray-400';
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'maintenance': 'bg-yellow-100 text-yellow-800',
      'archived': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.active;
  };

  const getPRStatusColor = (status) => {
    const colors = {
      'open': 'bg-blue-100 text-blue-800',
      'review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'merged': 'bg-purple-100 text-purple-800',
      'closed': 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.open;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const selectedRepoData = repositories.find(repo => repo.id === selectedRepo);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Code className="h-6 w-6 mr-3 text-blue-600" />
              Repositorios de Código
            </h1>
            <p className="text-gray-600 mt-1">Gestiona tus repositorios, commits y pull requests</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Github className="h-4 w-4" />
              Abrir en GitHub
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Repository Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Repositorios del Proyecto</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              onClick={() => setSelectedRepo(repo.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedRepo === repo.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-gray-600" />
                  <h4 className="font-medium text-gray-900">{repo.name}</h4>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(repo.status)}`}>
                  {repo.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{repo.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                  <span className="text-gray-600">{repo.language}</span>
                </div>
                <span className="text-gray-500">{formatDate(repo.lastCommit)}</span>
              </div>
              
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <GitCommit className="h-3 w-3" />
                    {repo.commits}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitBranch className="h-3 w-3" />
                    {repo.branches}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitPullRequest className="h-3 w-3" />
                    {repo.pullRequests}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Repository Details */}
      {selectedRepoData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Commits */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <GitCommit className="h-5 w-5 mr-2 text-gray-600" />
                Commits Recientes
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentCommits.map((commit) => (
                  <div key={commit.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight pr-4">
                        {commit.message}
                      </h4>
                      <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                        {commit.hash}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span className={commit.author === 'Tu' ? 'font-medium text-blue-600' : ''}>
                          {commit.author}
                        </span>
                        <Calendar className="h-3 w-3 ml-2" />
                        <span>{formatDate(commit.date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-green-600">
                          <Plus className="h-3 w-3" />
                          {commit.additions}
                        </span>
                        <span className="flex items-center gap-1 text-red-600">
                          <Minus className="h-3 w-3" />
                          {commit.deletions}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pull Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <GitPullRequest className="h-5 w-5 mr-2 text-gray-600" />
                Pull Requests
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pullRequests.map((pr) => (
                  <div key={pr.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight pr-4">
                        {pr.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPRStatusColor(pr.status)}`}>
                        {pr.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {pr.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(pr.created).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitCommit className="h-3 w-3" />
                        {pr.commits} commits
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-green-600">
                          <Plus className="h-3 w-3" />
                          {pr.additions}
                        </span>
                        <span className="flex items-center gap-1 text-red-600">
                          <Minus className="h-3 w-3" />
                          {pr.deletions}
                        </span>
                      </div>
                      
                      <div className="text-gray-500">
                        Reviewers: {pr.reviewers.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <GitBranch className="h-5 w-5 mr-2 text-gray-600" />
          Estadísticas de Desarrollo
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {repositories.reduce((sum, repo) => sum + repo.commits, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Commits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {repositories.reduce((sum, repo) => sum + repo.branches, 0)}
            </div>
            <div className="text-sm text-gray-600">Branches Activas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {repositories.reduce((sum, repo) => sum + repo.pullRequests, 0)}
            </div>
            <div className="text-sm text-gray-600">Pull Requests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{repositories.length}</div>
            <div className="text-sm text-gray-600">Repositorios</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeRepositories;
