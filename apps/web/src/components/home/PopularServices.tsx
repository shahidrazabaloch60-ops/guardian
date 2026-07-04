'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface PopularService {
  name: string;
  category: string;
  price: number;
  time: string;
  icon: string;
  slug: string;
  image?: string;
}

const POPULAR_SERVICES: PopularService[] = [
  { name: '1-99 Strength Training', category: 'skills', price: 129.99, time: '3-6 Days', icon: '💪', slug: 'skills/strength', image: '' },
  { name: 'Fire Cape Service', category: 'minigames', price: 15.0, time: '1 Hour', icon: '🔥', slug: 'minigames/pest-control', image: '' },
  { name: 'Song of the Elves Quest', category: 'quests', price: 75.0, time: '6-8 Hours', icon: '📜', slug: 'quests/song-of-the-elves', image: '' },
  { name: 'Infernal Cape Service', category: 'bossing', price: 85.0, time: '2 Hours', icon: '🌋', slug: 'bossing/inferno', image: '' },
  { name: 'Fighter Torso Service', category: 'minigames', price: 29.99, time: '3 Hours', icon: '🛡️', slug: 'minigames/barbarian-assault', image: '' },
  { name: '1-99 Agility Powerleveling', category: 'skills', price: 349.99, time: '8-14 Days', icon: '🏃', slug: 'skills/agility', image: '' },
];

export default function PopularServices() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sectionBg, setSectionBg] = useState('');
  const [cardBgs, setCardBgs] = useState<Record<string, string>>({});

  useEffect(() => {
    setSectionBg(localStorage.getItem('popular_section_bg') || '');
    
    const bgs: Record<string, string> = {};
    POPULAR_SERVICES.forEach(srv => {
      bgs[srv.slug] = localStorage.getItem(`pop_bg_${srv.slug}`) || '';
    });
    setCardBgs(bgs);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Optional Section Background */}
      {sectionBg && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${sectionBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-dark" />
        </>
      )}

      <div className="relative z-10 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Most Popular <span className="gradient-text">Boosting Services</span>
            </h2>
            <p className="text-surface-300">
              Check out our most ordered gaming boosts and skip the OSRS grind instantly.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/10 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/10 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {POPULAR_SERVICES.map((srv) => {
            const cardBg = cardBgs[srv.slug] || srv.image;
            return (
            <div key={srv.name} className="min-w-[280px] sm:min-w-[320px] max-w-[320px] snap-start">
              <GlassCard className="flex flex-col justify-between h-[380px] border border-white/5 bg-white/[0.01] relative overflow-hidden group">
                {cardBg && (
                  <>
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${cardBg})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />
                  </>
                )}
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-end items-start">
                      <Badge variant="info" size="sm" className="bg-primary-500/5 text-primary-400">
                        {srv.category}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-display font-bold text-lg text-white leading-snug">{srv.name}</h3>
                      <div className="flex items-center gap-4 text-xs text-surface-450 mt-1">
                        <span>⏱️ Est: {srv.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 mt-8 pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-xs text-surface-450 uppercase font-semibold">starting at</span>
                      <span className="text-2xl font-display font-extrabold text-gold-400">
                        ${srv.price.toFixed(2)}
                      </span>
                    </div>
                    <Button href={`/${srv.slug}`} variant="primary" className="w-full flex items-center gap-2">
                      <ShoppingCart size={16} />
                      <span>Configure Order</span>
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
