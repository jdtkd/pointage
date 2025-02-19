"use client";
import { useState, useEffect, useMemo } from 'react';
import { usePointageStore } from '../stores/pointageStore';
import dynamic from 'next/dynamic';
import ClientOnly from '../components/ClientOnly';
import { Icons } from '../components/icons';
import { isWorkingDay } from '../lib/utils';
import { HeuresAffichage } from '../components/HeuresAffichage';
import { calculerHeuresTravaillees } from '../lib/utils';

const MapWithNoSSR = dynamic(
  async () => import('../components/Map'),
  { ssr: false }
);

interface FiltresType {
  dateDebut: string;
  dateFin: string;
  type: string;
  status: string;
}

interface LocationDetails {
  address?: string;
  distance?: number;
  accuracy?: number;
}

// Ajoutons quelques icônes supplémentaires à notre composant Icons
const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'VALIDE':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case 'REJETE':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
  }
};

export default function HistoriquePage() {
  const { pointages } = usePointageStore();
  const [selectedPointage, setSelectedPointage] = useState<any>(null);
  const [filtres, setFiltres] = useState<FiltresType>({
    dateDebut: '',
    dateFin: '',
    type: '',
    status: ''
  });
  const [locationDetails, setLocationDetails] = useState<LocationDetails>({});

  // Utiliser useMemo pour les pointages filtrés
  const pointagesFiltres = useMemo(() => {
    return pointages.filter(pointage => {
      const date = new Date(pointage.timestamp);
      
      if (filtres.dateDebut && date < new Date(filtres.dateDebut)) return false;
      if (filtres.dateFin && date > new Date(filtres.dateFin)) return false;
      if (filtres.type && pointage.type !== filtres.type) return false;
      if (filtres.status && pointage.status !== filtres.status) return false;
      
      return true;
    });
  }, [pointages, filtres]);

  // Utiliser useMemo pour les statistiques
  const statsFiltre = useMemo(() => {
    if (pointagesFiltres.length === 0) {
      return { total: 0, moyenne: 0, joursPointes: 0 };
    }

    const heuresTravaillees = calculerHeuresTravaillees(pointagesFiltres);
    
    const joursUniques = new Set(
      pointagesFiltres.map(p => new Date(p.timestamp).toLocaleDateString())
    ).size;

    return {
      total: heuresTravaillees.total,
      moyenne: joursUniques > 0 ? heuresTravaillees.total / joursUniques : 0,
      joursPointes: joursUniques
    };
  }, [pointagesFiltres]);

  const handleFiltreChange = (name: keyof FiltresType, value: string) => {
    setFiltres(prev => ({ ...prev, [name]: value }));
  };

  // Fonction pour récupérer l'adresse depuis les coordonnées
  const getLocationDetails = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      // Calculer la distance par rapport au lieu de travail
      const workplaceLocation = {
        lat: 48.8566, // Coordonnées du lieu de travail
        lng: 2.3522
      };
      
      const distance = calculateDistance(
        { lat, lng },
        workplaceLocation
      );

      setLocationDetails({
        address: data.display_name,
        distance: distance,
        accuracy: selectedPointage.location.accuracy
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse:', error);
      setLocationDetails({});
    }
  };

  // Calculer la distance entre deux points en mètres
  const calculateDistance = (point1: {lat: number, lng: number}, point2: {lat: number, lng: number}) => {
    const R = 6371e3; // Rayon de la terre en mètres
    const φ1 = point1.lat * Math.PI/180;
    const φ2 = point2.lat * Math.PI/180;
    const Δφ = (point2.lat-point1.lat) * Math.PI/180;
    const Δλ = (point2.lng-point1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  useEffect(() => {
    if (selectedPointage?.location) {
      getLocationDetails(selectedPointage.location.lat, selectedPointage.location.lng);
    }
  }, [selectedPointage]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Filtres */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Filtres</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Date début</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              value={filtres.dateDebut}
              onChange={(e) => handleFiltreChange('dateDebut', e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Date fin</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              value={filtres.dateFin}
              onChange={(e) => handleFiltreChange('dateFin', e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Type</span>
            </label>
            <select
              className="select select-bordered"
              value={filtres.type}
              onChange={(e) => handleFiltreChange('type', e.target.value)}
            >
              <option value="">Tous</option>
              <option value="ARRIVEE">Arrivée</option>
              <option value="DEPART">Départ</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Statut</span>
            </label>
            <select
              className="select select-bordered"
              value={filtres.status}
              onChange={(e) => handleFiltreChange('status', e.target.value)}
            >
              <option value="">Tous</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="VALIDE">Validé</option>
              <option value="REJETE">Rejeté</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Total des heures</div>
          <div className="stat-value">
            <HeuresAffichage heures={statsFiltre.total} showLabel />
          </div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Moyenne journalière</div>
          <div className="stat-value">
            <HeuresAffichage heures={statsFiltre.moyenne} showLabel />
          </div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Jours pointés</div>
          <div className="stat-value">{statsFiltre.joursPointes}</div>
        </div>
      </div>

      {/* Liste des pointages */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Commentaire</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pointagesFiltres.map((pointage) => (
                <tr 
                  key={pointage.id}
                  className={`hover:bg-base-200 cursor-pointer ${
                    selectedPointage?.id === pointage.id ? 'bg-base-200' : ''
                  }`}
                  onClick={() => setSelectedPointage(pointage)}
                >
                  <td>
                    {new Date(pointage.timestamp).toLocaleString('fr-FR')}
                  </td>
                  <td>
                    <span className={`badge ${
                      pointage.type === 'ARRIVEE' ? 'badge-primary' : 'badge-secondary'
                    }`}>
                      {pointage.type}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      pointage.status === 'VALIDE' ? 'badge-success' : 
                      pointage.status === 'REJETE' ? 'badge-error' : 
                      'badge-warning'
                    }`}>
                      {pointage.status}
                    </span>
                  </td>
                  <td>{pointage.commentaire || '-'}</td>
                  <td>
                    <button 
                      className="btn btn-square btn-ghost btn-sm"
                      onClick={() => setSelectedPointage(pointage)}
                    >
                      <Icons.map className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de la carte */}
      {selectedPointage && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-xl">
                  Détails du pointage
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(selectedPointage.timestamp).toLocaleString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button 
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedPointage(null)}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[400px] rounded-lg overflow-hidden">
                <ClientOnly>
                  <MapWithNoSSR 
                    latitude={selectedPointage.location.lat} 
                    longitude={selectedPointage.location.lng}
                  />
                </ClientOnly>
              </div>

              <div className="space-y-4">
                <div className="bg-base-200 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Informations de localisation</h4>
                  {locationDetails.address && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">Adresse :</p>
                      <p className="text-sm text-gray-600">{locationDetails.address}</p>
                    </div>
                  )}
                  {locationDetails.distance && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">Distance du lieu de travail :</p>
                      <p className="text-sm text-gray-600">
                        {(locationDetails.distance / 1000).toFixed(2)} km
                      </p>
                    </div>
                  )}
                  {locationDetails.accuracy && (
                    <div>
                      <p className="text-sm font-medium">Précision :</p>
                      <p className="text-sm text-gray-600">
                        {locationDetails.accuracy} mètres
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-base-200 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Détails du pointage</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Type :</p>
                      <span className={`badge ${
                        selectedPointage.type === 'ARRIVEE' ? 'badge-primary' : 'badge-secondary'
                      }`}>
                        {selectedPointage.type}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Statut :</p>
                      <span className={`badge ${
                        selectedPointage.status === 'VALIDE' ? 'badge-success' : 
                        selectedPointage.status === 'REJETE' ? 'badge-error' : 
                        'badge-warning'
                      }`}>
                        {selectedPointage.status}
                      </span>
                    </div>
                  </div>
                  {selectedPointage.commentaire && (
                    <div className="mt-4">
                      <p className="text-sm font-medium">Commentaire :</p>
                      <p className="text-sm text-gray-600">{selectedPointage.commentaire}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
} 