import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useRole } from '../context/RoleContext.jsx';
import { 
  Users, 
  UserPlus, 
  Search, 
  RefreshCw, 
  Edit2, 
  Trash2, 
  Mail, 
  Shield,
  MoreVertical,
  Filter,
  X
} from 'lucide-react';

const CollaboratorsManagement = () => {
  const { getToken } = useAuth();
  const { role } = useRole();
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [newCollaborator, setNewCollaborator] = useState({
    email: '',
    nombre_negocio: '',
    role: 'user'
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // Opciones de roles disponibles
  const roleOptions = [
    { value: 'user', label: 'Usuario', color: 'bg-gray-100 text-gray-800' },
    { value: 'developers', label: 'Developer', color: 'bg-blue-100 text-blue-800' },
    { value: 'scrum_master', label: 'Scrum Master', color: 'bg-green-100 text-green-800' },
    { value: 'product_owner', label: 'Product Owner', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'super_admin', label: 'Super Admin', color: 'bg-purple-100 text-purple-800' }
  ];

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = await getToken();
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      
      // Usar endpoint diferente según el rol del usuario
      let url;
      if (role === 'super_admin') {
        // Solo Super Admin puede acceder al endpoint de admin
        url = `${API_URL}/admin/users${params.toString() ? `?${params.toString()}` : ''}`;
      } else {
        // Product Owner y otros roles usan el endpoint de team
        url = `${API_URL}/team/members${params.toString() ? `?${params.toString()}` : ''}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          
          // Procesar datos según el endpoint usado
          if (role === 'super_admin') {
            // Endpoint /admin/users devuelve { users: [...] }
            setCollaborators(data.users || []);
          } else {
            // Endpoint /team/members devuelve { teamMembers: [...] } o { members: [...] }
            // Necesitamos transformar los datos de TeamMember a formato de usuario
            const teamMembers = data.teamMembers || data.members || [];
            const users = teamMembers.map(teamMember => ({
              _id: teamMember.user?._id || teamMember._id,
              clerk_id: teamMember.user?.clerk_id || 'N/A',
              nombre_negocio: teamMember.user?.nombre_negocio || teamMember.user?.firstName + ' ' + teamMember.user?.lastName,
              email: teamMember.user?.email,
              role: teamMember.role,
              avatar: teamMember.user?.avatar,
              status: teamMember.status || 'active',
              is_active: teamMember.status === 'active',
              createdAt: teamMember.createdAt || teamMember.joinedDate || new Date(),
              team: teamMember.team,
              position: teamMember.position,
              skills: teamMember.skills
            }));
            setCollaborators(users);
          }
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar colaboradores');
      }
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      setError('Error al cargar colaboradores: ' + error.message);
      setCollaborators([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    // Solo Super Admin puede cambiar roles
    if (role !== 'super_admin') {
      setError('No tienes permisos para cambiar roles de usuario');
      return;
    }
    
    if (!window.confirm(`¿Estás seguro de cambiar el rol a ${newRole}?`)) return;
    
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (response.ok) {
        setError('success:Rol actualizado exitosamente');
        fetchCollaborators();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar rol');
      }
    } catch (error) {
      setError('Error al cambiar rol: ' + error.message);
    }
  };

  const handleInviteCollaborator = async (e) => {
    e.preventDefault();
    
    // Solo Super Admin puede invitar usuarios
    if (role !== 'super_admin') {
      setError('No tienes permisos para invitar nuevos usuarios');
      return;
    }
    
    if (!newCollaborator.email || !newCollaborator.nombre_negocio) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/admin/users/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCollaborator)
      });
      
      if (response.ok) {
        setError('success:Invitación enviada exitosamente');
        setNewCollaborator({ email: '', nombre_negocio: '', role: 'user' });
        setShowAddForm(false);
        fetchCollaborators();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar invitación');
      }
    } catch (error) {
      setError('Error al invitar colaborador: ' + error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCollaborators();
  };

  const getRoleInfo = (role) => {
    return roleOptions.find(option => option.value === role) || 
           { label: role, color: 'bg-gray-100 text-gray-800' };
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Cargando colaboradores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 p-6 border border-transparent dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Gestión de Colaboradores</h1>
              <p className="text-gray-600">Administra los usuarios y sus roles en el sistema</p>
            </div>
          </div>
          {/* Solo mostrar botón de invitar para Super Admin */}
          {role === 'super_admin' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus size={20} />
              Invitar Colaborador
            </button>
          )}
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Buscar
            </button>
          </form>
          
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="all">Todos los roles</option>
              {roleOptions.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            
            <button
              onClick={fetchCollaborators}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw size={20} />
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Mensajes de error/éxito */}
      {error && (
        <div className={`p-4 rounded-lg ${
          error.startsWith('success:')
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {error.startsWith('success:') ? error.replace('success:', '') : error}
        </div>
      )}

      {/* Lista de colaboradores */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 overflow-hidden border border-transparent dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Colaboradores ({collaborators.length})
          </h2>
        </div>

        {collaborators.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay colaboradores</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || roleFilter !== 'all' 
                ? 'No se encontraron colaboradores con los filtros aplicados'
                : 'Comienza invitando a tu primer colaborador'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {collaborators.map((collaborator) => {
              const roleInfo = getRoleInfo(collaborator.role);
              return (
                <div key={collaborator._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {(collaborator.nombre_negocio || collaborator.email || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {collaborator.nombre_negocio || 'Sin nombre'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail size={14} className="text-gray-400" />
                          <p className="text-sm text-gray-500 truncate">
                            {collaborator.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                        <Shield size={12} className="mr-1" />
                        {roleInfo.label}
                      </span>

                      <div className="flex items-center space-x-2">
                        {/* Solo mostrar selector de roles para Super Admin */}
                        {role === 'super_admin' ? (
                          <select
                            value={collaborator.role}
                            onChange={(e) => handleRoleChange(collaborator._id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {roleOptions.map(role => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm text-gray-600">
                            Solo lectura
                          </span>
                        )}

                        <button
                          onClick={() => setSelectedCollaborator(collaborator)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span>ID: {collaborator.clerk_id}</span>
                    <span>Creado: {new Date(collaborator.createdAt).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      collaborator.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {collaborator.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para agregar colaborador - Solo para Super Admin */}
      {showAddForm && role === 'super_admin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Invitar Colaborador</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewCollaborator({ email: '', nombre_negocio: '', role: 'user' });
                  setError('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleInviteCollaborator} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={newCollaborator.email}
                    onChange={(e) => setNewCollaborator(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="colaborador@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="nombre_negocio" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="nombre_negocio"
                    required
                    value={newCollaborator.nombre_negocio}
                    onChange={(e) => setNewCollaborator(prev => ({ ...prev, nombre_negocio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del colaborador"
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <select
                    id="role"
                    value={newCollaborator.role}
                    onChange={(e) => setNewCollaborator(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roleOptions.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCollaborator({ email: '', nombre_negocio: '', role: 'user' });
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enviar Invitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorsManagement;
