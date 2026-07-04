import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export default function Skeleton({
  className,
  variant = 'rectangular',
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-white/5 border border-white/5',
        variant === 'text' && 'h-4 w-3/4 rounded',
        variant === 'circular' && 'h-12 w-12 rounded-full',
        variant === 'rectangular' && 'h-32 rounded-2xl',
        className
      )}
    />
  );
}
