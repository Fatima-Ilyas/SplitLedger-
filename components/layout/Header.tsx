'use client';

import React from 'react';
import { Github, Star } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#F7F7F8]/90 backdrop-blur-md border-b border-slate-200/60">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-2xs border border-slate-200/80 shrink-0 bg-white flex items-center justify-center">
              <img
                src="/logo.png"
                alt="SplitLedger Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              Split<span className="text-brand-500">Ledger</span>
            </span>
          </div>

          {/* Center label */}
          <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200/80 rounded-full px-3.5 py-1.5 shadow-2xs">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-600 font-medium">Fragrance Split Calculator</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Fatima-Ilyas/SplitLedger-"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-xs font-medium shadow-2xs"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <div className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-brand-500" />
              MVP
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
