import { WORK_RULES } from '@/constants/work-rules';
import { TimeEntry } from '@/types/time-entry';

// Clé pour le stockage local
const STORAGE_KEY = 'time_entries';

// Charger les données depuis le localStorage
function loadTimeEntries(): TimeEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des pointages:', error);
    return [];
  }
}

// Sauvegarder les données dans le localStorage
function saveTimeEntries(entries: TimeEntry[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des pointages:', error);
  }
}

// Initialiser les données depuis le stockage local
let timeEntries: TimeEntry[] = loadTimeEntries();

export class TimeEntryService {
  // Vérifier si l'utilisateur a un pointage actif aujourd'hui
  private static async hasActiveClockInToday(userId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return timeEntries.some(
      entry => 
        entry.userId === userId && 
        new Date(entry.clockIn) >= today &&
        !entry.clockOut // Vérifier seulement les pointages sans départ
    );
  }

  // Pointer l'arrivée
  static async clockIn(userId: string): Promise<TimeEntry> {
    // Vérifier si l'utilisateur a un pointage actif aujourd'hui
    const hasActiveClockIn = await this.hasActiveClockInToday(userId);
    if (hasActiveClockIn) {
      throw new Error('Vous avez déjà un pointage en cours');
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
    saveTimeEntries(timeEntries); // Sauvegarder après modification
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

    saveTimeEntries(timeEntries); // Sauvegarder après modification
    return entry;
  }

  // Ajouter un pointage
  static async addTimeEntry(entry: TimeEntry): Promise<TimeEntry> {
    timeEntries.push(entry);
    saveTimeEntries(timeEntries);
    return entry;
  }

  // Mettre à jour un pointage
  static async updateTimeEntry(entryId: string, updates: Partial<TimeEntry>): Promise<TimeEntry> {
    const index = timeEntries.findIndex(e => e.id === entryId);
    if (index === -1) throw new Error('Pointage non trouvé');

    timeEntries[index] = { ...timeEntries[index], ...updates };
    saveTimeEntries(timeEntries);
    return timeEntries[index];
  }

  // Supprimer un pointage
  static async deleteTimeEntry(entryId: string): Promise<void> {
    timeEntries = timeEntries.filter(entry => entry.id !== entryId);
    saveTimeEntries(timeEntries);
  }

  // Nettoyer les anciennes données
  static async cleanOldEntries(daysToKeep: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    timeEntries = timeEntries.filter(
      entry => new Date(entry.clockIn) >= cutoffDate
    );
    saveTimeEntries(timeEntries);
  }

  // Exporter les données
  static async exportData(): Promise<string> {
    return JSON.stringify(timeEntries, null, 2);
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

    // Filtrer, trier et dédupliquer les entrées
    const entries = timeEntries
      .filter(
        entry => 
          entry.userId === userId &&
          new Date(entry.clockIn) >= startOfDay &&
          new Date(entry.clockIn) <= endOfDay
      )
      .sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime());

    // Dédupliquer par ID
    const uniqueEntries = Array.from(
      new Map(entries.map(entry => [entry.id, entry])).values()
    );

    return uniqueEntries;
  }
} 