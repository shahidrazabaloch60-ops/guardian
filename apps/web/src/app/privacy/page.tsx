import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8 animate-fade-in">
      <div className="text-center flex flex-col gap-2">
        <h1 className="font-display text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-sm text-surface-300">Last updated: July 03, 2026</p>
      </div>

      <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-8 flex flex-col gap-6 text-sm text-surface-300 leading-relaxed">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">1. Information Collection</h2>
        <p>
          We only store minimal records required to complete your boosting orders, including your contact email, order preferences, and encrypted credentials while work remains active.
        </p>

        <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">2. Credential Security</h2>
        <p>
          Booster specialists are given secure, temporary session cookies or single-use passwords. We strongly recommend enabling 2-Factor Authentication and changing passwords post-completion.
        </p>

        <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">3. Third-party Gateways</h2>
        <p>
          Credit card information is processed directly by Stripe/PayPal servers. GuardianRS never logs your payment card digits.
        </p>
      </GlassCard>
    </div>
  );
}
