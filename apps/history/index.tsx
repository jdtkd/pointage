'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { TimeEntriesHistory } from './components/time-entries-history';

export function HistoryModule() {
  const userId = "user_id"; // TODO: Get from auth

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="h-6 w-6" />
          Historique des Pointages
        </h2>
      </CardHeader>
      <CardContent>
        <TimeEntriesHistory userId={userId} />
      </CardContent>
    </Card>
  );
} 