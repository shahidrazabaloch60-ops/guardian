'use client';

import React from 'react';
import { ShieldCheck, Flame, UserCheck, Timer } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import AnimatedCounter from '../ui/AnimatedCounter';

export default function LiveStatistics() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4">
          GuardianRS <span className="gradient-text">By The Numbers</span>
        </h2>
        <p className="text-surface-300">
          Our track record speaks for itself. Live service statistics updated daily.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard hover={false} className="flex flex-col items-center justify-center p-8 text-center bg-white/[0.01]">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
            <ShieldCheck size={28} />
          </div>
          <span className="text-4xl font-display font-extrabold text-white">
            <AnimatedCounter end={52847} />
          </span>
          <span className="text-sm font-semibold uppercase tracking-wider text-surface-450 mt-2">
            Completed Orders
          </span>
        </GlassCard>

        <GlassCard hover={false} className="flex flex-col items-center justify-center p-8 text-center bg-white/[0.01]">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
            <UserCheck size={28} />
          </div>
          <span className="text-4xl font-display font-extrabold text-white">
            <AnimatedCounter end={12493} />
          </span>
          <span className="text-sm font-semibold uppercase tracking-wider text-surface-450 mt-2">
            Active Accounts Managed
          </span>
        </GlassCard>

        <GlassCard hover={false} className="flex flex-col items-center justify-center p-8 text-center bg-white/[0.01]">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
            <Flame size={28} />
          </div>
          <span className="text-4xl font-display font-extrabold text-white">
            <AnimatedCounter end={2847} />
          </span>
          <span className="text-sm font-semibold uppercase tracking-wider text-surface-450 mt-2">
            5-Star Reviews
          </span>
        </GlassCard>

        <GlassCard hover={false} className="flex flex-col items-center justify-center p-8 text-center bg-white/[0.01]">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6">
            <Timer size={28} />
          </div>
          <span className="text-4xl font-display font-extrabold text-white">
            <AnimatedCounter end={5} suffix="+" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-wider text-surface-450 mt-2">
            Years Active Service
          </span>
        </GlassCard>
      </div>
    </section>
  );
}
