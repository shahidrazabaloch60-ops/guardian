'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'primary' | 'accent' | 'gold' | 'none';
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className,
  hover = true,
  glow = 'none',
  onClick,
}: GlassCardProps) {
  const glowStyles = {
    primary: 'shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] border-indigo-500/20',
    accent: 'shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] border-emerald-500/20',
    gold: 'shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] border-amber-500/20',
    none: '',
  };

  const CardComponent = onClick ? motion.button : motion.div;

  return (
    <CardComponent
      onClick={onClick}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'glass-card rounded-2xl p-6 text-left border border-white/5 bg-white/5 backdrop-blur-xl',
        hover && 'hover:bg-white/10 hover:border-white/15',
        glowStyles[glow],
        onClick && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark',
        className
      )}
    >
      {children}
    </CardComponent>
  );
}
