"use client";
import { useState } from 'react';
import { usePointageStore, Pointage } from '../stores/pointageStore';

interface PointageJournee {
  date: string;
  arrivee?: Pointage;
  depart?: Pointage;
}

export default function HistoriquePage() {
  const { pointages, deletePointage } = usePointageStore();
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [statusFiltre, setStatusFiltre] = useState('');

  // Fonction pour regrouper les pointages par jour
  const regrouperPointagesParJour = (pointages: Pointage[]): PointageJournee[] => {
    const pointagesParJour = pointages.reduce((acc: { [key: string]: PointageJournee }, pointage) => {
      const date = new Date(pointage.timestamp).toLocaleDateString();
      
      if (!acc[date]) {
        acc[date] = { date, arrivee: undefined, depart: undefined };
      }

      if (pointage.type === 'ARRIVEE') {
        acc[date].arrivee = pointage;
      } else if (pointage.type === 'DEPART') {
        acc[date].depart = pointage;
      }

      return acc;
    }, {});

    return Object.values(pointagesParJour).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  // Filtrer et regrouper les pointages
  const pointagesFiltres = pointages
    .filter((pointage) => {
      const date = new Date(pointage.timestamp);
      const passeFiltreDates = (!dateDebut || date >= new Date(dateDebut)) &&
                              (!dateFin || date <= new Date(dateFin));
      const passeStatus = !statusFiltre || pointage.status === statusFiltre;
      return passeFiltreDates && passeStatus;
    });

  const pointagesJournaliers = regrouperPointagesParJour(pointagesFiltres);

  // Fonction pour formater l'heure
  const formatHeure = (timestamp?: string) => {
    if (!timestamp) return '--:--';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Fonction pour formater les coordonnées
  const formatCoordonnees = (location?: { lat: number; lng: number }) => {
    if (!location) return 'Non disponible';
    return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Filtres */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title mb-4">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date début</span>
              </label>
              <input 
                type="date" 
                className="input input-bordered"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date fin</span>
              </label>
              <input 
                type="date" 
                className="input input-bordered"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Statut</span>
              </label>
              <select 
                className="select select-bordered"
                value={statusFiltre}
                onChange={(e) => setStatusFiltre(e.target.value)}
              >
                <option value="">Tous</option>
                <option value="EN_ATTENTE">En attente</option>
                <option value="VALIDE">Validé</option>
                <option value="REJETE">Rejeté</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des pointages */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Historique des pointages</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Arrivée</th>
                  <th>Coordonnées Arrivée</th>
                  <th>Départ</th>
                  <th>Coordonnées Départ</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pointagesJournaliers.map((journee) => (
                  <tr key={journee.date}>
                    <td>{journee.date}</td>
                    <td>{formatHeure(journee.arrivee?.timestamp)}</td>
                    <td>
                      {journee.arrivee?.location && (
                        <button 
                          className="btn btn-xs btn-ghost tooltip" 
                          data-tip={formatCoordonnees(journee.arrivee.location)}
                        >
                          📍 Voir position
                        </button>
                      )}
                    </td>
                    <td>{formatHeure(journee.depart?.timestamp)}</td>
                    <td>
                      {journee.depart?.location && (
                        <button 
                          className="btn btn-xs btn-ghost tooltip" 
                          data-tip={formatCoordonnees(journee.depart.location)}
                        >
                          📍 Voir position
                        </button>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${
                        (journee.arrivee?.status === 'VALIDE' && journee.depart?.status === 'VALIDE') ? 'success' :
                        (journee.arrivee?.status === 'REJETE' || journee.depart?.status === 'REJETE') ? 'error' : 'warning'
                      }`}>
                        {(journee.arrivee?.status === 'VALIDE' && journee.depart?.status === 'VALIDE') ? 'Validé' :
                         (journee.arrivee?.status === 'REJETE' || journee.depart?.status === 'REJETE') ? 'Rejeté' : 'En attente'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-xs btn-ghost">
                          👁️ Détails
                        </button>
                        <button 
                          className="btn btn-xs btn-error"
                          onClick={() => {
                            if (journee.arrivee) deletePointage(journee.arrivee.id);
                            if (journee.depart) deletePointage(journee.depart.id);
                          }}
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 