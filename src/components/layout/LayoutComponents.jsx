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

// Tarjeta premium con tema adaptable claro/oscuro
export const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6', 
  shadow = 'shadow-lg',
  rounded = 'rounded-2xl',
  border = 'border border-gray-200 dark:border-gray-800',
  background = 'bg-white dark:bg-gray-950',
  hover = true
}) => {
  const hoverEffects = hover ? 'hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300' : '';
  
  return (
    <div className={`${background} ${rounded} ${border} ${shadow} ${padding} ${hoverEffects} relative overflow-hidden group ${className}`}>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Header de página premium con tema adaptable
export const PageHeader = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold sm:text-4xl text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="mt-4 flex sm:mt-0 sm:ml-6">
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

// Sección con título adaptable al tema
export const Section = ({ title, children, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

// Panel premium con header mejorado y tema adaptable
export const Panel = ({ title, subtitle, children, actions, className = '' }) => {
  return (
    <Card className={className}>
      {(title || subtitle || actions) && (
        <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
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

// Componente de carga premium con tema adaptable
export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 ${sizes[size]}`}></div>
    </div>
  );
};

// Botón premium con tema adaptable
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
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 shadow-md hover:shadow-lg',
    secondary: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
    outline: 'bg-transparent text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
  };

  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed';

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

// Estado vacío premium con tema adaptable
export const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      {Icon && (
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-950 dark:to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
          <Icon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
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
