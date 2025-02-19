import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatTime(date: Date) {
  return date.toLocaleString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isWorkingDay(date: Date = new Date()): boolean {
  const day = date.getDay();
  // 0 = dimanche, 6 = samedi
  return day !== 0 && day !== 6;
}

export function getNextWorkingDay(date: Date = new Date()): Date {
  const nextDay = new Date(date);
  do {
    nextDay.setDate(nextDay.getDate() + 1);
  } while (!isWorkingDay(nextDay));
  return nextDay;
}

export function formatDateToFr(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface HeuresTravaillees {
  total: number;
  pourcentageQuota: number;
  restantes: number;
}

export function calculerHeuresTravaillees(pointages: Pointage[]): HeuresTravaillees {
  const QUOTA_MENSUEL = 173.3; // heures par mois
  let totalHeures = 0;

  // Trier les pointages par date
  const pointagesTries = [...pointages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Grouper les pointages par jour
  const pointagesParJour = pointagesTries.reduce((acc, pointage) => {
    const date = new Date(pointage.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(pointage);
    return acc;
  }, {} as Record<string, Pointage[]>);

  // Calculer les heures pour chaque jour
  Object.values(pointagesParJour).forEach(pointagesJour => {
    if (pointagesJour.length >= 2) {
      const arrivee = pointagesJour.find(p => p.type === 'ARRIVEE');
      const depart = pointagesJour.find(p => p.type === 'DEPART');

      if (arrivee && depart) {
        const debut = new Date(arrivee.timestamp);
        const fin = new Date(depart.timestamp);
        
        // Calculer la durée en heures
        let duree = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
        
        // Soustraire la pause déjeuner si la durée est supérieure à 6h
        if (duree > 6) {
          duree -= 0.5; // 30 minutes de pause
        }

        totalHeures += duree;
      }
    }
  });

  // Calculer le pourcentage du quota atteint
  const pourcentageQuota = (totalHeures / QUOTA_MENSUEL) * 100;
  
  // Calculer les heures restantes
  const heuresRestantes = QUOTA_MENSUEL - totalHeures;

  return {
    total: Number(totalHeures.toFixed(2)),
    pourcentageQuota: Number(pourcentageQuota.toFixed(1)),
    restantes: Number(heuresRestantes.toFixed(2))
  };
}

export function formatDuree(heures: number): string {
  const heuresEntieres = Math.floor(heures);
  const minutes = Math.round((heures - heuresEntieres) * 60);
  
  if (minutes === 0) {
    return `${heuresEntieres}h`;
  }
  
  return `${heuresEntieres}h${minutes.toString().padStart(2, '0')}`;
}

export function formatDureeEnHM(heures: number): string {
  const heuresEntieres = Math.floor(heures);
  const minutes = Math.round((heures - heuresEntieres) * 60);
  
  return `${heuresEntieres.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
} 