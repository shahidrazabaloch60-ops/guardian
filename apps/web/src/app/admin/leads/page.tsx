'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import { Briefcase, Mail } from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/chat/leads`)
      .then(res => res.json())
      .then(data => setLeads(data))
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-extrabold text-white flex items-center gap-3">
            <Briefcase className="text-primary-500" /> Sales Leads
          </h1>
          <p className="text-sm text-surface-300">View contact information automatically captured by the AI Assistant.</p>
        </div>
      </div>

      <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-surface-400">
                <th className="pb-3 pl-4">Lead ID</th>
                <th className="pb-3">Contact Info</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Visitor ID</th>
                <th className="pb-3">Captured At</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map(l => (
                <tr key={l.id} className="text-sm hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 pl-4 font-mono text-surface-200">#{l.id.slice(0,8)}</td>
                  <td className="py-4 font-medium text-white">{l.discord || l.email}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {l.discord && <Badge variant="info">Discord</Badge>}
                      {l.email && <Badge variant="warning">Email</Badge>}
                    </div>
                  </td>
                  <td className="py-4 font-mono text-surface-400">{l.visitorId?.slice(0,8)}</td>
                  <td className="py-4 text-surface-300">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="py-4">
                    <Badge variant={l.status === 'NEW' ? 'success' : 'default'}>{l.status}</Badge>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-surface-400">No leads captured yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
