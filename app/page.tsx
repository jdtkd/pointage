'use client';

import { useTimeEntry } from "@/hooks/use-time-entry";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, Play, Square, Calendar } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { TimeEntriesList } from "@/components/time-entries/time-entries-list";
import { ClockDisplay } from "@/components/time-clock/clock-display";
import { TimeEntriesHistory } from '@/components/time-entries/time-entries-history';

export default function Home() {
  // TODO: Récupérer l'ID utilisateur depuis l'authentification
  const userId = "user_id";
  const { clockIn, clockOut, isLoading, currentEntry, stats } = useTimeEntry(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Carte de pointage */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Pointage
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <ClockDisplay />
              
              <div className="flex gap-4">
                <Button
                  onClick={() => clockIn()}
                  disabled={isLoading || !!currentEntry}
                  className="w-full"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Arrivée
                </Button>
                
                <Button
                  onClick={() => currentEntry && clockOut(currentEntry.id)}
                  disabled={isLoading || !currentEntry}
                  variant="secondary"
                  className="w-full"
                >
                  <Square className="mr-2 h-4 w-4" />
                  Départ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <DashboardStats stats={stats} />
      </div>

      {/* Historique */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Clock className="h-6 w-6" />
          Historique des Pointages
        </h2>
        <TimeEntriesHistory userId={userId} />
      </section>
    </div>
  );
}
