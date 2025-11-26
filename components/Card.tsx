
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: 'p-0',
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
};
