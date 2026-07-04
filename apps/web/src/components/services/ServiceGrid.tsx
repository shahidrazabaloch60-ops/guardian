import React from 'react';
import { cn } from '../../lib/utils';

interface ServiceGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function ServiceGrid({ children, className }: ServiceGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
        className
      )}
    >
      {children}
    </div>
  );
}
