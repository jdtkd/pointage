"use client";
import { useState, useEffect } from 'react';
import { usePointageStore, Pointage } from '../stores/pointageStore';
import dynamic from 'next/dynamic';
import ClientOnly from '../components/ClientOnly';

const MapWithNoSSR = dynamic(
  async () => {
    await import('leaflet/dist/leaflet.css');
    const { default: Map } = await import('../components/Map');
    return Map;
  },
  { 
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-base-200 rounded-lg flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }
);

export default function HistoriquePage() {
  const { pointages } = usePointageStore();
  const [selectedPointage, setSelectedPointage] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [filtres, setFiltres] = useState({
    dateDebut: '',
    dateFin: '',
    type: '',
    status: ''
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatDate = (date: Date) => {
    if (!isMounted) return '';
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrer les pointages
  const pointagesFiltres = pointages.filter(pointage => {
    const date = new Date(pointage.timestamp);
    const passeFiltreDates = (!filtres.dateDebut || date >= new Date(filtres.dateDebut)) &&
                            (!filtres.dateFin || date <= new Date(filtres.dateFin));
    const passeType = !filtres.type || pointage.type === filtres.type;
    const passeStatus = !filtres.status || pointage.status === filtres.status;
    return passeFiltreDates && passeType && passeStatus;
  });

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col gap-6">
        {/* En-tête avec titre et stats */}
        <div className="bg-base-100 rounded-box p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Historique des pointages</h1>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total</div>
                <div className="stat-value text-lg">{pointagesFiltres.length}</div>
                <div className="stat-desc">pointages</div>
              </div>
            </div>
          </div>

          {/* Filtres avec bouton toggle sur mobile */}
          <div className="collapse collapse-plus bg-base-200 md:bg-transparent rounded-box md:collapse-open">
            <input type="checkbox" /> 
            <div className="collapse-title text-lg font-medium md:hidden">
              Filtres de recherche
            </div>
            <div className="collapse-content p-0 md:p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Date début</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={filtres.dateDebut}
                    onChange={(e) => setFiltres({...filtres, dateDebut: e.target.value})}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Date fin</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={filtres.dateFin}
                    onChange={(e) => setFiltres({...filtres, dateFin: e.target.value})}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Type</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={filtres.type}
                    onChange={(e) => setFiltres({...filtres, type: e.target.value})}
                  >
                    <option value="">Tous les types</option>
                    <option value="ARRIVEE">Arrivée</option>
                    <option value="DEPART">Départ</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Statut</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={filtres.status}
                    onChange={(e) => setFiltres({...filtres, status: e.target.value})}
                  >
                    <option value="">Tous les statuts</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="VALIDE">Validé</option>
                    <option value="REJETE">Rejeté</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Liste des pointages */}
          <div className="bg-base-100 rounded-box shadow-lg">
            <div className="p-6 border-b border-base-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Liste des pointages</h2>
                <div className="badge badge-lg">{pointagesFiltres.length}</div>
              </div>
            </div>
            
            <ClientOnly>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead className="bg-base-200 text-base-content">
                    <tr>
                      <th className="whitespace-normal">Date</th>
                      <th className="whitespace-normal">Type</th>
                      <th className="whitespace-normal">Statut</th>
                      <th className="whitespace-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointagesFiltres.length > 0 ? (
                      pointagesFiltres.map((pointage) => (
                        <tr 
                          key={pointage.id} 
                          className={`hover cursor-pointer transition-colors ${
                            selectedPointage?.id === pointage.id ? 'bg-primary bg-opacity-10' : ''
                          }`}
                          onClick={() => setSelectedPointage(pointage)}
                        >
                          <td className="whitespace-normal">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {formatDate(new Date(pointage.timestamp))}
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-normal">
                            <span className={`badge badge-sm md:badge-md ${
                              pointage.type === 'ARRIVEE' ? 'badge-success' : 'badge-error'
                            }`}>
                              {pointage.type}
                            </span>
                          </td>
                          <td className="whitespace-normal">
                            <span className={`badge badge-sm md:badge-md ${
                              pointage.status === 'VALIDE' ? 'badge-success' : 
                              pointage.status === 'REJETE' ? 'badge-error' : 
                              'badge-warning'
                            }`}>
                              {pointage.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-ghost btn-circle"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPointage(pointage);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <p className="font-medium">Aucun pointage trouvé</p>
                            <p className="text-sm">Modifiez vos filtres pour voir plus de résultats</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </ClientOnly>
          </div>

          {/* Détails du pointage - Reste fixe sur les grands écrans */}
          <div className="xl:sticky xl:top-4 space-y-6">
            <div className="bg-base-100 rounded-box shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6">Détails du pointage</h2>
              <ClientOnly>
                {selectedPointage ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="stat bg-base-200 rounded-box">
                        <div className="stat-title">Date et heure</div>
                        <div className="stat-value text-lg">
                          {formatDate(new Date(selectedPointage.timestamp))}
                        </div>
                      </div>
                      <div className="stat bg-base-200 rounded-box">
                        <div className="stat-title">Type</div>
                        <div className="stat-value text-lg">
                          <span className={`badge ${
                            selectedPointage.type === 'ARRIVEE' ? 'badge-success' : 'badge-error'
                          }`}>
                            {selectedPointage.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="divider"></div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Statut</h3>
                      <div className="flex items-center gap-2">
                        <span className={`badge badge-lg ${
                          selectedPointage.status === 'VALIDE' ? 'badge-success' : 
                          selectedPointage.status === 'REJETE' ? 'badge-error' : 
                          'badge-warning'
                        }`}>
                          {selectedPointage.status}
                        </span>
                      </div>
                    </div>

                    {selectedPointage.commentaire && (
                      <>
                        <div className="divider"></div>
                        <div className="space-y-2">
                          <h3 className="font-semibold">Commentaire</h3>
                          <p className="text-sm bg-base-200 p-3 rounded-lg">
                            {selectedPointage.commentaire}
                          </p>
                        </div>
                      </>
                    )}

                    {selectedPointage.location && (
                      <>
                        <div className="divider"></div>
                        <div className="space-y-4">
                          <h3 className="font-semibold">Localisation</h3>
                          <div className="bg-base-200 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm opacity-70">Latitude</p>
                                <p className="font-mono text-sm">
                                  {selectedPointage.location.lat.toFixed(6)}°
                                </p>
                              </div>
                              <div>
                                <p className="text-sm opacity-70">Longitude</p>
                                <p className="font-mono text-sm">
                                  {selectedPointage.location.lng.toFixed(6)}°
                                </p>
                              </div>
                            </div>
                            <div className="h-[300px] relative">
                              <MapWithNoSSR 
                                position={[
                                  selectedPointage.location.lat,
                                  selectedPointage.location.lng
                                ]} 
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p>Sélectionnez un pointage pour voir les détails</p>
                  </div>
                )}
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 