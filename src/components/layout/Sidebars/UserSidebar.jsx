import React from 'react';
import { Home, FileText, UserCog, LogOut, Activity } from 'lucide-react';

function UserSidebar({ currentView, onViewChange, onLogout, userRole }) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'profile', icon: UserCog, label: 'Mi Perfil' },
    { id: 'actividades', icon: Activity, label: 'Mis Actividades' }
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-6">
        <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">
          PANEL USUARIO
        </h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

export default UserSidebar;
