import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  Briefcase,
  Calendar,
  Building2,
  Loader2
} from 'lucide-react';
import { profileService } from '../../../services/profileService';

const ExperienceSection = ({ profile, onRefresh, onSuccess, onError, viewMode }) => {
  const { getToken } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    technologies: '',
    achievements: ''
  });

  const experience = profile.experience || [];
  const canAddMore = experience.length < 3;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'isCurrent' && checked ? { endDate: '' } : {})
    }));
  };

  const handleAdd = async () => {
    if (!formData.company.trim() || !formData.position.trim() || !formData.startDate) {
      onError('Empresa, puesto y fecha de inicio son requeridos');
      return;
    }

    try {
      setSaving(true);
      const data = {
        company: formData.company,
        position: formData.position,
        startDate: formData.startDate,
        endDate: formData.isCurrent ? null : formData.endDate,
        isCurrent: formData.isCurrent,
        description: formData.description,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        achievements: formData.achievements.split('\n').filter(Boolean)
      };
      
      await profileService.addExperience(data, getToken);
      onSuccess('Experiencia agregada correctamente');
      resetForm();
      setIsAdding(false);
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al agregar experiencia');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setFormData({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate?.split('T')[0] || '',
      endDate: exp.endDate?.split('T')[0] || '',
      isCurrent: exp.isCurrent,
      description: exp.description || '',
      technologies: (exp.technologies || []).join(', '),
      achievements: (exp.achievements || []).join('\n')
    });
  };

  const handleUpdate = async (expId) => {
    if (!formData.company.trim() || !formData.position.trim() || !formData.startDate) {
      onError('Empresa, puesto y fecha de inicio son requeridos');
      return;
    }

    try {
      setSaving(true);
      const data = {
        company: formData.company,
        position: formData.position,
        startDate: formData.startDate,
        endDate: formData.isCurrent ? null : formData.endDate,
        isCurrent: formData.isCurrent,
        description: formData.description,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        achievements: formData.achievements.split('\n').filter(Boolean)
      };
      
      await profileService.updateExperience(expId, data, getToken);
      onSuccess('Experiencia actualizada correctamente');
      setEditingId(null);
      resetForm();
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al actualizar experiencia');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (expId) => {
    if (!confirm('¿Estás seguro de eliminar esta experiencia?')) return;

    try {
      setSaving(true);
      await profileService.deleteExperience(expId, getToken);
      onSuccess('Experiencia eliminada correctamente');
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al eliminar experiencia');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      technologies: '',
      achievements: ''
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
            Experiencia Laboral
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {experience.length}/3 experiencias agregadas
          </p>
        </div>
        
        {viewMode === 'edit' && !isAdding && !editingId && canAddMore && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Agregar Experiencia
          </button>
        )}
      </div>

      {/* Formulario */}
      {(isAdding || editingId) && viewMode === 'edit' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-4">
            {isAdding ? 'Nueva Experiencia' : 'Editar Experiencia'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Empresa *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="ej: Tech Company S.A."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Puesto *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="ej: Desarrollador Senior"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  disabled={formData.isCurrent}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isCurrent"
                checked={formData.isCurrent}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                Trabajo actual
              </label>
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
                maxLength={1000}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Describe tus responsabilidades y funciones..."
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {formData.description.length}/1000
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tecnologías Utilizadas
              </label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="React, Node.js, MongoDB (separadas por comas)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Logros (uno por línea)
              </label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Logro 1&#10;Logro 2&#10;Logro 3"
              />
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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

      {/* Lista de Experiencias */}
      {experience.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <Briefcase className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No has agregado experiencias laborales aún
          </p>
          {viewMode === 'edit' && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              Agregar Primera Experiencia
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {experience.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).map((exp) => (
            <div
              key={exp._id}
              className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    {exp.company}
                  </h3>
                  <p className="text-lg text-green-600 dark:text-green-400 font-medium mt-1">
                    {exp.position}
                  </p>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(exp.startDate)} - {exp.isCurrent ? 'Presente' : formatDate(exp.endDate)}
                    </span>
                    {exp.isCurrent && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                        Actual
                      </span>
                    )}
                  </div>
                </div>

                {viewMode === 'edit' && !editingId && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      disabled={saving}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {exp.description && (
                <p className="text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">
                  {exp.description}
                </p>
              )}

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tecnologías:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {exp.achievements && exp.achievements.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Logros:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="text-slate-600 dark:text-slate-400 text-sm">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!canAddMore && viewMode === 'edit' && (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            Has alcanzado el límite máximo de 3 experiencias laborales
          </p>
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;
