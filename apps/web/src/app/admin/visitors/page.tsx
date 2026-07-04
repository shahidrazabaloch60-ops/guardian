'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import { Users, Globe, Smartphone, Clock } from 'lucide-react';

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/chat/visitors`)
      .then(res => res.json())
      .then(data => setVisitors(data))
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-extrabold text-white flex items-center gap-3">
            <Users className="text-primary-500" /> Active Visitors
          </h1>
          <p className="text-sm text-surface-300">Track and monitor users currently browsing GuardianRS.</p>
        </div>
      </div>

      <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-surface-400">
                <th className="pb-3 pl-4">Visitor ID</th>
                <th className="pb-3">Location / IP</th>
                <th className="pb-3">Device / Browser</th>
                <th className="pb-3">Current Page</th>
                <th className="pb-3">Time Active</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visitors.map(v => (
                <tr key={v.id} className="text-sm hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 pl-4 font-mono text-surface-200">#{v.id.slice(0,8)}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-surface-400" />
                      <span>{v.country || 'Unknown'} / {v.ipAddress || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Smartphone size={14} className="text-surface-400" />
                      <span>{v.os} / {v.browser}</span>
                    </div>
                  </td>
                  <td className="py-4 text-primary-400">{v.currentPage}</td>
                  <td className="py-4 text-surface-300">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {new Date(v.updatedAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="py-4"><Badge variant="success">Online</Badge></td>
                </tr>
              ))}
              {visitors.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-surface-400">No active visitors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
