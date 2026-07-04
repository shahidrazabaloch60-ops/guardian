'use client';

import React from 'react';
import { skills } from '../../data/skills';
import ServiceCard from '../../components/services/ServiceCard';
import ServiceGrid from '../../components/services/ServiceGrid';

export default function SkillsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
          OSRS Skill <span className="gradient-text">Powerleveling</span>
        </h1>
        <p className="text-surface-300">
          Skip hours of tedious skilling. Select a skill below to open our interactive level calculators and configure your boost instantly.
        </p>
      </div>

      <ServiceGrid>
        {skills.map((skill) => (
          <ServiceCard
            key={skill.slug}
            name={skill.name}
            slug={skill.slug}
            icon={skill.icon}
            description={skill.description}
            price={skill.basePrice}
            priceType="level"
            category="skills"
            time={skill.estimatedTime}
            imageUrl={(skill as any).image}
          />
        ))}
      </ServiceGrid>

      <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto text-surface-300">
        <h2 className="text-2xl font-bold text-white mb-4">Why Choose Our OSRS Powerleveling Services?</h2>
        <p className="mb-4 text-sm leading-relaxed">
          Leveling up your skills in Old School RuneScape can be an incredible time sink. Our premium OSRS powerleveling services allow you to bypass the grind and jump straight into the end-game content you love. Whether you need 99 Agility, maxed combat stats, or a simple boost to complete a quest requirement, our verified professionals are ready to assist.
        </p>
        <p className="mb-4 text-sm leading-relaxed">
          <strong className="text-white font-semibold">100% Hand-Played:</strong> We never use bots, macros, or illegal scripts. Every single experience point is earned manually by an experienced player. <br/>
          <strong className="text-white font-semibold">Secure & Confidential:</strong> We employ strict VPN usage and account protection protocols to keep your account 100% safe during the boost.
        </p>
        <p className="text-sm leading-relaxed">
          Select your desired skill above to access our dynamic leveling calculator. Simply enter your current level and target level to get an instant, competitive quote for your order!
        </p>
      </div>
    </div>
  );
}
