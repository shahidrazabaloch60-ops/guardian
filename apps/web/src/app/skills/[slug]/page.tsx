'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { skills } from '../../../data/skills';
import XPCalculator from '../../../components/services/XPCalculator';
import OrderBuilder from '../../../components/services/OrderBuilder';
import ServiceFAQ from '../../../components/services/ServiceFAQ';

export default function SkillSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [skill, setSkill] = useState<any>(null);
  const [price, setPrice] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(99);

  useEffect(() => {
    const found = skills.find((s) => s.slug === slug);
    if (found) {
      setSkill(found);
    }
  }, [slug]);

  if (!skill) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Skill Not Found</h2>
        <Link href="/skills" className="text-primary-400 hover:underline mt-4 inline-block">Back to Skills</Link>
      </div>
    );
  }

  const handlePriceChange = (totalPrice: number, curLvl: number, tarLvl: number) => {
    setPrice(totalPrice);
    setCurrentLevel(curLvl);
    setTargetLevel(tarLvl);
  };

  const handleCheckout = (formData: any) => {
    // Stash checkout item in localstorage and route
    localStorage.setItem('guardianrs_pending_order', JSON.stringify(formData));
    router.push('/order');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-8">
      {/* Back Button */}
      <Link href="/skills" className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors w-fit">
        <ArrowLeft size={16} />
        <span>Back to Skilling Catalogue</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Calculator details */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              {skill.icon}
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-primary-400 uppercase tracking-widest font-bold">OSRS SKILLS</span>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">{skill.name} Boosting</h1>
            </div>
          </div>
          <p className="text-surface-300 leading-relaxed text-sm sm:text-base">{skill.description}</p>
          
          <XPCalculator basePrice={skill.basePrice} onPriceChange={handlePriceChange} />

          <div className="mt-2 bg-white/5 border border-white/10 rounded-2xl p-6 text-surface-300 text-sm flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white">Why Use GuardianRS for {skill.name} Training?</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <span className="shrink-0">✅</span>
                <span><strong className="text-white">Dedicated Skilling Experts:</strong> Your {skill.name} levels are acquired by professionals who know the fastest, most efficient training methods.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">🔒</span>
                <span><strong className="text-white">Zero Automation:</strong> We guarantee 100% manual, hand-played progress. No bots, no macros, no risks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">⚡</span>
                <span><strong className="text-white">Rapid Leveling:</strong> We maximize XP rates to ensure your {skill.name} goals are reached in record time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">🏆</span>
                <span><strong className="text-white">Unmatched Reliability:</strong> Countless players have trusted us to max their accounts and build their pure builds safely.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">💬</span>
                <span><strong className="text-white">24/7 Live Assistance:</strong> Our customer care team is available day and night to keep you informed on your XP gains.</span>
              </li>
            </ul>
            <p className="leading-relaxed text-surface-400 mt-2">
              The journey to a 99 in {skill.name} is one of the most notoriously exhausting grinds in gaming. Don't spend your valuable free time clicking trees or running laps. Our verified boosters will put in the hours for you, allowing you to jump straight into the exciting end-game content.
            </p>
          </div>

          <ServiceFAQ serviceName={skill.name} />
        </div>

        {/* Right Column: Checkout builder */}
        <div className="w-full lg:w-[420px] shrink-0">
          <OrderBuilder
            basePrice={skill.basePrice}
            serviceType="SKILL"
            serviceName={skill.name}
            calculatedPrice={price}
            currentLevel={currentLevel}
            targetLevel={targetLevel}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
