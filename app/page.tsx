'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { FragranceForm } from '@/components/FragranceForm';
import { ParticipantList } from '@/components/ParticipantList';
import { CostSummary } from '@/components/CostSummary';
import { ShareSummary } from '@/components/ShareSummary';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import {
  FragranceDetails,
  Participant,
  CostBreakdown,
  ValidationError,
  ParticipantSummary
} from '@/types';

import {
  calculateCostBreakdown,
  validateFragrance,
  validateParticipants,
  generateSplitSummary
} from '@/lib';

const defaultFragrance: FragranceDetails = {
  name: '',
  bottleSize: 0,
  bottlePrice: 0,
  shippingCost: 0,
  notes: '',
};

const defaultParticipant = (): Participant => ({
  id: crypto.randomUUID(),
  name: '',
  requestedMl: 0,
});

export default function HomePage() {
  const [fragrance, setFragrance] = useState<FragranceDetails>(defaultFragrance);
  const [participants, setParticipants] = useState<Participant[]>([defaultParticipant()]);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const [summaries, setSummaries] = useState<ParticipantSummary[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const fragErrors = validateFragrance(fragrance);
    const partErrors = validateParticipants(participants, fragrance.bottleSize || 0);
    const allErrors = [...fragErrors, ...partErrors];
    setErrors(allErrors);
    setCostBreakdown(calculateCostBreakdown(fragrance, participants));
  }, [fragrance, participants]);

  const handleGenerateSummary = async () => {
    setShowErrors(true);
    if (errors.length > 0) {
      toast.error('Please fix all errors before generating summary.');
      return;
    }
    if (!costBreakdown) return;
    setIsGenerating(true);
    setSummaries([]);
    try {
      const generatedSummaries = await generateSplitSummary(fragrance, participants, costBreakdown);
      setSummaries(generatedSummaries);
      toast.success('Summary generated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start a new split? All data will be lost.')) {
      setFragrance(defaultFragrance);
      setParticipants([defaultParticipant()]);
      setSummaries([]);
      setErrors([]);
      setShowErrors(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('Split reset successfully.');
    }
  };

  const hasErrors = errors.length > 0;
  const isOverAllocated = costBreakdown && costBreakdown.remainingMl < 0;

  return (
    <div className="min-h-screen bg-[#F7F7F8] pb-12 px-3 sm:px-6">
      <div className="mx-auto max-w-[1400px] pt-4 sm:pt-6">

        {/* ── UNIFIED DASHBOARD MASTER CONTAINER ────────────────────────── */}
        <div className="bg-slate-200/50 p-2.5 sm:p-4 rounded-[28px] sm:rounded-[32px] border border-slate-200/80 shadow-2xs space-y-3 sm:space-y-4">

          {/* ── HERO BENTO ROW ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">

            {/* Hero Card — Ultra Clean Luxury Product Banner */}
            <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xs border border-slate-200/70 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">

              {/* Left content */}
              <div className="flex flex-col justify-between flex-1 relative z-10 w-full">
                <div>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-none mb-2 sm:mb-3">
                    Split<span className="text-brand-500">Ledger</span>
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-sm max-w-lg leading-relaxed">
                    Calculate fair bottle costs, ml allocations, and generate instant WhatsApp share messages for your decant buyers.
                  </p>
                </div>

                <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full">
                  <Button
                    onClick={handleGenerateSummary}
                    disabled={hasErrors || isGenerating}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-xs transition-all"
                  >
                    {isGenerating ? 'Generating...' : 'Generate WhatsApp Messages'}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full sm:w-auto h-11 px-5 rounded-xl text-xs font-medium"
                  >
                    Reset Split
                  </Button>
                </div>
              </div>

              {/* Right product render (Desktop & Tablet only for clean mobile flow!) */}
              <div className="hidden sm:flex shrink-0 items-center justify-center relative">
                <div className="w-48 sm:w-56 h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-tr from-brand-50/80 via-purple-50/40 to-white p-2 border border-slate-100 flex items-center justify-center shadow-2xs">
                  <img
                    src="/hero_perfume.png"
                    alt="Luxury Fragrance Render"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>

            </div>

            {/* Stats Mini-Cards — Clean Frosted Cards without Icon Chips */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3 sm:gap-4">
              
              {/* Stat 1: Cost per ml */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-3.5 shadow-2xs border border-slate-200/70 flex flex-col justify-end min-h-[120px] sm:min-h-[140px] group">
                <img
                  src="/stat_cost.png"
                  alt="Cost Per ML Render"
                  className="absolute inset-0 w-full h-full object-cover blur-[1.5px] scale-105 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2.5px]" />

                <div className="relative z-10 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black/35 backdrop-blur-md border border-white/10">
                  <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium mb-0.5 uppercase tracking-wider">Cost / ml</p>
                  <p className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-xs">
                    {costBreakdown ? `$${costBreakdown.costPerMl.toFixed(2)}` : '—'}
                  </p>
                </div>
              </div>

              {/* Stat 2: Total cost */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-3.5 shadow-2xs border border-purple-900/50 flex flex-col justify-end min-h-[120px] sm:min-h-[140px] group">
                <img
                  src="/stat_total.png"
                  alt="Total Cost Render"
                  className="absolute inset-0 w-full h-full object-cover blur-[1.5px] scale-105 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-purple-950/60 backdrop-blur-[2.5px]" />

                <div className="relative z-10 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-purple-950/45 backdrop-blur-md border border-white/10">
                  <p className="text-[10px] sm:text-[11px] text-purple-200 font-medium mb-0.5 uppercase tracking-wider">Total Cost</p>
                  <p className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-xs">
                    {costBreakdown ? `$${costBreakdown.totalCost.toFixed(2)}` : '—'}
                  </p>
                </div>
              </div>

              {/* Stat 3: Participants */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-3.5 shadow-2xs border border-slate-200/70 flex flex-col justify-end min-h-[120px] sm:min-h-[140px] group">
                <img
                  src="/stat_participants.png"
                  alt="Participants Render"
                  className="absolute inset-0 w-full h-full object-cover blur-[1.5px] scale-105 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2.5px]" />

                <div className="relative z-10 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black/35 backdrop-blur-md border border-white/10">
                  <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium mb-0.5 uppercase tracking-wider">Participants</p>
                  <p className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-xs">
                    {participants.filter(p => p.name).length || participants.length}
                  </p>
                </div>
              </div>

              {/* Stat 4: Remaining */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-3.5 shadow-2xs border border-slate-200/70 flex flex-col justify-end min-h-[120px] sm:min-h-[140px] group">
                <img
                  src="/stat_remaining.png"
                  alt="Remaining ML Render"
                  className="absolute inset-0 w-full h-full object-cover blur-[1.5px] scale-105 group-hover:scale-110 transition-transform duration-500"
                />
                <div className={cn(
                  "absolute inset-0 backdrop-blur-[2.5px] transition-colors",
                  isOverAllocated
                    ? "bg-rose-950/60"
                    : "bg-emerald-950/60"
                )} />

                <div className="relative z-10 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black/35 backdrop-blur-md border border-white/10">
                  <p className="text-[10px] sm:text-[11px] text-slate-200 font-medium mb-0.5 uppercase tracking-wider">Remaining</p>
                  <p className={cn("text-xl sm:text-2xl font-bold tracking-tight drop-shadow-xs", isOverAllocated ? "text-rose-300" : "text-emerald-300")}>
                    {costBreakdown ? `${costBreakdown.remainingMl}ml` : '—'}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ── MAIN CONTENT BENTO ROW ───────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">

            {/* Left column: form inputs */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <FragranceForm
                fragrance={fragrance}
                onChange={setFragrance}
                errors={errors}
                showErrors={showErrors}
              />
              <ParticipantList
                participants={participants}
                onChange={setParticipants}
                errors={errors}
                showErrors={showErrors}
              />
            </div>

            {/* Right column: cost summary + share summaries */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-4 lg:sticky lg:top-[84px]">
              {costBreakdown && (
                <CostSummary
                  fragrance={fragrance}
                  breakdown={costBreakdown}
                />
              )}

              <ShareSummary
                summaries={summaries}
                isGenerating={isGenerating}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
