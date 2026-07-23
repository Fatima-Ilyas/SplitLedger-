'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button } from '@/components/ui';
import { Copy, Sparkles, CheckCircle2, MessageSquare, User, CopyCheck } from 'lucide-react';
import { toast } from 'sonner';
import { ParticipantSummary } from '@/types';

interface ShareSummaryProps {
  summaries: ParticipantSummary[];
  isGenerating?: boolean;
}

export function ShareSummary({ summaries, isGenerating = false }: ShareSummaryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Set default selected participant when summaries load
  useEffect(() => {
    if (summaries && summaries.length > 0) {
      if (!selectedId || !summaries.some(s => s.participantId === selectedId)) {
        setSelectedId(summaries[0].participantId);
      }
    } else {
      setSelectedId(null);
    }
  }, [summaries, selectedId]);

  const activeSummary = summaries?.find((s) => s.participantId === selectedId) || summaries?.[0];

  const handleCopySingle = async (summary: ParticipantSummary) => {
    try {
      await navigator.clipboard.writeText(summary.text);
      setCopiedId(summary.participantId);
      toast.success(`Copied message for ${summary.name}!`, {
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy text.');
    }
  };

  const handleCopyAll = async () => {
    if (!summaries || summaries.length === 0) return;
    try {
      const combinedText = summaries
        .map((s) => `--- ${s.name} ---\n${s.text}`)
        .join('\n\n====================\n\n');
      await navigator.clipboard.writeText(combinedText);
      setCopiedAll(true);
      toast.success('Copied all participant messages!', {
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      });
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy all: ', err);
      toast.error('Failed to copy all text.');
    }
  };

  const hasSummaries = summaries && summaries.length > 0;

  return (
    <Card className="p-6 md:p-7 overflow-hidden relative">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50/60 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10">
        {/* Header with Title & Copy All button */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4 gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 text-brand-500 rounded-xl">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">WhatsApp Messages</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {hasSummaries
                  ? `Select a person to view & copy their message`
                  : 'AI-generated personalized messages'}
              </p>
            </div>
          </div>

          {hasSummaries && (
            <Button
              onClick={handleCopyAll}
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shrink-0 font-medium"
            >
              {copiedAll ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  Copied All!
                </>
              ) : (
                <>
                  <CopyCheck className="w-3.5 h-3.5 mr-1 text-brand-500" />
                  Copy All
                </>
              )}
            </Button>
          )}
        </div>

        {/* Content Section */}
        {isGenerating ? (
          <div className="min-h-[220px] flex flex-col items-center justify-center py-10 gap-3 bg-brand-50/50 rounded-2xl border border-brand-100">
            <Sparkles className="w-6 h-6 animate-pulse text-brand-500" />
            <div className="text-center">
              <p className="text-sm font-semibold text-brand-700 animate-pulse">Generating personalized messages...</p>
              <p className="text-xs text-brand-500 mt-1">Gemini is crafting custom WhatsApp texts</p>
            </div>
          </div>
        ) : hasSummaries && activeSummary ? (
          <div className="flex flex-col gap-3">
            {/* Participant Pill Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {summaries.map((s) => {
                const isSelected = s.participantId === activeSummary.participantId;
                return (
                  <button
                    key={s.participantId}
                    onClick={() => setSelectedId(s.participantId)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    <User className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span>{s.name || 'Unnamed'}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Message Preview Card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden flex flex-col">
              {/* Tab Card Action Header */}
              <div className="flex justify-between items-center px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-slate-800">
                    Message for {activeSummary.name || 'Participant'}
                  </span>
                </div>
                <Button
                  onClick={() => handleCopySingle(activeSummary)}
                  variant="primary"
                  size="sm"
                  className="h-7 px-3 text-xs rounded-lg font-medium bg-brand-500 hover:bg-brand-600 text-white"
                >
                  {copiedId === activeSummary.participantId ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-white" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Copy Message
                    </>
                  )}
                </Button>
              </div>

              {/* Text content */}
              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed p-4 bg-white select-all">
                {activeSummary.text}
              </pre>
            </div>
          </div>
        ) : (
          <div className="min-h-[180px] flex flex-col items-center justify-center py-10 gap-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500">No messages generated yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Click &quot;Generate WhatsApp Messages&quot; above to create custom texts
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
