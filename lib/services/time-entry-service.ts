import { WORK_RULES } from '@/constants/work-rules';
import { TimeEntry } from '@/types/time-entry';

// Simuler une base de données en mémoire
let timeEntries: TimeEntry[] = [];

export class TimeEntryService {
  // Vérifier si l'utilisateur a déjà pointé aujourd'hui
  private static async hasClockInToday(userId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return timeEntries.some(
      entry => 
        entry.userId === userId && 
        new Date(entry.clockIn) >= today
    );
  }

  // Pointer l'arrivée
  static async clockIn(userId: string): Promise<TimeEntry> {
    // Vérifier si l'utilisateur a déjà pointé aujourd'hui
    const hasClockInToday = await this.hasClockInToday(userId);
    if (hasClockInToday) {
      throw new Error('Vous avez déjà pointé aujourd\'hui');
    }

    const now = new Date();
    const expectedStart = new Date(now);
    expectedStart.setHours(WORK_RULES.WORK_START_HOUR, 0, 0, 0);

    // Déterminer si l'employé est en retard
    const status = now > expectedStart ? 'LATE' : 'ON_TIME';

    const entry: TimeEntry = {
      id: crypto.randomUUID(),
      userId,
      clockIn: now.toISOString(),
      status,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    timeEntries.push(entry);
    return entry;
  }

  // Pointer le départ
  static async clockOut(entryId: string): Promise<TimeEntry> {
    const entry = timeEntries.find(e => e.id === entryId);
    if (!entry) {
      throw new Error('Pointage non trouvé');
    }

    if (entry.clockOut) {
      throw new Error('Vous avez déjà pointé votre départ');
    }

    const now = new Date();
    entry.clockOut = now.toISOString();
    entry.updatedAt = now.toISOString();

    return entry;
  }

  // Obtenir les statistiques
  static async getStats(userId: string) {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayEntries = timeEntries.filter(
      entry => new Date(entry.clockIn) >= startOfDay && entry.userId === userId
    );
    const weekEntries = timeEntries.filter(
      entry => new Date(entry.clockIn) >= startOfWeek && entry.userId === userId
    );
    const monthEntries = timeEntries.filter(
      entry => new Date(entry.clockIn) >= startOfMonth && entry.userId === userId
    );

    return {
      today: this.calculateDayStats(todayEntries),
      week: this.calculatePeriodStats(weekEntries),
      month: this.calculatePeriodStats(monthEntries)
    };
  }

  private static calculateDayStats(entries: TimeEntry[]) {
    const totalWorked = entries.reduce((total, entry) => {
      const start = new Date(entry.clockIn);
      const end = entry.clockOut ? new Date(entry.clockOut) : new Date();
      return total + (end.getTime() - start.getTime());
    }, 0);

    return {
      hoursWorked: totalWorked / (1000 * 60 * 60),
      isComplete: totalWorked >= WORK_RULES.HOURS_PER_DAY * 60 * 60 * 1000,
      status: entries[0]?.status || null
    };
  }

  private static calculatePeriodStats(entries: TimeEntry[]) {
    const totalWorked = entries.reduce((total, entry) => {
      const start = new Date(entry.clockIn);
      const end = entry.clockOut ? new Date(entry.clockOut) : new Date();
      return total + (end.getTime() - start.getTime());
    }, 0);

    const lateEntries = entries.filter(entry => entry.status === 'LATE');

    return {
      hoursWorked: totalWorked / (1000 * 60 * 60),
      lateCount: lateEntries.length,
      punctualityRate: entries.length ? ((entries.length - lateEntries.length) / entries.length) * 100 : 0
    };
  }

  // Récupérer le pointage actuel
  static async getCurrentEntry(userId: string): Promise<TimeEntry | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return timeEntries.find(
      entry => 
        new Date(entry.clockIn) >= today && 
        entry.userId === userId && 
        !entry.clockOut
    ) || null;
  }

  // Ajouter cette méthode pour récupérer l'historique
  static async getTimeEntries(userId: string, date?: Date): Promise<TimeEntry[]> {
    const selectedDate = date || new Date();
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    return timeEntries.filter(
      entry => 
        entry.userId === userId &&
        new Date(entry.clockIn) >= startOfDay &&
        new Date(entry.clockIn) <= endOfDay
    );
  }
} 