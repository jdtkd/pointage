'use client';

import { useState, useEffect } from 'react';
import { TimeEntry } from '@/types/time-entry';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function useTimeEntry() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Vérifier l'état de l'authentification au chargement
    const checkAuth = async () => {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Erreur auth:', error);
        return;
      }
      setUser(currentUser);

      // Si l'utilisateur est connecté, chercher un pointage en cours
      if (currentUser) {
        const { data: entries, error: entriesError } = await supabase
          .from('time_entries')
          .select('*')
          .eq('user_id', currentUser.id)
          .is('clock_out', null)
          .single();

        if (entriesError && entriesError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Erreur récupération pointage:', entriesError);
          return;
        }

        setCurrentEntry(entries || null);
      }
    };

    checkAuth();
  }, []);

  // Vérifier si l'heure est valide pour pointer (entre 8h et 20h)
  const isValidTimeToClockInOut = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 8 && hour <= 20;
  };

  const canClockIn = () => {
    if (!isValidTimeToClockInOut()) return false;
    // Vérifier si l'utilisateur n'a pas déjà un pointage en cours
    return !currentEntry;
  };

  const canClockOut = () => {
    if (!isValidTimeToClockInOut()) return false;
    if (!currentEntry) return false;
    
    // Vérifier si au moins 1 minute s'est écoulée depuis le pointage d'entrée
    // (réduit de 30 minutes à 1 minute pour les tests)
    const minWorkTime = 60 * 1000; // 1 minute en millisecondes
    const timeSinceClockIn = new Date().getTime() - new Date(currentEntry.clockIn).getTime();
    
    return timeSinceClockIn >= minWorkTime;
  };

  const clockIn = async () => {
    try {
      if (!user) {
        throw new Error('Vous devez être connecté pour pointer');
      }

      if (!isValidTimeToClockInOut()) {
        throw new Error('Pointage possible uniquement entre 8h et 20h');
      }

      setIsLoading(true);
      
      const newEntry = {
        user_id: user.id,
        clock_in: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('time_entries')
        .insert([newEntry])
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur lors du pointage: ${error.message}`);
      }

      if (!data) {
        throw new Error('Aucune donnée retournée par Supabase');
      }
      
      setCurrentEntry(data);
      toast.success('Pointage d\'entrée enregistré');
    } catch (error) {
      console.error('Erreur détaillée:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors du pointage');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clockOut = async () => {
    if (!currentEntry || !user) return;

    try {
      if (!isValidTimeToClockInOut()) {
        throw new Error('Pointage possible uniquement entre 8h et 20h');
      }

      setIsLoading(true);
      
      const { error } = await supabase
        .from('time_entries')
        .update({ clock_out: new Date().toISOString() })
        .eq('id', currentEntry.id)
        .eq('user_id', user.id); // Sécurité supplémentaire

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur lors du pointage: ${error.message}`);
      }

      setCurrentEntry(null);
      toast.success('Pointage de sortie enregistré');
    } catch (error) {
      console.error('Erreur détaillée:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors du pointage');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clockIn,
    clockOut,
    isLoading,
    currentEntry,
    isAuthenticated: !!user,
    canClockIn: !!user && !currentEntry && isValidTimeToClockInOut(),
    canClockOut: !!user && !!currentEntry && isValidTimeToClockInOut()
  };
} 