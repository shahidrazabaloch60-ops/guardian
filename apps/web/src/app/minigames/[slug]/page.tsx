'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { minigames } from '../../../data/minigames';
import Input from '../../../components/ui/Input';
import GlassCard from '../../../components/ui/GlassCard';
import OrderBuilder from '../../../components/services/OrderBuilder';
import Badge from '../../../components/ui/Badge';
import ServiceFAQ from '../../../components/services/ServiceFAQ';

export default function MinigameSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [minigame, setMinigame] = useState<any>(null);
  const [hoursWanted, setHoursWanted] = useState<number>(5);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const found = minigames.find((m) => m.slug === slug);
    if (found) {
      setMinigame(found);
    }
  }, [slug]);

  useEffect(() => {
    if (minigame) {
      setPrice(hoursWanted * minigame.pricePerHour);
    }
  }, [hoursWanted, minigame]);

  if (!minigame) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Minigame Not Found</h2>
        <Link href="/minigames" className="text-primary-400 hover:underline mt-4 inline-block">Back to Minigames</Link>
      </div>
    );
  }

  const handleCheckout = (formData: any) => {
    localStorage.setItem('guardianrs_pending_order', JSON.stringify(formData));
    router.push('/order');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-8">
      {/* Back Button */}
      <Link href="/minigames" className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors w-fit">
        <ArrowLeft size={16} />
        <span>Back to Minigame Catalogue</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: calculator details */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              {minigame.icon}
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-primary-400 uppercase tracking-widest font-bold">OSRS MINIGAMES</span>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">{minigame.name} Boost</h1>
            </div>
          </div>
          <p className="text-surface-300 leading-relaxed text-sm sm:text-base">{minigame.description}</p>

          {/* Points/Hours selector card */}
          <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4">
            <h3 className="font-display font-bold text-lg text-white">Hourly Calculator</h3>
            <Input
              label="Select Boost Duration (Hours)"
              type="number"
              min={1}
              max={100}
              value={hoursWanted}
              onChange={(e) => setHoursWanted(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            />
            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-sm font-semibold">
              <span className="text-surface-300 font-bold uppercase tracking-wider text-xs">Expected Rewards:</span>
              <div className="flex flex-wrap gap-1.5 justify-end">
                {minigame.rewards.map((rew: string) => (
                  <Badge key={rew} variant="default" className="text-[10px] bg-white/5">{rew}</Badge>
                ))}
              </div>
            </div>
          </GlassCard>

          <div className="mt-2 bg-white/5 border border-white/10 rounded-2xl p-6 text-surface-300 text-sm flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white">Why GuardianRS is Perfect for {minigame.name}</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <span className="shrink-0">✅</span>
                <span><strong className="text-white">Minigame Veterans:</strong> Our team excels at the specific strategies required to maximize points in {minigame.name}.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">🔒</span>
                <span><strong className="text-white">Safe & Secure:</strong> Every order is completely hand-played with stringent privacy measures to protect your account.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">⚡</span>
                <span><strong className="text-white">Speedy Point Farming:</strong> We utilize the most optimal team setups and methods to secure your rewards as fast as possible.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">🏆</span>
                <span><strong className="text-white">Proven Excellence:</strong> We have successfully delivered thousands of Void sets, Fighter Torsos, and Skilling outfits.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">💬</span>
                <span><strong className="text-white">24/7 Order Tracking:</strong> Connect with our live chat agents anytime for immediate updates on your boost.</span>
              </li>
            </ul>
            <p className="leading-relaxed text-surface-400 mt-2">
              Acquiring the exclusive rewards from {minigame.name} is essential for account progression, but the repetitive grind can quickly lead to burnout. GuardianRS takes the repetitive strain off your shoulders, delivering your required points quickly so you can get back to the content you actually enjoy.
            </p>
          </div>

          <ServiceFAQ serviceName={minigame.name} />
        </div>

        {/* Right Column: Checkout builder */}
        <div className="w-full lg:w-[420px] shrink-0">
          <OrderBuilder
            basePrice={minigame.pricePerHour}
            serviceType="MINIGAME"
            serviceName={minigame.name}
            calculatedPrice={price}
            minigamePoints={hoursWanted}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
