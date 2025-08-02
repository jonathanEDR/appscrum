import React, { useState } from 'react';
import { Search, Filter, Calendar, User, Tag } from 'lucide-react';

const AdvancedFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    prioridad: '',
    fechaDesde: '',
    fechaHasta: '',
    responsable: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-800">Filtros Avanzados</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Búsqueda por texto */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filtro por estado */}
        <select
          value={filters.estado}
          onChange={(e) => handleFilterChange('estado', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Todos los estados</option>
          <option value="planificado">Planificado</option>
          <option value="en_desarrollo">En Desarrollo</option>
          <option value="activo">Activo</option>
          <option value="completado">Completado</option>
          <option value="lanzado">Lanzado</option>
        </select>

        {/* Filtro por prioridad */}
        <select
          value={filters.prioridad}
          onChange={(e) => handleFilterChange('prioridad', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>

        {/* Fecha desde */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="date"
            placeholder="Fecha desde"
            value={filters.fechaDesde}
            onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
            className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Fecha hasta */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="date"
            placeholder="Fecha hasta"
            value={filters.fechaHasta}
            onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
            className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Botón limpiar filtros */}
        <button
          onClick={() => {
            const emptyFilters = {
              search: '', estado: '', prioridad: '', 
              fechaDesde: '', fechaHasta: '', responsable: ''
            };
            setFilters(emptyFilters);
            onFilterChange(emptyFilters);
          }}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilters;
