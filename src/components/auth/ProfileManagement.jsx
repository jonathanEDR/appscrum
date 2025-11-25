import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Edit2, Save, X, Search, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ProfileManagement = ({ userRole }) => {
  const { getToken } = useAuth();
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editForm, setEditForm] = useState({
    nombre_negocio: '',
    email: '',
  });
  
  // Opciones de roles disponibles
  const availableRoles = [
    { value: 'user', label: 'Usuario', color: theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800' },
    { value: 'developers', label: 'Developer', color: theme === 'dark' ? 'bg-blue-800/50 text-blue-300' : 'bg-blue-100 text-blue-800' },
    { value: 'scrum_master', label: 'Scrum Master', color: theme === 'dark' ? 'bg-green-800/50 text-green-300' : 'bg-green-100 text-green-800' },
    { value: 'product_owner', label: 'Product Owner', color: theme === 'dark' ? 'bg-yellow-800/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800' },
    { value: 'super_admin', label: 'Super Admin', color: theme === 'dark' ? 'bg-purple-800/50 text-purple-300' : 'bg-purple-100 text-purple-800' }
  ];
  
  // Función para obtener información del rol
  const getRoleInfo = (role) => {
    return availableRoles.find(r => r.value === role) || availableRoles[0];
  };
  // Función para verificar si el usuario puede editar a otro usuario
  const canEditUser = (targetUser) => {
    // Solo el super_admin puede editar cualquier usuario
    return userRole === 'super_admin';
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching users...');
      const token = await getToken();
      console.log('Token obtained:', !!token);
      
      const url = `${API_URL}/admin/users${searchTerm ? `?search=${searchTerm}` : ''}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Data received:', data);
          setUsers(data.users || []);
          setError('');
        } else {
          const text = await response.text();
          console.error('Received non-JSON response:', text);
          throw new Error('El servidor devolvió una respuesta inválida (no JSON)');
        }
      } else {
        let errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            const text = await response.text();
            console.error('Error response (non-JSON):', text);
          }
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al cargar los usuarios: ' + error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    // Verificar permisos antes de permitir la edición
    if (!canEditUser(user)) {
      setError('No tienes permisos para editar este usuario');
      return;
    }

    setEditingUser(user);
    setEditForm({
      nombre_negocio: user.nombre_negocio || '',
      email: user.email
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      nombre_negocio: '',
      email: ''
    });
  };

  const handleSaveProfile = async (userId) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/auth/update-profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      if (response.ok) {
        const result = await response.json();
        setEditingUser(null);
        fetchUsers(); // Recargar la lista de usuarios
        // Mostrar mensaje de éxito
        setError('success:' + result.message);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      setError('Error al actualizar el perfil: ' + error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // Función para cambiar el rol de un usuario
  const handleChangeRole = async (userId, newRole, currentRole) => {
    // Validar que el rol sea diferente
    if (newRole === currentRole) {
      setError('El rol seleccionado es el mismo que el actual');
      return;
    }
    
    if (!window.confirm(`¿Estás seguro de que quieres cambiar el rol de este usuario a ${newRole}?`)) return;
    
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
        fetchUsers();
        setError('success:Rol actualizado exitosamente');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar el rol');
      }
    } catch (error) {
      setError('Error al cambiar el rol: ' + error.message);
    }
  };
  
  // Roles disponibles en el sistema
  const availableRoles = [
    { value: 'user', label: 'Usuario', color: 'bg-gray-100 text-gray-800' },
    { value: 'developers', label: 'Desarrollador', color: 'bg-green-100 text-green-800' },
    { value: 'scrum_master', label: 'Scrum Master', color: 'bg-blue-100 text-blue-800' },
    { value: 'product_owner', label: 'Product Owner', color: 'bg-orange-100 text-orange-800' },
    { value: 'super_admin', label: 'Super Admin', color: 'bg-purple-100 text-purple-800' }
  ];
  
  // Obtener el label y color de un rol
  const getRoleInfo = (roleValue) => {
    return availableRoles.find(r => r.value === roleValue) || { label: roleValue, color: 'bg-gray-100 text-gray-800' };
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-6 ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Gestión de Perfiles</h2>
          <div className="flex gap-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                className={`border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search size={20} />
              </button>
            </form>
            <button
              onClick={() => fetchUsers()}
              className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'} text-white px-4 py-2 rounded-lg transition-colors`}
            >
              <RefreshCw size={20} />
              Actualizar
            </button>
          </div>
        </div>

        {error && (
          <div className={`px-4 py-3 rounded mb-4 ${
            error.startsWith('success:')
              ? (theme === 'dark' ? 'bg-green-900/30 border border-green-700 text-green-300' : 'bg-green-50 border border-green-200 text-green-700')
              : (theme === 'dark' ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-red-50 border border-red-200 text-red-700')
          }`}>
            {error.startsWith('success:') ? error.replace('success:', '') : error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Usuario
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Email
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Nombre del Negocio
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Rol
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-600' : 'bg-white divide-gray-200'} divide-y`}>
              {users.map((user) => (
                <tr key={user._id} className={`${!canEditUser(user) ? (theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50') : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {user.clerk_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser?._id === user._id ? (
                      <input
                        type="email"
                        className={`border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded px-3 py-1 text-sm w-full`}
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    ) : (
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{user.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser?._id === user._id ? (
                      <input
                        type="text"
                        className={`border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded px-3 py-1 text-sm w-full`}
                        value={editForm.nombre_negocio}
                        onChange={(e) => setEditForm({ ...editForm, nombre_negocio: e.target.value })}
                      />
                    ) : (
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{user.nombre_negocio || '-'}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser?._id === user._id ? (
                      <select
                        className={`border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded px-3 py-1 text-sm`}
                        value={user.role}
                        onChange={(e) => {
                          handleCancelEdit();
                          handleChangeRole(user._id, e.target.value, user.role);
                        }}
                        disabled={user.role === 'super_admin'}
                      >
                        {availableRoles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleInfo(user.role).color}`}>
                          {getRoleInfo(user.role).label}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">                    {editingUser?._id === user._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveProfile(user._id)}
                          className={`${theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-900'}`}
                          title="Guardar cambios"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className={`${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                          title="Cancelar edición"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        {/* Mostrar botón de editar si el usuario actual puede editar al usuario */}
                        {userRole === 'super_admin' && (
                          <>
                            <button
                              onClick={() => handleEdit(user)}
                              className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}
                              title="Editar perfil"
                            >
                              <Edit2 size={18} />
                            </button>
                            {/* Selector de rol como dropdown en lugar de botón de promoción */}
                            {user.role !== 'super_admin' && (
                              <select
                                onChange={(e) => {
                                  if (e.target.value !== user.role) {
                                    handleChangeRole(user._id, e.target.value, user.role);
                                  }
                                  e.target.value = user.role; // Reset al valor actual
                                }}
                                defaultValue=""
                                className={`text-sm border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600' : 'border-gray-300 bg-white hover:bg-gray-50'} rounded px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                title="Cambiar rol"
                              >
                                <option value="" disabled>
                                  Cambiar rol...
                                </option>
                                {availableRoles
                                  .filter(role => role.value !== 'super_admin' && role.value !== user.role)
                                  .map((role) => (
                                    <option key={role.value} value={role.value}>
                                      {role.label}
                                    </option>
                                  ))
                                }
                              </select>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
