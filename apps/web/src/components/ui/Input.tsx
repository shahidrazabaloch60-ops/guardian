'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export default function Input({
  label,
  error,
  icon: Icon,
  className,
  id,
  type = 'text',
  required,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-surface-400">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          id={id}
          className={cn(
            'glass-input w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200',
            Icon && 'pl-11',
            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-400 mt-0.5">{error}</span>}
    </div>
  );
}
