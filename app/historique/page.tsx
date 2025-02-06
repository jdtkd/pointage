export default function HistoriquePage() {
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
              <input type="date" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date fin</span>
              </label>
              <input type="date" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Statut</span>
              </label>
              <select className="select select-bordered">
                <option value="">Tous</option>
                <option value="valide">Validé</option>
                <option value="en_attente">En attente</option>
                <option value="rejete">Rejeté</option>
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
                  <th>Type</th>
                  <th>Heure</th>
                  <th>Localisation</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Exemple de données */}
                <tr>
                  <td>2024-03-20</td>
                  <td>Arrivée</td>
                  <td>08:30</td>
                  <td>
                    <button className="btn btn-xs btn-ghost">
                      📍 Voir sur la carte
                    </button>
                  </td>
                  <td>
                    <span className="badge badge-success">Validé</span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-xs btn-ghost">👁️ Détails</button>
                      <button className="btn btn-xs btn-error">🗑️ Supprimer</button>
                    </div>
                  </td>
                </tr>
                {/* Ajoutez plus de lignes ici */}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <div className="join">
              <button className="join-item btn">«</button>
              <button className="join-item btn btn-active">1</button>
              <button className="join-item btn">2</button>
              <button className="join-item btn">3</button>
              <button className="join-item btn">»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 