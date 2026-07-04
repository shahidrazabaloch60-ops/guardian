'use client';

import React from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

export default function AdminStaffPage() {
  const mockStaffList = [
    { id: 'stf_1', name: 'Booster_Steve', activeJobs: 1, totalCompletions: 12, rating: '4.95' },
    { id: 'stf_2', name: 'Booster_Dave', activeJobs: 0, totalCompletions: 8, rating: '4.85' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-white">Booster Staff Directory</h1>
        <p className="text-sm text-surface-300">Overview booster completion metrics, active workloads, and rating feedback stats.</p>
      </div>

      <div className="flex flex-col gap-4">
        {mockStaffList.map((stf) => (
          <GlassCard key={stf.id} hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-white text-lg">{stf.name}</span>
              <span className="text-xs text-surface-450">
                Staff ID: {stf.id} • Rating: ⭐ {stf.rating} • Completed: {stf.totalCompletions} jobs
              </span>
            </div>

            <div className="flex items-center gap-6 self-end sm:self-auto">
              <Badge variant="info">Jobs: {stf.activeJobs} Active</Badge>
              <Button variant="secondary" size="sm">
                View Performance
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
