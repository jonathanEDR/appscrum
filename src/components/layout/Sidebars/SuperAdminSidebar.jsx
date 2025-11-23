import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  UserCog, 
  LogOut, 
  Shield, 
  History,
  Menu,
  X,
  Settings,
  Cloud,
  GraduationCap
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import LogoDisplay from '../LogoDisplay';

function SuperAdminSidebar({ onLogout, isOpen, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Gestión de Usuarios', path: '/super_admin/usuarios' },
    { id: 'cvs', icon: GraduationCap, label: 'Gestión de CVs', path: '/super_admin/cvs' },
    { id: 'cloudinary', icon: Cloud, label: 'Gestión de Cloudinary', path: '/super_admin/cloudinary' },
    { id: 'config', icon: Settings, label: 'Configuración', path: '/super_admin/configuracion' },
    { id: 'history', icon: History, label: 'Historial', path: '/super_admin/historial' },
    { id: 'profile', icon: UserCog, label: 'Mi Perfil', path: '/super_admin/perfil' },
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Botón toggle para móvil y desktop */}
      <button
        onClick={onToggle}
        className={`fixed top-4 left-4 z-[60] p-3 rounded-xl backdrop-blur-md border transition-all duration-300 hover:scale-105 shadow-xl bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 border-white/30 dark:border-gray-700 ${
          isOpen ? 'translate-x-72' : 'translate-x-0'
        }`}
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

      {/* Sidebar principal con colores definidos: blanco puro (claro) y negro eclipse (oscuro) */}
      <div 
        className={`fixed left-0 top-0 h-screen w-72 z-50 transform transition-all duration-300 ease-in-out shadow-2xl border-r-2 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--sidebar-bg, #ffffff)',
          borderColor: 'var(--sidebar-border, #e5e7eb)',
          boxShadow: '4px 0 16px var(--sidebar-shadow, rgba(0, 0, 0, 0.06))'
        }}
      >
        {/* Header premium con colores adaptados */}
        <div className="p-8 border-b-2" style={{ borderColor: 'var(--sidebar-border)', boxShadow: '0 2px 6px var(--sidebar-shadow, rgba(0, 0, 0, 0.03))' }}>
          <div className="mb-2">
            <LogoDisplay 
              size="medium" 
              showText={false}
              iconClassName="bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold" style={{ color: 'var(--sidebar-text)' }}>Super Admin</h2>
                <p className="text-sm" style={{ color: 'var(--sidebar-text-muted)' }}>Control total del sistema</p>
              </div>
              {/* Theme Toggle al lado del título */}
              <div className="ml-3">
                <ThemeToggle size="small" showLabel={false} />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white shadow-lg">
              Autoridad Máxima
            </span>
          </div>
        </div>
        
        {/* Navegación moderna */}
        <div className="p-6">
          <nav className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`sidebar-button w-full group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
                    active 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 shadow-lg scale-105 sidebar-button-text-active border-2 border-purple-400 dark:border-purple-300' 
                      : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 sidebar-button-text border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  style={{
                    transform: active ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      active 
                        ? 'bg-white/20' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <Icon size={20} className={active ? 'sidebar-button-text-active' : 'sidebar-button-text'} />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Footer premium */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t-2" style={{ borderColor: 'var(--sidebar-border)', backgroundColor: 'var(--sidebar-bg)', boxShadow: '0 -2px 6px var(--sidebar-shadow, rgba(0, 0, 0, 0.03))' }}>
          <button
            onClick={onLogout}
            className="sidebar-button w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 border-2 border-transparent hover:border-red-300 dark:hover:border-red-700"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 bg-red-100 dark:bg-red-950/50 group-hover:bg-red-200 dark:group-hover:bg-red-900/50"
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

export default SuperAdminSidebar;
