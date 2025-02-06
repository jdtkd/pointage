"use client";

import { usePointageStore } from '../stores/pointageStore';

export default function StatistiquesTravail() {
  const { pointages } = usePointageStore();

  // Calcul du temps de travail aujourd'hui
  const calculerTempsJournalier = () => {
    const aujourdhui = new Date().toLocaleDateString();
    const pointagesAujourdhui = pointages.filter(p => 
      new Date(p.timestamp).toLocaleDateString() === aujourdhui
    );

    const arrivee = pointagesAujourdhui.find(p => p.type === 'ARRIVEE');
    const depart = pointagesAujourdhui.find(p => p.type === 'DEPART');

    if (arrivee && depart) {
      const debut = new Date(arrivee.timestamp);
      const fin = new Date(depart.timestamp);
      const diffHeures = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
      return `${Math.floor(diffHeures)}h${Math.round((diffHeures % 1) * 60)}`;
    }

    return '--:--';
  };

  // Calcul du temps de travail ce mois
  const calculerTempsMensuel = () => {
    const moisActuel = new Date().getMonth();
    const anneeActuelle = new Date().getFullYear();

    let tempsTotal = 0;

    // Grouper les pointages par jour
    const pointagesParJour = pointages.reduce((acc, pointage) => {
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

    // Calculer le temps pour chaque jour
    Object.values(pointagesParJour).forEach((pointagesJour: any) => {
      const arrivee = pointagesJour.find(p => p.type === 'ARRIVEE');
      const depart = pointagesJour.find(p => p.type === 'DEPART');
      
      if (arrivee && depart) {
        const debut = new Date(arrivee.timestamp);
        const fin = new Date(depart.timestamp);
        tempsTotal += (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
      }
    });

    const heures = Math.floor(tempsTotal);
    const minutes = Math.round((tempsTotal % 1) * 60);
    return `${heures}h${minutes}`;
  };

  return (
    <div className="stats shadow w-full mb-4">
      <div className="stat">
        <div className="stat-title">Aujourd'hui</div>
        <div className="stat-value text-primary">{calculerTempsJournalier()}</div>
        <div className="stat-desc">Temps de travail</div>
      </div>
      <div className="stat">
        <div className="stat-title">Ce mois</div>
        <div className="stat-value text-secondary">{calculerTempsMensuel()}</div>
        <div className="stat-desc">Total mensuel</div>
      </div>
    </div>
  );
} 