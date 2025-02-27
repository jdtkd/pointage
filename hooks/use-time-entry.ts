'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clockIn, clockOut, getCurrentEntry, getTimeStats } from '@/app/actions/time-entries';

interface TimeEntryStats {
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

export function useTimeEntry(userId: string) {
  const queryClient = useQueryClient();

  // Récupérer le pointage actuel
  const { data: currentEntry } = useQuery({
    queryKey: ['currentEntry', userId],
    queryFn: () => getCurrentEntry(userId)
  });

  // Récupérer les statistiques
  const { data: stats } = useQuery({
    queryKey: ['timeStats', userId],
    queryFn: () => getTimeStats(userId)
  });

  // Mutation pour pointer l'arrivée
  const clockInMutation = useMutation({
    mutationFn: () => clockIn(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentEntry'] });
      queryClient.invalidateQueries({ queryKey: ['timeStats'] });
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      toast.success('Pointage d\'arrivée enregistré');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors du pointage d\'arrivée');
      console.error(error);
    }
  });

  // Mutation pour pointer le départ
  const clockOutMutation = useMutation({
    mutationFn: (entryId: string) => clockOut(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentEntry'] });
      queryClient.invalidateQueries({ queryKey: ['timeStats'] });
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      toast.success('Pointage de départ enregistré');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors du pointage de départ');
      console.error(error);
    }
  });

  return {
    currentEntry,
    stats,
    isLoading: clockInMutation.isPending || clockOutMutation.isPending,
    clockIn: () => clockInMutation.mutate(),
    clockOut: (entryId: string) => clockOutMutation.mutate(entryId)
  };
} 