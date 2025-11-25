import React from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ProjectFilters = ({ filters, projects, onFilterChange }) => {
  const { theme } = useTheme();
  
  const handleClearFilters = () => {
    onFilterChange('project', 'all');
    onFilterChange('type', 'all');
    onFilterChange('priority', 'all');
    onFilterChange('status', 'available');
    onFilterChange('search', '');
  };

  return (
    <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Filtros</h3>
        <button
          onClick={handleClearFilters}
          className={`flex items-center gap-2 px-3 py-1 text-sm border rounded-lg transition-colors ${
            theme === 'dark' 
              ? 'text-gray-300 border-gray-600 hover:text-white hover:bg-gray-700' 
              : 'text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <X className="h-4 w-4" />
          Limpiar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Búsqueda */}
        <div className="lg:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Buscar por título o descripción..."
              className={`pl-10 pr-4 py-2 border rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>

        {/* Proyecto */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Proyecto
          </label>
          <select
            value={filters.project}
            onChange={(e) => onFilterChange('project', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los proyectos</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>
                {project.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los tipos</option>
            <option value="tarea">Tarea</option>
            <option value="bug">Bug</option>
            <option value="mejora">Mejora</option>
          </select>
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioridad
          </label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todas las prioridades</option>
            <option value="muy_alta">Muy Alta</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
      </div>

      {/* Indicadores de filtros activos */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.search && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Búsqueda: "{filters.search}"
            <button
              onClick={() => onFilterChange('search', '')}
              className="ml-1 hover:text-blue-900"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {filters.project !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Proyecto: {projects.find(p => p._id === filters.project)?.nombre || 'Desconocido'}
            <button
              onClick={() => onFilterChange('project', 'all')}
              className="ml-1 hover:text-green-900"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {filters.type !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            Tipo: {filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}
            <button
              onClick={() => onFilterChange('type', 'all')}
              className="ml-1 hover:text-purple-900"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {filters.priority !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
            Prioridad: {filters.priority.replace('_', ' ').charAt(0).toUpperCase() + filters.priority.replace('_', ' ').slice(1)}
            <button
              onClick={() => onFilterChange('priority', 'all')}
              className="ml-1 hover:text-orange-900"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectFilters;
