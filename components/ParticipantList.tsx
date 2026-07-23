'use client';

import React from 'react';
import { Card, Button } from '@/components/ui';
import { Participant, ValidationError } from '@/types';
import { Plus, Trash2, Users, AlertCircle } from 'lucide-react';

interface ParticipantListProps {
  participants: Participant[];
  onChange: (participants: Participant[]) => void;
  errors: ValidationError[];
  showErrors?: boolean;
}

export function ParticipantList({ participants, onChange, errors, showErrors = false }: ParticipantListProps) {
  const getError = (field: string) => showErrors ? errors.find((e) => e.field === field)?.message : undefined;

  const handleAdd = () => {
    onChange([...participants, { id: crypto.randomUUID(), name: '', requestedMl: 0 }]);
  };

  const handleRemove = (id: string) => {
    if (participants.length > 1) onChange(participants.filter((p) => p.id !== id));
  };

  const handleChange = (id: string, field: keyof Participant, value: string | number) => {
    onChange(participants.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const allocationError = getError('allocation');
  const emptyError = getError('participants');

  return (
    <Card className="p-6 md:p-7">
      {/* Header */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-50 text-brand-500 rounded-xl">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Participants</h2>
            <p className="text-xs text-slate-500 mt-0.5">{participants.length} person{participants.length !== 1 ? 's' : ''} sharing this split.</p>
          </div>
        </div>
        <Button
          onClick={handleAdd}
          size="sm"
          variant="secondary"
          className="w-full sm:w-auto rounded-xl text-xs font-semibold h-8 px-4"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Person
        </Button>
      </div>

      {/* Error banners */}
      {emptyError && (
        <div className="mb-3 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {emptyError}
        </div>
      )}
      {allocationError && (
        <div className="mb-3 flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {allocationError}
        </div>
      )}

      {/* ── Compact data table ── */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50">
        {/* Table header */}
        <div className="grid grid-cols-[36px_1fr_120px_40px] gap-2 bg-slate-100/70 border-b border-slate-200/80 px-3 py-2.5">
          <span className="text-xs font-medium text-slate-500 text-center">#</span>
          <span className="text-xs font-medium text-slate-500">Name</span>
          <span className="text-xs font-medium text-slate-500">Qty (ml)</span>
          <span className="text-xs font-medium text-slate-500"></span>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-slate-100 bg-white">
          {participants.map((p, index) => {
            const nameError = getError(`participant-${p.id}-name`);
            const mlError = getError(`participant-${p.id}-ml`);

            return (
              <div
                key={p.id}
                className="grid grid-cols-[36px_1fr_120px_40px] gap-2 items-center px-3 py-2 hover:bg-slate-50/80 transition-colors group"
              >
                {/* Index */}
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-brand-500 text-white text-xs font-medium mx-auto">
                  {index + 1}
                </div>

                {/* Name Input with default visible border */}
                <div className="pr-1">
                  <input
                    type="text"
                    placeholder="Participant name"
                    value={p.name}
                    onChange={(e) => handleChange(p.id, 'name', e.target.value)}
                    className={`w-full h-9 px-3 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 bg-white border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                      nameError
                        ? 'border-rose-300 bg-rose-50/50'
                        : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  />
                  {nameError && (
                    <p className="text-[10px] text-rose-500 mt-0.5 ml-1">{nameError}</p>
                  )}
                </div>

                {/* Qty Input with default visible border */}
                <div className="pr-1">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="0"
                    value={p.requestedMl || ''}
                    onChange={(e) => handleChange(p.id, 'requestedMl', parseFloat(e.target.value) || 0)}
                    className={`w-full h-9 px-3 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 bg-white border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                      mlError
                        ? 'border-rose-300 bg-rose-50/50'
                        : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  />
                  {mlError && (
                    <p className="text-[10px] text-rose-500 mt-0.5 ml-1">{mlError}</p>
                  )}
                </div>

                {/* Delete */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleRemove(p.id)}
                    disabled={participants.length === 1}
                    aria-label="Remove participant"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
