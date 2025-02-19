"use client";

import { useEffect, useState } from 'react';
import { usePointageStore } from '../stores/pointageStore';
import { calculerHeuresTravaillees } from '../lib/utils';
import { HeuresAffichage } from './HeuresAffichage';

export function HeuresLayout() {
  const { pointages } = usePointageStore();
  const [heures, setHeures] = useState({
    heuresJour: 0,
    heuresMois: 0
  });

  useEffect(() => {
    // Calcul des heures du jour
    const aujourdhui = new Date().toLocaleDateString();
    const pointagesAujourdhui = pointages.filter(p => 
      new Date(p.timestamp).toLocaleDateString() === aujourdhui
    );
    const heuresJour = calculerHeuresTravaillees(pointagesAujourdhui).total;

    // Calcul des heures du mois
    const heuresMois = calculerHeuresTravaillees(pointages).total;

    setHeures({ heuresJour, heuresMois });
  }, [pointages]);

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Heures aujourd&apos;hui</p>
        <HeuresAffichage 
          heures={heures.heuresJour} 
          className="text-lg font-semibold"
          showLabel
        />
      </div>
      <div>
        <p className="text-sm text-gray-500">Total mensuel</p>
        <HeuresAffichage 
          heures={heures.heuresMois} 
          className="text-lg font-semibold"
          showLabel
        />
      </div>
    </div>
  );
} 