'use client';

import React, { useState } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Mail, Lock, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export default function DashboardSettingsPage() {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // 2FA Mock state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    setTimeout(() => {
      updateUser({ username, email });
      setLoadingProfile(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-white">Profile Settings</h1>
        <p className="text-sm text-surface-300">Update account preferences and enable 2-Factor Authentication security shields.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Details */}
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4">
          <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Personal Details</h3>
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
            />
            <Button type="submit" loading={loadingProfile} variant="primary" className="w-full mt-2">
              Update Profile Details
            </Button>
          </form>
        </GlassCard>

        {/* 2-Factor Auth */}
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-6">
          <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-4">Account Security</h3>
          
          <div className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">2-Factor Authentication</span>
                <span className="text-xs text-surface-400">Protects dashboard logins</span>
              </div>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                twoFactorEnabled
                  ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 shadow-glow-accent'
                  : 'bg-white/5 border border-white/5 hover:bg-white/10 text-white'
              }`}
            >
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <p className="text-xs text-surface-450 leading-relaxed">
            Enable 2-Factor Authentication to shield your OSRS credentials, screenshots, and billing records from unauthorized dashboard accesses.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
