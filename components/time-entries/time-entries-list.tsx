'use client';

import { useState } from 'react';
import { TimeEntry } from "@/types/time-entry";
import { Clock, AlertCircle, CheckCircle2, Download } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { EmptyState } from "./empty-state";
import { TimeEntriesFilters } from "./time-entries-filters";
import { DailyStats } from "./daily-stats";

// Définir l'interface des props
interface TimeEntriesListProps {
  userId: string;
}

export function TimeEntriesList({ userId }: TimeEntriesListProps) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      // TODO: Implémenter la récupération des entrées
      setEntries([]);
    } catch (error) {
      console.error('Erreur lors de la récupération des pointages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <TimeEntriesFilters 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onRefresh={fetchEntries}
        isLoading={isLoading}
      />

      {isLoading ? (
        <div>Chargement...</div>
      ) : entries.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <DailyStats
            totalHours={8}
            onTimeCount={5}
            lateCount={1}
            totalEntries={6}
          />
          
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-card p-4 rounded-lg border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {entry.status === 'LATE' ? (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium">
                        {format(new Date(entry.clockIn), 'EEEE d MMMM', { locale: fr })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(entry.clockIn), 'HH:mm')} - {entry.clockOut ? format(new Date(entry.clockOut), 'HH:mm') : 'En cours'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">Durée</p>
                      <p className="text-sm text-muted-foreground">
                        {calculateDuration(entry)}
                      </p>
                    </div>
                    <button
                      className="p-2 hover:bg-accent rounded-full"
                      title="Télécharger le justificatif"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function calculateDuration(entry: TimeEntry): string {
  const start = new Date(entry.clockIn);
  const end = entry.clockOut ? new Date(entry.clockOut) : new Date();
  const diffInMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  return `${hours}h${minutes.toString().padStart(2, '0')}`;
} 