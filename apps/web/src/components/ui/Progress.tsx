import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number; // 0 to 100
  color?: 'primary' | 'accent' | 'gold';
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Progress({
  value,
  color = 'primary',
  label,
  showPercentage = false,
  size = 'md',
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max(value, 0), 100);

  const colors = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-400',
    accent: 'bg-gradient-to-r from-accent-600 to-accent-400',
    gold: 'bg-gradient-to-r from-gold-600 to-gold-400',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-surface-400">
          {label && <span>{label}</span>}
          {showPercentage && <span>{percentage}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-white/5 border border-white/5 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
