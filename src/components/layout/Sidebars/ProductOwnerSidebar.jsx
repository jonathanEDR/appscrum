import React from 'react';
import { Home, FileText, UserCog, LogOut, Shield, Users, Menu, X, ChevronLeft, ChevronRight, Target, Calendar, BarChart3 } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import LogoDisplay from '../LogoDisplay';

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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Botón de toggle flotante */}
      <button
        onClick={onToggle}
        className={`fixed top-4 left-4 z-[60] p-3 rounded-xl backdrop-blur-md border transition-all duration-300 hover:scale-105 shadow-xl bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 border-white/30 dark:border-gray-700 ${
          isOpen ? 'translate-x-72' : 'translate-x-0'
        }`}
      >
        {isOpen ? (
          <X className="text-white drop-shadow-sm" size={20} />
        ) : (
          <Menu className="text-white drop-shadow-sm" size={20} />
        )}
      </button>

      {/* Sidebar principal con colores adaptados al tema: blanco puro (claro) y negro eclipse (oscuro) */}
      <div 
        className={`fixed left-0 top-0 h-screen w-72 z-50 transform transition-all duration-300 ease-in-out shadow-2xl border-r-2 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--sidebar-bg, #ffffff)',
          borderColor: 'var(--sidebar-border, #e5e7eb)',
          boxShadow: '4px 0 16px var(--sidebar-shadow, rgba(0, 0, 0, 0.06))'
        }}
      >
        {/* Header premium con colores adaptados */}
        <div className="p-8 border-b-2" style={{ borderColor: 'var(--sidebar-border)', boxShadow: '0 2px 6px var(--sidebar-shadow, rgba(0, 0, 0, 0.03))' }}>
          <div className="mb-2">
            <LogoDisplay 
              size="medium" 
              showText={false}
              iconClassName="bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold" style={{ color: 'var(--sidebar-text)' }}>Product Owner</h2>
                <p className="text-sm" style={{ color: 'var(--sidebar-text-muted)' }}>Gestión de producto</p>
              </div>
              {/* Theme Toggle al lado del título */}
              <div className="ml-3">
                <ThemeToggle size="small" showLabel={false} />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 text-white shadow-lg">
              Dueño de Producto
            </span>
          </div>
        </div>
        
        {/* Navegación moderna */}
        <div className="p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`sidebar-button w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 shadow-lg sidebar-button-text-active' 
                      : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 sidebar-button-text'
                  }`}
                >
                  <div 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'sidebar-button-text-active' : 'sidebar-button-text'} />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Footer premium */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t-2" style={{ borderColor: 'var(--sidebar-border)', backgroundColor: 'var(--sidebar-bg)', boxShadow: '0 -2px 6px var(--sidebar-shadow, rgba(0, 0, 0, 0.03))' }}>
          <button
            onClick={onLogout}
            className="sidebar-button w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 border-2 border-transparent hover:border-red-300 dark:hover:border-red-700"
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 bg-red-100 dark:bg-red-950/50 group-hover:bg-red-200 dark:group-hover:bg-red-900/50"
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

export default ProductOwnerSidebar;
