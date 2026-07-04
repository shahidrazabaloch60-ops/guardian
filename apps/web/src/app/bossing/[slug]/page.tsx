'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { bosses } from '../../../data/bosses';
import Input from '../../../components/ui/Input';
import GlassCard from '../../../components/ui/GlassCard';
import OrderBuilder from '../../../components/services/OrderBuilder';
import Badge from '../../../components/ui/Badge';
import ServiceFAQ from '../../../components/services/ServiceFAQ';

export default function BossSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [boss, setBoss] = useState<any>(null);
  const [killCount, setKillCount] = useState<number>(50);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const found = bosses.find((b) => b.slug === slug);
    if (found) {
      setBoss(found);
    }
  }, [slug]);

  useEffect(() => {
    if (boss) {
      setPrice(killCount * boss.pricePerKc);
    }
  }, [killCount, boss]);

  if (!boss) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Boss Not Found</h2>
        <Link href="/bossing" className="text-primary-400 hover:underline mt-4 inline-block">Back to Bossing</Link>
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
      <Link href="/bossing" className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors w-fit">
        <ArrowLeft size={16} />
        <span>Back to Bossing Catalogue</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: KC calculator details */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              {boss.icon}
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-primary-400 uppercase tracking-widest font-bold">OSRS BOSSING</span>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">{boss.name} Boosting</h1>
            </div>
          </div>
          <p className="text-surface-300 leading-relaxed text-sm sm:text-base">{boss.description}</p>
          
          <div className="flex flex-wrap gap-2 my-2">
            <Badge variant="warning">Min Combat: {boss.minCombatLevel}</Badge>
            <Badge variant="gold" className="capitalize">Difficulty: {boss.difficulty}</Badge>
          </div>

          {/* KC selector card */}
          <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4">
            <h3 className="font-display font-bold text-lg text-white">Kill Count Calculator</h3>
            <Input
              label="Select Desired Kills"
              type="number"
              min={1}
              max={1000}
              value={killCount}
              onChange={(e) => setKillCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
            />
            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-sm font-semibold">
              <span className="text-surface-300 font-bold uppercase tracking-wider text-xs">Drop Pool includes:</span>
              <div className="flex flex-wrap gap-1.5 justify-end">
                {boss.drops.map((drop: string) => (
                  <Badge key={drop} variant="default" className="text-[10px] bg-white/5">{drop}</Badge>
                ))}
              </div>
            </div>
          </GlassCard>

          <div className="mt-2 bg-white/5 border border-white/10 rounded-2xl p-6 text-surface-300 text-sm flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white">Why GuardianRS is the Best Choice for {boss.name}</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <span className="shrink-0">✅</span>
                <span><strong className="text-white">Elite PvM Specialists:</strong> We exclusively assign top-tier OSRS players who specialize in {boss.name} mechanics to your order.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">🔒</span>
                <span><strong className="text-white">Ironclad Security:</strong> Your account's safety is our highest priority, utilizing dedicated IPs and rigorous privacy measures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">⚡</span>
                <span><strong className="text-white">Lightning-Fast Delivery:</strong> We skip the delays. Our team gets to work immediately to ensure rapid completion of your {boss.name} kills.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">🏆</span>
                <span><strong className="text-white">Flawless Track Record:</strong> Join thousands of satisfied customers who have successfully secured their rarest drops and pets through us.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">💬</span>
                <span><strong className="text-white">Round-the-Clock Support:</strong> Our dedicated live chat team is always online to provide you with real-time updates on your boost.</span>
              </li>
            </ul>
            <p className="leading-relaxed text-surface-400 mt-2">
              Farming {boss.name} requires intense focus, expensive gear setups, and countless hours of trial and error. Why waste millions in supplies and deal with the frustration of repeated wipes? Let our professional team handle the heavy lifting so you can instantly enjoy the prestigious rewards.
            </p>
          </div>

          <ServiceFAQ serviceName={boss.name} />
        </div>

        {/* Right Column: Checkout builder */}
        <div className="w-full lg:w-[420px] shrink-0">
          <OrderBuilder
            basePrice={boss.pricePerKc}
            serviceType="BOSS"
            serviceName={boss.name}
            calculatedPrice={price}
            bossKillCount={killCount}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
