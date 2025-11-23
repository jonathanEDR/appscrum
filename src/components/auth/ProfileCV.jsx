import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award, 
  FolderGit2,
  Edit3,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { profileService } from '../../services/profileService';
import PersonalInfoSection from './profile/PersonalInfoSection';
import SkillsSection from './profile/SkillsSection';
import ExperienceSection from './profile/ExperienceSection';
import EducationSection from './profile/EducationSection';
import ProjectsSection from './profile/ProjectsSection';
import CertificationsSection from './profile/CertificationsSection';

const ProfileCV = () => {
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [viewMode, setViewMode] = useState('edit'); // 'edit' o 'preview'

  // Cargar CV del usuario
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getMyCV(getToken);
      setProfile(response.user);
      setError(null);
    } catch (err) {
      console.error('Error cargando perfil:', err);
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRefresh = () => {
    fetchProfile();
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Secciones del CV
  const sections = [
    { id: 'personal', icon: User, label: 'Información Personal', color: 'blue' },
    { id: 'skills', icon: Code, label: 'Habilidades', color: 'purple' },
    { id: 'experience', icon: Briefcase, label: 'Experiencia', color: 'green' },
    { id: 'education', icon: GraduationCap, label: 'Educación', color: 'orange' },
    { id: 'projects', icon: FolderGit2, label: 'Proyectos', color: 'cyan' },
    { id: 'certifications', icon: Award, label: 'Certificaciones', color: 'pink' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mi Perfil Profesional</h1>
              <p className="text-purple-100 dark:text-purple-200">
                Gestiona tu información y CV
              </p>
            </div>
            
            {/* Toggle View Mode */}
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('edit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'edit'
                    ? 'bg-white text-purple-600'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Edit3 className="h-4 w-4" />
                Editar
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-white text-purple-600'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Eye className="h-4 w-4" />
                Vista Previa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="container mx-auto px-6 py-4">
        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 dark:text-green-300">{success}</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-4 sticky top-6">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Secciones
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                        isActive
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`} />
                      <span className="text-sm">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
              {profile && (
                <>
                  {activeSection === 'personal' && (
                    <PersonalInfoSection
                      profile={profile}
                      clerkUser={clerkUser}
                      onRefresh={handleRefresh}
                      onSuccess={showSuccess}
                      onError={showError}
                      viewMode={viewMode}
                    />
                  )}
                  
                  {activeSection === 'skills' && (
                    <SkillsSection
                      profile={profile}
                      onRefresh={handleRefresh}
                      onSuccess={showSuccess}
                      onError={showError}
                      viewMode={viewMode}
                    />
                  )}
                  
                  {activeSection === 'experience' && (
                    <ExperienceSection
                      profile={profile}
                      onRefresh={handleRefresh}
                      onSuccess={showSuccess}
                      onError={showError}
                      viewMode={viewMode}
                    />
                  )}
                  
                  {activeSection === 'education' && (
                    <EducationSection
                      profile={profile}
                      onRefresh={handleRefresh}
                      onSuccess={showSuccess}
                      onError={showError}
                      viewMode={viewMode}
                    />
                  )}
                  
                  {activeSection === 'projects' && (
                    <ProjectsSection
                      profile={profile}
                      onRefresh={handleRefresh}
                      onSuccess={showSuccess}
                      onError={showError}
                      viewMode={viewMode}
                    />
                  )}
                  
                  {activeSection === 'certifications' && (
                    <CertificationsSection
                      profile={profile}
                      onRefresh={handleRefresh}
                      onSuccess={showSuccess}
                      onError={showError}
                      viewMode={viewMode}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCV;
