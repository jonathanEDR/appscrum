import React from 'react';

// Contenedor principal centrado
export const PageContainer = ({ children, className = '', maxWidth = 'max-w-7xl' }) => {
  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${maxWidth} ${className}`}>
      {children}
    </div>
  );
};

// Grid adaptativo para dashboards
export const DashboardGrid = ({ children, columns = 3, gap = 'gap-6', className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  return (
    <div className={`grid ${gridCols[columns]} ${gap} w-full ${className}`}>
      {children}
    </div>
  );
};

// Tarjeta premium con efecto glassmorphism mejorado
export const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6', 
  shadow = 'shadow-galaxy-enhanced',
  rounded = 'rounded-2xl',
  border = 'border border-white/20',
  background = 'glass-card',
  hover = true
}) => {
  const hoverEffects = hover ? 'hover-lift hover:shadow-galaxy-hover animate-fadeIn' : '';
  
  return (
    <div className={`${background} ${rounded} ${border} ${shadow} ${padding} transition-all duration-300 ${hoverEffects} relative overflow-hidden group ${className}`}>
      <div className="absolute inset-0 gradient-galaxy-enhanced opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Header de página premium con efectos galaxia
export const PageHeader = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`mb-8 animate-fadeIn ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold sm:text-4xl text-gradient-galaxy animate-float">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-base text-primary-600 sm:text-lg opacity-80">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="mt-4 flex sm:mt-0 sm:ml-6 animate-slideIn">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// Layout de dos columnas
export const TwoColumnLayout = ({ leftContent, rightContent, leftWidth = 'w-full lg:w-2/3', rightWidth = 'w-full lg:w-1/3', gap = 'gap-8' }) => {
  return (
    <div className={`flex flex-col lg:flex-row ${gap} w-full`}>
      <div className={leftWidth}>
        {leftContent}
      </div>
      <div className={rightWidth}>
        {rightContent}
      </div>
    </div>
  );
};

// Layout de tres columnas
export const ThreeColumnLayout = ({ leftContent, centerContent, rightContent, gap = 'gap-6' }) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 ${gap} w-full`}>
      <div className="lg:col-span-1">
        {leftContent}
      </div>
      <div className="lg:col-span-1">
        {centerContent}
      </div>
      <div className="lg:col-span-1">
        {rightContent}
      </div>
    </div>
  );
};

// Sección con título
export const Section = ({ title, children, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-primary-900 mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

// Panel premium con header mejorado
export const Panel = ({ title, subtitle, children, actions, className = '' }) => {
  return (
    <Card className={className}>
      {(title || subtitle || actions) && (
        <div className="mb-6 border-b border-primary-200/50 pb-4">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-xl font-semibold text-primary-800">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-primary-600">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center space-x-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      {children}
    </Card>
  );
};

// Componente de carga premium con efecto galaxia mejorado
export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`spinner-galaxy ${sizes[size]} animate-galaxy-pulse`}></div>
    </div>
  );
};

// Botón premium con efectos galaxia
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  loading = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  const variants = {
    primary: 'btn-galaxy',
    secondary: 'bg-white/80 text-primary-600 border border-primary-200 hover:bg-white hover:border-primary-300',
    outline: 'bg-transparent text-primary-600 border border-primary-300 hover:bg-primary-50',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50'
  };

  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed hover-lift';

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="small" className="mr-2" />
      ) : null}
      {children}
    </button>
  );
};

// Estado vacío premium
export const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      {Icon && (
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-medium">
          <Icon className="h-10 w-10 text-primary-500" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-primary-800 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-base text-primary-600 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </div>
  );
};
