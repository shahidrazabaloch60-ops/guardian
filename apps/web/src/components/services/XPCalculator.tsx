'use client';

import React, { useState, useEffect } from 'react';
import { calculateXP, calculateLevelFromXP } from '../../lib/utils';
import Input from '../ui/Input';
import GlassCard from '../ui/GlassCard';

interface XPCalculatorProps {
  basePrice: number;
  onPriceChange: (totalPrice: number, currentLvl: number, targetLvl: number) => void;
}

export default function XPCalculator({ basePrice, onPriceChange }: XPCalculatorProps) {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [targetLevel, setTargetLevel] = useState<number>(99);
  const [currentXP, setCurrentXP] = useState<number>(0);
  const [targetXP, setTargetXP] = useState<number>(13034431);

  // Sync levels with XP updates
  useEffect(() => {
    const calculatedXP = calculateXP(currentLevel);
    if (calculatedXP !== currentXP) {
      setCurrentXP(calculatedXP);
    }
  }, [currentLevel]);

  useEffect(() => {
    const calculatedXP = calculateXP(targetLevel);
    if (calculatedXP !== targetXP) {
      setTargetXP(calculatedXP);
    }
  }, [targetLevel]);

  // Handle XP differences and call price change
  useEffect(() => {
    const lvlDiff = Math.max(0, targetLevel - currentLevel);
    const calculatedPrice = lvlDiff * basePrice;
    onPriceChange(calculatedPrice, currentLevel, targetLevel);
  }, [currentLevel, targetLevel, basePrice]);

  return (
    <GlassCard hover={false} className="border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-6">
      <h3 className="font-display font-bold text-lg text-white">OSRS XP & Level Calculator</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current State */}
        <div className="flex flex-col gap-4">
          <Input
            label="Current Level"
            type="number"
            min={1}
            max={99}
            value={currentLevel}
            onChange={(e) => setCurrentLevel(Math.min(99, Math.max(1, parseInt(e.target.value) || 1)))}
          />
          <div className="flex justify-between text-xs text-surface-450 uppercase font-semibold">
            <span>XP equivalent:</span>
            <span className="text-white font-mono">{currentXP.toLocaleString()} XP</span>
          </div>
        </div>

        {/* Target State */}
        <div className="flex flex-col gap-4">
          <Input
            label="Target Level"
            type="number"
            min={1}
            max={99}
            value={targetLevel}
            onChange={(e) => setTargetLevel(Math.min(99, Math.max(1, parseInt(e.target.value) || 1)))}
          />
          <div className="flex justify-between text-xs text-surface-450 uppercase font-semibold">
            <span>XP equivalent:</span>
            <span className="text-white font-mono">{targetXP.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex justify-between items-center text-sm font-semibold">
        <span className="text-surface-300">Total Levels Needed:</span>
        <span className="text-indigo-400 font-display text-lg">
          {Math.max(0, targetLevel - currentLevel)} Levels
        </span>
      </div>
      <div className="flex justify-between items-center text-sm font-semibold">
        <span className="text-surface-300">Total XP Needed:</span>
        <span className="text-emerald-450 font-mono text-base">
          {Math.max(0, targetXP - currentXP).toLocaleString()} XP
        </span>
      </div>
    </GlassCard>
  );
}
