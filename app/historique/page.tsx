"use client";
import { useState, useEffect, useMemo } from 'react';
import { usePointageStore, type Pointage } from '../stores/pointageStore';
import dynamic from 'next/dynamic';
import ClientOnly from '../components/ClientOnly';
import { Icons } from '../components/icons';
import { HeuresAffichage } from '../components/HeuresAffichage';
import { calculerHeuresTravaillees } from '../lib/utils';
import { pointageService } from '../lib/services/pointageService';
import { toast } from 'sonner';

interface LocationDetails {
  address?: string;
  distance?: number;
  accuracy?: number;
}

interface FiltresType {
  dateDebut: string;
  dateFin: string;
  type: string;
  status: string;
}

// Constantes
const WORKPLACE_LOCATION = {
  lat: 48.8566,
  lng: 2.3522
};

const MapWithNoSSR = dynamic(
  () => import('../components/Map'),
  { ssr: false }
);

// Fonction utilitaire pour calculer la distance
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

export default function HistoriquePage() {
  const { pointages } = usePointageStore();
  const [selectedPointage, setSelectedPointage] = useState<Pointage | null>(null);
  const [locationDetails, setLocationDetails] = useState<LocationDetails>({});
  const [filtres, setFiltres] = useState<FiltresType>({
    dateDebut: '',
    dateFin: '',
    type: '',
    status: ''
  });

  const pointagesFiltres = useMemo(() => {
    return pointages.filter(pointage => {
      const date = new Date(pointage.timestamp);
      const dateDebut = filtres.dateDebut ? new Date(filtres.dateDebut) : null;
      const dateFin = filtres.dateFin ? new Date(filtres.dateFin) : null;
      
      if (dateDebut && date < dateDebut) return false;
      if (dateFin && date > dateFin) return false;
      if (filtres.type && pointage.type !== filtres.type) return false;
      if (filtres.status && pointage.status !== filtres.status) return false;
      
      return true;
    });
  }, [pointages, filtres]);

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

  const handleCloseModal = () => {
    setSelectedPointage(null);
    setLocationDetails({});
  };

  useEffect(() => {
    if (selectedPointage?.location) {
      const fetchLocationDetails = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedPointage.location.lat}&lon=${selectedPointage.location.lng}`
          );
          const data = await response.json();
          
          const distance = calculateDistance(
            selectedPointage.location,
            WORKPLACE_LOCATION
          );

          setLocationDetails({
            address: data.display_name,
            distance,
            accuracy: typeof selectedPointage.location === 'object' && 
                     'accuracy' in selectedPointage.location ? 
                     (selectedPointage.location as { accuracy?: number }).accuracy : 
                     undefined
          });
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'adresse:', error);
          setLocationDetails({});
        }
      };

      fetchLocationDetails();
    }
  }, [selectedPointage]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="date"
          className="input input-bordered"
          value={filtres.dateDebut}
          onChange={(e) => handleFiltreChange('dateDebut', e.target.value)}
        />
        <input
          type="date"
          className="input input-bordered"
          value={filtres.dateFin}
          onChange={(e) => handleFiltreChange('dateFin', e.target.value)}
        />
        <select
          className="select select-bordered"
          value={filtres.type}
          onChange={(e) => handleFiltreChange('type', e.target.value)}
        >
          <option value="">Tous les types</option>
          <option value="ARRIVEE">Arrivée</option>
          <option value="DEPART">Départ</option>
        </select>
        <select
          className="select select-bordered"
          value={filtres.status}
          onChange={(e) => handleFiltreChange('status', e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="VALIDE">Validé</option>
          <option value="REJETE">Rejeté</option>
        </select>
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

      {/* Tableau des pointages */}
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
                onClick={() => {
                  if (pointage.id) {
                    setSelectedPointage(pointage);
                  }
                }}
              >
                <td>{new Date(pointage.timestamp).toLocaleString('fr-FR')}</td>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      if (pointage.id) {
                        setSelectedPointage(pointage);
                      }
                    }}
                  >
                    <Icons.map className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedPointage && selectedPointage.location && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-xl">Détails du pointage</h3>
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
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[400px] rounded-lg overflow-hidden">
                <ClientOnly>
                  <MapWithNoSSR 
                    lat={selectedPointage.location.lat} 
                    lng={selectedPointage.location.lng}
                  />
                </ClientOnly>
              </div>

              <div className="space-y-4">
                {/* Informations de localisation */}
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
                    <div className="mb-2">
                      <p className="text-sm font-medium">Précision :</p>
                      <p className="text-sm text-gray-600">
                        {locationDetails.accuracy} mètres
                      </p>
                    </div>
                  )}
                </div>

                {/* Détails du pointage */}
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