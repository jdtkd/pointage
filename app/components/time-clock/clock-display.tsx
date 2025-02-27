'use client';

import { useEffect, useState } from 'react';

export function ClockDisplay() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    // Initialiser l'heure au montage du composant
    setTime(new Date().toLocaleTimeString());

    // Mettre à jour l'heure chaque seconde
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Ne rien afficher pendant le rendu côté serveur
  if (!time) return null;

  return (
    <time className="text-3xl font-mono font-bold">
      {time}
    </time>
  );
} 