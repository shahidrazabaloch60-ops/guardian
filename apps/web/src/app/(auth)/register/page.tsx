'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import Link from 'next/link';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import GlassCard from '../../../components/ui/GlassCard';
import { useAuth } from '../../../hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { setCredentials } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate Auth API Register
    setTimeout(() => {
      if (username && email && password) {
        setCredentials(
          {
            id: 'usr_2',
            email,
            username,
            role: 'CUSTOMER' as any,
            twoFactorEnabled: false,
            createdAt: new Date().toISOString(),
          },
          'mock_jwt_token',
          'mock_jwt_refresh_token'
        );
        router.push('/dashboard');
      } else {
        setError('Please fill in all registration fields.');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 flex flex-col gap-8 animate-fade-in">
      <div className="text-center flex flex-col gap-2">
        <h1 className="font-display text-3xl font-extrabold text-white">Create Your Account</h1>
        <p className="text-sm text-surface-300">Start configuring OSRS boosts and saving your progress.</p>
      </div>

      <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-8 shadow-glass flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Username"
            type="text"
            placeholder="OSRSLegend"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={User}
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
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
          />
          {error && <span className="text-xs text-red-400">{error}</span>}
          
          <Button type="submit" loading={loading} variant="primary" className="w-full mt-2 flex items-center gap-2">
            <UserPlus size={16} />
            <span>Create Free Account</span>
          </Button>
        </form>
      </GlassCard>

      <div className="text-center text-xs text-surface-450">
        <span>Already have an account? </span>
        <Link href="/login" className="text-primary-400 hover:underline font-semibold">Log In</Link>
      </div>
    </div>
  );
}
