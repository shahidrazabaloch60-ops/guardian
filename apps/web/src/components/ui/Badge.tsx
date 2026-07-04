import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold';
  className?: string;
  size?: 'sm' | 'md';
}

export default function Badge({
  children,
  variant = 'default',
  className,
  size = 'md',
}: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-white border-white/10',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    gold: 'bg-gold-500/10 text-gold-400 border-gold-500/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase',
    md: 'px-2.5 py-1 text-xs font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
