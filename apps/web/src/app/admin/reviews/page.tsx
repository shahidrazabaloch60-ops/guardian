'use client';

import React, { useState } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service: string;
  status: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    { id: 'rev_1', name: 'XpWaste99', rating: 5, comment: 'Ordered 70-99 Runecrafting, and the booster finished it 2 days earlier. VPN used successfully.', service: 'Runecrafting Leveling', status: 'PENDING' },
  ]);

  const handleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
    );
  };

  const handleRemove = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-white">Review Moderation Center</h1>
        <p className="text-sm text-surface-300">Moderate and approve client feedback before homepage publishing.</p>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <GlassCard key={rev.id} hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-white text-base">{rev.name}</span>
                  <span className="text-xs text-primary-400">Service: {rev.service} • Rating: ⭐ {rev.rating}/5</span>
                </div>
                <Badge variant={rev.status === 'APPROVED' ? 'success' : 'warning'} size="sm">
                  {rev.status}
                </Badge>
              </div>
              <p className="text-sm text-surface-300 italic">"{rev.comment}"</p>
              
              <div className="flex gap-2 justify-end mt-2">
                {rev.status === 'PENDING' && (
                  <Button onClick={() => handleApprove(rev.id)} variant="primary" size="sm">
                    Approve Review
                  </Button>
                )}
                <Button onClick={() => handleRemove(rev.id)} variant="secondary" size="sm" className="text-red-400 hover:text-red-300">
                  Remove Review
                </Button>
              </div>
            </GlassCard>
          ))
        ) : (
          <GlassCard hover={false} className="p-8 text-center text-surface-450">
            No active feedback review backlog.
          </GlassCard>
        )}
      </div>
    </div>
  );
}
