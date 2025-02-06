"use client";
import { useRouter } from 'next/navigation';
import { usePointageStore } from './stores/pointageStore';
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {description && <div className="stat-desc">{description}</div>}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { pointages, dernierPointage } = usePointageStore();
  const { user, isLoaded } = useUser();

  // Rediriger vers la page de connexion si non authentifié
  if (isLoaded && !user) {
    router.push('/sign-in');
    return null;
  }

  // Calculer les statistiques
  const aujourdhui = new Date().toLocaleDateString();
  const pointagesAujourdhui = pointages.filter(p => 
    new Date(p.timestamp).toLocaleDateString() === aujourdhui
  );

  // Calculer le temps de travail (si on a un pointage d'arrivée et de départ)
  const calculerTempsDePresence = () => {
    const dernierPointageArrivee = pointagesAujourdhui.find(p => p.type === 'ARRIVEE');
    const dernierPointageDepart = pointagesAujourdhui.find(p => p.type === 'DEPART');

    if (dernierPointageArrivee && dernierPointageDepart) {
      const debut = new Date(dernierPointageArrivee.timestamp);
      const fin = new Date(dernierPointageDepart.timestamp);
      const diffHeures = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
      return `${Math.floor(diffHeures)}h${Math.round((diffHeures % 1) * 60)}`;
    }
    return '--:--';
  };

  // Déterminer le statut actuel
  const determinerStatut = () => {
    if (!dernierPointage) return 'Non pointé';
    return dernierPointage.type === 'ARRIVEE' ? 'Présent' : 'Absent';
  };

  // Gérer les actions rapides
  const handlePointer = () => {
    router.push('/pointer');
  };

  const handleHistorique = () => {
    router.push('/historique');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section avec nom de l'utilisateur */}
      <div className="hero bg-base-100 rounded-box p-6 mb-6">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-4xl font-bold">
              Bienvenue {user?.firstName || 'sur l\'App de Pointage'}
            </h1>
            <p className="py-6">Gérez facilement vos présences avec la géolocalisation.</p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={handlePointer}
            >
              📍 Pointer maintenant
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard 
          title="Pointages du jour" 
          value={pointagesAujourdhui.length} 
          description={`Dernier: ${dernierPointage ? new Date(dernierPointage.timestamp).toLocaleTimeString() : '--:--'}`} 
        />
        <StatCard 
          title="Temps de travail" 
          value={calculerTempsDePresence()} 
          description="Aujourd'hui" 
        />
        <StatCard 
          title="Statut" 
          value={determinerStatut()} 
          description={dernierPointage ? `Depuis ${new Date(dernierPointage.timestamp).toLocaleTimeString()}` : 'Aucun pointage'} 
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Actions rapides</h2>
            <div className="flex flex-col gap-2">
              <button 
                className="btn btn-primary btn-lg"
                onClick={handlePointer}
              >
                📍 Pointer avec géolocalisation
              </button>
              <button 
                className="btn btn-secondary btn-lg"
                onClick={handleHistorique}
              >
                📊 Voir l'historique
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Derniers pointages</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {pointages.slice(0, 5).map((pointage) => (
                    <tr key={pointage.id}>
                      <td>{new Date(pointage.timestamp).toLocaleString()}</td>
                      <td>{pointage.type}</td>
                      <td>
                        <span className={`badge badge-${
                          pointage.status === 'VALIDE' ? 'success' :
                          pointage.status === 'REJETE' ? 'error' : 'warning'
                        }`}>
                          {pointage.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {pointages.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center">
                        Aucun pointage enregistré
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
