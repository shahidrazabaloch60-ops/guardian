'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, User, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    // Mock fetch post details
    const posts: Record<string, any> = {
      'dt2-whisperer-guide': {
        title: 'OSRS Desert Treasure II Boss Guide: Whisperer mechanics',
        date: 'June 28, 2026',
        tag: 'Guides',
        readTime: '5 mins',
        author: 'PvmExpert_Steve',
        content: `The Whisperer is one of the four post-quest bosses introduced with Desert Treasure II. Located in the ruins of Camdozaal, it requires quick prayers, precise movement, and magic damage scaling.

## Magic Setup
Since the Whisperer is immune to melee and highly resistant to ranged, you must bring magic gear. A Shadow of Tumeken, Sang staff, or Trident of the Swamp are the best weapons. Bring plenty of restore potions and magic damage boosting robes like Ancestral or Virtus.

## Phase Mechanics
1. **Prayer Flicking**: The Whisperer alternates between ranged and magic attacks. Keep your prayers mapped and listen to audio cues.
2. **Dodging Shadow Roots**: Periodically, the boss summons black roots under your tile. Always keep moving to avoid high typeless damage.
3. **Enrage Phase**: The boss speeds up its attack cycles and moves quickly. Maintain composure, pray correctly, and maximize dps.`,
      },
      'osrs-vpn-matching-importance': {
        title: 'Why VPN Matching matters for RuneScape Powerleveling',
        date: 'June 22, 2026',
        tag: 'Security',
        readTime: '3 mins',
        author: 'Guardian_Security',
        content: `When Jagex notices a login transition from New York to Germany in under 5 minutes, the account is flagged and locked. This is due to 'delayed travel locks'.

## How GuardianRS Protects You
To bypass these system triggers:
1. **Regional IP matching**: We deploy dedicated private VPN routing nodes that match your exact country and city.
2. **Delayed Logs**: We coordinate login times. We wait at least 3-4 hours after your last logout to mimic real human travel intervals.
3. **Session Clears**: Boosters never store login credentials. Single-use passwords are cleared post session logs.`,
      },
    };

    setPost(posts[slug] || {
      title: 'Blog Article Not Found',
      date: '',
      tag: 'Error',
      readTime: '',
      author: 'System',
      content: 'The requested blog post could not be found.',
    });
  }, [slug]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8 animate-fade-in">
      <Link href="/blog" className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors w-fit">
        <ArrowLeft size={16} />
        <span>Back to Articles</span>
      </Link>

      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Badge variant="info">{post?.tag}</Badge>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {post?.title}
        </h1>
        <div className="flex flex-wrap gap-4 text-xs text-surface-450 border-y border-white/5 py-4 my-2">
          <span className="flex items-center gap-1.5"><User size={14} /> By {post?.author}</span>
          <span className="flex items-center gap-1.5"><Calendar size={14} /> {post?.date}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> {post?.readTime} read</span>
        </div>
      </div>

      <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-8 text-sm sm:text-base text-surface-300 leading-relaxed flex flex-col gap-6">
        <div className="whitespace-pre-line">{post?.content}</div>
      </GlassCard>
    </div>
  );
}
