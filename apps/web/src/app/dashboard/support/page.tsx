'use client';

import React, { useState } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import { MessageSquare, Plus } from 'lucide-react';

export default function DashboardSupportPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [dept, setDept] = useState('billing');
  const [msg, setMsg] = useState('');

  const mockTickets = [
    { id: 'tkt_1', subject: 'Change VPN location to USA', status: 'RESOLVED', department: 'Skilling Support', date: 'June 25, 2026' },
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(false);
    setSubject('');
    setMsg('');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="font-display text-3xl font-extrabold text-white">Support Tickets</h1>
          <p className="text-sm text-surface-300">Open new help desk tickets or view active conversations.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} variant="primary" size="sm" className="flex items-center gap-2">
          <Plus size={16} />
          <span>New Ticket</span>
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {mockTickets.length > 0 ? (
          mockTickets.map((tkt) => (
            <GlassCard key={tkt.id} hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-base">{tkt.subject}</span>
                  <Badge variant="success" size="sm">
                    {tkt.status}
                  </Badge>
                </div>
                <span className="text-xs text-surface-450">
                  Ticket ID: {tkt.id} • Dept: {tkt.department} • Last update: {tkt.date}
                </span>
              </div>
              <Button variant="secondary" size="sm" className="self-end sm:self-auto">
                Open Chat
              </Button>
            </GlassCard>
          ))
        ) : (
          <GlassCard hover={false} className="p-8 text-center flex flex-col items-center gap-3">
            <MessageSquare className="w-12 h-12 text-surface-500" />
            <h3 className="font-bold text-white">No Tickets Found</h3>
            <p className="text-sm text-surface-400">If you have any questions, feel free to open a ticket above.</p>
          </GlassCard>
        )}
      </div>

      {/* Create Ticket Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Open Support Ticket">
        <form onSubmit={handleCreateTicket} className="flex flex-col gap-4">
          <Input
            label="Subject"
            placeholder="e.g. Change scheduled play hours"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-surface-400">Select Department</label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="glass-input px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white focus:outline-none"
            >
              <option value="billing">Billing & Checkout Support</option>
              <option value="skills">Skilling Boost assistance</option>
              <option value="pvm">Combat / Bossing assistance</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-surface-400">Detailed Message</label>
            <textarea
              rows={4}
              required
              className="glass-input w-full p-4 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-surface-500 focus:outline-none focus:border-primary-500"
              placeholder="Describe your request in detail..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full mt-2">
            Submit Support Request
          </Button>
        </form>
      </Modal>
    </div>
  );
}
