'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { SERVICE_CATEGORIES } from '../../lib/constants';

export default function ServiceCategories() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 20 },
    },
  };

  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    setImages({
      skills: localStorage.getItem('cat_bg_skills') || '',
      bossing: localStorage.getItem('cat_bg_bossing') || '',
      quests: localStorage.getItem('cat_bg_quests') || '',
      minigames: localStorage.getItem('cat_bg_minigames') || '',
    });
  }, []);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">
          Explore Our <span className="gradient-text">Boosting Catalog</span>
        </h2>
        <p className="text-surface-300 max-w-xl mx-auto">
          Choose from our carefully curated service categories and let our expert boosters manage the grind.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {SERVICE_CATEGORIES.map((cat) => {
          const bgImage = images[cat.slug] || cat.image;
          return (
          <Link key={cat.slug} href={`/${cat.slug}`} className="block h-full group">
            <GlassCard hover={true} className="flex flex-col justify-between h-full p-8 border border-white/5 bg-white/[0.01] relative overflow-hidden">
              {bgImage && (
                <>
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${bgImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />
                </>
              )}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col mt-4">
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-primary-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-surface-400 mt-1 uppercase tracking-widest font-semibold">
                      {cat.count}+ services available
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary-400 mt-8 group-hover:translate-x-1.5 transition-transform duration-300">
                  <span>View Catalogue</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </GlassCard>
          </Link>
          );
        })}
      </motion.div>
    </section>
  );
}
