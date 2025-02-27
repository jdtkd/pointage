'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTimeEntry } from '@/hooks/use-time-entry';
import { useUser } from '@/hooks/use-user';
import { Clock, Coffee, Play, Square } from 'lucide-react';

export function TimeClockCard() {
  const { user } = useUser();
  const { clockIn, clockOut, startBreak, endBreak, isLoading, currentEntry, currentBreak } = useTimeEntry();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mise à jour de l'heure toutes les secondes
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Pointage</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6">
          <div className="text-4xl font-mono">
            {currentTime.toLocaleTimeString()}
          </div>
          
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={clockIn}
              disabled={isLoading || !!currentEntry}
              className="w-32"
            >
              <Play className="mr-2 h-4 w-4" />
              Arrivée
            </Button>
            <Button
              size="lg"
              onClick={clockOut}
              disabled={isLoading || !currentEntry || !!currentBreak}
              variant="secondary"
              className="w-32"
            >
              <Square className="mr-2 h-4 w-4" />
              Départ
            </Button>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={startBreak}
              disabled={isLoading || !currentEntry || !!currentBreak}
              variant="outline"
              className="w-32"
            >
              <Coffee className="mr-2 h-4 w-4" />
              Pause
            </Button>
            <Button
              onClick={endBreak}
              disabled={isLoading || !currentBreak}
              variant="outline"
              className="w-32"
            >
              Fin Pause
            </Button>
          </div>

          {currentEntry && (
            <div className="text-sm text-muted-foreground">
              En service depuis {new Date(currentEntry.clockIn).toLocaleTimeString()}
            </div>
          )}

          {currentBreak && (
            <div className="text-sm text-muted-foreground">
              En pause depuis {new Date(currentBreak.clockIn).toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 