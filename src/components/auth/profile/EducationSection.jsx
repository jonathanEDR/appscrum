import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  GraduationCap,
  Calendar,
  BookOpen,
  Loader2
} from 'lucide-react';
import { profileService } from '../../../services/profileService';

const EducationSection = ({ profile, onRefresh, onSuccess, onError, viewMode }) => {
  const { getToken } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    level: 'bachelor',
    startDate: '',
    endDate: '',
    status: 'completed',
    description: ''
  });

  const education = profile.education || [];
  const canAddMore = education.length < 3;

  const levels = {
    high_school: 'Secundaria',
    technical: 'Técnico',
    bachelor: 'Licenciatura',
    master: 'Maestría',
    phd: 'Doctorado',
    other: 'Otro'
  };

  const statuses = {
    completed: 'Completado',
    in_progress: 'En Curso',
    incomplete: 'Incompleto'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!formData.institution.trim() || !formData.degree.trim() || !formData.field.trim()) {
      onError('Institución, título y campo son requeridos');
      return;
    }

    try {
      setSaving(true);
      const data = {
        institution: formData.institution,
        degree: formData.degree,
        field: formData.field,
        level: formData.level,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        status: formData.status,
        description: formData.description
      };
      
      await profileService.addEducation(data, getToken);
      onSuccess('Educación agregada correctamente');
      resetForm();
      setIsAdding(false);
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al agregar educación');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (edu) => {
    setEditingId(edu._id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      level: edu.level || 'bachelor',
      startDate: edu.startDate?.split('T')[0] || '',
      endDate: edu.endDate?.split('T')[0] || '',
      status: edu.status || 'completed',
      description: edu.description || ''
    });
  };

  const handleUpdate = async (eduId) => {
    if (!formData.institution.trim() || !formData.degree.trim() || !formData.field.trim()) {
      onError('Institución, título y campo son requeridos');
      return;
    }

    try {
      setSaving(true);
      const data = {
        institution: formData.institution,
        degree: formData.degree,
        field: formData.field,
        level: formData.level,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        status: formData.status,
        description: formData.description
      };
      
      await profileService.updateEducation(eduId, data, getToken);
      onSuccess('Educación actualizada correctamente');
      setEditingId(null);
      resetForm();
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al actualizar educación');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eduId) => {
    if (!confirm('¿Estás seguro de eliminar esta educación?')) return;

    try {
      setSaving(true);
      await profileService.deleteEducation(eduId, getToken);
      onSuccess('Educación eliminada correctamente');
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al eliminar educación');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      field: '',
      level: 'bachelor',
      startDate: '',
      endDate: '',
      status: 'completed',
      description: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    resetForm();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      in_progress: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      incomplete: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    };
    return colors[status] || colors.completed;
  };

  const getLevelColor = (level) => {
    const colors = {
      high_school: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      technical: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      bachelor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      master: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      phd: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      other: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    };
    return colors[level] || colors.other;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Educación
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {education.length}/3 títulos agregados
          </p>
        </div>
        
        {viewMode === 'edit' && !isAdding && !editingId && canAddMore && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Agregar Educación
          </button>
        )}
      </div>

      {/* Formulario */}
      {(isAdding || editingId) && viewMode === 'edit' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-4">
            {isAdding ? 'Nueva Educación' : 'Editar Educación'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Institución *
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ej: Universidad Nacional"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ej: Ingeniero en Sistemas"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Campo de Estudio *
                </label>
                <input
                  type="text"
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ej: Ingeniería de Software"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nivel
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(levels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(statuses).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe áreas de especialización, proyectos destacados..."
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {formData.description.length}/500
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancelEdit}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={isAdding ? handleAdd : () => handleUpdate(editingId)}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Lista de Educación */}
      {education.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <GraduationCap className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No has agregado educación aún
          </p>
          {viewMode === 'edit' && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              Agregar Primera Educación
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {education.sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0)).map((edu) => (
            <div
              key={edu._id}
              className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(edu.level)}`}>
                      {levels[edu.level] || edu.level}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(edu.status)}`}>
                      {statuses[edu.status] || edu.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {edu.degree}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mt-1 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {edu.institution}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    {edu.field}
                  </p>
                  {(edu.startDate || edu.endDate) && (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500 text-sm mt-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(edu.startDate)} {edu.endDate && `- ${formatDate(edu.endDate)}`}
                      </span>
                    </div>
                  )}
                </div>

                {viewMode === 'edit' && !editingId && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(edu)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(edu._id)}
                      disabled={saving}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {edu.description && (
                <p className="text-slate-700 dark:text-slate-300 text-sm mt-3 whitespace-pre-wrap">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {!canAddMore && viewMode === 'edit' && (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            Has alcanzado el límite máximo de 3 títulos educativos
          </p>
        </div>
      )}
    </div>
  );
};

export default EducationSection;
