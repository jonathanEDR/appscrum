import React from 'react';
import { 
  Home, 
  FileText, 
  UserCog, 
  LogOut, 
  Shield, 
  Users, 
  Target, 
  AlertTriangle, 
  Calendar, 
  Activity,
  BarChart3,
  ClipboardList,
  Wrench,
  Menu,
  X
} from 'lucide-react';

function ScrumMasterSidebar({ currentView, onViewChange, onLogout, userRole, isOpen, onToggle }) {
  const menuItems = [
    { 
      id: 'dashboard', 
      icon: Home, 
      label: 'Dashboard',
      section: 'main'
    },
    { 
      id: 'sprints', 
      icon: Target, 
      label: 'Sprints',
      section: 'main' 
    },
    { 
      id: 'impediments', 
      icon: AlertTriangle, 
      label: 'Impedimentos',
      section: 'team'
    },
    { 
      id: 'ceremonies', 
      icon: Calendar, 
      label: 'Ceremonias',
      section: 'team'
    },
    { 
      id: 'team', 
      icon: Users, 
      label: 'Equipo',
      section: 'team'
    },
    { 
      id: 'metrics', 
      icon: BarChart3, 
      label: 'Métricas',
      section: 'reports'
    },
    { 
      id: 'profile', 
      icon: UserCog, 
      label: 'Mi Perfil',
      section: 'settings'
    }
  ];

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const sectionLabels = {
    main: 'Principal',
    team: 'Equipo',
    reports: 'Reportes',
    settings: 'Configuración'
  };

  return (
    <>
      {/* Botón toggle para móvil y desktop */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-[60] p-3 rounded-xl backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-105 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(168, 85, 247, 0.95))',
          boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1)',
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
          background: 'linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 25%, #c4b5fd 50%, #a78bfa 75%, #8b5cf6 100%)'
        }}
      >
        {/* Header premium con gradiente violeta claro */}
        <div className="p-8 border-b border-violet-300/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-medium"
                 style={{
                   background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
                 }}>
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-violet-900">Scrum Master</h2>
              <p className="text-sm text-violet-700">Panel de control</p>
            </div>
          </div>
        </div>
        
        {/* Navegación moderna */}
        <div className="p-6 space-y-8">
          <nav className="space-y-6">
            {Object.entries(groupedItems).map(([section, items]) => (
              <div key={section}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 px-3" 
                    style={{ color: '#7c3aed' }}>
                  {sectionLabels[section]}
                </h3>
                <div className="space-y-2">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className="sidebar-button w-full group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300"
                        style={{
                          background: isActive 
                            ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)' 
                            : 'transparent',
                          color: isActive ? '#ffffff' : '#581c87',
                          transform: isActive ? 'scale(1.02)' : 'scale(1)',
                          boxShadow: isActive ? '0 8px 32px rgba(139, 92, 246, 0.25)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.target.style.background = 'rgba(139, 92, 246, 0.1)';
                            e.target.style.color = '#6b21a8';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#581c87';
                          }
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                            style={{
                              background: isActive 
                                ? 'rgba(255, 255, 255, 0.2)' 
                                : 'rgba(139, 92, 246, 0.15)'
                            }}
                          >
                            <Icon size={18} className="shrink-0" />
                          </div>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        {item.isNew && (
                          <span className="bg-success-100 text-success-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            Nuevo
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
        
        {/* Footer premium */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-violet-300/30">
          <button
            onClick={onLogout}
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

export default ScrumMasterSidebar;
