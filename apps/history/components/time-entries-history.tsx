'use client';

import { useQuery } from '@tanstack/react-query';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimeEntry } from '@/types/time-entry';
import { getTimeEntriesForDate } from '@/app/actions/time-entries';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, AlertCircle, CheckCircle2, Calendar, Download, Timer } from 'lucide-react';
import { TimeEntriesFilters } from './time-entries-filters';
import { useState, useMemo } from 'react';
import { toast } from "sonner";
import { exportTimeEntries } from "@/app/actions/time-entries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TimeEntriesHistoryProps {
  userId: string;
}

function formatDuration(clockIn: string, clockOut?: string): string {
  if (!clockOut) return 'En cours';
  
  const start = new Date(clockIn);
  const end = new Date(clockOut);
  const hours = differenceInHours(end, start);
  const minutes = differenceInMinutes(end, start) % 60;
  
  return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
}

export function TimeEntriesHistory({ userId }: TimeEntriesHistoryProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: entries = [], isLoading, refetch } = useQuery({
    queryKey: ['timeEntries', userId, selectedDate],
    queryFn: () => getTimeEntriesForDate(userId, selectedDate),
    staleTime: 30000,
  });

  // Dédupliquer et trier les entrées
  const uniqueEntries = useMemo(() => {
    const entriesMap = new Map<string, TimeEntry>();
    
    entries.forEach(entry => {
      const hourKey = format(new Date(entry.clockIn), 'yyyy-MM-dd HH');
      if (!entriesMap.has(hourKey) || 
          new Date(entry.createdAt) > new Date(entriesMap.get(hourKey)!.createdAt)) {
        entriesMap.set(hourKey, entry);
      }
    });

    return Array.from(entriesMap.values())
      .sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime());
  }, [entries]);

  const handleExport = async () => {
    try {
      const data = await exportTimeEntries();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pointages_${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Export réussi');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 z-40 border-b">
        <div className="flex justify-between items-center">
          <TimeEntriesFilters
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onRefresh={() => refetch()}
            isLoading={isLoading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="ml-4"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Clock className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Chargement des pointages...</p>
        </div>
      ) : uniqueEntries.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="max-w-sm mx-auto space-y-3">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium">Aucun pointage</h3>
            <p className="text-sm text-muted-foreground">
              Aucun pointage n'a été trouvé pour cette date.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {uniqueEntries.map((entry) => (
            <Card key={entry.id} className="bg-card hover:bg-accent/5 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-full p-2 bg-background shrink-0">
                      {entry.status === 'LATE' ? (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="min-w-0 truncate">
                      <p className="font-medium truncate">
                        {format(new Date(entry.clockIn), 'EEEE d MMMM', { locale: fr })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>
                        {format(new Date(entry.clockIn), 'HH:mm')}
                        {entry.clockOut && (
                          <>
                            <span className="mx-1 text-muted-foreground">→</span>
                            {format(new Date(entry.clockOut), 'HH:mm')}
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 min-w-[80px]">
                      <Timer className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{formatDuration(entry.clockIn, entry.clockOut)}</span>
                    </div>

                    <Badge 
                      variant={entry.status === 'LATE' ? 'warning' : 'success'}
                      className="shrink-0"
                    >
                      {entry.status === 'LATE' ? 'En retard' : 'À l\'heure'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 