import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card = ({ children, className = '', onClick, hoverable = false }: CardProps) => {
  return (
    <div 
      className={twMerge(
        "bg-white rounded-lg shadow-soft overflow-hidden",
        hoverable && "transition-transform hover:-translate-y-1 hover:shadow-medium",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return (
    <div className={twMerge("p-4 sm:p-5 border-b border-neutral-200", className)}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent = ({ children, className = '' }: CardContentProps) => {
  return (
    <div className={twMerge("p-4 sm:p-5", className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return (
    <div className={twMerge("p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50", className)}>
      {children}
    </div>
  );
};