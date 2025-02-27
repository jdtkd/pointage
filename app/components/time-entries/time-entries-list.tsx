'use client';

import { useState, useMemo } from 'react';
import { TimeEntry } from "@/types/time-entry";
import { Clock, AlertCircle, CheckCircle2, Download } from "lucide-react";
import { WORK_RULES } from "@/constants/work-rules";
import { EmptyState } from "./empty-state";
import { TimeEntriesFilters, type TimeEntriesFilters as Filters } from "./time-entries-filters";
import { Button } from "@/components/ui/button";
import { DailyStats } from "./daily-stats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TimeEntriesList() {
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    status: 'all'
  });

  // TODO: Remplacer par les vraies données de Supabase
  const [entries] = useState<TimeEntry[]>([
    {
      id: '1',
      userId: 'user1',
      clockIn: new Date(new Date().setHours(9, 0, 0)),
      clockOut: new Date(new Date().setHours(17, 30, 0)),
      type: 'work'
    }
  ]);

  // Calcul de la durée entre deux timestamps
  const getDuration = (start: Date, end: Date) => {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Vérifier si l'entrée est en retard
  const isLate = (entry: TimeEntry) => {
    const startTime = new Date(entry.clockIn);
    const expectedStart = new Date(startTime);
    expectedStart.setHours(9, 0, 0, 0);
    return startTime.getTime() - expectedStart.getTime() > WORK_RULES.LATE_THRESHOLD * 60 * 1000;
  };

  // Filtrer les entrées selon les critères
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Filtre par date
      if (filters.dateRange?.from && new Date(entry.clockIn) < filters.dateRange.from) return false;
      if (filters.dateRange?.to) {
        const endDate = new Date(filters.dateRange.to);
        endDate.setHours(23, 59, 59);
        if (new Date(entry.clockIn) > endDate) return false;
      }

      // Filtre par statut
      if (filters.status !== 'all') {
        const isEntryLate = isLate(entry);
        if (filters.status === 'late' && !isEntryLate) return false;
        if (filters.status === 'onTime' && isEntryLate) return false;
      }

      return true;
    });
  }, [entries, filters]);

  // Grouper les entrées par date
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const date = new Date(entry.clockIn).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, TimeEntry[]>);

  // Exporter les données en CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Heure d\'arrivée', 'Heure de départ', 'Durée', 'Statut'];
    const rows = filteredEntries.map(entry => [
      new Date(entry.clockIn).toLocaleDateString(),
      new Date(entry.clockIn).toLocaleTimeString(),
      entry.clockOut ? new Date(entry.clockOut).toLocaleTimeString() : '-',
      entry.clockOut ? getDuration(new Date(entry.clockIn), new Date(entry.clockOut)) : '-',
      entry.type === 'work' ? (isLate(entry) ? 'En retard' : 'À l\'heure') : '-'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pointages_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <TimeEntriesFilters
          onFiltersChange={setFilters}
          onReset={() => setFilters({ status: 'all' })}
        />
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      {filteredEntries.length === 0 ? (
        <EmptyState />
      ) : (
        Object.entries(groupedEntries).map(([date, dayEntries]) => (
          <div key={date} className="space-y-4">
            <DailyStats entries={dayEntries} date={date} />
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Heure d'arrivée</TableHead>
                  <TableHead>Heure de départ</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dayEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {new Date(entry.clockIn).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {entry.clockOut ? new Date(entry.clockOut).toLocaleTimeString() : '-'}
                    </TableCell>
                    <TableCell>
                      {entry.clockOut ? getDuration(new Date(entry.clockIn), new Date(entry.clockOut)) : 'En cours'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isLate(entry) ? (
                          <span className="flex items-center gap-1 text-red-500">
                            <AlertCircle className="h-4 w-4" />
                            Retard
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-500">
                            <CheckCircle2 className="h-4 w-4" />
                            À l'heure
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))
      )}
    </div>
  );
} 