import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Apply a coloured gradient overlay: purple | cyan | green | amber */
  variant?: 'purple' | 'cyan' | 'green' | 'amber' | 'default';
  /** Remove default padding */
  noPadding?: boolean;
  onClick?: () => void;
}

const variantClass: Record<NonNullable<CardProps['variant']>, string> = {
  default: '',
  purple:  'stat-card-purple',
  cyan:    'stat-card-cyan',
  green:   'stat-card-green',
  amber:   'stat-card-amber',
};

export default function Card({
  children,
  className = '',
  variant = 'default',
  noPadding = false,
  onClick,
}: CardProps) {
  return (
    <div
      className={`panel ${variantClass[variant]} ${noPadding ? 'no-padding' : ''} ${className}`}
      style={noPadding ? { padding: 0 } : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
