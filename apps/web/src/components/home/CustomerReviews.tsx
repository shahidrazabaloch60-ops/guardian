'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface Testimonial {
  name: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
}

const TESTIMONIALS: Testimonial[] = [
  { name: 'XpWaste99', rating: 5, comment: 'Ordered 70-99 Runecrafting, and the booster finished it 2 days earlier than estimated. Highly recommend using VPN match.', service: 'Runecrafting Leveling', date: 'June 20, 2026' },
  { name: 'PureSpecOSRS', rating: 5, comment: 'Got my Fire Cape on my HCIM. Handled with absolute care, and they streamed the fight caves on private Discord link.', service: 'Minigames (Pest Control)', date: 'June 18, 2026' },
  { name: 'GielinorChad', rating: 4, comment: 'Quick response on live support. Custom quest builder made it simple to stack 5 quests together for a bulk discount.', service: 'Quest Package', date: 'June 15, 2026' },
  { name: 'PkerIron', rating: 5, comment: 'Had 100 kills of Chambers of Xeric done. Unbelievable skills, got me my Dex scroll. Will definitely order again.', service: 'Bossing (CoX)', date: 'June 12, 2026' },
  { name: 'Lvl3Skiller', rating: 5, comment: 'Construction 1-83 took only 1 day. Amazing speed and excellent communication throughout.', service: 'Construction Leveling', date: 'June 09, 2026' },
];

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-4">
          <Star size={12} fill="currentColor" />
          <span>4.9 / 5 Stars Overall</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">
          Trusted By Thousands <span className="gradient-text">Of Players</span>
        </h2>
        <p className="text-surface-300">
          Read what our buyers say about our reliable OSRS powerleveling and boosting services.
        </p>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-16 z-10 hidden sm:block">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/10 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-16 z-10 hidden sm:block">
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/10 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Active Testimonial Card */}
        <GlassCard hover={false} className="p-8 md:p-12 border border-white/5 bg-white/[0.01] shadow-glass flex flex-col gap-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-white">
                {TESTIMONIALS[activeIndex].name}
              </span>
              <span className="text-xs text-primary-400 mt-0.5">
                Verified Buyer ({TESTIMONIALS[activeIndex].service})
              </span>
            </div>
            <div className="flex gap-0.5 text-gold-400">
              {Array.from({ length: TESTIMONIALS[activeIndex].rating }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
          </div>
          <p className="text-base sm:text-lg text-surface-200 leading-relaxed italic">
            "{TESTIMONIALS[activeIndex].comment}"
          </p>
          <span className="text-xs text-surface-450 self-end mt-4">
            Completed: {TESTIMONIALS[activeIndex].date}
          </span>
        </GlassCard>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'bg-primary-500 w-6' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
