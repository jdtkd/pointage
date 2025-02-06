"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocationMap from '../components/mobile/LocationMap';
import { usePointageStore, PointageType } from '../stores/pointageStore';

export default function PointerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [commentaire, setCommentaire] = useState('');
  const { addPointage, setIsPointing, dernierPointage } = usePointageStore();

  const handleGeolocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoading(false);
          setShowMap(true);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  };

  const handlePointage = async (type: PointageType) => {
    if (!location) {
      alert('Veuillez d\'abord obtenir votre position');
      return;
    }

    setIsPointing(true);
    
    try {
      addPointage({
        type,
        timestamp: new Date().toISOString(),
        location,
        commentaire: commentaire.trim() || undefined,
      });

      // Redirection vers l'historique après le pointage
      router.push('/historique');
    } catch (error) {
      console.error('Erreur lors du pointage:', error);
      alert('Une erreur est survenue lors du pointage');
    } finally {
      setIsPointing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title text-xl sm:text-2xl mb-4 sm:mb-6">Pointage</h2>
          
          {/* Status actuel */}
          <div className="alert alert-info mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="flex flex-col">
              <span className="font-bold">
                {dernierPointage ? 
                  `Dernier pointage: ${dernierPointage.type}` : 
                  'Non pointé'}
              </span>
              <span className="text-sm">
                {dernierPointage ? 
                  new Date(dernierPointage.timestamp).toLocaleString() : 
                  '--:--'}
              </span>
            </div>
          </div>

          {/* Actions rapides pour mobile */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button 
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              onClick={handleGeolocation}
              disabled={isLoading}
            >
              📍 Position
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowMap(!showMap)}
              disabled={!location}
            >
              🗺️ Carte
            </button>
          </div>

          {/* Carte si activée */}
          {showMap && location && (
            <div className="mb-4">
              <LocationMap latitude={location.lat} longitude={location.lng} />
            </div>
          )}

          {/* Position détectée */}
          {location && (
            <div className="alert alert-success mb-4 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Position OK: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
            </div>
          )}

          {/* Commentaire */}
          <div className="form-control mb-4">
            <textarea 
              className="textarea textarea-bordered h-16" 
              placeholder="Commentaire (optionnel)"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col gap-2">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => handlePointage('ARRIVEE')}
              disabled={!location}
            >
              ⏰ Pointer l'arrivée
            </button>
            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => handlePointage('DEPART')}
              disabled={!location}
            >
              🏃 Pointer le départ
            </button>
          </div>

          {/* Indicateur de synchronisation */}
          <div className="text-center text-sm text-base-content/70 mt-4">
            Dernière synchronisation: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
} 