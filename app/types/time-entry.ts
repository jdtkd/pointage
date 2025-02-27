export interface TimeEntry {
  id: string;
  userId: string;
  clockIn: Date;
  clockOut?: Date;
}

export interface DailyStats {
  totalWorkTime: number; // en minutes
  entries: TimeEntry[];
  firstEntry?: TimeEntry;
  lastEntry?: TimeEntry;
  isComplete: boolean;
  totalEntries: number;
}

export interface TimeEntryStats {
  todayHours: number;
  monthHours: number;
  punctualityRate: number;
  expectedProgress: number;
}

export interface WorkSchedule {
  userId: string;
  dayOfWeek: number; // 0-6 pour dimanche-samedi
  startTime: string; // format "HH:mm"
  endTime: string;
  breakDuration: number; // en minutes
} 