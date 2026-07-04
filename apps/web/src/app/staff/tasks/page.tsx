'use client';

import React, { useState } from 'react';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Camera, RefreshCw } from 'lucide-react';

export default function StaffTasksPage() {
  const [currentLevel, setCurrentLevel] = useState(83);
  const [completed, setCompleted] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentLevel >= 99) {
      setCompleted(true);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-extrabold text-white">Active Assignments</h1>
        <p className="text-sm text-surface-300">Update levels, logs, screenshots, and complete jobs.</p>
      </div>

      <div className="flex flex-col gap-6">
        <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-8 shadow-glass flex flex-col gap-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-display font-bold text-xl text-white">70-99 Strength Training</h3>
              <span className="text-xs text-surface-450">Task ID: job_strength_99 • Account: IRONMAN</span>
            </div>
            <Badge variant={completed ? 'success' : 'info'}>{completed ? 'Completed' : 'Active'}</Badge>
          </div>

          {/* Form updater */}
          <form onSubmit={handleUpdate} className="flex flex-col sm:flex-row gap-4 items-end max-w-md pt-4 border-t border-white/5">
            <Input
              label="Update Current Level"
              type="number"
              min={70}
              max={99}
              value={currentLevel}
              onChange={(e) => setCurrentLevel(Math.min(99, Math.max(70, parseInt(e.target.value) || 70)))}
            />
            <Button type="submit" variant="primary" className="whitespace-nowrap flex items-center gap-2 h-[46px]">
              <RefreshCw size={16} />
              <span>Update Progress</span>
            </Button>
          </form>

          {/* Screenshot upload simulation */}
          <div className="flex flex-col gap-3">
            <span className="text-xs text-surface-400 uppercase font-semibold">Upload Progress Photo (Screenshots)</span>
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.01] hover:bg-white/[0.02] cursor-pointer transition-all">
              <div className="flex flex-col items-center text-center gap-2">
                <Camera className="w-10 h-10 text-surface-500" />
                <span className="text-sm font-bold text-white">Drag & drop or Click to upload</span>
                <span className="text-xs text-surface-450">PNG, JPG up to 10MB</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
