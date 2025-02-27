import { TimeEntry } from "@/types/time-entry";
import { WORK_RULES } from "@/constants/work-rules";

export function calculateWorkHours(entries: TimeEntry[]): {
  todayHours: number;
  weekHours: number;
  monthHours: number;
  overtimeHours: number;
  punctualityRate: number;
} {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Filtrer les entrées par période
  const todayEntries = entries.filter(entry => 
    new Date(entry.clockIn) >= startOfDay && entry.type === 'work'
  );
  const weekEntries = entries.filter(entry => 
    new Date(entry.clockIn) >= startOfWeek && entry.type === 'work'
  );
  const monthEntries = entries.filter(entry => 
    new Date(entry.clockIn) >= startOfMonth && entry.type === 'work'
  );

  // Calculer les heures travaillées
  const calculateHours = (entries: TimeEntry[]): number => {
    return entries.reduce((total, entry) => {
      const start = new Date(entry.clockIn);
      const end = entry.clockOut ? new Date(entry.clockOut) : new Date();
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
  };

  // Calculer le taux de ponctualité
  const calculatePunctuality = (entries: TimeEntry[]): number => {
    if (entries.length === 0) return 100;

    const onTimeCount = entries.filter(entry => {
      const startTime = new Date(entry.clockIn);
      const expectedStart = new Date(startTime);
      expectedStart.setHours(9, 0, 0, 0); // 9h00
      
      return startTime <= expectedStart || 
        (startTime.getTime() - expectedStart.getTime()) <= WORK_RULES.LATE_THRESHOLD * 60 * 1000;
    }).length;

    return (onTimeCount / entries.length) * 100;
  };

  // Calculer les heures supplémentaires
  const calculateOvertime = (monthlyHours: number): number => {
    const expectedMonthlyHours = WORK_RULES.HOURS_PER_MONTH;
    return Math.max(0, monthlyHours - expectedMonthlyHours);
  };

  const todayHours = calculateHours(todayEntries);
  const weekHours = calculateHours(weekEntries);
  const monthHours = calculateHours(monthEntries);
  const overtimeHours = calculateOvertime(monthHours);
  const punctualityRate = calculatePunctuality(monthEntries);

  return {
    todayHours: Number(todayHours.toFixed(1)),
    weekHours: Number(weekHours.toFixed(1)),
    monthHours: Number(monthHours.toFixed(1)),
    overtimeHours: Number(overtimeHours.toFixed(1)),
    punctualityRate: Number(punctualityRate.toFixed(1))
  };
}

export function calculateExpectedProgress(): number {
  const now = new Date();
  const currentDay = now.getDate();
  const currentHour = now.getHours();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Calculer le nombre de jours ouvrés dans le mois
  let workDaysInMonth = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    if (WORK_RULES.WORK_DAYS.includes(date.getDay())) {
      workDaysInMonth++;
    }
  }

  // Calculer le nombre de jours ouvrés écoulés
  let workDaysPassed = 0;
  for (let day = 1; day <= currentDay; day++) {
    const date = new Date(currentYear, currentMonth, day);
    if (WORK_RULES.WORK_DAYS.includes(date.getDay())) {
      workDaysPassed++;
    }
  }

  // Ajouter la progression de la journée en cours
  const isWorkDay = WORK_RULES.WORK_DAYS.includes(now.getDay());
  if (isWorkDay && currentHour >= 9 && currentHour <= 17) {
    const hoursWorked = currentHour - 9;
    const dayProgress = hoursWorked / WORK_RULES.HOURS_PER_DAY;
    workDaysPassed = workDaysPassed - 1 + dayProgress;
  }

  return (workDaysPassed / workDaysInMonth) * 100;
} 