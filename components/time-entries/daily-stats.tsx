'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";

interface DailyStatsProps {
  totalHours: number;
  onTimeCount: number;
  lateCount: number;
  totalEntries: number;
}

export function DailyStats({
  totalHours,
  onTimeCount,
  lateCount,
  totalEntries
}: DailyStatsProps) {
  const punctualityRate = totalEntries > 0 
    ? (onTimeCount / totalEntries) * 100 
    : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Heures totales
            </p>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              À l'heure
            </p>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <p className="text-2xl font-bold">{onTimeCount}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              En retard
            </p>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <p className="text-2xl font-bold">{lateCount}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Ponctualité
            </p>
            <p className="text-2xl font-bold">
              {punctualityRate.toFixed(0)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 