'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTimeEntryStats } from "@/hooks/use-time-entry-stats";
import { WORK_RULES } from "@/constants/work-rules";
import { Clock, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function DashboardStats() {
  const { stats, isLoading } = useTimeEntryStats();

  if (isLoading) {
    return <div>Chargement des statistiques...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Statistiques
        </h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progression mensuelle */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression Mensuelle</span>
              <span>{Math.round(stats.expectedProgress)}%</span>
            </div>
            <Progress value={stats.expectedProgress} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Heures du jour */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Aujourd'hui</span>
              </div>
              <p className="text-2xl font-bold">
                {stats.todayHours}h
                <span className="text-sm text-muted-foreground ml-1">
                  /{WORK_RULES.HOURS_PER_DAY}h
                </span>
              </p>
            </div>

            {/* Heures du mois */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Ce mois</span>
              </div>
              <p className="text-2xl font-bold">
                {Math.round(stats.monthHours)}h
                <span className="text-sm text-muted-foreground ml-1">
                  /{WORK_RULES.HOURS_PER_MONTH}h
                </span>
              </p>
            </div>

            {/* Ponctualité */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Ponctualité</span>
              </div>
              <p className="text-2xl font-bold">
                {stats.punctualityRate}%
              </p>
            </div>

            {/* Heures supplémentaires */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>Heures Supp.</span>
              </div>
              <p className="text-2xl font-bold">
                {stats.overtimeHours}h
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 