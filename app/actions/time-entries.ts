'use server';

import { TimeEntryService } from '@/lib/services/time-entry-service';
import { revalidatePath } from 'next/cache';

export async function clockIn(userId: string) {
  const entry = await TimeEntryService.clockIn(userId);
  revalidatePath('/');
  return entry;
}

export async function clockOut(entryId: string) {
  const entry = await TimeEntryService.clockOut(entryId);
  revalidatePath('/');
  return entry;
}

export async function getCurrentEntry(userId: string) {
  return TimeEntryService.getCurrentEntry(userId);
}

export async function getTimeStats(userId: string) {
  return TimeEntryService.getStats(userId);
}

export async function getTimeEntriesForDate(userId: string, date?: Date) {
  return TimeEntryService.getTimeEntries(userId, date);
} 