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

const QUOTA_MENSUEL = 173.3; // 173.3 heures par mois
const QUOTA_JOURNALIER = 8; // 8 heures par jour

export default function StatistiquesTravail() {
  const { pointages } = usePointageStore();

  // Calcul du temps de travail aujourd'hui
  const calculerTempsJournalier = () => {
    const aujourdhui = new Date().toLocaleDateString();
    const pointagesAujourdhui = pointages.filter(p => 
      new Date(p.timestamp).toLocaleDateString() === aujourdhui
    );

    const temps = calculerTempsTravailPourPointages(pointagesAujourdhui);
    const quotaAtteint = temps.heures + (temps.minutes / 60) >= QUOTA_JOURNALIER;

    return {
      ...temps,
      quotaAtteint
    };
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
    const joursDansMois = new Date(anneeActuelle, moisActuel + 1, 0).getDate();
    const joursOuvres = calculerJoursOuvres(anneeActuelle, moisActuel);

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
      tempsTotal += heures + (minutes / 60);
    });

    const joursTravailles = Object.keys(pointagesParJour).length;
    const moyenneParJour = joursTravailles > 0 ? (tempsTotal / joursTravailles).toFixed(1) : "0";
    const progression = (tempsTotal / QUOTA_MENSUEL) * 100;
    const objectifJournalier = (QUOTA_MENSUEL / joursOuvres).toFixed(1);

    return {
      total: tempsTotal.toFixed(1),
      joursTravailles,
      moyenneParJour,
      progression: Math.min(progression, 100).toFixed(1),
      objectifJournalier,
      joursOuvres
    };
  };

  // Calculer les jours ouvrés du mois (hors weekends)
  const calculerJoursOuvres = (annee: number, mois: number) => {
    const joursDansMois = new Date(annee, mois + 1, 0).getDate();
    let joursOuvres = 0;
    
    for (let jour = 1; jour <= joursDansMois; jour++) {
      const date = new Date(annee, mois, jour);
      const jourSemaine = date.getDay();
      if (jourSemaine !== 0 && jourSemaine !== 6) { // 0 = dimanche, 6 = samedi
        joursOuvres++;
      }
    }
    
    return joursOuvres;
  };

  const tempsJournalier = calculerTempsJournalier();
  const tempsMensuel = calculerTempsMensuel();

  return (
    <div className="stats stats-vertical shadow w-full mb-4">
      <div className="stat">
        <div className="stat-title">Aujourd'hui</div>
        <div className={`stat-value ${tempsJournalier.quotaAtteint ? 'text-success' : 'text-primary'}`}>
          {`${tempsJournalier.heures}h${tempsJournalier.minutes.toString().padStart(2, '0')}`}
        </div>
        <div className="stat-desc">
          Objectif : {QUOTA_JOURNALIER}h
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Ce mois</div>
        <div className="stat-value text-secondary">{tempsMensuel.total}h</div>
        <div className="stat-desc flex flex-col gap-1">
          <div>
            {tempsMensuel.joursTravailles}/{tempsMensuel.joursOuvres} jours
          </div>
          <div className="w-full bg-base-200 rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-full transition-all"
              style={{ width: `${tempsMensuel.progression}%` }}
            />
          </div>
          <div>
            {tempsMensuel.progression}% du quota ({QUOTA_MENSUEL}h)
          </div>
        </div>
      </div>
    </div>
  );
} 