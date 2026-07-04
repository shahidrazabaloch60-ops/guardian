'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { quests } from '../../../data/quests';
import GlassCard from '../../../components/ui/GlassCard';
import OrderBuilder from '../../../components/services/OrderBuilder';
import Badge from '../../../components/ui/Badge';
import ServiceFAQ from '../../../components/services/ServiceFAQ';

export default function QuestSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [quest, setQuest] = useState<any>(null);

  useEffect(() => {
    const found = quests.find((q) => q.slug === slug);
    if (found) {
      setQuest(found);
    }
  }, [slug]);

  if (!quest) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Quest Not Found</h2>
        <Link href="/quests" className="text-primary-400 hover:underline mt-4 inline-block">Back to Quests</Link>
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
      <Link href="/quests" className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors w-fit">
        <ArrowLeft size={16} />
        <span>Back to Quest Catalogue</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: details */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              📜
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-primary-400 uppercase tracking-widest font-bold">OSRS QUESTS</span>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">{quest.name} Boost</h1>
            </div>
          </div>
          <p className="text-surface-300 leading-relaxed text-sm sm:text-base">{quest.description}</p>
          
          <div className="flex flex-wrap gap-2 my-2">
            <Badge variant="info">Quest Points: {quest.questPoints}</Badge>
            <Badge variant="gold" className="capitalize">Difficulty: {quest.difficulty}</Badge>
            <Badge variant={quest.members ? 'success' : 'default'}>{quest.members ? 'Members' : 'Free to Play'}</Badge>
          </div>

          {/* Requirements card */}
          {quest.requirements.length > 0 && (
            <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4">
              <h3 className="font-display font-bold text-lg text-white">Prerequisites & Requirements</h3>
              <ul className="list-disc pl-5 text-sm text-surface-300 flex flex-col gap-1.5">
                {quest.requirements.map((req: string) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </GlassCard>
          )}

          <div className="mt-2 bg-white/5 border border-white/10 rounded-2xl p-6 text-surface-300 text-sm flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white">Why Trust GuardianRS with {quest.name}?</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <span className="shrink-0">✅</span>
                <span><strong className="text-white">Questing Specialists:</strong> Our players have memorized the puzzles and optimal routes to finish {quest.name} seamlessly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">🔒</span>
                <span><strong className="text-white">Maximum Account Safety:</strong> We use localized VPNs and strict operational guidelines to keep your details completely secure.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">⚡</span>
                <span><strong className="text-white">Express Completion:</strong> Forget spending hours reading guides—we blast through the dialogue and requirements at top speed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">🏆</span>
                <span><strong className="text-white">Guaranteed Results:</strong> We boast a perfect completion rate across all Grandmaster quests and Achievement Diaries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">💬</span>
                <span><strong className="text-white">Always Online Support:</strong> Reach out to our friendly staff at any time to check on your quest's progress.</span>
              </li>
            </ul>
            <p className="leading-relaxed text-surface-400 mt-2">
              Completing {quest.name} often requires tracking down obscure items, solving confusing puzzles, and surviving dangerous boss fights. Save yourself the headache and let our experienced team unlock those crucial game-changing rewards for you while you sit back and relax.
            </p>
          </div>

          <ServiceFAQ serviceName={quest.name} />
        </div>

        {/* Right Column: Checkout builder */}
        <div className="w-full lg:w-[420px] shrink-0">
          <OrderBuilder
            basePrice={quest.price}
            serviceType="QUEST"
            serviceName={quest.name}
            calculatedPrice={quest.price}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
