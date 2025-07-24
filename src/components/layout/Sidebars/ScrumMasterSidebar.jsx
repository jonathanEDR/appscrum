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
  Wrench
} from 'lucide-react';

function ScrumMasterSidebar({ currentView, onViewChange, onLogout, userRole }) {
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
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Shield className="text-orange-600" size={24} />
          Scrum Master
        </h2>
        
        <nav className="space-y-6">
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {sectionLabels[section]}
              </h3>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                        currentView === item.id
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className="shrink-0" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {item.isNew && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
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
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

export default ScrumMasterSidebar;
