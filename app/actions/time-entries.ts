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

export async function deleteTimeEntry(entryId: string) {
  await TimeEntryService.deleteTimeEntry(entryId);
  revalidatePath('/');
}

export async function cleanOldEntries(days: number) {
  await TimeEntryService.cleanOldEntries(days);
  revalidatePath('/');
}

export async function exportTimeEntries() {
  return TimeEntryService.exportData();
}

export async function importTimeEntries(data: string) {
  await TimeEntryService.importData(data);
  revalidatePath('/');
} 