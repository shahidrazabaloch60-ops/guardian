import React from 'react';
import { Shield, Sparkles, HeartHandshake } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-12 animate-fade-in">
      <div className="text-center flex flex-col gap-4">
        <span className="text-xs text-primary-400 uppercase tracking-widest font-bold">About GuardianRS</span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
          We Skip the Grind, <br />
          <span className="gradient-text">You Enjoy the Adventure</span>
        </h1>
        <p className="text-surface-300 max-w-xl mx-auto leading-relaxed">
          GuardianRS was founded by a team of veteran OSRS players committed to delivering top-tier account boosting and skilling with absolute safety.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlassCard hover={false} className="flex flex-col gap-4 bg-white/[0.01]">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Shield size={24} />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Absolute Security</h3>
          <p className="text-sm text-surface-400 leading-relaxed">
            Every transaction is encrypted, and boosters employ strict VPN protocols matching your geographical region.
          </p>
        </GlassCard>

        <GlassCard hover={false} className="flex flex-col gap-4 bg-white/[0.01]">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles size={24} />
          </div>
          <h3 className="font-display font-bold text-lg text-white">100% Hand Done</h3>
          <p className="text-sm text-surface-400 leading-relaxed">
            We ban botting. Every skill tier or boss kill is completed manually by vetted OSRS experts.
          </p>
        </GlassCard>

        <GlassCard hover={false} className="flex flex-col gap-4 bg-white/[0.01]">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <HeartHandshake size={24} />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Fair Pricing</h3>
          <p className="text-sm text-surface-400 leading-relaxed">
            No hidden fees. Dynamic calculators ensure you pay strictly for what you need with coupon support.
          </p>
        </GlassCard>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center bg-white/[0.01] border border-white/5 p-8 rounded-2xl">
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="font-display font-bold text-2xl text-white">Our Mission</h3>
          <p className="text-sm text-surface-300 leading-relaxed">
            Old School RuneScape is an incredible game, but many players have their time locked behind hours of repetitive clicks. We bridge that gap by completing the grinds, freeing you to participate in high-level raids, bossing, and PvP instantly.
          </p>
        </div>
        <div className="text-5xl select-none hidden md:block">⚔️🛡️👑</div>
      </div>
    </div>
  );
}
