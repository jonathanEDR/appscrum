import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import sprintService from '../../services/sprintService';
import { 
  Users, 
  User, 
  Clock, 
  Calendar, 
  Activity, 
  Mail, 
  Phone,
  MoreHorizontal,
  Edit,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Filter,
  Search,
  Plus,
  RefreshCw,
  Target
} from 'lucide-react';

const TeamMemberCard = ({ member, onEdit, onMessage }) => {
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      busy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      on_leave: 'bg-gray-100 text-gray-800 border-gray-200',
      inactive: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.active;
  };

  const getWorkloadColor = (percentage) => {
    if (percentage > 100) return 'text-red-600';
    if (percentage > 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRoleIcon = (role) => {
    const icons = {
      scrum_master: '🎯',
      product_owner: '📋',
      developer: '💻',
      tester: '🧪',
      designer: '🎨',
      analyst: '📊'
    };
    return icons[role] || '👤';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-semibold text-lg">
                {member.user?.firstName?.[0]}{member.user?.lastName?.[0]}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {member.user?.firstName} {member.user?.lastName}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{getRoleIcon(member.role)} {member.role.replace('_', ' ')}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                  {member.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* Información de contacto */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{member.user?.email}</span>
          </div>
          {member.user?.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{member.user.phone}</span>
            </div>
          )}
        </div>
        
        {/* Carga de trabajo */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Carga de trabajo</span>
            <span className={`text-sm font-semibold ${getWorkloadColor(member.workloadPercentage)}`}>
              {member.workloadPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                member.workloadPercentage > 100 ? 'bg-red-500' :
                member.workloadPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(member.workloadPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{member.workload?.currentStoryPoints || 0} SP actuales</span>
            <span>{member.workload?.maxStoryPoints || 0} SP máx</span>
          </div>
          {member.workload?.completedPoints > 0 && (
            <div className="text-xs text-green-600 mt-1">
              ✓ {member.workload.completedPoints} SP completados
            </div>
          )}
        </div>
        
        {/* Información del Sprint Activo */}
        {member.sprintInfo?.currentSprint && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Sprint Activo</span>
            </div>
            <div className="text-xs text-orange-700">
              <div>{member.sprintInfo.assignedItems} items asignados</div>
              <div>{member.sprintInfo.completedItems} items completados</div>
            </div>
          </div>
        )}
        
        {/* Habilidades */}
        {member.skills && member.skills.length > 0 && (
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-700">Habilidades</span>
            <div className="flex flex-wrap gap-1 mt-2">
              {member.skills.slice(0, 4).map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                >
                  {skill.name}
                </span>
              ))}
              {member.skills.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  +{member.skills.length - 4} más
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Disponibilidad */}
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Activity className="h-4 w-4" />
            <span>Disponibilidad: {member.availability}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Clock className="h-4 w-4" />
            <span>Última actividad: {new Date(member.lastActiveDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Acciones */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <button 
            onClick={() => onEdit(member)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Edit className="h-4 w-4" />
            Editar
          </button>
          <button 
            onClick={() => onMessage(member)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Mensaje
          </button>
        </div>
      </div>
    </div>
  );
};

const TeamOverview = () => {
  const { getToken } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Datos mockeados para desarrollo
  const mockTeamMembers = [
    {
      _id: '1',
      user: {
        firstName: 'Ana',
        lastName: 'García',
        email: 'ana.garcia@email.com',
        phone: '+1 555-0101'
      },
      role: 'scrum_master',
      status: 'active',
      availability: 100,
      workload: {
        currentStoryPoints: 18,
        maxStoryPoints: 24
      },
      workloadPercentage: 75,
      skills: [
        { name: 'Agile' },
        { name: 'Facilitation' },
        { name: 'Team Management' }
      ],
      lastActiveDate: new Date()
    },
    {
      _id: '2',
      user: {
        firstName: 'Carlos',
        lastName: 'Ruiz',
        email: 'carlos.ruiz@email.com',
        phone: '+1 555-0102'
      },
      role: 'developer',
      status: 'active',
      availability: 90,
      workload: {
        currentStoryPoints: 21,
        maxStoryPoints: 24
      },
      workloadPercentage: 87,
      skills: [
        { name: 'React' },
        { name: 'Node.js' },
        { name: 'JavaScript' },
        { name: 'TypeScript' }
      ],
      lastActiveDate: new Date()
    },
    {
      _id: '3',
      user: {
        firstName: 'María',
        lastName: 'López',
        email: 'maria.lopez@email.com',
        phone: '+1 555-0103'
      },
      role: 'developer',
      status: 'busy',
      availability: 85,
      workload: {
        currentStoryPoints: 26,
        maxStoryPoints: 24
      },
      workloadPercentage: 108,
      skills: [
        { name: 'Python' },
        { name: 'Django' },
        { name: 'PostgreSQL' }
      ],
      lastActiveDate: new Date(Date.now() - 86400000) // Ayer
    },
    {
      _id: '4',
      user: {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@email.com',
        phone: '+1 555-0104'
      },
      role: 'product_owner',
      status: 'active',
      availability: 100,
      workload: {
        currentStoryPoints: 15,
        maxStoryPoints: 20
      },
      workloadPercentage: 75,
      skills: [
        { name: 'Product Management' },
        { name: 'User Stories' },
        { name: 'Analytics' }
      ],
      lastActiveDate: new Date()
    },
    {
      _id: '5',
      user: {
        firstName: 'Sofia',
        lastName: 'Martínez',
        email: 'sofia.martinez@email.com',
        phone: '+1 555-0105'
      },
      role: 'tester',
      status: 'on_leave',
      availability: 0,
      workload: {
        currentStoryPoints: 0,
        maxStoryPoints: 20
      },
      workloadPercentage: 0,
      skills: [
        { name: 'Testing' },
        { name: 'Automation' },
        { name: 'Selenium' }
      ],
      lastActiveDate: new Date(Date.now() - 172800000) // Hace 2 días
    }
  ];



  // Función optimizada para obtener miembros del equipo
  const fetchTeamMembers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = await getToken();
      const API_URL = import.meta.env.VITE_API_URL;
      
      // Si no hay API configurada, usa datos mockeados directamente
      if (!API_URL) {
        console.info('API_URL no configurada, usando datos de demostración');
        setTeamMembers(mockTeamMembers);
        setLoading(false);
        return;
      }
      
      // Intentar endpoint específico para miembros del equipo
      try {
        console.log('Obteniendo miembros del equipo desde:', `${API_URL}/api/team/members`);
        const response = await fetch(`${API_URL}/api/team/members`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const teamData = await response.json();
          console.log('Datos del equipo obtenidos:', teamData);
          
          // Mapear datos de la API al formato del componente
          const mapped = (teamData.members || teamData || []).map(member => ({
            _id: member._id || Math.random().toString(36),
            user: {
              firstName: member.user?.firstName || member.user?.nombre_negocio || 'Usuario',
              lastName: member.user?.lastName || '',
              email: member.user?.email || 'usuario@email.com',
              phone: member.user?.phone || ''
            },
            role: member.role || 'developer',
            status: member.status || 'active',
            availability: member.availability || 100,
            workload: {
              currentStoryPoints: member.workload?.currentStoryPoints || 0,
              maxStoryPoints: member.workload?.maxStoryPoints || 24,
              completedPoints: member.workload?.completedPoints || 0
            },
            workloadPercentage: member.workload ? 
              Math.round((member.workload.currentStoryPoints / member.workload.maxStoryPoints) * 100) : 0,
            skills: member.skills || [],
            lastActiveDate: member.updatedAt ? new Date(member.updatedAt) : new Date(),
            sprintInfo: {
              currentSprint: null,
              assignedItems: 0,
              completedItems: 0
            }
          }));
          
          if (mapped.length > 0) {
            setTeamMembers(mapped);
            setError('');
          } else {
            console.info('No se encontraron miembros del equipo, usando datos de demostración');
            setTeamMembers(mockTeamMembers);
            setError('No se encontraron miembros del equipo. Mostrando datos de demostración.');
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (apiError) {
        console.warn('Error al conectar con la API:', apiError.message);
        setTeamMembers(mockTeamMembers);
        setError('Conectando con el servidor... Mostrando datos de demostración mientras tanto.');
      }
      
    } catch (error) {
      console.error('Error general al obtener miembros del equipo:', error);
      setTeamMembers(mockTeamMembers);
      setError('Error de conexión. Mostrando datos de demostración.');
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchTeamMembers();
    fetchActiveSprintWorkload(); // Nueva función para obtener workload del sprint activo
  }, []); // Removemos getToken de las dependencias para evitar re-renders innecesarios

  // Nueva función para obtener la carga de trabajo del sprint activo
  const fetchActiveSprintWorkload = async () => {
    try {
      const token = await getToken();
      const workloadData = await sprintService.getTeamWorkloadFromActiveSprint(token);
      
      console.log('Workload del sprint activo:', workloadData);
      
      // Actualizar workload de team members con datos reales
      updateTeamMembersWithSprintWorkload(workloadData);
    } catch (error) {
      console.error('Error fetching sprint workload:', error);
    }
  };

  // Nueva función para actualizar workload basado en sprint activo
  const updateTeamMembersWithSprintWorkload = (workloadData) => {
    setTeamMembers(prevMembers => {
      return prevMembers.map(member => {
        // Buscar workload por ID o email
        const memberWorkload = workloadData[member._id] || 
                              workloadData[member.user?.email] ||
                              null;

        if (memberWorkload) {
          const maxStoryPoints = Math.max(
            memberWorkload.currentStoryPoints, 
            member.workload?.maxStoryPoints || 24
          );
          
          const workloadPercentage = Math.round(
            (memberWorkload.currentStoryPoints / maxStoryPoints) * 100
          );

          return {
            ...member,
            workload: {
              currentStoryPoints: memberWorkload.currentStoryPoints,
              maxStoryPoints,
              completedPoints: memberWorkload.completedStoryPoints
            },
            workloadPercentage,
            sprintInfo: {
              currentSprint: memberWorkload.sprintName,
              assignedItems: memberWorkload.assignedItems,
              completedItems: memberWorkload.completedItems
            },
            // Actualizar status basado en carga de trabajo
            status: workloadPercentage > 100 ? 'busy' : 
                   workloadPercentage === 0 ? 'inactive' : 'active'
          };
        }

        return member;
      });
    });
  };

  // Filtrado optimizado con useMemo
  const filteredMembers = useMemo(() => {
    let filtered = teamMembers;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(member => 
        `${member.user?.firstName} ${member.user?.lastName}`.toLowerCase().includes(searchLower) ||
        member.user?.email.toLowerCase().includes(searchLower) ||
        member.role.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    return filtered;
  }, [teamMembers, searchTerm, statusFilter, roleFilter]);

  // Handlers optimizados con useCallback
  const handleEditMember = useCallback((member) => {
    console.log('Editar miembro:', member);
    // Aquí puedes abrir un modal de edición
  }, []);

  const handleMessageMember = useCallback((member) => {
    console.log('Enviar mensaje a:', member);
    // Aquí puedes abrir un chat o modal de mensaje
  }, []);

  const handleAddMember = useCallback(() => {
    console.log('Agregar nuevo miembro');
    // Redirigir a la página de gestión de colaboradores
    window.location.href = '/super_admin/colaboradores';
  }, []);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchTeamMembers(),
      fetchActiveSprintWorkload()
    ]);
    setLoading(false);
  }, []);

  // Estadísticas optimizadas con useMemo
  const statsCards = useMemo(() => {
    const totalMembers = teamMembers.length;
    const activeMembers = teamMembers.filter(m => m.status === 'active').length;
    const overloadedMembers = teamMembers.filter(m => m.workloadPercentage > 100).length;
    const avgWorkload = totalMembers > 0 
      ? Math.round(teamMembers.reduce((sum, m) => sum + (m.workloadPercentage || 0), 0) / totalMembers)
      : 0;

    // Nueva estadística: miembros trabajando en sprint activo
    const membersInActiveSprint = teamMembers.filter(m => 
      m.sprintInfo?.currentSprint || m.workload?.currentStoryPoints > 0
    ).length;

    return [
      {
        title: 'Total Miembros',
        value: totalMembers,
        icon: Users,
        color: 'blue'
      },
      {
        title: 'Miembros Activos',
        value: activeMembers,
        icon: CheckCircle,
        color: 'green'
      },
      {
        title: 'En Sprint Activo',
        value: membersInActiveSprint,
        icon: Target,
        color: 'orange'
      },
      {
        title: 'Sobrecargados',
        value: overloadedMembers,
        icon: AlertTriangle,
        color: overloadedMembers > 0 ? 'red' : 'gray'
      }
    ];
  }, [teamMembers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumen del Equipo</h1>
          <p className="text-gray-600">Gestiona y supervisa el estado del equipo de desarrollo</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button 
            onClick={handleAddMember}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Agregar Miembro
          </button>
        </div>
      </div>

      {/* Mensaje de información */}
      {error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Modo Demostración</h3>
              <p className="text-sm text-blue-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'text-blue-600 bg-blue-100',
            green: 'text-green-600 bg-green-100',
            red: 'text-red-600 bg-red-100',
            yellow: 'text-yellow-600 bg-yellow-100',
            orange: 'text-orange-600 bg-orange-100',
            gray: 'text-gray-600 bg-gray-100'
          };
          
          return (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar miembros del equipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="busy">Ocupado</option>
                <option value="on_leave">De licencia</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Todos los roles</option>
              <option value="scrum_master">Scrum Master</option>
              <option value="product_owner">Product Owner</option>
              <option value="developer">Desarrollador</option>
              <option value="tester">Tester</option>
              <option value="designer">Diseñador</option>
              <option value="analyst">Analista</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <TeamMemberCard
              key={member._id}
              member={member}
              onEdit={handleEditMember}
              onMessage={handleMessageMember}
            />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay miembros del equipo</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || roleFilter !== 'all' 
                ? 'No se encontraron miembros con los filtros aplicados.'
                : 'No hay miembros del equipo registrados en este momento.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamOverview;
