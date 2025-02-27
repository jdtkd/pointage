export const WORK_RULES = {
  HOURS_PER_DAY: 8,
  LATE_THRESHOLD: 10, // minutes
  WORK_START_HOUR: 9,
  WORK_END_HOUR: 17,
  WORK_DAYS: [1, 2, 3, 4, 5], // Lundi à Vendredi
} as const;

export type WorkRules = typeof WORK_RULES; 