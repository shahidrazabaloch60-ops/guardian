import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8 animate-fade-in">
      <div className="text-center flex flex-col gap-2">
        <h1 className="font-display text-3xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-sm text-surface-300">Last updated: July 03, 2026</p>
      </div>

      <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-8 flex flex-col gap-6 text-sm text-surface-300 leading-relaxed">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">1. Agreement to Terms</h2>
        <p>
          By accessing or ordering from GuardianRS, you agree to comply with our conditions, safety agreements, and terms of service.
        </p>

        <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">2. Service Policy</h2>
        <p>
          We provide educational assistance, manual powerleveling, boss kill counts, and minigame helpers. We do not claim ownership over any OSRS assets, accounts, or copyrights belonging to Jagex Ltd.
        </p>

        <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">3. Safety & Refund Policies</h2>
        <p>
          While we enforce VPN protection and strict manual verification, account safety rests with the owner. Refunds are permitted prior to work assignments. Once a booster begins, partial payouts apply depending on progress.
        </p>
      </GlassCard>
    </div>
  );
}
