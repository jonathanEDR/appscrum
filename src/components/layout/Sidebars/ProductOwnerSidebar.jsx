import React from 'react';
import { Home, FileText, UserCog, LogOut, Shield, Users, Menu, X, ChevronLeft, ChevronRight, Target, Calendar, BarChart3, Sparkles, Bot } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import LogoDisplay from '../LogoDisplay';

function ProductOwnerSidebar({ currentView, onViewChange, onLogout, userRole, isOpen = true, onToggle }) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'productos', icon: FileText, label: 'Productos' },
    { id: 'backlog', icon: Target, label: 'Product Backlog' },
    { id: 'roadmap', icon: Calendar, label: 'Roadmap' },
    { id: 'sprint-planning', icon: Sparkles, label: 'Planificación Sprint' },
    { id: 'scrum-ai', icon: Bot, label: 'SCRUM AI', badge: 'Beta' },
    { id: 'metricas', icon: BarChart3, label: 'Métricas' },
    { id: 'colaboradores', icon: Users, label: 'Colaboradores' },
    { id: 'perfil', icon: UserCog, label: 'Mi Perfil' }
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Botón de toggle flotante */}
      <button
        onClick={onToggle}
        className={`fixed top-4 left-4 z-[60] p-2.5 rounded-xl backdrop-blur-md border transition-all duration-300 hover:scale-105 shadow-xl bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 border-white/30 dark:border-gray-700 ${
          isOpen ? 'translate-x-64' : 'translate-x-0'
        }`}
      >
        {isOpen ? (
          <X className="text-white drop-shadow-sm" size={18} />
        ) : (
          <Menu className="text-white drop-shadow-sm" size={18} />
        )}
      </button>

      {/* Sidebar principal con colores adaptados al tema: blanco puro (claro) y negro eclipse (oscuro) */}
      <div 
        className={`fixed left-0 top-0 h-screen w-64 z-50 transform transition-all duration-300 ease-in-out shadow-2xl border-r-2 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--sidebar-bg, #ffffff)',
          borderColor: 'var(--sidebar-border, #e5e7eb)',
          boxShadow: '4px 0 16px var(--sidebar-shadow, rgba(0, 0, 0, 0.06))'
        }}
      >
        {/* Header compacto */}
        <div className="p-4 border-b-2" style={{ borderColor: 'var(--sidebar-border)', boxShadow: '0 2px 6px var(--sidebar-shadow, rgba(0, 0, 0, 0.03))' }}>
          <div className="flex items-center gap-3">
            <LogoDisplay 
              size="small" 
              showText={false}
              iconClassName="bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold truncate" style={{ color: 'var(--sidebar-text)' }}>Product Owner</h2>
              <p className="text-xs" style={{ color: 'var(--sidebar-text-muted)' }}>Gestión de producto</p>
            </div>
            <ThemeToggle size="small" showLabel={false} />
          </div>
          <div className="mt-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 text-white shadow-md">
              Dueño de Producto
            </span>
          </div>
        </div>
        
        {/* Navegación compacta */}
        <div className="p-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`sidebar-button w-full group flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 shadow-md sidebar-button-text-active' 
                      : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 sidebar-button-text'
                  }`}
                >
                  <div 
                    className={`w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/20' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <Icon size={15} className={isActive ? 'sidebar-button-text-active' : 'sidebar-button-text'} />
                  </div>
                  <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Footer compacto */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t-2" style={{ borderColor: 'var(--sidebar-border)', backgroundColor: 'var(--sidebar-bg)', boxShadow: '0 -2px 6px var(--sidebar-shadow, rgba(0, 0, 0, 0.03))' }}>
          <button
            onClick={onLogout}
            className="sidebar-button w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 border border-transparent hover:border-red-300 dark:hover:border-red-700"
          >
            <div 
              className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 bg-red-100 dark:bg-red-950/50 group-hover:bg-red-200 dark:group-hover:bg-red-900/50"
            >
              <LogOut size={15} />
            </div>
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductOwnerSidebar;
