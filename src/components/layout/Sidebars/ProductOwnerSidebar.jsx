import React from 'react';
import { Home, FileText, UserCog, LogOut, Shield, Users, Menu, X, ChevronLeft, ChevronRight, Target, Calendar, BarChart3 } from 'lucide-react';

function ProductOwnerSidebar({ currentView, onViewChange, onLogout, userRole, isOpen = true, onToggle }) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'productos', icon: FileText, label: 'Productos' },
    { id: 'backlog', icon: Target, label: 'Product Backlog' },
    { id: 'roadmap', icon: Calendar, label: 'Roadmap' },
    { id: 'metricas', icon: BarChart3, label: 'Métricas' },
    { id: 'colaboradores', icon: Users, label: 'Colaboradores' },
    { id: 'perfil', icon: UserCog, label: 'Mi Perfil' }
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Botón de toggle flotante */}
      <button
        onClick={onToggle}
        className="fixed top-6 left-6 z-[60] p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          color: 'white',
          transform: isOpen ? 'translateX(252px)' : 'translateX(0)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = isOpen ? 'translateX(252px) scale(1.1)' : 'translateX(0) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = isOpen ? 'translateX(252px) scale(1)' : 'translateX(0) scale(1)';
        }}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`h-screen fixed left-0 top-0 shadow-galaxy border-r border-white/10 transition-all duration-300 ease-in-out z-50 ${
          isOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 25%, #cbd5e1 50%, #e2e8f0 75%, #f1f5f9 100%)'
        }}
      >
      {/* Header premium con gradiente galaxia */}
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-medium"
               style={{
                 background: 'linear-gradient(135deg, #22d3ee, #06b6d4)'
               }}>
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#1e293b' }}>Product Owner</h2>
            <p className="text-sm" style={{ color: '#475569' }}>Gestión de producto</p>
          </div>
        </div>
      </div>
      
      {/* Navegación moderna */}
      <div className="p-6">
        <nav className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className="sidebar-button w-full group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300"
                style={{
                  background: isActive 
                    ? 'linear-gradient(135deg, #1e40af, #3b82f6)' 
                    : 'rgba(30, 41, 59, 0.1)',
                  color: isActive ? '#ffffff' : '#1e293b',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isActive ? '0 8px 32px rgba(30, 64, 175, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: isActive ? 'none' : '1px solid rgba(30, 41, 59, 0.2)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(30, 64, 175, 0.2)';
                    e.target.style.color = '#1e40af';
                    e.target.style.transform = 'scale(1.01)';
                    e.target.style.boxShadow = '0 4px 16px rgba(30, 64, 175, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(30, 41, 59, 0.1)';
                    e.target.style.color = '#1e293b';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isActive 
                      ? 'rgba(255, 255, 255, 0.25)' 
                      : 'rgba(30, 41, 59, 0.15)',
                    border: isActive ? 'none' : '1px solid rgba(30, 41, 59, 0.2)'
                  }}
                >
                  <Icon size={20} style={{ 
                    color: isActive ? '#ffffff' : '#475569' 
                  }} />
                </div>
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Footer premium */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
        <button
          onClick={onLogout}
          className="sidebar-button w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group"
          style={{ 
            color: '#fca5a5',
            background: 'rgba(248, 113, 113, 0.08)',
            border: '1px solid rgba(248, 113, 113, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(248, 113, 113, 0.15)';
            e.target.style.color = '#ffffff';
            e.target.style.transform = 'scale(1.01)';
            e.target.style.boxShadow = '0 4px 16px rgba(248, 113, 113, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(248, 113, 113, 0.08)';
            e.target.style.color = '#fca5a5';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{ 
              background: 'rgba(248, 113, 113, 0.2)',
              border: '1px solid rgba(248, 113, 113, 0.3)'
            }}
          >
            <LogOut size={20} style={{ color: '#fca5a5' }} />
          </div>
          <span className="font-semibold text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
    </>
  );
}

export default ProductOwnerSidebar;
