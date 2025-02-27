export interface TimeEntry {
  id: string;
  userId: string;
  clockIn: Date | string;
  clockOut?: Date | string;
  status: 'ON_TIME' | 'LATE' | 'ABSENT';
  notes?: string;
  breaks?: Break[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Break {
  id: string;
  timeEntryId: string;
  userId: string;
  startTime: Date | string;
  endTime?: Date | string;
  type: 'LUNCH' | 'COFFEE' | 'OTHER';
} 