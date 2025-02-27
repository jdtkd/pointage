'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimeEntry } from '@/types/time-entry';
import { getTimeEntriesForDate } from '@/app/actions/time-entries';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TimeEntriesFilters } from './time-entries-filters';

interface TimeEntriesHistoryProps {
  userId: string;
}

export function TimeEntriesHistory({ userId }: TimeEntriesHistoryProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: entries = [], isLoading, refetch } = useQuery({
    queryKey: ['timeEntries', userId, selectedDate],
    queryFn: () => getTimeEntriesForDate(userId, selectedDate)
  });

  return (
    <div className="space-y-4">
      <TimeEntriesFilters
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onRefresh={() => refetch()}
        isLoading={isLoading}
      />

      {isLoading ? (
        <div className="text-center py-8">
          <Clock className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Chargement des pointages...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucun pointage trouvé pour cette date
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="bg-card">
              <CardContent className="pt-6">
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          Arrivée : {format(new Date(entry.clockIn), 'HH:mm')}
                          {entry.clockOut && ` - Départ : ${format(new Date(entry.clockOut), 'HH:mm')}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {entry.status === 'LATE' ? 'En retard' : 'À l\'heure'}
                    </p>
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