'use client';

import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setMsg('');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-12 animate-fade-in">
      <div className="text-center flex flex-col gap-4">
        <span className="text-xs text-primary-400 uppercase tracking-widest font-bold">Get In Touch</span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">Contact Our Support</h1>
        <p className="text-surface-300 max-w-xl mx-auto">
          Need custom boosting quotes? Have ticket questions? Connect with our team 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="flex flex-col gap-6">
          <GlassCard hover={false} className="flex gap-4 p-6 bg-white/[0.01]">
            <div className="text-primary-400 text-2xl">📧</div>
            <div className="flex flex-col">
              <span className="text-xs text-surface-450 uppercase font-semibold">Email Us</span>
              <span className="text-sm font-bold text-white">support@guardianrs.com</span>
            </div>
          </GlassCard>

          <GlassCard hover={false} className="flex gap-4 p-6 bg-white/[0.01]">
            <div className="text-emerald-400 text-2xl">💬</div>
            <div className="flex flex-col">
              <span className="text-xs text-surface-450 uppercase font-semibold">Live Chat</span>
              <span className="text-sm font-bold text-white">Available 24/7 in chat bubble</span>
            </div>
          </GlassCard>

          <GlassCard hover={false} className="flex gap-4 p-6 bg-white/[0.01]">
            <div className="text-amber-400 text-2xl">🎮</div>
            <div className="flex flex-col">
              <span className="text-xs text-surface-450 uppercase font-semibold">Join Discord</span>
              <span className="text-sm font-bold text-white">discord.gg/guardianrs</span>
            </div>
          </GlassCard>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-8 shadow-glass">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-4 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="text-xl font-bold text-white">Message Sent</h4>
                <p className="text-sm text-surface-300">Thank you! Our support team will reach out via email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex flex-col gap-4">
                <Input
                  label="Your Name"
                  placeholder="OSRS Legend"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-surface-400">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    className="glass-input w-full p-4 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-surface-500 focus:outline-none focus:border-primary-500"
                    placeholder="How can we help with your RuneScape account?"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full mt-2 flex items-center gap-2">
                  <Send size={16} />
                  <span>Send Ticket</span>
                </Button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
