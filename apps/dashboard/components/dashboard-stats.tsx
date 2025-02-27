'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TimeEntryStats } from "@/types/time-entry";
import { Clock, Calendar, TrendingUp, Target } from "lucide-react";
import { WORK_RULES } from "@/constants/work-rules";

interface DashboardStatsProps {
  stats: TimeEntryStats | undefined;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  if (!stats) return null;

  const dailyProgress = (stats.today.hoursWorked / WORK_RULES.HOURS_PER_DAY) * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="text-lg font-semibold">Statistiques</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistiques du jour */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Aujourd'hui</span>
            </div>
            <span className={`text-sm ${stats.today.status === 'LATE' ? 'text-yellow-500' : 'text-green-500'}`}>
              {stats.today.status === 'LATE' ? 'En retard' : 'À l\'heure'}
            </span>
          </div>
          <Progress value={dailyProgress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{stats.today.hoursWorked.toFixed(1)}h</span>
            <span>{WORK_RULES.HOURS_PER_DAY}h</span>
          </div>
        </div>

        {/* Statistiques de la semaine */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Cette semaine</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{stats.week.punctualityRate.toFixed(0)}%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3 bg-card">
              <div className="text-sm text-muted-foreground">Heures</div>
              <div className="text-2xl font-bold">{stats.week.hoursWorked.toFixed(1)}h</div>
            </div>
            <div className="rounded-lg border p-3 bg-card">
              <div className="text-sm text-muted-foreground">Retards</div>
              <div className="text-2xl font-bold">{stats.week.lateCount}</div>
            </div>
          </div>
        </div>

        {/* Statistiques du mois */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Ce mois</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3 bg-card">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">{stats.month.hoursWorked.toFixed(1)}h</div>
            </div>
            <div className="rounded-lg border p-3 bg-card">
              <div className="text-sm text-muted-foreground">Ponctualité</div>
              <div className="text-2xl font-bold">{stats.month.punctualityRate.toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 