import React from 'react';
import { Card } from '@/components/ui';
import { CostBreakdown, FragranceDetails } from '@/types';
import { cn } from '@/lib/utils';
import { PieChart } from 'lucide-react';

interface CostSummaryProps {
  fragrance: FragranceDetails;
  breakdown: CostBreakdown;
}

export function CostSummary({ fragrance, breakdown }: CostSummaryProps) {
  const isOverAllocated = breakdown.remainingMl < 0;

  return (
    <Card className="p-6 md:p-7 overflow-hidden relative">
      {/* Subtle decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 text-brand-500 rounded-xl">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Cost Breakdown</h2>
              <p className="text-xs text-slate-500 mt-0.5">Live split calculation.</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">per ml</p>
            <p className="text-xl font-bold text-brand-500 tracking-tight">
              ${breakdown.costPerMl.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-xs font-medium text-slate-500 mb-1">Total Cost</p>
            <p className="text-sm font-semibold text-slate-900">${breakdown.totalCost.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-xs font-medium text-slate-500 mb-1">Bottle Size</p>
            <p className="text-sm font-semibold text-slate-900">{fragrance.bottleSize || 0}ml</p>
          </div>
          <div className={cn(
            'p-3 rounded-2xl border text-center',
            isOverAllocated ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-100'
          )}>
            <p className={cn("text-xs font-medium mb-1", isOverAllocated ? "text-rose-500" : "text-emerald-600")}>
              Remaining
            </p>
            <p className={cn("text-sm font-semibold", isOverAllocated ? "text-rose-600" : "text-emerald-700")}>
              {breakdown.remainingMl}ml
            </p>
          </div>
        </div>

        {/* Participant shares */}
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2.5">
            Participant Shares
          </p>
          {breakdown.participantCosts.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No participants added yet.</p>
          ) : (
            <ul className="space-y-2">
              {breakdown.participantCosts.map((pc, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-brand-500 text-white text-xs font-medium flex items-center justify-center">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-slate-800">
                      {pc.participant.name || 'Unnamed'}
                    </span>
                    <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full font-medium">
                      {pc.participant.requestedMl}ml
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    ${pc.cost.toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}
