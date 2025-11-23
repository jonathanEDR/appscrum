import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin,
  Save,
  X,
  Camera,
  Loader2
} from 'lucide-react';
import { profileService } from '../../../services/profileService';
import CloudinaryImagePicker from '../../common/CloudinaryImagePicker';
import CloudinaryImage from '../../common/CloudinaryImage';

const PersonalInfoSection = ({ profile, clerkUser, onRefresh, onSuccess, onError, viewMode }) => {
  const { getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  
  const [formData, setFormData] = useState({
    phone: profile.profile?.phone || '',
    city: profile.profile?.location?.city || '',
    country: profile.profile?.location?.country || '',
    linkedin: profile.profile?.links?.linkedin || '',
    github: profile.profile?.links?.github || '',
    portfolio: profile.profile?.links?.portfolio || '',
    bio: profile.profile?.bio || '',
    title: profile.profile?.professional?.title || '',
    specialty: profile.profile?.professional?.specialty || '',
    yearsOfExperience: profile.profile?.professional?.yearsOfExperience || 0,
    availability: profile.profile?.professional?.availability || 'full_time'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Actualizar información personal
      await profileService.updatePersonalInfo({
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio,
        bio: formData.bio
      }, getToken);

      // Actualizar información profesional
      await profileService.updateProfessionalInfo({
        title: formData.title,
        specialty: formData.specialty,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        availability: formData.availability
      }, getToken);

      onSuccess('Información actualizada correctamente');
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      onError(error.message || 'Error al actualizar información');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      phone: profile.profile?.phone || '',
      city: profile.profile?.location?.city || '',
      country: profile.profile?.location?.country || '',
      linkedin: profile.profile?.links?.linkedin || '',
      github: profile.profile?.links?.github || '',
      portfolio: profile.profile?.links?.portfolio || '',
      bio: profile.profile?.bio || '',
      title: profile.profile?.professional?.title || '',
      specialty: profile.profile?.professional?.specialty || '',
      yearsOfExperience: profile.profile?.professional?.yearsOfExperience || 0,
      availability: profile.profile?.professional?.availability || 'full_time'
    });
    setIsEditing(false);
  };

  const handlePhotoSelect = async (imageData) => {
    try {
      await profileService.updatePhoto(imageData.url, imageData.publicId, getToken);
      onSuccess('Foto de perfil actualizada');
      setShowImagePicker(false);
      onRefresh();
    } catch (error) {
      onError('Error al actualizar foto de perfil');
    }
  };

  const availabilityOptions = [
    { value: 'full_time', label: 'Tiempo Completo' },
    { value: 'part_time', label: 'Medio Tiempo' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'unavailable', label: 'No Disponible' }
  ];

  const photoUrl = profile.profile?.photo || clerkUser?.imageUrl;

  return (
    <div className="p-6">
      {/* Header con Foto */}
      <div className="flex items-start gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        {/* Foto de Perfil */}
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-lg">
            {photoUrl ? (
              <CloudinaryImage
                src={photoUrl}
                alt={profile.nombre_negocio || 'Perfil'}
                size="thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
                <User className="h-12 w-12 text-white" />
              </div>
            )}
          </div>
          
          {viewMode === 'edit' && (
            <button
              onClick={() => setShowImagePicker(true)}
              className="absolute bottom-0 right-0 bg-purple-600 dark:bg-purple-700 text-white rounded-full p-2 shadow-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors"
              title="Cambiar foto"
            >
              <Camera className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Información Básica */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {profile.nombre_negocio || 'Sin nombre'}
          </h2>
          {formData.title && (
            <p className="text-lg text-purple-600 dark:text-purple-400 font-medium mt-1">
              {formData.title}
            </p>
          )}
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mt-2">
            <Mail className="h-4 w-4" />
            <span className="text-sm">{profile.email}</span>
          </div>
        </div>

        {/* Botón de Editar */}
        {viewMode === 'edit' && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors text-sm font-medium"
          >
            Editar Información
          </button>
        )}
      </div>

      {/* Formulario */}
      <div className="space-y-6">
        {/* Información Profesional */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Información Profesional
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Título Profesional
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  placeholder="ej: Desarrollador Full Stack"
                />
              ) : (
                <p className="text-slate-900 dark:text-slate-100 py-2">
                  {formData.title || 'No especificado'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Especialidad
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  placeholder="ej: React, Node.js, MongoDB"
                />
              ) : (
                <p className="text-slate-900 dark:text-slate-100 py-2">
                  {formData.specialty || 'No especificado'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Años de Experiencia
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-900 dark:text-slate-100 py-2">
                  {formData.yearsOfExperience} años
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Disponibilidad
              </label>
              {isEditing ? (
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                >
                  {availabilityOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <p className="text-slate-900 dark:text-slate-100 py-2">
                  {availabilityOptions.find(o => o.value === formData.availability)?.label}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Biografía */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Biografía
          </label>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent resize-none"
              placeholder="Cuéntanos sobre ti, tus intereses y objetivos profesionales..."
            />
          ) : (
            <p className="text-slate-900 dark:text-slate-100 py-2 whitespace-pre-wrap">
              {formData.bio || 'No especificado'}
            </p>
          )}
          {isEditing && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {formData.bio.length}/500 caracteres
            </p>
          )}
        </div>

        {/* Información de Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Teléfono
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              ) : (
                <p className="text-slate-900 dark:text-slate-100 py-2">
                  {formData.phone || 'No especificado'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Ciudad
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  placeholder="Ciudad"
                />
              ) : (
                <p className="text-slate-900 dark:text-slate-100 py-2">
                  {formData.city || 'No especificado'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                País
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  placeholder="País"
                />
              ) : (
                <p className="text-slate-900 dark:text-slate-100 py-2">
                  {formData.country || 'No especificado'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Enlaces Profesionales */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Enlaces Profesionales
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Linkedin className="h-4 w-4 inline mr-2" />
                LinkedIn
              </label>
              {isEditing ? (
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  placeholder="https://linkedin.com/in/tu-perfil"
                />
              ) : (
                <p className="text-slate-900 dark:text-slate-100 py-2">
                  {formData.linkedin ? (
                    <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">
                      {formData.linkedin}
                    </a>
                  ) : 'No especificado'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Github className="h-4 w-4 inline mr-2" />
                GitHub
              </label>
              {isEditing ? (
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  placeholder="https://github.com/tu-usuario"
                />
              ) : (
                <p className="text-slate-900 dark:text-slate-100 py-2">
                  {formData.github ? (
                    <a href={formData.github} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">
                      {formData.github}
                    </a>
                  ) : 'No especificado'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Globe className="h-4 w-4 inline mr-2" />
                Portafolio / Sitio Web
              </label>
              {isEditing ? (
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  placeholder="https://tu-portafolio.com"
                />
              ) : (
                <p className="text-slate-900 dark:text-slate-100 py-2">
                  {formData.portfolio ? (
                    <a href={formData.portfolio} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">
                      {formData.portfolio}
                    </a>
                  ) : 'No especificado'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        {isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modal de Cloudinary */}
      <CloudinaryImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={handlePhotoSelect}
        folder="profiles"
        title="Seleccionar Foto de Perfil"
        currentImage={profile.profile?.photo}
      />
    </div>
  );
};

export default PersonalInfoSection;
