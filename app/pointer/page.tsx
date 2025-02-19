"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LocationMap from '../components/mobile/LocationMap';
import { usePointageStore, PointageType } from '../stores/pointageStore';
import { Icons } from '../components/icons';
import { isWorkingDay, formatDateToFr } from '../lib/utils';
import { toast } from 'sonner';
import { pointageService } from '../lib/services/pointageService';

export default function PointerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [commentaire, setCommentaire] = useState('');
  const { addPointage, setIsPointing, dernierPointage, pointages } = usePointageStore();
  const [isWorkDay, setIsWorkDay] = useState(false);

  useEffect(() => {
    const today = new Date();
    setIsWorkDay(isWorkingDay(today));
  }, []);

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

  // Fonction pour vérifier si l'utilisateur peut pointer aujourd'hui
  const verifierPointageJour = () => {
    const aujourdhui = new Date().toLocaleDateString();
    const pointageAujourdhui = pointages.find(p => 
      new Date(p.timestamp).toLocaleDateString() === aujourdhui
    );

    if (!pointageAujourdhui) {
      return { peutPointerArrivee: true, peutPointerDepart: false };
    }

    if (pointageAujourdhui.type === 'ARRIVEE') {
      return { peutPointerArrivee: false, peutPointerDepart: true };
    }

    return { peutPointerArrivee: false, peutPointerDepart: false };
  };

  const { peutPointerArrivee, peutPointerDepart } = verifierPointageJour();

  // Fonction pour vérifier si l'heure actuelle est dans la plage autorisée
  const isHeureAutorisee = () => {
    const now = new Date();
    const heure = now.getHours();
    return heure >= 8 && heure < 20;
  };

  // Message d'erreur pour les heures non autorisées
  const getMessageHoraire = () => {
    if (!isHeureAutorisee()) {
      return "Les pointages sont uniquement autorisés entre 8h00 et 20h00";
    }
    return null;
  };

  const handlePointage = async (type: PointageType) => {
    if (!isWorkDay) {
      toast.error("Le pointage n'est possible que du lundi au vendredi");
      return;
    }

    if (!location) {
      toast.error("Veuillez activer votre géolocalisation");
      return;
    }

    if (!isHeureAutorisee()) {
      toast.error("Le pointage n'est pas autorisé à cette heure");
      return;
    }

    // Vérification supplémentaire des conditions de pointage
    if (type === 'ARRIVEE' && !peutPointerArrivee) {
      alert('Vous avez déjà pointé votre arrivée aujourd\'hui');
      return;
    }

    if (type === 'DEPART' && !peutPointerDepart) {
      alert('Vous devez d\'abord pointer votre arrivée avant de pointer votre départ');
      return;
    }

    try {
      setIsPointing(true);
      const newPointage = {
        type,
        timestamp: new Date().toISOString(),
        location: location,
        commentaire: commentaire
      };
      
      addPointage(newPointage);
      toast.success(`Pointage ${type.toLowerCase()} enregistré avec succès`);
      router.push('/');
    } catch (error) {
      toast.error("Une erreur est survenue lors du pointage");
      console.error(error);
    } finally {
      setIsPointing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        {/* En-tête */}
        <div className="bg-base-100 rounded-box p-4 shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Pointer</h1>
          {!isWorkDay ? (
            <div className="alert alert-warning">
              <Icons.warning className="w-5 h-5" />
              <span>Le pointage n'est possible que du lundi au vendredi</span>
            </div>
          ) : (
            <p className="text-base-content/70">
              Enregistrez votre arrivée ou départ pour {formatDateToFr(new Date())}
            </p>
          )}
        </div>

        {/* Carte de pointage */}
        <div className="bg-base-100 rounded-box p-4 shadow-sm">
          <div className="space-y-4">
            {/* Boutons de géolocalisation et carte */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                onClick={handleGeolocation}
                disabled={isLoading}
              >
                <Icons.location className="w-5 h-5 mr-2" />
                Position
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowMap(!showMap)}
                disabled={!location}
              >
                <Icons.map className="w-5 h-5 mr-2" />
                Carte
              </button>
            </div>

            {/* Carte */}
            {showMap && location && (
              <div className="rounded-box overflow-hidden">
                <LocationMap latitude={location.lat} longitude={location.lng} />
              </div>
            )}

            {/* Position détectée */}
            {location && (
              <div className="alert alert-success text-sm">
                <Icons.check className="w-5 h-5" />
                <span>Position OK: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
              </div>
            )}

            {/* Commentaire */}
            <div className="form-control">
              <textarea 
                className="textarea textarea-bordered h-16" 
                placeholder="Commentaire (optionnel)"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
              />
            </div>

            {/* Boutons de pointage */}
            <div className="grid grid-cols-1 gap-2">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => handlePointage('ARRIVEE')}
                disabled={!location || !peutPointerArrivee || !isHeureAutorisee() || !isWorkDay}
              >
                <Icons.clock className="w-6 h-6 mr-2" />
                Pointer l'arrivée
              </button>
              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => handlePointage('DEPART')}
                disabled={!location || !peutPointerDepart || !isHeureAutorisee() || !isWorkDay}
              >
                <Icons.logout className="w-6 h-6 mr-2" />
                Pointer le départ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 