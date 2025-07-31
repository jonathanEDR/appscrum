import React from 'react';
import { Home, UserCircle, FileText, Settings, LogOut } from 'lucide-react';

function Sidebar({ currentView, onViewChange, onLogout }) {
  const menuItems = [
    // { id: 'notes', icon: FileText, label: 'Mis Notas' },
    { id: 'profile', icon: UserCircle, label: 'Mi Perfil' },
  ];

  return (
    <div className="w-72 bg-gradient-glass backdrop-blur-2xl h-screen fixed left-0 top-0 shadow-galaxy border-r border-primary-200/30">
      <div className="p-6">
        {/* Header con logo premium */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-medium">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary-800">AppScrum</h1>
            <span className="bg-primary-100 text-primary-800 px-3 py-1.5 rounded-full text-xs font-medium">
              Usuario
            </span>
          </div>
        </div>

        <h2 className="text-sm font-medium text-primary-400 mb-4 uppercase tracking-wide">
          PANEL DE USUARIO
        </h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group ${
                  currentView === item.id
                    ? 'bg-primary-100/80 text-primary-800 shadow-medium backdrop-blur-sm'
                    : 'text-primary-600 hover:bg-white/50 hover:text-primary-800 hover:shadow-medium'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  currentView === item.id
                    ? 'bg-primary-200 text-primary-800'
                    : 'bg-primary-50 text-primary-600 group-hover:bg-primary-100'
                }`}>
                  <Icon size={18} />
                </div>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Separador premium */}
      <div className="border-t border-primary-200/50 my-4"></div>
      
      {/* Botón de cerrar sesión */}
      <div className="p-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-error-600 hover:bg-error-50/80 hover:text-error-700 transition-all duration-300 group"
        >
          <div className="w-10 h-10 rounded-xl bg-error-100 group-hover:bg-error-200 flex items-center justify-center transition-all duration-300">
            <LogOut size={20} />
          </div>
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
