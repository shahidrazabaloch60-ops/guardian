'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, LogIn, Chrome } from 'lucide-react';
import Link from 'next/link';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import GlassCard from '../../../components/ui/GlassCard';
import { useAuth } from '../../../hooks/useAuth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { setCredentials } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate Auth API Login
    setTimeout(() => {
      if (email && password) {
        setCredentials(
          {
            id: email === 'admin@guardianrs.com' ? 'usr_admin' : 'usr_1',
            email,
            username: email.split('@')[0],
            role: email === 'admin@guardianrs.com' ? ('ADMIN' as any) : ('CUSTOMER' as any),
            twoFactorEnabled: false,
            createdAt: new Date().toISOString(),
          },
          'mock_jwt_token',
          'mock_jwt_refresh_token'
        );
        router.push(email === 'admin@guardianrs.com' ? '/admin' : redirect);
      } else {
        setError('Please fill in all credentials.');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 flex flex-col gap-8 animate-fade-in">
      <div className="text-center flex flex-col gap-2">
        <h1 className="font-display text-3xl font-extrabold text-white">Log Into Your Account</h1>
        <p className="text-sm text-surface-300">Welcome back! Manage your active order boosts easily.</p>
      </div>

      <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-8 shadow-glass flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
          />
          {error && <span className="text-xs text-red-400">{error}</span>}
          
          <Button type="submit" loading={loading} variant="primary" className="w-full mt-2 flex items-center gap-2">
            <LogIn size={16} />
            <span>Login to Dashboard</span>
          </Button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-xs text-surface-450 uppercase font-semibold">Or Connect With</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => {
              // Simulate social login redirect
              setCredentials(
                { id: 'usr_oauth', email: 'googleuser@gmail.com', username: 'GoogleGamer', role: 'CUSTOMER' as any, twoFactorEnabled: false, createdAt: new Date().toISOString() },
                'mock_oauth_token',
                'mock_oauth_refresh_token'
              );
              router.push(redirect);
            }}
            variant="secondary"
            className="flex items-center justify-center gap-2 text-xs"
          >
            <Chrome size={16} />
            <span>Google</span>
          </Button>
          <Button
            onClick={() => {
              setCredentials(
                { id: 'usr_discord', email: 'discorduser@discord.com', username: 'DiscordGamer', role: 'CUSTOMER' as any, twoFactorEnabled: false, createdAt: new Date().toISOString() },
                'mock_oauth_token',
                'mock_oauth_refresh_token'
              );
              router.push(redirect);
            }}
            variant="secondary"
            className="flex items-center justify-center gap-2 text-xs"
          >
            <span>🎮 Discord</span>
          </Button>
        </div>
      </GlassCard>

      <div className="text-center text-xs text-surface-450">
        <span>Don't have an account? </span>
        <Link href="/register" className="text-primary-400 hover:underline font-semibold">Register Free</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-6 py-20 flex justify-center text-white text-sm">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
