'use client';

import { TimeClockCard } from './components/time-clock-card';
import { useTimeEntry } from '@/hooks/use-time-entry';

export function TimeClockModule() {
  const userId = "user_id"; // TODO: Get from auth
  const { currentEntry, isLoading, clockIn, clockOut } = useTimeEntry(userId);

  return (
    <TimeClockCard
      currentEntry={currentEntry}
      isLoading={isLoading}
      onClockIn={clockIn}
      onClockOut={clockOut}
    />
  );
} 