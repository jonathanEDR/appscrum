import React from 'react';
import { 
  Home, 
  User, 
  Target, 
  Calendar, 
  Clock, 
  Code, 
  LogOut, 
  Shield 
} from 'lucide-react';

function DevelopersSidebar({ currentView, onViewChange, onLogout, userRole }) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'profile', icon: User, label: 'Mi Perfil' },
    { id: 'tasks', icon: Target, label: 'Mis Tareas' },
    { id: 'sprint-board', icon: Calendar, label: 'Sprint Board' },
    { id: 'time-tracking', icon: Clock, label: 'Time Tracking' },
    { id: 'code', icon: Code, label: 'Código' }
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Shield className="text-blue-600" size={20} />
          PANEL DESARROLLADOR
        </h2>
        <div className="text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            Rol actual: Developers
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

export default DevelopersSidebar;
