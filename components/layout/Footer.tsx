import React from 'react';
import { Container } from './Container';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
      <Container size="md">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p>© {new Date().getFullYear()} SplitLedger — Fragrance Decant Cost Splitter</p>
          <p className="text-slate-600">Built with Next.js & Tailwind CSS</p>
        </div>
      </Container>
    </footer>
  );
};
