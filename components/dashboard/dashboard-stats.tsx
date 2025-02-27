'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StatsData {
  today: {
    hoursWorked: number;
    isComplete: boolean;
    status: 'ON_TIME' | 'LATE' | 'ABSENT' | null;
  };
  week: {
    hoursWorked: number;
    lateCount: number;
    punctualityRate: number;
  };
  month: {
    hoursWorked: number;
    lateCount: number;
    punctualityRate: number;
  };
}

interface DashboardStatsProps {
  stats?: StatsData;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  if (!stats) return null;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Statistiques
        </h2>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Aujourd'hui */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Aujourd'hui
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  Heures travaillées
                </div>
                <p className="text-2xl font-bold">
                  {stats.today.hoursWorked.toFixed(1)}h
                </p>
                <Progress 
                  value={(stats.today.hoursWorked / 8) * 100} 
                  className="mt-2"
                />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Statut
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {stats.today.status === 'LATE' ? (
                    <>
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-500">En retard</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">À l'heure</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cette semaine */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Cette semaine
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  Heures travaillées
                </div>
                <p className="text-2xl font-bold">
                  {stats.week.hoursWorked.toFixed(1)}h
                </p>
                <Progress 
                  value={(stats.week.hoursWorked / 40) * 100} 
                  className="mt-2"
                />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Ponctualité
                </div>
                <p className="text-2xl font-bold">
                  {stats.week.punctualityRate.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Ce mois */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Ce mois
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  Heures travaillées
                </div>
                <p className="text-2xl font-bold">
                  {stats.month.hoursWorked.toFixed(1)}h
                </p>
                <Progress 
                  value={(stats.month.hoursWorked / 173) * 100} 
                  className="mt-2"
                />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Retards
                </div>
                <p className="text-2xl font-bold">
                  {stats.month.lateCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 