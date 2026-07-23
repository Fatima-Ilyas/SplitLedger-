import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'SplitLedger — Fragrance Decant & Split Cost Calculator',
  description:
    'A clean, fair calculator for fragrance decant split hosts to divide bottle costs among buyers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-[#EEEEF0] text-slate-900 font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Toaster theme="light" position="bottom-right" />
      </body>
    </html>
  );
}
