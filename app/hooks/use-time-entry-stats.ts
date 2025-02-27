'use client';

import { useState, useEffect } from 'react';
import { TimeEntry, TimeEntryStats } from '@/types/time-entry';
import { supabase } from '@/lib/supabase/client';
import { WORK_RULES } from '@/constants/work-rules';
import { calculateExpectedProgress } from '@/lib/time-calculations';
import { toast } from 'sonner';

export function useTimeEntryStats() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<TimeEntryStats>({
    todayHours: 0,
    monthHours: 0,
    punctualityRate: 0,
    expectedProgress: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // Vérifier d'abord l'authentification
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        
        if (!user) {
          console.warn('Utilisateur non authentifié');
          return;
        }

        // Récupérer les entrées du mois pour l'utilisateur connecté
        const { data: entries, error: entriesError } = await supabase
          .from('time_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('clock_in', startOfMonth.toISOString())
          .lte('clock_in', today.toISOString());

        if (entriesError) {
          console.error('Erreur Supabase:', entriesError);
          throw new Error(`Erreur lors de la récupération des entrées: ${entriesError.message}`);
        }

        if (!entries) {
          console.warn('Aucune entrée trouvée');
          return;
        }

        // Calculer les statistiques
        const calculatedStats = calculateStats(entries);
        setStats(calculatedStats);
      } catch (error) {
        console.error('Erreur détaillée:', error);
        toast.error(error instanceof Error ? error.message : 'Erreur lors de la récupération des statistiques');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000); // Rafraîchir toutes les 5 minutes
    return () => clearInterval(interval);
  }, []);

  return { isLoading, stats };
}

function calculateStats(entries: TimeEntry[]): TimeEntryStats {
  if (!entries.length) {
    return {
      todayHours: 0,
      monthHours: 0,
      punctualityRate: 100,
      expectedProgress: calculateExpectedProgress()
    };
  }

  const today = new Date();
  const todayEntries = entries.filter(entry => 
    new Date(entry.clockIn).toDateString() === today.toDateString()
  );

  // Calculer les heures du jour
  const todayHours = todayEntries.reduce((total, entry) => {
    const start = new Date(entry.clockIn);
    const end = entry.clockOut ? new Date(entry.clockOut) : new Date();
    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);

  // Calculer les heures du mois
  const monthHours = entries.reduce((total, entry) => {
    const start = new Date(entry.clockIn);
    const end = entry.clockOut ? new Date(entry.clockOut) : new Date();
    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);

  // Calculer le taux de ponctualité
  const onTimeEntries = entries.filter(entry => {
    const startTime = new Date(entry.clockIn);
    const expectedStart = new Date(startTime);
    expectedStart.setHours(9, 0, 0, 0);
    return startTime <= expectedStart || 
      (startTime.getTime() - expectedStart.getTime()) <= WORK_RULES.LATE_THRESHOLD * 60 * 1000;
  });

  const punctualityRate = (onTimeEntries.length / entries.length) * 100;

  return {
    todayHours: Number(todayHours.toFixed(1)),
    monthHours: Number(monthHours.toFixed(1)),
    punctualityRate: Number(punctualityRate.toFixed(1)),
    expectedProgress: Number(calculateExpectedProgress().toFixed(1))
  };
} 