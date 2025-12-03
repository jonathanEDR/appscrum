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
        className="fixed top-4 left-4 z-[60] p-2.5 rounded-xl backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-105 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(168, 85, 247, 0.95))',
          boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1)',
          transform: isOpen ? 'translateX(260px)' : 'translateX(0)'
        }}
      >
        {isOpen ? (
          <X className="text-white drop-shadow-sm" size={18} />
        ) : (
          <Menu className="text-white drop-shadow-sm" size={18} />
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
        className={`fixed left-0 top-0 h-screen w-64 z-50 transform transition-transform duration-300 ease-in-out border-r-2 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
          boxShadow: 'var(--sidebar-shadow)'
        }}
      >
        {/* Header del sidebar con tema */}
        <div className="p-3 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-600 to-violet-600 flex-shrink-0">
                <Shield className="text-white" size={20} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold truncate" style={{ color: 'var(--sidebar-text)' }}>Scrum Master</h2>
                <p className="text-xs opacity-70 truncate" style={{ color: 'var(--sidebar-text)' }}>Panel</p>
              </div>
            </div>
            <ThemeToggle size="small" showLabel={false} />
          </div>
        </div>
        
        {/* Navegación moderna */}
        <div className="p-2 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
          <nav className="space-y-0.5">
            {Object.entries(groupedItems).map(([section, items]) => (
              <div key={section}>
                <h3 className="text-[9px] font-semibold uppercase tracking-wider mb-1 px-2 opacity-60" 
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
                        className={`sidebar-button w-full group flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md' 
                            : 'hover:bg-purple-100 dark:hover:bg-gray-800'
                        }`}
                        style={{
                          color: isActive ? '#ffffff' : 'var(--sidebar-text)'
                        }}
                      >
                        <div 
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                            isActive 
                              ? 'bg-white/20' 
                              : 'bg-purple-100 dark:bg-gray-700'
                          }`}
                        >
                          <Icon size={14} className="shrink-0 sidebar-button-text" />
                        </div>
                        <span className="text-xs font-medium sidebar-button-text flex-1 truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
          <button
            onClick={onLogout}
            className="sidebar-button w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 group text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <div className="w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 bg-red-100 dark:bg-red-950/40 flex-shrink-0">
              <LogOut size={14} />
            </div>
            <span className="text-xs font-medium truncate">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default ScrumMasterSidebar;
