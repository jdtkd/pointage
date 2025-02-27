'use client';

import { TimeEntry } from "@/types/time-entry";
import { Card } from "@/components/ui/card";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { WORK_RULES } from "@/constants/work-rules";

interface DailyStatsProps {
  entries: TimeEntry[];
  date: string;
}

export function DailyStats({ entries, date }: DailyStatsProps) {
  const workEntries = entries.filter(entry => entry.type === 'work');
  const breakEntries = entries.filter(entry => entry.type === 'break');

  // Calcul du temps total travaillé
  const getTotalWorkTime = () => {
    return workEntries.reduce((total, entry) => {
      const start = new Date(entry.clockIn);
      const end = entry.clockOut ? new Date(entry.clockOut) : new Date();
      return total + (end.getTime() - start.getTime());
    }, 0);
  };

  // Calcul du temps total de pause
  const getTotalBreakTime = () => {
    return breakEntries.reduce((total, entry) => {
      const start = new Date(entry.clockIn);
      const end = entry.clockOut ? new Date(entry.clockOut) : new Date();
      return total + (end.getTime() - start.getTime());
    }, 0);
  };

  // Formatage du temps en heures et minutes
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Vérification des retards
  const getLateCount = () => {
    return workEntries.filter(entry => {
      const startTime = new Date(entry.clockIn);
      const expectedStart = new Date(startTime);
      expectedStart.setHours(9, 0, 0, 0);
      return startTime.getTime() - expectedStart.getTime() > WORK_RULES.LATE_THRESHOLD * 60 * 1000;
    }).length;
  };

  const totalWorkTime = getTotalWorkTime();
  const totalBreakTime = getTotalBreakTime();
  const lateCount = getLateCount();

  return (
    <Card className="p-4 mb-4 bg-muted/5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Date</div>
          <div className="font-medium">{new Date(date).toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}</div>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Temps de travail
          </div>
          <div className="font-medium">
            {formatTime(totalWorkTime)}
            <span className="text-sm text-muted-foreground ml-1">
              /{WORK_RULES.HOURS_PER_DAY}h
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Temps de pause</div>
          <div className="font-medium">
            {formatTime(totalBreakTime)}
            <span className="text-sm text-muted-foreground ml-1">
              /{WORK_RULES.STANDARD_BREAK_TIME}min
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Ponctualité</div>
          <div className="flex items-center gap-2">
            {lateCount > 0 ? (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-500">{lateCount} retard(s)</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-green-500">À l'heure</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
} 