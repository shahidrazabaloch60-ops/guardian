'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Play } from 'lucide-react';
import Button from '../ui/Button';
import AnimatedCounter from '../ui/AnimatedCounter';

type Announcement = {
  isActive: boolean;
  badgeText: string;
  title: string;
  description: string;
  button1Text: string;
  button2Text: string;
  button2Url: string;
  button3Text: string;
  button3Url: string;
};

export default function HeroSection() {
  const [videoUrl, setVideoUrl] = useState('');
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [stats, setStats] = useState({
    stat1Num: 50000,
    stat1Label: 'Orders Filled',
    stat2Num: 12000,
    stat2Label: 'Happy Gamers',
    stat3Num: 4.9,
    stat3Label: 'Overall Rating',
    stat4Text: '24/7',
    stat4Label: 'Customer Support',
  });

  useEffect(() => {
    setVideoUrl(localStorage.getItem('hero_video_url') || '');
    setStats({
      stat1Num: Number(localStorage.getItem('hero_stat1_num')) || 50000,
      stat1Label: localStorage.getItem('hero_stat1_label') || 'Orders Filled',
      stat2Num: Number(localStorage.getItem('hero_stat2_num')) || 12000,
      stat2Label: localStorage.getItem('hero_stat2_label') || 'Happy Gamers',
      stat3Num: Number(localStorage.getItem('hero_stat3_num')) || 4.9,
      stat3Label: localStorage.getItem('hero_stat3_label') || 'Overall Rating',
      stat4Text: localStorage.getItem('hero_stat4_text') || '24/7',
      stat4Label: localStorage.getItem('hero_stat4_label') || 'Customer Support',
    });

    // Fetch dynamic hero announcement config
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/settings/hero-announcement`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setAnnouncement(data);
        }
      })
      .catch(err => console.error('[HeroSection] Failed to fetch hero announcement settings:', err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 20 },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-6 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-hero-glow pointer-events-none -z-10 animate-pulse-slow" />

      {/* Looping Background Video */}
      {videoUrl && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none -z-20 mix-blend-screen"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto text-center flex flex-col items-center gap-8"
      >
        {/* Banner Pill */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-primary-300 uppercase tracking-widest"
        >
          <Sparkles size={14} className="text-primary-400 animate-pulse" />
          <span>Voted #1 OSRS Boost Provider</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl"
        >
          Level Up Your OSRS <br />
          <span className="gradient-text">Adventure Today</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-xl text-surface-300 max-w-2xl leading-relaxed"
        >
          GuardianRS offers premium, hand-done OSRS powerleveling, combat training, diaries, minigames, and boss assistance by verified legends.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button href="/skills" size="lg" variant="primary" className="flex items-center gap-2">
            <Play size={16} fill="currentColor" />
            <span>Browse Services</span>
          </Button>
          <Button
            onClick={() => {
              const widget = document.getElementById('chat-widget');
              if (widget) widget.click();
            }}
            size="lg"
            variant="secondary"
            className="flex items-center gap-2 border border-white/10 hover:border-white/20"
          >
            <MessageSquare size={16} />
            <span>Live Chat</span>
          </Button>
        </motion.div>

        {/* Dynamic Announcement Banner - Fully Responsive and Optimized Layout */}
        {announcement?.isActive && (
          <motion.div
            variants={itemVariants}
            className="w-full max-w-4xl p-5 md:p-7 bg-[#09091f]/50 border border-indigo-500/30 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 text-left shadow-[0_0_40px_rgba(99,102,241,0.2)] backdrop-blur-xl mt-4"
          >
            <div className="flex flex-col items-start gap-1 w-full lg:max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-extrabold text-emerald-400 tracking-wider uppercase shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{announcement.badgeText}</span>
              </div>
              <h3 className="font-display font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl text-white tracking-wide uppercase leading-snug mt-2">
                {announcement.title}
              </h3>
              <p className="text-xs md:text-sm text-indigo-200/80 leading-relaxed mt-1">
                {announcement.description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0 mt-2 lg:mt-0 justify-start lg:justify-end">
              {announcement.button1Text && (
                <button
                  onClick={() => {
                    const widget = document.getElementById('chat-widget');
                    if (widget) {
                      widget.click();
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-primary-500/30 hover:scale-[1.02] active:scale-95 w-full sm:w-auto shrink-0"
                >
                  <MessageSquare size={13} />
                  <span>{announcement.button1Text}</span>
                </button>
              )}
              
              {announcement.button2Text && announcement.button2Url && (
                <a
                  href={announcement.button2Url}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-indigo-500/30 text-indigo-300 hover:bg-white/5 bg-indigo-950/20 flex items-center justify-center gap-1 transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto shrink-0"
                >
                  <span>{announcement.button2Text}</span>
                  <span>→</span>
                </a>
              )}
              
              {announcement.button3Text && announcement.button3Url && (
                <a
                  href={announcement.button3Url}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-white/10 text-surface-200 hover:bg-white/5 bg-white/[0.01] flex items-center justify-center gap-1 transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto shrink-0"
                >
                  <span>{announcement.button3Text}</span>
                  <span>→</span>
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Stats Row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-12 w-full max-w-4xl p-6 rounded-2xl glass-card border border-white/5 bg-white/[0.02]"
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl font-display font-extrabold text-white">
              <AnimatedCounter end={stats.stat1Num} suffix="+" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-450 mt-1">{stats.stat1Label}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-display font-extrabold text-primary-400">
              <AnimatedCounter end={stats.stat2Num} suffix="+" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-450 mt-1">{stats.stat2Label}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-display font-extrabold text-gold-400">
              <AnimatedCounter end={Math.floor(stats.stat3Num)} suffix={`.${Math.round((stats.stat3Num % 1) * 10)}`} />/5
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-450 mt-1">{stats.stat3Label}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-display font-extrabold text-accent-400">{stats.stat4Text}</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-450 mt-1">{stats.stat4Label}</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
