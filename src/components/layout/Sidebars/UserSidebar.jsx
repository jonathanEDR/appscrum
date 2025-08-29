import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  UserCog, 
  LogOut, 
  Activity,
  Menu,
  X
} from 'lucide-react';

function UserSidebar({ currentView, onViewChange, userRole, isOpen, onToggle }) {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/sign-in');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'profile', icon: UserCog, label: 'Mi Perfil' },
    { id: 'actividades', icon: Activity, label: 'Mis Actividades' }
  ];

  return (
    <>
      {/* Botón toggle para móvil y desktop */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-[60] p-3 rounded-xl backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-105 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.95))',
          boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1)',
          transform: isOpen ? 'translateX(280px)' : 'translateX(0)'
        }}
      >
        {isOpen ? (
          <X className="text-white drop-shadow-sm" size={20} />
        ) : (
          <Menu className="text-white drop-shadow-sm" size={20} />
        )}
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar principal */}
      <div 
        className={`fixed left-0 top-0 h-screen w-72 z-50 transform transition-transform duration-300 ease-in-out shadow-galaxy border-r border-white/10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 25%, #93c5fd 50%, #60a5fa 75%, #3b82f6 100%)'
        }}
      >
        {/* Header premium con gradiente azul cielo */}
        <div className="p-8 border-b border-blue-300/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-medium"
                 style={{
                   background: 'linear-gradient(135deg, #3b82f6, #60a5fa)'
                 }}>
              <Home className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">Usuario</h2>
              <p className="text-sm text-blue-700">Panel personal</p>
            </div>
          </div>
          <div className="mt-3">
            <span className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#1e40af'
                  }}>
              Rol: Usuario
            </span>
          </div>
        </div>
        
        {/* Navegación moderna */}
        <div className="p-6">
          <nav className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className="sidebar-button w-full group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300"
                  style={{
                    background: isActive 
                      ? 'linear-gradient(135deg, #3b82f6, #60a5fa)' 
                      : 'transparent',
                    color: isActive ? '#ffffff' : '#1e3a8a',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isActive ? '0 8px 32px rgba(59, 130, 246, 0.25)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                      e.target.style.color = '#1d4ed8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#1e3a8a';
                    }
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isActive 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'rgba(59, 130, 246, 0.15)'
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Footer premium */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-300/30">
          <button
            onClick={handleLogout}
            className="sidebar-button w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group"
            style={{ color: '#dc2626' }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(248, 113, 113, 0.15)';
              e.target.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#dc2626';
            }}
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{ background: 'rgba(248, 113, 113, 0.15)' }}
            >
              <LogOut size={18} />
            </div>
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default UserSidebar;
