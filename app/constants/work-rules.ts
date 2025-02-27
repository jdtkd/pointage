export const WORK_RULES = {
  HOURS_PER_DAY: 8,
  HOURS_PER_MONTH: 173,
  HOURS_PER_WEEK: 40,
  WORK_DAYS: [1, 2, 3, 4, 5], // 1-5 représente Lundi-Vendredi
  STANDARD_START_TIME: '09:00',
  STANDARD_END_TIME: '17:00',
  STANDARD_BREAK_TIME: 60, // minutes
  LATE_THRESHOLD: 10, // minutes de retard tolérées
} as const; 