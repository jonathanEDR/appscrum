import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  Code,
  Loader2
} from 'lucide-react';
import { profileService } from '../../../services/profileService';

const SkillsSection = ({ profile, onRefresh, onSuccess, onError, viewMode }) => {
  const { getToken } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'language',
    level: 'intermediate'
  });

  const skills = profile.skills || [];
  const canAddMore = skills.length < 20;

  const categories = [
    { value: 'language', label: 'Lenguaje de Programación', color: 'blue' },
    { value: 'framework', label: 'Framework', color: 'purple' },
    { value: 'tool', label: 'Herramienta', color: 'green' },
    { value: 'methodology', label: 'Metodología', color: 'orange' },
    { value: 'other', label: 'Otro', color: 'gray' }
  ];

  const levels = [
    { value: 'beginner', label: 'Principiante', color: 'red' },
    { value: 'intermediate', label: 'Intermedio', color: 'yellow' },
    { value: 'advanced', label: 'Avanzado', color: 'blue' },
    { value: 'expert', label: 'Experto', color: 'purple' }
  ];

  const getCategoryColor = (category) => {
    return categories.find(c => c.value === category)?.color || 'gray';
  };

  const getLevelColor = (level) => {
    return levels.find(l => l.value === level)?.color || 'gray';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      onError('El nombre de la habilidad es requerido');
      return;
    }

    try {
      setSaving(true);
      await profileService.addSkill(formData, getToken);
      onSuccess('Habilidad agregada correctamente');
      setFormData({ name: '', category: 'language', level: 'intermediate' });
      setIsAdding(false);
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al agregar habilidad');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level
    });
  };

  const handleUpdate = async (skillId) => {
    if (!formData.name.trim()) {
      onError('El nombre de la habilidad es requerido');
      return;
    }

    try {
      setSaving(true);
      await profileService.updateSkill(skillId, formData, getToken);
      onSuccess('Habilidad actualizada correctamente');
      setEditingId(null);
      setFormData({ name: '', category: 'language', level: 'intermediate' });
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al actualizar habilidad');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skillId) => {
    if (!confirm('¿Estás seguro de eliminar esta habilidad?')) return;

    try {
      setSaving(true);
      await profileService.deleteSkill(skillId, getToken);
      onSuccess('Habilidad eliminada correctamente');
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al eliminar habilidad');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', category: 'language', level: 'intermediate' });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Habilidades Técnicas
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {skills.length}/20 habilidades agregadas
          </p>
        </div>
        
        {viewMode === 'edit' && !isAdding && !editingId && canAddMore && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Agregar Habilidad
          </button>
        )}
      </div>

      {/* Formulario de Nueva Habilidad */}
      {isAdding && viewMode === 'edit' && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-4">
            Nueva Habilidad
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ej: JavaScript"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Categoría
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nivel
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {levels.map(lvl => (
                  <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancelEdit}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAdd}
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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

      {/* Lista de Habilidades */}
      {skills.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <Code className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No has agregado habilidades aún
          </p>
          {viewMode === 'edit' && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              Agregar Primera Habilidad
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {editingId === skill._id ? (
                // Modo Edición
                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      {levels.map(lvl => (
                        <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleUpdate(skill._id)}
                      disabled={saving}
                      className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                // Modo Vista
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {skill.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getCategoryColor(skill.category)}-100 dark:bg-${getCategoryColor(skill.category)}-900/30 text-${getCategoryColor(skill.category)}-700 dark:text-${getCategoryColor(skill.category)}-300`}>
                        {categories.find(c => c.value === skill.category)?.label}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getLevelColor(skill.level)}-100 dark:bg-${getLevelColor(skill.level)}-900/30 text-${getLevelColor(skill.level)}-700 dark:text-${getLevelColor(skill.level)}-300`}>
                        {levels.find(l => l.value === skill.level)?.label}
                      </span>
                    </div>
                  </div>
                  
                  {viewMode === 'edit' && !editingId && (
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="p-2 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        disabled={saving}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!canAddMore && viewMode === 'edit' && (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            Has alcanzado el límite máximo de 20 habilidades
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
