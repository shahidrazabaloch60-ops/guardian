'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { quests } from '../../data/quests';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import { Search } from 'lucide-react';

export default function QuestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');

  const filteredQuests = quests.filter((q) => {
    const matchesSearch = q.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'ALL' || q.difficulty.toUpperCase() === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
          OSRS Quest & <span className="gradient-text">Diary Helper</span>
        </h1>
        <p className="text-surface-300">
          Skip hours of reading dialogue. Select any quest, miniquest, or diary tier below to configure pricing and get it done manually by our specialists.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/[0.01] border border-white/5 p-4 rounded-2xl max-w-3xl mx-auto w-full">
        <div className="relative w-full sm:max-w-sm">
          <Input
            placeholder="Search all OSRS quests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            className="!py-2.5"
          />
        </div>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="glass-input px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white focus:outline-none w-full sm:w-48 cursor-pointer"
        >
          <option value="ALL">All Difficulties</option>
          <option value="NOVICE">Novice</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="EXPERIENCED">Experienced</option>
          <option value="MASTER">Master</option>
          <option value="GRANDMASTER">Grandmaster</option>
        </select>
      </div>

      <div className="flex flex-col gap-3">
        {filteredQuests.map((quest) => (
          <Link href={`/quests/${quest.slug}`} key={quest.slug}>
            <GlassCard hover={true} className="border border-white/5 bg-white/[0.01] p-4 flex items-center justify-between group relative overflow-hidden">
              {(quest as any).image && (
                <>
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${(quest as any).image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/30 to-transparent" />
                </>
              )}
              <div className="flex items-center gap-4 relative z-10 pl-2">
                <div className="flex flex-col">
                  <span className="font-bold text-white text-base group-hover:text-primary-400 transition-colors">{quest.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                      quest.difficulty === 'novice' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      quest.difficulty === 'intermediate' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      quest.difficulty === 'experienced' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      quest.difficulty === 'master' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {quest.difficulty}
                    </span>
                    <span className="text-xs text-surface-400">Est. {quest.estimatedTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs text-surface-450 uppercase font-bold tracking-wider">Starts at</span>
                  <span className="font-display font-extrabold text-gold-400">${quest.price.toFixed(2)}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-colors shrink-0">
                  <span className="transform -rotate-45 font-bold leading-none">→</span>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
        {filteredQuests.length === 0 && (
          <div className="text-center py-12 text-surface-400">No quests found matching your search.</div>
        )}
      </div>

      <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto text-surface-300">
        <h2 className="text-2xl font-bold text-white mb-4">Effortless OSRS Questing & Diaries</h2>
        <p className="mb-4 text-sm leading-relaxed">
          Quests unlock some of the most vital content, areas, and equipment in Old School RuneScape, but completing them can often feel like a tedious chore. Our OSRS Questing service takes the headache out of puzzles, dialogue, and long item collection runs so you can enjoy the rewards instantly.
        </p>
        <p className="mb-4 text-sm leading-relaxed">
          <strong className="text-white font-semibold">Grandmaster to Novice:</strong> From Dragon Slayer II and Desert Treasure II down to the simplest beginner quests, our workers have optimized routes to finish them in record time. <br/>
          <strong className="text-white font-semibold">Achievement Diaries:</strong> We also offer full tier completions for any regional Achievement Diary, securing you those powerful teleports and daily rewards.
        </p>
        <p className="text-sm leading-relaxed">
          Browse the quest directory above or use the search bar to find exactly what you need. Select a quest to view its base price and start your order today!
        </p>
      </div>
    </div>
  );
}
