import React from 'react';
import { Home, FileText, UserCog, LogOut, Shield, Users } from 'lucide-react';

function ScrumMasterSidebar({ currentView, onViewChange, onLogout, userRole }) {
  const menuItems = [
    // { id: 'dashboard', icon: Home, label: 'Gestión de Notas' },
    { id: 'users', icon: Users, label: 'Colaboradores' },
    { id: 'history', icon: FileText, label: 'Historial' },
    { id: 'profile', icon: UserCog, label: 'Mi Perfil' }
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Shield className="text-green-600" size={24} />
          Panel de Scrum Master
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
                    ? 'bg-green-50 text-green-700'
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

export default ScrumMasterSidebar;
