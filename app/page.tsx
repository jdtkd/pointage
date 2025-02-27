'use client';

import { ClockModule } from '@/apps/clock';
import { TimeClockModule } from '@/apps/time-clock';
import { DashboardModule } from '@/apps/dashboard';
import { HistoryModule } from '@/apps/history';

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-safe-area">
      <ClockModule />

      <div className="container mx-auto px-4 py-20 md:py-24 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <TimeClockModule />
          <DashboardModule />
        </div>

        <section>
          <HistoryModule />
        </section>
      </div>
    </main>
  );
}
