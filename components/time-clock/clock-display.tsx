'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function ClockDisplay() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="text-center space-y-2">
      <div className="text-2xl font-bold">
        {format(time, 'HH:mm:ss')}
      </div>
      <div className="text-sm text-muted-foreground">
        {format(time, 'EEEE d MMMM yyyy', { locale: fr })}
      </div>
    </div>
  );
} 