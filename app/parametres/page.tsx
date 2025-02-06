export default function ParametresPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Paramètres</h2>

          {/* Paramètres de notification */}
          <div className="collapse collapse-arrow bg-base-200 mb-4">
            <input type="checkbox" /> 
            <div className="collapse-title text-xl font-medium">
              🔔 Notifications
            </div>
            <div className="collapse-content">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Rappels de pointage</span> 
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Notifications par email</span> 
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Notifications push</span> 
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>
            </div>
          </div>

          {/* Paramètres de géolocalisation */}
          <div className="collapse collapse-arrow bg-base-200 mb-4">
            <input type="checkbox" /> 
            <div className="collapse-title text-xl font-medium">
              📍 Géolocalisation
            </div>
            <div className="collapse-content">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Activer la géolocalisation automatique</span> 
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Rayon de tolérance (mètres)</span>
                </label>
                <input type="number" className="input input-bordered" placeholder="100" />
              </div>
            </div>
          </div>

          {/* Paramètres du compte */}
          <div className="collapse collapse-arrow bg-base-200 mb-4">
            <input type="checkbox" /> 
            <div className="collapse-title text-xl font-medium">
              👤 Compte
            </div>
            <div className="collapse-content">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" className="input input-bordered" value="utilisateur@example.com" disabled />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Fuseau horaire</span>
                </label>
                <select className="select select-bordered">
                  <option>Europe/Paris</option>
                  <option>Europe/London</option>
                  <option>America/New_York</option>
                </select>
              </div>
              <button className="btn btn-warning">
                🔑 Changer le mot de passe
              </button>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4 mt-6">
            <button className="btn btn-ghost">Annuler</button>
            <button className="btn btn-primary">Enregistrer les modifications</button>
          </div>
        </div>
      </div>
    </div>
  );
} 