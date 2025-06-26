import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = '', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    'extra-large': 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-walmart-blue',
    secondary: 'border-gray-600',
    white: 'border-white',
    success: 'border-green-600',
    warning: 'border-yellow-500',
    error: 'border-red-600'
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center space-y-2 ${className}`}
      role="status"
      aria-label={text || 'Loading'}
    >
      <div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          border-2 border-t-transparent rounded-full animate-spin
        `}
        aria-hidden="true"
      />
      {text && (
        <p className="text-sm text-gray-600 font-medium">
          {text}
        </p>
      )}
      <span className="sr-only">
        {text || 'Loading, please wait...'}
      </span>
    </div>
  );
};

export default LoadingSpinner;
