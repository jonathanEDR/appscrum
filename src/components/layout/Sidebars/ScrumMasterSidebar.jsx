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
  X,
  Bug
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

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
      id: 'bug-reports', 
      icon: Bug, 
      label: 'Bug Reports',
      section: 'reports'
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
        className={`fixed left-0 top-0 h-screen w-72 z-50 transform transition-transform duration-300 ease-in-out border-r-2 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
          boxShadow: 'var(--sidebar-shadow)'
        }}
      >
        {/* Header del sidebar con tema */}
        <div className="p-8 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-600 to-violet-600">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--sidebar-text)' }}>Scrum Master</h2>
                <p className="text-sm opacity-70" style={{ color: 'var(--sidebar-text)' }}>Panel de control</p>
              </div>
            </div>
            <ThemeToggle size="small" showLabel={false} />
          </div>
        </div>
        
        {/* Navegación moderna */}
        <div className="p-4 space-y-3 overflow-y-auto" style={{ height: 'calc(100vh - 240px)' }}>
          <nav className="space-y-3">
            {Object.entries(groupedItems).map(([section, items]) => (
              <div key={section}>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 px-2 opacity-60" 
                    style={{ color: 'var(--sidebar-text)' }}>
                  {sectionLabels[section]}
                </h3>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`sidebar-button w-full group flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg' 
                            : 'hover:bg-purple-100 dark:hover:bg-gray-800'
                        }`}
                        style={{
                          color: isActive ? '#ffffff' : 'var(--sidebar-text)'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                              isActive 
                                ? 'bg-white/20' 
                                : 'bg-purple-100 dark:bg-gray-700'
                            }`}
                          >
                            <Icon size={16} className="shrink-0 sidebar-button-text" />
                          </div>
                          <span className="text-sm font-medium sidebar-button-text">{item.label}</span>
                        </div>
                        {item.isNew && (
                          <span className="bg-success-100 text-success-800 text-[10px] font-medium px-2 py-0.5 rounded-full">
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
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
          <button
            onClick={onLogout}
            className="sidebar-button w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 group text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 bg-red-100 dark:bg-red-950/40">
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
