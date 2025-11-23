import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  FolderGit2,
  ExternalLink,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { profileService } from '../../../services/profileService';
import CloudinaryImagePicker from '../../common/CloudinaryImagePicker';
import CloudinaryImage from '../../common/CloudinaryImage';

const ProjectsSection = ({ profile, onRefresh, onSuccess, onError, viewMode }) => {
  const { getToken } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    imageUrl: '',
    technologies: '',
    date: '',
    role: ''
  });

  const projects = profile.projects || [];
  const canAddMore = projects.length < 3;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (imageUrl) => {
    setFormData(prev => ({ ...prev, imageUrl }));
    setShowImagePicker(false);
  };

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      onError('Nombre y descripción son requeridos');
      return;
    }

    try {
      setSaving(true);
      const data = {
        name: formData.name,
        description: formData.description,
        url: formData.url || undefined,
        imageUrl: formData.imageUrl || undefined,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        date: formData.date || undefined,
        role: formData.role || undefined
      };
      
      await profileService.addProject(data, getToken);
      onSuccess('Proyecto agregado correctamente');
      resetForm();
      setIsAdding(false);
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al agregar proyecto');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      name: project.name,
      description: project.description,
      url: project.url || '',
      imageUrl: project.imageUrl || '',
      technologies: (project.technologies || []).join(', '),
      date: project.date?.split('T')[0] || '',
      role: project.role || ''
    });
  };

  const handleUpdate = async (projectId) => {
    if (!formData.name.trim() || !formData.description.trim()) {
      onError('Nombre y descripción son requeridos');
      return;
    }

    try {
      setSaving(true);
      const data = {
        name: formData.name,
        description: formData.description,
        url: formData.url || undefined,
        imageUrl: formData.imageUrl || undefined,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        date: formData.date || undefined,
        role: formData.role || undefined
      };
      
      await profileService.updateProject(projectId, data, getToken);
      onSuccess('Proyecto actualizado correctamente');
      setEditingId(null);
      resetForm();
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al actualizar proyecto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
      setSaving(true);
      await profileService.deleteProject(projectId, getToken);
      onSuccess('Proyecto eliminado correctamente');
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al eliminar proyecto');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      url: '',
      imageUrl: '',
      technologies: '',
      date: '',
      role: ''
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
            <FolderGit2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Proyectos
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {projects.length}/3 proyectos agregados
          </p>
        </div>
        
        {viewMode === 'edit' && !isAdding && !editingId && canAddMore && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Agregar Proyecto
          </button>
        )}
      </div>

      {/* Formulario */}
      {(isAdding || editingId) && viewMode === 'edit' && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-4">
            {isAdding ? 'Nuevo Proyecto' : 'Editar Proyecto'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="ej: Sistema de Gestión"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tu Rol
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="ej: Desarrollador Full Stack"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Describe el proyecto, objetivos, tu contribución..."
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {formData.description.length}/1000
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  URL del Proyecto
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="React, Node.js, PostgreSQL (separadas por comas)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Imagen del Proyecto
              </label>
              <div className="flex items-center gap-4">
                {formData.imageUrl && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                    <CloudinaryImage
                      src={formData.imageUrl}
                      alt="Project preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowImagePicker(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ImageIcon className="h-4 w-4" />
                  {formData.imageUrl ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                </button>
                {formData.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
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

      {/* Modal de Selección de Imagen */}
      {showImagePicker && (
        <CloudinaryImagePicker
          onSelect={handleImageSelect}
          onClose={() => setShowImagePicker(false)}
          folder="profile/projects"
        />
      )}

      {/* Lista de Proyectos */}
      {projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <FolderGit2 className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No has agregado proyectos aún
          </p>
          {viewMode === 'edit' && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              Agregar Primer Proyecto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).map((project) => (
            <div
              key={project._id}
              className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {project.imageUrl && (
                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700">
                  <CloudinaryImage
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {project.name}
                    </h3>
                    {project.role && (
                      <p className="text-purple-600 dark:text-purple-400 text-sm font-medium mt-1">
                        {project.role}
                      </p>
                    )}
                    {project.date && (
                      <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                        {formatDate(project.date)}
                      </p>
                    )}
                  </div>

                  {viewMode === 'edit' && !editingId && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        disabled={saving}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 whitespace-pre-wrap">
                  {project.description}
                </p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver Proyecto
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!canAddMore && viewMode === 'edit' && (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            Has alcanzado el límite máximo de 3 proyectos
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
