import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { 
  Users,
  Search,
  Eye,
  Download,
  Filter,
  Loader2,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Calendar,
  Building2,
  BookOpen,
  FolderGit2,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { profileService } from '../../services/profileService';
import { apiService } from '../../services/apiService';
import CloudinaryImage from '../common/CloudinaryImage';

const CVManagementPanel = () => {
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCVModal, setShowCVModal] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [loadingCV, setLoadingCV] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const data = await apiService.request('/admin/users', {
        method: 'GET'
      }, token);

      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
    } catch (error) {
      setError(error.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.nombre_negocio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por rol
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const viewCV = async (userId) => {
    setSelectedUser(userId);
    setShowCVModal(true);
    setLoadingCV(true);
    setCvData(null);

    try {
      const data = await profileService.getUserCV(userId, getToken);
      // El backend devuelve { status, user } así que extraemos el user
      setCvData(data.user || data);
    } catch (error) {
      setError(error.message || 'Error al cargar el CV');
    } finally {
      setLoadingCV(false);
    }
  };

  const closeModal = () => {
    setShowCVModal(false);
    setSelectedUser(null);
    setCvData(null);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      super_admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      product_owner: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      scrum_master: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      developers: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      user: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    };
    return colors[role] || colors.user;
  };

  const getRoleLabel = (role) => {
    const labels = {
      super_admin: 'Super Admin',
      product_owner: 'Product Owner',
      scrum_master: 'Scrum Master',
      developers: 'Developer',
      user: 'Usuario'
    };
    return labels[role] || role;
  };

  const hasProfileData = (user) => {
    return (
      (user.skills && user.skills.length > 0) ||
      (user.experience && user.experience.length > 0) ||
      (user.education && user.education.length > 0) ||
      (user.projects && user.projects.length > 0) ||
      (user.certifications && user.certifications.length > 0)
    );
  };

  const hasBasicInfo = (user) => {
    return user.profile && (
      user.profile.bio ||
      user.profile.phone ||
      user.profile.location?.city ||
      user.profile.location?.country ||
      user.profile.links?.linkedin ||
      user.profile.links?.github ||
      user.profile.links?.portfolio ||
      user.profile.professionalInfo?.title ||
      user.profile.professional?.title
    );
  };

  const getProfileCompleteness = (user) => {
    let completed = 0;
    let total = 6;
    
    if (hasBasicInfo(user)) completed++;
    if (user.skills && user.skills.length > 0) completed++;
    if (user.experience && user.experience.length > 0) completed++;
    if (user.education && user.education.length > 0) completed++;
    if (user.projects && user.projects.length > 0) completed++;
    if (user.certifications && user.certifications.length > 0) completed++;
    
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3 mb-2">
          <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          Gestión de CVs
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Visualiza y gestiona los perfiles profesionales de todos los usuarios
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-2">
          <X className="h-5 w-5 text-red-600 dark:text-red-400" />
          <span className="text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por rol */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos los roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="product_owner">Product Owner</option>
              <option value="scrum_master">Scrum Master</option>
              <option value="developers">Developer</option>
              <option value="user">Usuario</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const profileStats = getProfileCompleteness(user);
          const hasData = hasProfileData(user) || hasBasicInfo(user);
          
          return (
            <div
              key={user._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header con foto */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  {user.profile?.photo ? (
                    <CloudinaryImage
                      src={user.profile.photo}
                      alt={user.nombre_negocio}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-200 dark:border-purple-700"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center border-2 border-purple-200 dark:border-purple-700">
                      <span className="text-2xl font-bold text-white">
                        {user.nombre_negocio?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  {profileStats.percentage > 0 && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                      {profileStats.percentage === 100 ? (
                        <CheckCircle className="h-3 w-3 text-white" />
                      ) : (
                        <span className="text-[10px] font-bold text-white">{profileStats.percentage}%</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 truncate">
                    {user.nombre_negocio || 'Sin nombre'}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    {user.email}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getRoleBadgeColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </div>
              </div>

              {/* Info profesional */}
              {user.profile?.professional?.title && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {user.profile.professional.title}
                  </p>
                  {user.profile.professional.specialty && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {user.profile.professional.specialty}
                    </p>
                  )}
                  {user.profile.professional.yearsOfExperience && (
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      {user.profile.professional.yearsOfExperience} años de experiencia
                    </p>
                  )}
                </div>
              )}

              {/* Barra de progreso */}
              {profileStats.percentage > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Perfil completado
                    </span>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      {profileStats.completed}/{profileStats.total} secciones
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileStats.percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Badges de secciones completadas */}
              {(user.skills?.length > 0 || user.experience?.length > 0 || user.education?.length > 0 || user.projects?.length > 0 || user.certifications?.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {user.skills && user.skills.length > 0 && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full flex items-center gap-1">
                      <Code className="h-3 w-3" />
                      {user.skills.length}
                    </span>
                  )}
                  {user.experience && user.experience.length > 0 && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {user.experience.length}
                    </span>
                  )}
                  {user.education && user.education.length > 0 && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      {user.education.length}
                    </span>
                  )}
                  {user.projects && user.projects.length > 0 && (
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full flex items-center gap-1">
                      <FolderGit2 className="h-3 w-3" />
                      {user.projects.length}
                    </span>
                  )}
                  {user.certifications && user.certifications.length > 0 && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {user.certifications.length}
                    </span>
                  )}
                </div>
              )}

              {/* Info básica disponible */}
              {!hasProfileData(user) && hasBasicInfo(user) && (
                <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Tiene información básica
                  </p>
                </div>
              )}

              {/* Botón Ver CV/Perfil */}
              <button
                onClick={() => viewCV(user._id)}
                className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  hasData
                    ? 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
                disabled={!hasData}
              >
                <Eye className="h-4 w-4" />
                {hasData ? (hasProfileData(user) ? 'Ver CV Completo' : 'Ver Perfil') : 'Sin Datos'}
              </button>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <Users className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            No se encontraron usuarios con los filtros aplicados
          </p>
        </div>
      )}

      {/* Modal de CV */}
      {showCVModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                {cvData?.profile?.photo ? (
                  <CloudinaryImage
                    src={cvData.profile.photo}
                    alt={cvData.nombre_negocio}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-200 dark:border-purple-700"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {cvData?.nombre_negocio?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {cvData?.nombre_negocio || 'Cargando...'}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {cvData?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Contenido del CV */}
            <div className="p-6">
              {loadingCV ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
                </div>
              ) : cvData ? (
                <div className="space-y-6">
                  {/* Estadísticas de Completitud */}
                  {(() => {
                    const stats = getProfileCompleteness(cvData);
                    if (stats.percentage > 0) {
                      return (
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">
                              Completitud del Perfil
                            </h3>
                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {stats.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                            <div 
                              className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${stats.percentage}%` }}
                            />
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {stats.completed} de {stats.total} secciones completadas
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Información Profesional */}
                  {cvData.profile?.professional && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        Información Profesional
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cvData.profile.professional.title && (
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Título Profesional</p>
                            <p className="text-slate-900 dark:text-slate-100 font-medium">
                              {cvData.profile.professional.title}
                            </p>
                          </div>
                        )}
                        {cvData.profile.professional.specialty && (
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Especialidad</p>
                            <p className="text-slate-900 dark:text-slate-100 font-medium">
                              {cvData.profile.professional.specialty}
                            </p>
                          </div>
                        )}
                        {cvData.profile.professional.yearsOfExperience && (
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Años de Experiencia</p>
                            <p className="text-purple-600 dark:text-purple-400 font-bold">
                              {cvData.profile.professional.yearsOfExperience} años
                            </p>
                          </div>
                        )}
                        {cvData.profile.professional.availability && (
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Disponibilidad</p>
                            <p className="text-slate-900 dark:text-slate-100 font-medium capitalize">
                              {cvData.profile.professional.availability.replace('_', ' ')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Información Personal */}
                  {cvData.profile && (cvData.profile.phone || cvData.profile.location || cvData.profile.bio || cvData.profile.links) && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        Información de Contacto
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cvData.profile.phone && (
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{cvData.profile.phone}</span>
                          </div>
                        )}
                        {(cvData.profile.location?.city || cvData.profile.location?.country) && (
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>
                              {[cvData.profile.location?.city, cvData.profile.location?.country]
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                          </div>
                        )}
                        {cvData.profile.links?.linkedin && (
                          <a
                            href={cvData.profile.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                          </a>
                        )}
                        {cvData.profile.links?.github && (
                          <a
                            href={cvData.profile.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:underline"
                          >
                            <Github className="h-4 w-4" />
                            GitHub
                          </a>
                        )}
                      </div>
                      {cvData.profile.bio && (
                        <p className="mt-4 text-slate-700 dark:text-slate-300">
                          {cvData.profile.bio}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Habilidades */}
                  {cvData.skills && cvData.skills.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
                        Habilidades ({cvData.skills.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {cvData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experiencia */}
                  {cvData.experience && cvData.experience.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Experiencia Laboral
                      </h3>
                      <div className="space-y-4">
                        {cvData.experience.map((exp, index) => (
                          <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-slate-900 dark:text-slate-100">{exp.company}</h4>
                                <p className="text-blue-600 dark:text-blue-400">{exp.position}</p>
                              </div>
                              <div className="text-right text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(exp.startDate)} - {exp.isCurrent ? 'Presente' : formatDate(exp.endDate)}
                                </div>
                              </div>
                            </div>
                            {exp.description && (
                              <p className="text-slate-700 dark:text-slate-300 text-sm mt-2">{exp.description}</p>
                            )}
                            {exp.technologies && exp.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {exp.technologies.map((tech, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Educación */}
                  {cvData.education && cvData.education.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        Educación
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cvData.education.map((edu, index) => (
                          <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <h4 className="font-bold text-slate-900 dark:text-slate-100">{edu.degree}</h4>
                            <p className="text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1">
                              <BookOpen className="h-4 w-4" />
                              {edu.institution}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{edu.field}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Proyectos */}
                  {cvData.projects && cvData.projects.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <FolderGit2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        Proyectos
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cvData.projects.map((project, index) => (
                          <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            {project.imageUrl && (
                              <CloudinaryImage
                                src={project.imageUrl}
                                alt={project.name}
                                className="w-full h-40 object-cover"
                              />
                            )}
                            <div className="p-4">
                              <h4 className="font-bold text-slate-900 dark:text-slate-100">{project.name}</h4>
                              <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{project.description}</p>
                              {project.url && (
                                <a
                                  href={project.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 text-sm mt-2 hover:underline"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Ver proyecto
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certificaciones */}
                  {cvData.certifications && cvData.certifications.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        Certificaciones
                      </h3>
                      <div className="space-y-3">
                        {cvData.certifications.map((cert, index) => (
                          <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start gap-3">
                            <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-900 dark:text-slate-100">{cert.name}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{cert.issuer}</p>
                              {cert.credentialUrl && (
                                <a
                                  href={cert.credentialUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm mt-1 hover:underline"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Verificar
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mensaje cuando no hay datos de CV pero hay info básica */}
                  {!cvData.skills?.length && !cvData.experience?.length && !cvData.education?.length && !cvData.projects?.length && !cvData.certifications?.length && !hasBasicInfo(cvData) && (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <User className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">
                        Este usuario aún no ha completado su CV
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        No hay información profesional, habilidades, experiencia, educación, proyectos o certificaciones registradas
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-red-600 dark:text-red-400">Error al cargar el CV</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVManagementPanel;
