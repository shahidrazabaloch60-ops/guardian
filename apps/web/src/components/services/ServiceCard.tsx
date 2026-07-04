'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatPriceFromDollars } from '../../lib/utils';

interface ServiceCardProps {
  name: string;
  slug: string;
  icon: string;
  description: string;
  price: number;
  priceType: 'level' | 'kc' | 'hour' | 'flat';
  category: string;
  time?: string;
  imageUrl?: string;
  onClick?: () => void;
}

export default function ServiceCard({
  name,
  slug,
  icon,
  description,
  price,
  priceType,
  category,
  time,
  imageUrl,
  onClick,
}: ServiceCardProps) {
  const priceTypeLabels = {
    level: '/ level',
    kc: '/ kill count',
    hour: '/ hour',
    flat: 'flat rate',
  };

  return (
    <GlassCard className="flex flex-col justify-between h-[360px] border border-white/5 bg-white/[0.01] relative overflow-hidden group">
      {/* Background Image Layer */}
      {imageUrl && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          {/* Gradient Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />
        </>
      )}

      {/* Content wrapper to stay above background */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex flex-col gap-5">
          <div className="flex justify-end items-start">
          <Badge variant="info" size="sm" className="bg-primary-500/5 text-primary-400">
            {category}
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-lg text-white leading-snug">{name}</h3>
          <p className="text-xs text-surface-400 line-clamp-3 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-white/5">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-xs text-surface-450 uppercase font-semibold">Price starts at</span>
            <span className="text-2xl font-display font-extrabold text-gold-400">
              {formatPriceFromDollars(price)}
              <span className="text-xs font-normal text-surface-450 ml-1">
                {priceTypeLabels[priceType]}
              </span>
            </span>
          </div>
          {time && <span className="text-xs text-surface-450">⏱️ Est: {time}</span>}
        </div>
        <Button
          onClick={onClick}
          href={onClick ? undefined : `/${category}/${slug}`}
          variant="primary"
          className="w-full flex items-center gap-2"
        >
          <ShoppingCart size={16} />
          <span>Configure Boost</span>
        </Button>
      </div>
      </div>
    </GlassCard>
  );
}
