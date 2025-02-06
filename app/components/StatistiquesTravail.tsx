"use client";

import { usePointageStore } from "../stores/pointageStore";
import type { Pointage } from "../stores/pointageStore";

interface PointagesParJour {
  [key: string]: Pointage[];
}

interface TempsTravail {
  heures: number;
  minutes: number;
}

export default function StatistiquesTravail() {
  const { pointages } = usePointageStore();

  // Calcul du temps de travail aujourd'hui
  const calculerTempsJournalier = () => {
    const aujourdhui = new Date().toLocaleDateString();
    const pointagesAujourdhui = pointages.filter(p => 
      new Date(p.timestamp).toLocaleDateString() === aujourdhui
    );

    return calculerTempsTravailPourPointages(pointagesAujourdhui);
  };

  // Fonction utilitaire pour calculer le temps entre arrivée et départ
  const calculerTempsTravailPourPointages = (pointagesJour: Pointage[]): TempsTravail => {
    const arrivee = pointagesJour.find(p => p.type === 'ARRIVEE');
    const depart = pointagesJour.find(p => p.type === 'DEPART');

    if (arrivee && depart) {
      const debut = new Date(arrivee.timestamp);
      const fin = new Date(depart.timestamp);
      const diffHeures = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
      return {
        heures: Math.floor(diffHeures),
        minutes: Math.round((diffHeures % 1) * 60)
      };
    }

    return { heures: 0, minutes: 0 };
  };

  // Calcul du temps de travail ce mois
  const calculerTempsMensuel = () => {
    const moisActuel = new Date().getMonth();
    const anneeActuelle = new Date().getFullYear();

    // Grouper les pointages par jour
    const pointagesParJour = pointages.reduce<PointagesParJour>((acc, pointage) => {
      const date = new Date(pointage.timestamp);
      if (date.getMonth() === moisActuel && date.getFullYear() === anneeActuelle) {
        const jour = date.toLocaleDateString();
        if (!acc[jour]) {
          acc[jour] = [];
        }
        acc[jour].push(pointage);
      }
      return acc;
    }, {});

    // Calculer le temps total pour le mois en heures décimales
    let tempsTotal = 0;

    Object.values(pointagesParJour).forEach((pointagesJour) => {
      const { heures, minutes } = calculerTempsTravailPourPointages(pointagesJour);
      // Convertir en heures décimales
      tempsTotal += heures + (minutes / 60);
    });

    const joursTravailles = Object.keys(pointagesParJour).length;
    const moyenneParJour = joursTravailles > 0 ? (tempsTotal / joursTravailles).toFixed(1) : "0";

    return {
      total: tempsTotal.toFixed(1), // Arrondi à 1 décimale
      joursTravailles,
      moyenneParJour
    };
  };

  // Formater le temps journalier pour l'affichage
  const formatTempsJournalier = () => {
    const { heures, minutes } = calculerTempsJournalier();
    if (heures === 0 && minutes === 0) return '--:--';
    return `${heures}h${minutes.toString().padStart(2, '0')}`;
  };

  const tempsMensuel = calculerTempsMensuel();

  return (
    <div className="stats shadow w-full mb-4">
      <div className="stat">
        <div className="stat-title">Aujourd'hui</div>
        <div className="stat-value text-primary">{formatTempsJournalier()}</div>
        <div className="stat-desc">Temps de travail</div>
      </div>
      <div className="stat">
        <div className="stat-title">Ce mois</div>
        <div className="stat-value text-secondary">{tempsMensuel.total}h</div>
        <div className="stat-desc">
          {tempsMensuel.joursTravailles} jour{tempsMensuel.joursTravailles > 1 ? 's' : ''} 
          ({tempsMensuel.moyenneParJour}h/jour)
        </div>
      </div>
    </div>
  );
} 