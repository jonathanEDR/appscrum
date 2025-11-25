import React, { useState, useCallback, useMemo } from 'react';
import { Bug, AlertCircle, CheckCircle, Clock, Plus, Loader } from 'lucide-react';
import { useBugReports } from '../../hooks/useBugReports';
import BugReportCard from './BugReportCard';
import BugReportFilters from './BugReportFilters';
import BugReportModal from './BugReportModal';
import BugReportDetail from './BugReportDetail';
import { useTheme } from '../../context/ThemeContext';

const BugReports = () => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [selectedBugId, setSelectedBugId] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    severity: '',
    assignedToMe: false
  });
  const [searchText, setSearchText] = useState('');

  // Hook para bug reports
  const { 
    bugReports, 
    loading, 
    error, 
    bugStats,
    updateBugReport,
    deleteBugReport,
    refresh 
  } = useBugReports();

  // Filtrar bugs por búsqueda de texto
  const filteredBySearch = useMemo(() => {
    if (!searchText.trim()) return bugReports;
    
    const lowerSearch = searchText.toLowerCase();
    return bugReports.filter(bug => 
      bug.title?.toLowerCase().includes(lowerSearch) ||
      bug.description?.toLowerCase().includes(lowerSearch)
    );
  }, [bugReports, searchText]);

  // Aplicar filtros
  const filteredBugs = useMemo(() => {
    let result = filteredBySearch;

    if (filters.status) {
      result = result.filter(bug => bug.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter(bug => bug.priority === filters.priority);
    }

    if (filters.severity) {
      result = result.filter(bug => bug.severity === filters.severity);
    }

    if (filters.assignedToMe) {
      // TODO: Filtrar por usuario actual cuando tengamos el contexto
      result = result.filter(bug => bug.assignedTo !== null);
    }

    return result;
  }, [filteredBySearch, filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSearchChange = useCallback((text) => {
    setSearchText(text);
  }, []);

  const handleBugClick = useCallback((bug) => {
    setSelectedBugId(bug._id);
  }, []);

  const handleCreateBug = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    // No necesitamos refresh aquí porque createBugReport ya actualiza el estado
  }, []);

  const handleDetailClose = useCallback(() => {
    setSelectedBugId(null);
  }, []);

  const handleDetailUpdate = useCallback((updatedBug) => {
    // Actualización optimista del estado local
    if (updatedBug) {
      updateBugReport(updatedBug._id, updatedBug);
    }
  }, [updateBugReport]);

  const handleDetailDelete = useCallback((bugId) => {
    // Eliminación optimista del estado local
    deleteBugReport(bugId);
    setSelectedBugId(null);
  }, [deleteBugReport]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Bug className="h-8 w-8 text-red-500" />
            Bug Reports
          </h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Gestiona y reporta bugs del sistema • {filteredBugs.length} resultado{filteredBugs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button 
          onClick={handleCreateBug}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          Nuevo Bug Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
              <p className={`text-3xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{bugStats.total}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Bug className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Abiertos</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{bugStats.open}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'}`}>
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>En Progreso</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{bugStats.inProgress}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Resueltos</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{bugStats.resolved}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <BugReportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
      />

      {/* Lista de Bugs */}
      {loading ? (
        <div className={`rounded-xl shadow-sm border p-12 text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <Loader className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Cargando bug reports...</p>
        </div>
      ) : error ? (
        <div className={`border-2 rounded-xl p-8 text-center ${theme === 'dark' ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'}`}>
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-red-300' : 'text-red-900'}`}>Error al cargar bugs</h3>
          <p className={theme === 'dark' ? 'text-red-400' : 'text-red-700'}>{error}</p>
          <button
            onClick={refresh}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : filteredBugs.length === 0 ? (
        <div className={`rounded-xl shadow-sm border p-12 text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <Bug className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {bugReports.length === 0 ? 'No hay bug reports' : 'No se encontraron resultados'}
          </h3>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {bugReports.length === 0 
              ? 'Aún no hay bugs reportados. ¡Crea el primero!' 
              : 'Intenta ajustar los filtros de búsqueda'}
          </p>
          {bugReports.length === 0 && (
            <button
              onClick={handleCreateBug}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear Bug Report
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBugs.map((bug) => (
            <BugReportCard
              key={bug._id}
              bug={bug}
              onClick={handleBugClick}
            />
          ))}
        </div>
      )}

      {/* Modal para crear bug */}
      <BugReportModal
        isOpen={showModal}
        onClose={handleModalClose}
      />

      {/* Modal de detalle */}
      {selectedBugId && (
        <BugReportDetail
          bugId={selectedBugId}
          onClose={handleDetailClose}
          onUpdate={handleDetailUpdate}
          onDelete={handleDetailDelete}
        />
      )}
    </div>
  );
};

export default BugReports;
