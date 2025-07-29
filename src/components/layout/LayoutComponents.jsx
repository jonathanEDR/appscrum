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

// Tarjeta base mejorada
export const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6', 
  shadow = 'shadow-medium',
  rounded = 'rounded-xl',
  border = 'border border-gray-200',
  background = 'bg-white'
}) => {
  return (
    <div className={`${background} ${rounded} ${border} ${shadow} ${padding} ${className}`}>
      {children}
    </div>
  );
};

// Header de página
export const PageHeader = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="mt-4 flex sm:mt-0 sm:ml-4">
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

// Panel con header
export const Panel = ({ title, subtitle, children, actions, className = '' }) => {
  return (
    <Card className={className}>
      {(title || subtitle || actions) && (
        <div className="mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-medium text-gray-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center space-x-2">
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

// Componente de carga mejorado
export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-primary-200 border-t-primary-600 ${sizes[size]}`}></div>
    </div>
  );
};

// Estado vacío
export const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <Icon className="mx-auto h-12 w-12 text-gray-400" />
      )}
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};
