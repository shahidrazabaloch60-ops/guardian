'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Check, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('GuardianRS');
  const [desc, setDesc] = useState('Premium Old School RuneScape powerleveling and combat boosts.');
  const [stripeConfigured, setStripeConfigured] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [trustBadges, setTrustBadges] = useState([
    { title: 'VPN Regional Protection', icon: '🛡️', desc: 'We match your local region IP' },
    { title: '100% Hand Done', icon: '💪', desc: 'No bots or macro automation ever' },
    { title: 'Professional Boosters', icon: '⭐', desc: 'Fully vetted elite OSRS players' },
    { title: '24/7 Live Support', icon: '💬', desc: 'Here to help you anytime' }
  ]);
  const [savingBadges, setSavingBadges] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/settings/trust-badges`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTrustBadges(data);
        }
      })
      .catch(err => console.error('[Settings] Failed to fetch trust badges:', err));
  }, []);

  const handleSaveBadges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBadges(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/settings/trust-badges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badges: trustBadges })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Failed to save trust badges");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving trust badges");
    } finally {
      setSavingBadges(false);
    }
  };

  const [announcement, setAnnouncement] = useState({
    isActive: true,
    badgeText: 'NOW LIVE',
    title: 'THE BLOOD MOON RISES QUEST IS NOW LIVE',
    description: 'Get a quick quote in live chat and skip straight to the fun.',
    button1Text: 'Live Chat for a quote',
    button2Text: 'Maggot King service',
    button2Url: '/bossing/maggot-king',
    button3Text: 'Quest service',
    button3Url: '/quests'
  });
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/settings/hero-announcement`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setAnnouncement(data);
        }
      })
      .catch(err => console.error('[Settings] Failed to fetch hero announcement settings:', err));
  }, []);

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAnnouncement(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/settings/hero-announcement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcement })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Failed to save hero announcement settings");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving hero announcement settings");
    } finally {
      setSavingAnnouncement(false);
    }
  };

  const [welcomeMessage, setWelcomeMessage] = useState("👋 Hi! Welcome to our OSRS boosting service. How can I help you today?");
  const [savingWelcome, setSavingWelcome] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/settings/chat-welcome-message`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.message === 'string') {
          setWelcomeMessage(data.message);
        }
      })
      .catch(err => console.error('[Settings] Failed to fetch welcome message setting:', err));
  }, []);

  const handleSaveWelcome = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWelcome(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/settings/chat-welcome-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: welcomeMessage })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Failed to save welcome message");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving welcome message");
    } finally {
      setSavingWelcome(false);
    }
  };

  const [stats, setStats] = useState({
    stat1Num: '50000',
    stat1Label: 'Orders Filled',
    stat2Num: '12000',
    stat2Label: 'Happy Gamers',
    stat3Num: '4.9',
    stat3Label: 'Overall Rating',
    stat4Text: '24/7',
    stat4Label: 'Customer Support',
  });

  const [heroVideoUrl, setHeroVideoUrl] = useState('');
  const [popularSectionBg, setPopularSectionBg] = useState('');
  const [popularBgImages, setPopularBgImages] = useState<Record<string, string>>({});

  useEffect(() => {
    setStats({
      stat1Num: localStorage.getItem('hero_stat1_num') || '50000',
      stat1Label: localStorage.getItem('hero_stat1_label') || 'Orders Filled',
      stat2Num: localStorage.getItem('hero_stat2_num') || '12000',
      stat2Label: localStorage.getItem('hero_stat2_label') || 'Happy Gamers',
      stat3Num: localStorage.getItem('hero_stat3_num') || '4.9',
      stat3Label: localStorage.getItem('hero_stat3_label') || 'Overall Rating',
      stat4Text: localStorage.getItem('hero_stat4_text') || '24/7',
      stat4Label: localStorage.getItem('hero_stat4_label') || 'Customer Support',
    });

    setHeroVideoUrl(localStorage.getItem('hero_video_url') || '');
    setPopularSectionBg(localStorage.getItem('popular_section_bg') || '');

    const sliderServices = [
      'skills/strength',
      'minigames/pest-control',
      'quests/song-of-the-elves',
      'bossing/inferno',
      'minigames/barbarian-assault',
      'skills/agility'
    ];
    const bgs: Record<string, string> = {};
    sliderServices.forEach(slug => {
      bgs[slug] = localStorage.getItem(`pop_bg_${slug}`) || '';
    });
    setPopularBgImages(bgs);
  }, []);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    localStorage.setItem('hero_stat1_num', stats.stat1Num);
    localStorage.setItem('hero_stat1_label', stats.stat1Label);
    localStorage.setItem('hero_stat2_num', stats.stat2Num);
    localStorage.setItem('hero_stat2_label', stats.stat2Label);
    localStorage.setItem('hero_stat3_num', stats.stat3Num);
    localStorage.setItem('hero_stat3_label', stats.stat3Label);
    localStorage.setItem('hero_stat4_text', stats.stat4Text);
    localStorage.setItem('hero_stat4_label', stats.stat4Label);
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-white">Global Configuration Settings</h1>
        <p className="text-sm text-surface-300">Set SEO tags, hero statistics, verify payment gateway webhooks, and publish site announcements.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold animate-scale-in">
          <Check size={16} />
          <span>Global site configurations successfully saved!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          {/* Branding Config */}
          <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4">
            <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Brand Information</h3>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <Input
                label="Site Name Title"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
              <Input
                label="Meta Description Tag"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <Button type="submit" loading={loading} variant="primary" className="w-full mt-2">
                Save Configurations
              </Button>
            </form>
          </GlassCard>

          {/* Gateways Config */}
          <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-6">
            <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Payment Integrations</h3>
            
            <div className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">Stripe Integration</span>
                  <span className="text-xs text-surface-450">{stripeConfigured ? 'Connected' : 'Offline'}</span>
                </div>
              </div>
              <button
                onClick={() => setStripeConfigured(!stripeConfigured)}
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  stripeConfigured
                    ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 shadow-glow-accent'
                    : 'bg-white/5 border border-white/5 hover:bg-white/10 text-white'
                }`}
              >
                {stripeConfigured ? 'Online' : 'Offline'}
              </button>
            </div>

            <p className="text-xs text-surface-450 leading-relaxed">
              Ensure Stripe, PayPal, and NOWPayments configuration webhooks are authorized. Review logs in developer console.
            </p>
          </GlassCard>

          {/* Feature Cards (Why Choose Us) Config */}
          <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4">
            <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Feature Cards (Why Choose Us)</h3>
            <p className="text-xs text-surface-400 mb-2">Edit icons (emojis), titles, and descriptions for the trust badges shown on the homepage.</p>
            
            <form onSubmit={handleSaveBadges} className="flex flex-col gap-6">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs font-bold text-primary-400">Card #{idx + 1}</span>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-1">
                      <Input
                        label="Icon"
                        value={badge.icon}
                        onChange={(e) => {
                          const updated = [...trustBadges];
                          updated[idx].icon = e.target.value;
                          setTrustBadges(updated);
                        }}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        label="Title"
                        value={badge.title}
                        onChange={(e) => {
                          const updated = [...trustBadges];
                          updated[idx].title = e.target.value;
                          setTrustBadges(updated);
                        }}
                      />
                    </div>
                  </div>
                  <Input
                    label="Description"
                    value={badge.desc}
                    onChange={(e) => {
                      const updated = [...trustBadges];
                      updated[idx].desc = e.target.value;
                      setTrustBadges(updated);
                    }}
                  />
                </div>
              ))}
              <Button type="submit" loading={savingBadges} variant="primary" className="w-full mt-2">
                Save Feature Cards
              </Button>
            </form>
          </GlassCard>

          {/* Hero Announcement Config */}
          <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-display font-bold text-lg text-white">Hero Announcement Banner</h3>
              <button
                type="button"
                onClick={() => setAnnouncement({ ...announcement, isActive: !announcement.isActive })}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  announcement.isActive
                    ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 shadow-glow-accent'
                    : 'bg-white/5 border border-white/5 hover:bg-white/10 text-white'
                }`}
              >
                {announcement.isActive ? 'Active' : 'Disabled'}
              </button>
            </div>
            
            <p className="text-xs text-surface-400 mb-2">Configure the notification alert banner displayed on the homepage Hero Section.</p>
            
            <form onSubmit={handleSaveAnnouncement} className="flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <Input
                    label="Badge"
                    value={announcement.badgeText}
                    onChange={(e) => setAnnouncement({ ...announcement, badgeText: e.target.value })}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    label="Announcement Title"
                    value={announcement.title}
                    onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                  />
                </div>
              </div>

              <Input
                label="Description Subtitle"
                value={announcement.description}
                onChange={(e) => setAnnouncement({ ...announcement, description: e.target.value })}
              />

              <div className="h-px bg-white/5 my-2" />
              <span className="text-xs font-bold text-primary-400">Action Button 1 (Live Chat Trigger)</span>
              <Input
                label="Button 1 Label"
                value={announcement.button1Text}
                onChange={(e) => setAnnouncement({ ...announcement, button1Text: e.target.value })}
              />

              <div className="h-px bg-white/5 my-2" />
              <span className="text-xs font-bold text-primary-400">Action Button 2 (Service Link)</span>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Button 2 Label"
                  value={announcement.button2Text}
                  onChange={(e) => setAnnouncement({ ...announcement, button2Text: e.target.value })}
                />
                <Input
                  label="Button 2 URL Link"
                  value={announcement.button2Url}
                  onChange={(e) => setAnnouncement({ ...announcement, button2Url: e.target.value })}
                />
              </div>

              <div className="h-px bg-white/5 my-2" />
              <span className="text-xs font-bold text-primary-400">Action Button 3 (Service Link)</span>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Button 3 Label"
                  value={announcement.button3Text}
                  onChange={(e) => setAnnouncement({ ...announcement, button3Text: e.target.value })}
                />
                <Input
                  label="Button 3 URL Link"
                  value={announcement.button3Url}
                  onChange={(e) => setAnnouncement({ ...announcement, button3Url: e.target.value })}
                />
              </div>

              <Button type="submit" loading={savingAnnouncement} variant="primary" className="w-full mt-2">
                Save Announcement Banner
              </Button>
            </form>
          </GlassCard>

          {/* Chat Settings Config */}
          <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4">
            <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Live Chat Configurations</h3>
            <p className="text-xs text-surface-400 mb-2">Edit the default automated greeting message sent to customers when they land on the website.</p>
            
            <form onSubmit={handleSaveWelcome} className="flex flex-col gap-4">
              <Input
                label="Greeting Welcome Message"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
              />
              <Button type="submit" loading={savingWelcome} variant="primary" className="w-full mt-2">
                Save Chat Settings
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* Hero Statistics Config */}
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4">
          <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Hero Statistics</h3>
          <p className="text-xs text-surface-400 mb-2">Configure the statistics shown on the main homepage banner.</p>
          <form onSubmit={handleUpdate} className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Stat 1 Number (e.g. 50000)"
                value={stats.stat1Num}
                onChange={(e) => setStats({...stats, stat1Num: e.target.value})}
              />
              <Input
                label="Stat 1 Label"
                value={stats.stat1Label}
                onChange={(e) => setStats({...stats, stat1Label: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Stat 2 Number (e.g. 12000)"
                value={stats.stat2Num}
                onChange={(e) => setStats({...stats, stat2Num: e.target.value})}
              />
              <Input
                label="Stat 2 Label"
                value={stats.stat2Label}
                onChange={(e) => setStats({...stats, stat2Label: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Stat 3 Number (e.g. 4.9)"
                value={stats.stat3Num}
                onChange={(e) => setStats({...stats, stat3Num: e.target.value})}
              />
              <Input
                label="Stat 3 Label"
                value={stats.stat3Label}
                onChange={(e) => setStats({...stats, stat3Label: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Stat 4 Text (e.g. 24/7)"
                value={stats.stat4Text}
                onChange={(e) => setStats({...stats, stat4Text: e.target.value})}
              />
              <Input
                label="Stat 4 Label"
                value={stats.stat4Label}
                onChange={(e) => setStats({...stats, stat4Label: e.target.value})}
              />
            </div>
            <Button type="submit" loading={loading} variant="primary" className="w-full mt-2">
              Save Statistics
            </Button>
          </form>
        </GlassCard>

        {/* Section Backgrounds Config */}
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-6">
          <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Section Backgrounds</h3>
          
          <div className="flex flex-col gap-6">
            {/* Hero Background Video */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-surface-400">Main Hero Section - Background Video</span>
              <div className="flex items-center gap-4">
                {heroVideoUrl ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-dark">
                    <video src={heroVideoUrl} className="w-full h-full object-cover" muted playsInline />
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem('hero_video_url');
                        setHeroVideoUrl('');
                        window.dispatchEvent(new Event('storage'));
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 1000);
                      }}
                      className="absolute top-0.5 right-0.5 bg-red-500/80 text-white rounded p-0.5 hover:bg-red-500"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-surface-400 shrink-0">
                    <ImageIcon size={20} />
                  </div>
                )}
                <div className="flex flex-col gap-2 w-full">
                  <span className="text-sm font-bold text-white">Hero Looping Video</span>
                  <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-lg text-xs border border-white/10 transition-colors text-center font-semibold max-w-[200px]">
                    Upload Video (MP4/WebM)
                    <input 
                      type="file" 
                      accept="video/mp4,video/webm" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            localStorage.setItem('hero_video_url', e.target?.result as string);
                            setHeroVideoUrl(e.target?.result as string);
                            window.dispatchEvent(new Event('storage'));
                            setSuccess(true);
                            setTimeout(() => setSuccess(false), 1000);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5 w-full" />

            {/* Popular Services Section BG */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-surface-400">Popular Services Section - Background Image</span>
              <div className="flex items-center gap-4">
                {popularSectionBg ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <img src={popularSectionBg} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem('popular_section_bg');
                        setPopularSectionBg('');
                        window.dispatchEvent(new Event('storage'));
                      }}
                      className="absolute top-0.5 right-0.5 bg-red-500/80 text-white rounded p-0.5 hover:bg-red-500"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-surface-400 shrink-0">
                    <ImageIcon size={20} />
                  </div>
                )}
                <div className="flex flex-col gap-2 w-full">
                  <span className="text-sm font-bold text-white">Popular Services Section BG</span>
                  <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-lg text-xs border border-white/10 transition-colors text-center font-semibold max-w-[200px]">
                    Upload Background
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            localStorage.setItem('popular_section_bg', e.target?.result as string);
                            setPopularSectionBg(e.target?.result as string);
                            window.dispatchEvent(new Event('storage'));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Popular Service Cards Config */}
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4">
          <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Popular Service Cards</h3>
          <p className="text-xs text-surface-400 mb-2">Upload images for the individual service cards on the homepage slider.</p>
          
          <div className="flex flex-col gap-4">
            {[
              { name: 'Strength Training', slug: 'skills/strength' },
              { name: 'Fire Cape', slug: 'minigames/pest-control' },
              { name: 'Song of the Elves', slug: 'quests/song-of-the-elves' },
              { name: 'Infernal Cape', slug: 'bossing/inferno' },
              { name: 'Fighter Torso', slug: 'minigames/barbarian-assault' },
              { name: 'Agility Training', slug: 'skills/agility' }
            ].map((srv) => (
              <div key={srv.slug} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                {popularBgImages[srv.slug] ? (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <img src={popularBgImages[srv.slug]} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem(`pop_bg_${srv.slug}`);
                        setPopularBgImages(prev => ({ ...prev, [srv.slug]: '' }));
                        window.dispatchEvent(new Event('storage'));
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 1000);
                      }}
                      className="absolute top-0.5 right-0.5 bg-red-500/80 text-white rounded p-0.5 hover:bg-red-500"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-surface-400 shrink-0">
                    <ImageIcon size={16} />
                  </div>
                )}
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-sm font-bold text-white">{srv.name}</span>
                  <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs border border-white/10 transition-colors text-center font-semibold w-fit">
                    Upload
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            localStorage.setItem(`pop_bg_${srv.slug}`, e.target?.result as string);
                            setPopularBgImages(prev => ({ ...prev, [srv.slug]: e.target?.result as string }));
                            window.dispatchEvent(new Event('storage'));
                            setSuccess(true);
                            setTimeout(() => setSuccess(false), 1000);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
