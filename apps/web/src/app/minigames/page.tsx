'use client';

import React from 'react';
import { minigames } from '../../data/minigames';
import ServiceCard from '../../components/services/ServiceCard';
import ServiceGrid from '../../components/services/ServiceGrid';

export default function MinigamesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
          OSRS Minigame <span className="gradient-text">Calculators & Boosts</span>
        </h1>
        <p className="text-surface-300">
          Skip hours of repetitive minigames. Choose any minigame below to configure rewards, points, or hours wanted, and let our professional team handle it.
        </p>
      </div>

      <ServiceGrid>
        {minigames.map((mg) => (
          <ServiceCard
            key={mg.slug}
            name={mg.name}
            slug={mg.slug}
            icon={mg.icon}
            description={mg.description}
            price={mg.pricePerHour}
            priceType="hour"
            category="minigames"
            time={mg.estimatedTime}
            imageUrl={(mg as any).image}
          />
        ))}
      </ServiceGrid>

      <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto text-surface-300">
        <h2 className="text-2xl font-bold text-white mb-4">Premium OSRS Minigame Services</h2>
        <p className="mb-4 text-sm leading-relaxed">
          Minigames in Old School RuneScape offer some of the most essential untradeable items in the game—from the Void Knight equipment in Pest Control to the Fighter Torso in Barbarian Assault. However, the repetitive grinding can quickly cause burnout. GuardianRS provides fast, reliable minigame boosting so you can secure your desired rewards without the endless grind.
        </p>
        <p className="mb-4 text-sm leading-relaxed">
          <strong className="text-white font-semibold">Full Outfits & Untradeables:</strong> Need a full Prospector Kit from Motherlode Mine or Graceful from Agility Arenas? We can farm the required points or hours to get you fully equipped. <br/>
          <strong className="text-white font-semibold">PVP & PVE Minigames:</strong> Whether it's Last Man Standing for points or Guardians of the Rift for outfit pieces, our experienced players know the most efficient methods for every minigame.
        </p>
        <p className="text-sm leading-relaxed">
          Select a minigame above to start configuring your boost. You can order by the hour or specify exact points needed for your account.
        </p>
      </div>
    </div>
  );
}
