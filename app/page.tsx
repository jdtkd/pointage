import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="hero bg-base-100 rounded-box p-6 mb-6">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-4xl font-bold">Bienvenue sur l'App de Pointage</h1>
            <p className="py-6">Gérez facilement vos présences et votre temps de travail.</p>
            <button className="btn btn-primary">Pointer maintenant</button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Pointages du jour</div>
            <div className="stat-value">31</div>
            <div className="stat-desc">↗︎ +5% par rapport à hier</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Temps de travail</div>
            <div className="stat-value">7h30</div>
            <div className="stat-desc">Aujourd'hui</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Statut</div>
            <div className="stat-value text-success">Présent</div>
            <div className="stat-desc">Depuis 8h30</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Actions rapides</h2>
            <div className="flex flex-col gap-2">
              <button className="btn btn-primary">📍 Pointer l'arrivée</button>
              <button className="btn btn-secondary">🏃 Pointer le départ</button>
              <button className="btn btn-accent">📝 Déclarer une absence</button>
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
                  <tr>
                    <td>Aujourd'hui 8h30</td>
                    <td>Arrivée</td>
                    <td><span className="badge badge-success">Validé</span></td>
                  </tr>
                  <tr>
                    <td>Hier 17h00</td>
                    <td>Départ</td>
                    <td><span className="badge badge-success">Validé</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
