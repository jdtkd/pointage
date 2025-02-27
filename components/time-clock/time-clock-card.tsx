'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimeEntry } from "@/types/time-entry";
import { Clock, Play, Square } from "lucide-react";
import { ClockDisplay } from "./clock-display";

interface TimeClockCardProps {
  currentEntry: TimeEntry | null;
  isLoading: boolean;
  onClockIn: () => void;
  onClockOut: (entryId: string) => void;
}

export function TimeClockCard({
  currentEntry,
  isLoading,
  onClockIn,
  onClockOut
}: TimeClockCardProps) {
  return (
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
              onClick={() => onClockIn()}
              disabled={isLoading || !!currentEntry}
              className="w-full"
            >
              <Play className="mr-2 h-4 w-4" />
              Arrivée
            </Button>
            
            <Button
              onClick={() => currentEntry && onClockOut(currentEntry.id)}
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
  );
} 