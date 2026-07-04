'use client';

import React from 'react';
import { bosses } from '../../data/bosses';
import ServiceCard from '../../components/services/ServiceCard';
import ServiceGrid from '../../components/services/ServiceGrid';

export default function BossingPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
          OSRS Bossing & <span className="gradient-text">Raids Assistance</span>
        </h1>
        <p className="text-surface-300">
          Skip the hard mechanics. Hire our expert PVM players to secure your chambers, theater, tomb runs, or specific boss kill counts.
        </p>
      </div>

      <ServiceGrid>
        {bosses.map((boss) => (
          <ServiceCard
            key={boss.slug}
            name={boss.name}
            slug={boss.slug}
            icon={boss.icon}
            description={boss.description}
            price={boss.pricePerKc}
            priceType="kc"
            category="bossing"
            time="1-4 hours"
            imageUrl={(boss as any).image}
          />
        ))}
      </ServiceGrid>

      <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto text-surface-300">
        <h2 className="text-2xl font-bold text-white mb-4">Master OSRS Bossing with GuardianRS</h2>
        <p className="mb-4 text-sm leading-relaxed">
          Conquering the toughest bosses in Gielinor requires precision, high-tier gear, and hours of practice. GuardianRS offers professional OSRS bossing services to help you secure rare drops, elusive pets, and prestigious completion logs without the frustration of learning complex mechanics or dealing with continuous wipes.
        </p>
        <p className="mb-4 text-sm leading-relaxed">
          <strong className="text-white font-semibold">Raids & High-End PVM:</strong> Need an Inferno Cape? Struggling with the Theatre of Blood or Tombs of Amascut? Our elite PVM specialists have thousands of combined kill counts and can efficiently clear any raid or solo boss. <br/>
          <strong className="text-white font-semibold">Custom Kill Counts:</strong> Order specific amounts of KC for any boss to farm that one drop you've been chasing.
        </p>
        <p className="text-sm leading-relaxed">
          Choose a boss above to configure your requested kill count, set your account type, and let our verified experts do the heavy lifting while you reap the rewards.
        </p>
      </div>
    </div>
  );
}
