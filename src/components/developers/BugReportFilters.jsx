import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const BugReportFilters = ({ onFilterChange, onSearchChange, filters }) => {
  const { theme } = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Opciones de filtros
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'open', label: '🔴 Abierto' },
    { value: 'in_progress', label: '🔵 En Progreso' },
    { value: 'resolved', label: '🟢 Resuelto' },
    { value: 'closed', label: '⚫ Cerrado' }
  ];

  const priorityOptions = [
    { value: '', label: 'Todas las prioridades' },
    { value: 'low', label: '🟢 Baja' },
    { value: 'medium', label: '🔵 Media' },
    { value: 'high', label: '🟡 Alta' },
    { value: 'critical', label: '🔴 Crítica' }
  ];

  const severityOptions = [
    { value: '', label: 'Todas las severidades' },
    { value: 'minor', label: 'Menor' },
    { value: 'moderate', label: 'Moderada' },
    { value: 'major', label: 'Mayor' },
    { value: 'critical', label: 'Crítica' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearchChange(value);
  };

  const handleFilterChange = (filterName, value) => {
    onFilterChange({ ...filters, [filterName]: value });
  };

  const clearFilters = () => {
    setSearchText('');
    onSearchChange('');
    onFilterChange({
      status: '',
      priority: '',
      severity: '',
      assignedToMe: false
    });
  };

  const hasActiveFilters = () => {
    return searchText || 
           filters.status || 
           filters.priority || 
           filters.severity || 
           filters.assignedToMe;
  };

  return (
    <div className={`rounded-xl shadow-sm border p-4 space-y-4 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Barra de búsqueda y botones principales */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Buscar por título o descripción..."
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
          {searchText && (
            <button
              onClick={() => {
                setSearchText('');
                onSearchChange('');
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              showAdvanced
                ? 'bg-blue-500 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>

          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-red-900/40 text-red-300 hover:bg-red-900/60'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              <X className="h-4 w-4" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange('status', filters.status === 'open' ? '' : 'open')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            filters.status === 'open'
              ? 'bg-red-500 text-white'
              : theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔴 Abiertos
        </button>

        <button
          onClick={() => handleFilterChange('status', filters.status === 'in_progress' ? '' : 'in_progress')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            filters.status === 'in_progress'
              ? 'bg-blue-500 text-white'
              : theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔵 En Progreso
        </button>

        <button
          onClick={() => handleFilterChange('priority', filters.priority === 'critical' ? '' : 'critical')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            filters.priority === 'critical'
              ? 'bg-red-500 text-white'
              : theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔴 Críticos
        </button>

        <button
          onClick={() => handleFilterChange('assignedToMe', !filters.assignedToMe)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            filters.assignedToMe
              ? 'bg-purple-500 text-white'
              : theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          👤 Asignados a mí
        </button>
      </div>

      {/* Filtros avanzados (colapsable) */}
      {showAdvanced && (
        <div className={`pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4 ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {/* Estado */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Estado
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Prioridad */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Prioridad
            </label>
            <select
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Severidad */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Severidad
            </label>
            <select
              value={filters.severity || ''}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {severityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Indicador de filtros activos */}
      {hasActiveFilters() && (
        <div className={`pt-3 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Filter className="inline h-4 w-4 mr-1" />
            Filtros activos: 
            {searchText && <span className="ml-1 text-blue-600 font-medium">Búsqueda</span>}
            {filters.status && <span className="ml-1 text-blue-600 font-medium">Estado</span>}
            {filters.priority && <span className="ml-1 text-blue-600 font-medium">Prioridad</span>}
            {filters.severity && <span className="ml-1 text-blue-600 font-medium">Severidad</span>}
            {filters.assignedToMe && <span className="ml-1 text-blue-600 font-medium">Asignados</span>}
          </p>
        </div>
      )}
    </div>
  );
};

export default BugReportFilters;
