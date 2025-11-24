import React, { useState, useEffect } from 'react';
import CeremonyModal from './modalScrumMaster/modalCeremonies';
import { useAuth } from '@clerk/clerk-react';
import apiService from '../../services/apiService';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Plus, 
  Play, 
  Save, 
  CheckCircle,
  Target,
  MessageSquare,
  BarChart3,
  AlertCircle
} from 'lucide-react';

const CeremonyCard = ({ ceremony, onEdit, onStart, onComplete }) => {
  const getCeremonyIcon = (type) => {
    const icons = {
      sprint_planning: Target,
      daily_standup: MessageSquare,
      sprint_review: BarChart3,
      retrospective: Users
    };
    return icons[type] || Calendar;
  };

  const getCeremonyTitle = (type) => {
    const titles = {
      sprint_planning: 'Sprint Planning',
      daily_standup: 'Daily Standup',
      sprint_review: 'Sprint Review',
      retrospective: 'Retrospectiva'
    };
    return titles[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || colors.scheduled;
  };

  const Icon = getCeremonyIcon(ceremony.type);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Icon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{ceremony.title}</h3>
              <p className="text-sm text-gray-600">{getCeremonyTitle(ceremony.type)}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ceremony.status)}`}>
            {ceremony.status === 'scheduled' && 'Programada'}
            {ceremony.status === 'in_progress' && 'En Progreso'}
            {ceremony.status === 'completed' && 'Completada'}
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(ceremony.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{ceremony.time} ({ceremony.duration} min)</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{ceremony.participants?.length || 0} participantes</span>
          </div>
        </div>

        {ceremony.notes && (
          <div className="mb-4">
            <p className="text-sm text-gray-700">{ceremony.notes}</p>
          </div>
        )}

        {ceremony.blockers && ceremony.blockers.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-red-700 mb-2">Bloqueos identificados:</h4>
            <ul className="text-sm text-red-600">
              {ceremony.blockers.map((blocker, index) => (
                <li key={index} className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {blocker}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            {ceremony.status === 'scheduled' && (
              <button
                onClick={() => onStart(ceremony)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
              >
                <Play className="h-4 w-4" />
                Iniciar
              </button>
            )}
            {ceremony.status === 'in_progress' && (
              <button
                onClick={() => onComplete(ceremony)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Completar
              </button>
            )}
          </div>
          <button
            onClick={() => onEdit(ceremony)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            <FileText className="h-4 w-4" />
            {ceremony.status === 'completed' ? 'Ver detalles' : 'Editar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Ceremonies = () => {
  const [ceremonies, setCeremonies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCeremony, setEditingCeremony] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  // Cargar ceremonias desde el backend
  useEffect(() => {
    loadCeremonies();
  }, [getToken]);

  const loadCeremonies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCeremonies(getToken);
      
      // El backend retorna { ceremonies: [...], total: X }
      const ceremoniesData = response.ceremonies || response || [];
      
      // Transformar datos del backend al formato del componente
      const formattedCeremonies = ceremoniesData.map(ceremony => ({
        id: ceremony._id || ceremony.id,
        type: ceremony.type,
        title: ceremony.title,
        date: new Date(ceremony.date).toISOString().split('T')[0],
        time: ceremony.startTime,
        duration: ceremony.duration,
        status: ceremony.status || 'scheduled',
        participants: ceremony.participants || [],
        notes: ceremony.notes || '',
        goals: ceremony.goals || [],
        blockers: ceremony.blockers || []
      }));
      
      setCeremonies(formattedCeremonies);
    } catch (error) {
      console.error('Error loading ceremonies:', error);
      setError('Error al cargar ceremonias. Mostrando vista vacía.');
      setCeremonies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // Usar el método con fallback que incluye autenticación
        const data = await apiService.getTeamMembersWithFallback(getToken);
        
        // Mapear datos al formato esperado
        const names = (data.members || data || []).map(member => {
          if (member.user && member.user.firstName && member.user.lastName) {
            return `${member.user.firstName} ${member.user.lastName}`;
          }
          if (member.firstName && member.lastName) {
            return `${member.firstName} ${member.lastName}`;
          }
          return member.user?.email || member.email || member.id || 'Usuario';
        });
        
        setTeamMembers(names);
        console.log('Team members loaded:', names);
      } catch (error) {
        console.error('Error loading team members:', error);
        // Fallback local en caso de error
        setTeamMembers([
          'Ana García',
          'Carlos López', 
          'María Rodríguez',
          'David Chen'
        ]);
      }
    };
    
    fetchTeamMembers();
  }, [getToken]);

  const handleCreateCeremony = () => {
    setEditingCeremony(null);
    setIsModalOpen(true);
  };

  const handleEditCeremony = (ceremony) => {
    setEditingCeremony(ceremony);
    setIsModalOpen(true);
  };

  const handleStartCeremony = async (ceremony) => {
    try {
      await apiService.updateCeremony(
        ceremony.id,
        { status: 'in_progress' },
        getToken
      );
      
      setCeremonies(prev => prev.map(c => 
        c.id === ceremony.id 
          ? { ...c, status: 'in_progress' }
          : c
      ));
    } catch (error) {
      console.error('Error starting ceremony:', error);
      alert('Error al iniciar la ceremonia.');
    }
  };

  const handleCompleteCeremony = async (ceremony) => {
    try {
      await apiService.updateCeremony(
        ceremony.id,
        { status: 'completed' },
        getToken
      );
      
      setCeremonies(prev => prev.map(c => 
        c.id === ceremony.id 
          ? { ...c, status: 'completed' }
          : c
      ));
    } catch (error) {
      console.error('Error completing ceremony:', error);
      alert('Error al completar la ceremonia.');
    }
  };

  const handleSaveCeremony = async (formData) => {
    try {
      // Transformar formData para coincidir con lo que el backend espera
      const apiData = {
        type: formData.type,
        title: formData.title,
        date: formData.date,
        startTime: formData.time, // El modal envía 'time', el backend espera 'startTime'
        duration: formData.duration || 60,
        notes: formData.notes || '',
        description: formData.description || '',
        participants: formData.participants || [],
        goals: formData.goals || [],
        blockers: formData.blockers || []
      };

      if (editingCeremony) {
        // Editar ceremonia existente
        const updatedCeremony = await apiService.updateCeremony(
          editingCeremony.id, 
          apiData, 
          getToken
        );
        
        setCeremonies(prev => prev.map(c => 
          c.id === editingCeremony.id 
            ? { ...c, ...updatedCeremony }
            : c
        ));
      } else {
        // Crear nueva ceremonia
        try {
          const newCeremony = await apiService.createCeremony(apiData, getToken);
          
          // Recargar todas las ceremonias para obtener el formato correcto del backend
          await loadCeremonies();
        } catch (apiError) {
          console.error('Error creating ceremony:', apiError);
          alert('Error al crear la ceremonia. Por favor, inténtalo de nuevo.');
          return;
        }
      }
      
      setIsModalOpen(false);
      setEditingCeremony(null);
    } catch (error) {
      console.error('Error saving ceremony:', error);
      // Mostrar notificación de error al usuario
      alert('Error al guardar la ceremonia. Por favor, inténtalo de nuevo.');
    }
  };

  const upcomingCeremonies = ceremonies.filter(c => c.status === 'scheduled' || c.status === 'in_progress');
  const completedCeremonies = ceremonies.filter(c => c.status === 'completed');

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando ceremonias...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadCeremonies}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ceremonias Scrum</h1>
          <p className="text-gray-600">Planifica y documenta las ceremonias del equipo</p>
        </div>
        <button
          onClick={handleCreateCeremony}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva Ceremonia
        </button>
      </div>

      {/* Próximas ceremonias */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximas Ceremonias</h2>
        <div className="grid gap-4">
          {upcomingCeremonies.length > 0 ? (
            upcomingCeremonies.map((ceremony) => (
              <CeremonyCard
                key={ceremony.id}
                ceremony={ceremony}
                onEdit={handleEditCeremony}
                onStart={handleStartCeremony}
                onComplete={handleCompleteCeremony}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ceremonias programadas</h3>
              <p className="text-gray-600 mb-4">Programa tu próxima ceremonia Scrum</p>
              <button
                onClick={handleCreateCeremony}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Programar ceremonia
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ceremonias completadas */}
      {completedCeremonies.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ceremonias Completadas</h2>
          <div className="grid gap-4">
            {completedCeremonies.map((ceremony) => (
              <CeremonyCard
                key={ceremony.id}
                ceremony={ceremony}
                onEdit={handleEditCeremony}
                onStart={handleStartCeremony}
                onComplete={handleCompleteCeremony}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <CeremonyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCeremony(null);
        }}
        ceremony={editingCeremony}
        onSave={handleSaveCeremony}
        teamMembers={teamMembers}
      />
    </div>
  );
};

export default Ceremonies;
