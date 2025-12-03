import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  Search,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  XCircle,
  Archive
} from 'lucide-react';

const getDecisionStatusColors = (theme) => [
  { value: 'proposed', label: 'Propuesto', color: theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700', icon: Clock },
  { value: 'accepted', label: 'Aceptado', color: theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'rejected', label: 'Rechazado', color: theme === 'dark' ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700', icon: XCircle },
  { value: 'deprecated', label: 'Deprecado', color: theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700', icon: Archive },
  { value: 'superseded', label: 'Reemplazado', color: theme === 'dark' ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-700', icon: Archive }
];

// Keep static version for form options
const DECISION_STATUS = [
  { value: 'proposed', label: 'Propuesto' },
  { value: 'accepted', label: 'Aceptado' },
  { value: 'rejected', label: 'Rechazado' },
  { value: 'deprecated', label: 'Deprecado' },
  { value: 'superseded', label: 'Reemplazado' }
];

const EMPTY_DECISION = {
  title: '',
  context: '',
  decision: '',
  consequences: '',
  status: 'proposed',
  date: new Date().toISOString().split('T')[0],
  author: '',
  alternatives: '',
  related_decisions: ''
};

/**
 * DecisionsTab - Gestión de Architecture Decision Records (ADRs)
 */
const DecisionsTab = ({ architecture, onAddDecision, onUpdateArchitecture, loading, theme = 'light' }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState(EMPTY_DECISION);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedDecision, setExpandedDecision] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const decisions = architecture?.architecture_decisions || [];
  const statusColors = getDecisionStatusColors(theme);

  // Filtrar decisiones - mantener índice original
  const filteredDecisions = decisions.map((decision, originalIndex) => ({
    ...decision,
    originalIndex
  })).filter(decision => {
    const matchesSearch = decision.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         decision.context?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         decision.decision?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || decision.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingIndex !== null) {
        const updatedDecisions = [...decisions];
        updatedDecisions[editingIndex] = formData;
        await onUpdateArchitecture({ architecture_decisions: updatedDecisions });
      } else {
        await onAddDecision(formData);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving decision:', err);
    }
  };

  const handleEdit = (decision, index) => {
    setEditingIndex(index);
    setFormData({
      title: decision.title || '',
      context: decision.context || '',
      decision: decision.decision || '',
      consequences: decision.consequences || '',
      status: decision.status || 'proposed',
      date: decision.date || new Date().toISOString().split('T')[0],
      author: decision.author || '',
      alternatives: decision.alternatives || '',
      related_decisions: decision.related_decisions || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    try {
      const updatedDecisions = decisions.filter((_, i) => i !== index);
      await onUpdateArchitecture({ architecture_decisions: updatedDecisions });
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting decision:', err);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingIndex(null);
    setFormData(EMPTY_DECISION);
  };

  const getStatusConfig = (status) => {
    return statusColors.find(s => s.value === status) || statusColors[0];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <FileText className="text-pink-600" />
            Decisiones de Arquitectura (ADRs)
          </h2>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Documenta las decisiones importantes de arquitectura del proyecto
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          disabled={loading}
        >
          <Plus size={20} />
          Nueva Decisión
        </button>
      </div>

      {/* Info Banner */}
      <div className={`rounded-lg p-4 border ${
        theme === 'dark' ? 'bg-pink-900/30 border-pink-800' : 'bg-pink-50 border-pink-200'
      }`}>
        <p className={`text-sm ${theme === 'dark' ? 'text-pink-300' : 'text-pink-800'}`}>
          <strong>¿Qué es un ADR?</strong> Un Architecture Decision Record documenta una decisión de arquitectura significativa: 
          el contexto, la decisión tomada, y sus consecuencias. Ayuda a mantener un registro histórico del "por qué" detrás de las decisiones técnicas.
        </p>
      </div>

      {/* Filters */}
      <div className={`rounded-xl border p-4 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} size={20} />
            <input
              type="text"
              placeholder="Buscar decisiones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">Todos los estados</option>
            {DECISION_STATUS.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Decision Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {editingIndex !== null ? 'Editar Decisión' : 'Nueva Decisión de Arquitectura'}
                </h3>
                <button
                  onClick={resetForm}
                  className={theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Título de la Decisión *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="ej: Usar React con TypeScript para el frontend"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Estado
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {DECISION_STATUS.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                {/* Author */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Autor
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Nombre del autor"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              {/* Context */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Contexto *
                </label>
                <textarea
                  name="context"
                  value={formData.context}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="¿Cuál es el problema o situación que motivó esta decisión?"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Decision */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Decisión *
                </label>
                <textarea
                  name="decision"
                  value={formData.decision}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="¿Qué decidimos hacer? Describe la solución elegida."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Consequences */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Consecuencias
                </label>
                <textarea
                  name="consequences"
                  value={formData.consequences}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="¿Cuáles son las consecuencias (positivas y negativas) de esta decisión?"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Alternatives */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Alternativas Consideradas
                </label>
                <textarea
                  name="alternatives"
                  value={formData.alternatives}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="¿Qué otras opciones se consideraron?"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Related Decisions */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Decisiones Relacionadas
                </label>
                <input
                  type="text"
                  name="related_decisions"
                  value={formData.related_decisions}
                  onChange={handleInputChange}
                  placeholder="IDs o títulos de decisiones relacionadas"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Actions */}
              <div className={`flex justify-end gap-3 pt-4 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <button
                  type="button"
                  onClick={resetForm}
                  className={theme === 'dark' ? 'px-4 py-2 text-gray-400 hover:text-gray-200' : 'px-4 py-2 text-gray-600 hover:text-gray-800'}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.title || !formData.context || !formData.decision}
                  className="flex items-center gap-2 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {editingIndex !== null ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-xl max-w-md w-full p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full ${
                theme === 'dark' ? 'bg-red-900/50' : 'bg-red-100'
              }`}>
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h3 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Confirmar Eliminación</h3>
            </div>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              ¿Estás seguro de eliminar la decisión <strong>"{confirmDelete.title}"</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className={theme === 'dark' ? 'px-4 py-2 text-gray-400 hover:text-gray-200' : 'px-4 py-2 text-gray-600 hover:text-gray-800'}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.index)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decisions List */}
      {filteredDecisions.length > 0 ? (
        <div className="space-y-4">
          {filteredDecisions.map((decision) => {
            const statusConfig = getStatusConfig(decision.status);
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedDecision === decision.originalIndex;

            return (
              <div
                key={decision.originalIndex}
                className={`rounded-xl border overflow-hidden transition-shadow ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-900/50' 
                    : 'bg-white border-gray-200 hover:shadow-md'
                }`}
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedDecision(isExpanded ? null : decision.originalIndex)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-sm font-mono ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>ADR-{String(decision.originalIndex + 1).padStart(3, '0')}</span>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${statusConfig.color}`}>
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </span>
                      </div>
                      <h4 className={`font-semibold text-lg ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{decision.title}</h4>
                      <p className={`mt-1 line-clamp-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>{decision.context}</p>
                      
                      <div className={`flex items-center gap-4 mt-3 text-sm ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {decision.date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(decision.date)}
                          </span>
                        )}
                        {decision.author && (
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {decision.author}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(decision, decision.originalIndex); }}
                        className={`p-2 rounded-lg ${
                          theme === 'dark' 
                            ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/50' 
                            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete({ ...decision, index: decision.originalIndex }); }}
                        className={`p-2 rounded-lg ${
                          theme === 'dark' 
                            ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/50' 
                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={18} />
                      </button>
                      {isExpanded ? <ChevronUp size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} /> : <ChevronDown size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className={`px-5 pb-5 pt-4 border-t ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50'
                  }`}>
                    <div className="space-y-4">
                      <div>
                        <h5 className={`text-sm font-semibold uppercase mb-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                        }`}>Decisión</h5>
                        <p className={`whitespace-pre-wrap ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>{decision.decision}</p>
                      </div>

                      {decision.consequences && (
                        <div>
                          <h5 className={`text-sm font-semibold uppercase mb-2 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                          }`}>Consecuencias</h5>
                          <p className={`whitespace-pre-wrap ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>{decision.consequences}</p>
                        </div>
                      )}

                      {decision.alternatives && (
                        <div>
                          <h5 className={`text-sm font-semibold uppercase mb-2 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                          }`}>Alternativas Consideradas</h5>
                          <p className={`whitespace-pre-wrap ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>{decision.alternatives}</p>
                        </div>
                      )}

                      {decision.related_decisions && (
                        <div>
                          <h5 className={`text-sm font-semibold uppercase mb-2 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                          }`}>Decisiones Relacionadas</h5>
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{decision.related_decisions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`rounded-xl border p-12 text-center ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className={`text-lg font-semibold mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {decisions.length === 0 ? 'No hay decisiones documentadas' : 'No se encontraron resultados'}
          </h3>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            {decisions.length === 0 
              ? 'Documenta las decisiones importantes de arquitectura de tu proyecto'
              : 'Intenta ajustar los filtros de búsqueda'
            }
          </p>
          {decisions.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
            >
              <Plus size={20} />
              Crear Primera Decisión
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DecisionsTab;
