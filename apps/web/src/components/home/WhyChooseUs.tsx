'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { TRUST_BADGES } from '../../lib/constants';

export default function WhyChooseUs() {
  const [badges, setBadges] = useState<{ title: string; icon: string; desc: string; }[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/settings/trust-badges`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBadges(data);
        }
      })
      .catch(err => console.error('[WhyChooseUs] Failed to fetch trust badges:', err));
  }, []);

  const displayBadges = badges.length > 0 ? badges : TRUST_BADGES;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">
          Safe OSRS Boosting <span className="gradient-text">By Experts</span>
        </h2>
        <p className="text-surface-300 max-w-xl mx-auto">
          We protect your hard-earned progress. Account security and hand-done execution are our core priorities.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {displayBadges.map((badge, idx) => (
          <GlassCard key={idx} hover={true} className="flex flex-col gap-6 p-8 border border-white/5 bg-white/[0.01]">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
              {badge.icon}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-display font-bold text-lg text-white">{badge.title}</h3>
              <p className="text-sm text-surface-400 leading-relaxed">{badge.desc}</p>
            </div>
          </GlassCard>
        ))}
      </motion.div>
    </section>
  );
}
