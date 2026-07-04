'use client';

import React from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Button from '../../../components/ui/Button';
import { FileCode, Plus, BookOpen, ShieldCheck, DollarSign } from 'lucide-react';

export default function KnowledgeBasePage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-extrabold text-white flex items-center gap-3">
            <FileCode className="text-primary-500" /> AI Knowledge Base
          </h1>
          <p className="text-sm text-surface-300">Train the AI Assistant by providing custom responses for specific topics.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus size={16} /> Add Entry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard hover={true} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4 cursor-pointer">
          <div className="w-12 h-12 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <h3 className="font-bold text-lg text-white">General Services</h3>
          <p className="text-sm text-surface-400 flex-1">Definitions and overviews for Skills, Bosses, Quests, and Minigames.</p>
          <span className="text-xs text-primary-400 font-semibold uppercase">12 Entries</span>
        </GlassCard>

        <GlassCard hover={true} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4 cursor-pointer">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold text-lg text-white">Account Safety</h3>
          <p className="text-sm text-surface-400 flex-1">Rules on how the AI explains bans, VPNs, manual playing, and risk.</p>
          <span className="text-xs text-primary-400 font-semibold uppercase">4 Entries</span>
        </GlassCard>

        <GlassCard hover={true} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4 cursor-pointer">
          <div className="w-12 h-12 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <h3 className="font-bold text-lg text-white">Pricing Rules</h3>
          <p className="text-sm text-surface-400 flex-1">Exceptions, bulk discounts, and custom quote guidelines.</p>
          <span className="text-xs text-primary-400 font-semibold uppercase">2 Entries</span>
        </GlassCard>
      </div>

      <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 mt-4">
        <h3 className="font-bold text-lg text-white mb-4">Recent Entries</h3>
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-dark/50 border border-white/10 rounded-lg">
            <h4 className="font-bold text-white text-sm mb-2">How to answer: "Is this safe?"</h4>
            <p className="text-sm text-surface-300">Always emphasize that we use hand-played methods by verified pros. No bots, no scripts. We can use a VPN matching your location. Never say 100% risk-free.</p>
          </div>
          <div className="p-4 bg-dark/50 border border-white/10 rounded-lg">
            <h4 className="font-bold text-white text-sm mb-2">Infernal Cape Requirements</h4>
            <p className="text-sm text-surface-300">Customer must have: 94+ Magic, 90+ Ranged, 70+ Prayer, and appropriate gear. If they don't, offer a custom quote to get those stats first.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
