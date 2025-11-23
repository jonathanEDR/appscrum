import React from 'react';
import { Home, UserCircle, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

function Sidebar({ currentView, onViewChange, onLogout, isOpen, onToggle }) {
  const menuItems = [
    // { id: 'notes', icon: FileText, label: 'Mis Notas' },
    { id: 'profile', icon: UserCircle, label: 'Mi Perfil' },
  ];

  return (
    <>
      {/* Botón toggle para móvil y desktop */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-[60] p-3 rounded-xl backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-105 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.95), rgba(99, 102, 241, 0.95))',
          boxShadow: '0 12px 40px rgba(79, 70, 229, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1)',
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
        className={`fixed left-0 top-0 h-screen w-72 z-50 transform transition-transform duration-300 ease-in-out border-r-2 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
          boxShadow: 'var(--sidebar-shadow)'
        }}
      >
      <div className="p-6">
        {/* Header con tema */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: 'var(--sidebar-text)' }}>AppScrum</h1>
              <span className="text-xs font-medium opacity-70" style={{ color: 'var(--sidebar-text)' }}>
                Usuario
              </span>
            </div>
          </div>
          <ThemeToggle size="small" showLabel={false} />
        </div>

        <h2 className="text-xs font-medium opacity-60 mb-3 uppercase tracking-wide" style={{ color: 'var(--sidebar-text)' }}>
          PANEL DE USUARIO
        </h2>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg'
                    : 'hover:bg-indigo-100 dark:hover:bg-gray-800'
                }`}
                style={{
                  color: isActive ? '#ffffff' : 'var(--sidebar-text)'
                }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-white/20'
                    : 'bg-indigo-100 dark:bg-gray-700'
                }`}>
                  <Icon size={16} className="sidebar-button-text" />
                </div>
                <span className="font-medium text-sm sidebar-button-text">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Botón de cerrar sesión */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 group text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center transition-all duration-300">
            <LogOut size={18} />
          </div>
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
    </>
  );
}

export default Sidebar;
