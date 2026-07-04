'use client';

import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { formatPriceFromDollars } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

export default function StaffPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-white">Booster Workspace</h1>
        <p className="text-sm text-surface-300">Welcome back, {user?.username || 'Booster'}! Monitor assignments and upload screenshots below.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col justify-between min-h-[140px]">
          <span className="text-xs text-surface-450 uppercase font-semibold">My Active Tasks</span>
          <span className="text-4xl font-display font-extrabold text-white">1</span>
        </GlassCard>
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col justify-between min-h-[140px]">
          <span className="text-xs text-surface-450 uppercase font-semibold">Completed Orders</span>
          <span className="text-4xl font-display font-extrabold text-emerald-400">12</span>
        </GlassCard>
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col justify-between min-h-[140px]">
          <span className="text-xs text-surface-450 uppercase font-semibold">My Wallet Earnings</span>
          <span className="text-4xl font-display font-extrabold text-gold-400">$645.00</span>
        </GlassCard>
      </div>

      {/* Active task overview */}
      <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-8 shadow-glass flex flex-col gap-6">
        <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Assigned Boosting Job</h3>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-white text-base">70-99 Strength Training</span>
            <span className="text-xs text-surface-450">Customer: Al***x • account: Ironman • VPN: USA</span>
          </div>
          <Badge variant="info">In Progress</Badge>
        </div>

        <div className="w-full h-3 rounded-full bg-white/5 border border-white/5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-600 to-indigo-500 rounded-full" style={{ width: '45%' }} />
        </div>
      </GlassCard>
    </div>
  );
}
