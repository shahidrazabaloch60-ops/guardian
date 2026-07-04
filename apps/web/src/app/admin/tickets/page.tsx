'use client';

import React, { useState } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';

interface TicketItem {
  id: string;
  subject: string;
  user: string;
  status: string;
  department: string;
  date: string;
  replyHistory: string[];
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([
    {
      id: 'tkt_1',
      subject: 'Change VPN location to USA',
      user: 'Al***x',
      status: 'OPEN',
      department: 'Skilling Support',
      date: 'June 25, 2026',
      replyHistory: ['User requested VPN adjustment matching California location.'],
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleRespondClick = (ticket: TicketItem) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText) return;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: 'RESOLVED',
              replyHistory: [...t.replyHistory, `Admin reply: ${replyText}`],
            }
          : t
      )
    );
    setReplyText('');
    setModalOpen(false);
    setSelectedTicket(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-white">Help Desk Support Tickets</h1>
        <p className="text-sm text-surface-300">Overview, reply, and close active customer support queries.</p>
      </div>

      <div className="flex flex-col gap-4">
        {tickets.map((tkt) => (
          <GlassCard key={tkt.id} hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-base">{tkt.subject}</span>
                <Badge variant={tkt.status === 'RESOLVED' ? 'success' : 'warning'} size="sm">
                  {tkt.status}
                </Badge>
              </div>
              <span className="text-xs text-surface-450">
                Ticket ID: {tkt.id} • Buyer: {tkt.user} • Dept: {tkt.department} • Date: {tkt.date}
              </span>
            </div>

            <Button onClick={() => handleRespondClick(tkt)} variant="secondary" size="sm" className="self-end sm:self-auto">
              Respond to Ticket
            </Button>
          </GlassCard>
        ))}
      </div>

      {/* Reply Ticket Modal */}
      {selectedTicket && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Respond: ${selectedTicket.subject}`}>
          <form onSubmit={handleSendReply} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 max-h-48 overflow-y-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-surface-450">History logs:</span>
              {selectedTicket.replyHistory.map((h, i) => (
                <p key={i} className="text-xs text-surface-300 border-l border-primary-500 pl-3 py-1">
                  {h}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-surface-400">Admin Response</label>
              <textarea
                rows={3}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="glass-input w-full p-4 rounded-xl text-sm bg-white/5 border border-white/10 text-white focus:outline-none"
                placeholder="Type your response to send to user..."
              />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2">
              Send Reply & Resolve Ticket
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
