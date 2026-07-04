import React from 'react';
import Link from 'next/link';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  tag: string;
  readTime: string;
}

const POSTS: BlogPost[] = [
  { title: 'OSRS Desert Treasure II Boss Guide: Whisperer mechanics', slug: 'dt2-whisperer-guide', excerpt: 'Learn the optimal shadow attack phases, dodge patterns, and recommended magic setups to defeat the Whisperer in Camdozaal.', date: 'June 28, 2026', tag: 'Guides', readTime: '5 mins' },
  { title: 'Why VPN Matching matters for RuneScape Powerleveling', slug: 'osrs-vpn-matching-importance', excerpt: 'Account locks occur when logins travel thousands of miles instantly. Discover how our regional VPN setups keep your account safe.', date: 'June 22, 2026', tag: 'Security', readTime: '3 mins' },
  { title: 'OSRS Gold Farming: Top 5 Skilling activities for gp', slug: 'top-5-skilling-gp-activities', excerpt: 'Skip the combat. We list high level skilling methods like Thieving elves or crafting blood runes that yield massive profits.', date: 'June 18, 2026', tag: 'Skilling', readTime: '4 mins' },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-12 animate-fade-in">
      <div className="text-center flex flex-col gap-4">
        <span className="text-xs text-primary-400 uppercase tracking-widest font-bold">GuardianRS Blog</span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">RuneScape News & Guides</h1>
        <p className="text-surface-300 max-w-xl mx-auto">
          Read updates, guides, and tips from our elite boosting team.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
            <GlassCard className="flex flex-col gap-4 border border-white/5 bg-white/[0.01]">
              <div className="flex justify-between items-start gap-4">
                <Badge variant="info" size="sm">{post.tag}</Badge>
                <span className="text-xs text-surface-450">{post.date} • {post.readTime} read</span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-primary-400 transition-colors leading-tight">
                {post.title}
              </h3>
              <p className="text-sm text-surface-300 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
