'use client';

import { DashboardStats } from './components/dashboard-stats';
import { useTimeEntry } from '@/hooks/use-time-entry';

export function DashboardModule() {
  const userId = "user_id"; // TODO: Get from auth
  const { stats } = useTimeEntry(userId);

  return <DashboardStats stats={stats} />;
} 