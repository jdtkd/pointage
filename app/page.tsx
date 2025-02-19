"use client";
import { useRouter } from 'next/navigation';
import { usePointageStore } from './stores/pointageStore';
import { useState, useEffect } from 'react';
import { Icons } from './components/icons';
import { motion } from 'framer-motion';
import { calculerHeuresTravaillees, formatDureeEnHM } from './lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <motion.div 
    className={`card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200 border border-base-200`}
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="card-body">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="card-title text-base-content/70 text-sm mb-2">{title}</h2>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-')}/10`}>
          {icon}
        </div>
      </div>
    </div>
  </motion.div>
);

export default function HomePage() {
  const router = useRouter();
  const { pointages } = usePointageStore();
  const [stats, setStats] = useState({
    totalPointages: 0,
    pointagesAujourdhui: 0,
    heuresTravaillees: '0h',
    dernierPointage: 'Aucun',
    quotaAtteint: 0,
    heuresRestantes: '0h'
  });

  useEffect(() => {
    // Calcul des statistiques
    const aujourdhui = new Date().toLocaleDateString();
    const pointagesAujourdhui = pointages.filter(p => 
      new Date(p.timestamp).toLocaleDateString() === aujourdhui
    ).length;

    const heuresTravaillees = calculerHeuresTravaillees(pointages);

    setStats({
      totalPointages: pointages.length,
      pointagesAujourdhui,
      heuresTravaillees: formatDureeEnHM(heuresTravaillees.total),
      dernierPointage: pointages[0]?.type || 'Aucun',
      quotaAtteint: heuresTravaillees.pourcentageQuota,
      heuresRestantes: formatDureeEnHM(heuresTravaillees.restantes)
    });
  }, [pointages]);

  const handlePointer = () => {
    router.push('/pointer');
  };

  const handleHistorique = () => {
    router.push('/historique');
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div 
        className="flex flex-col gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* En-tête */}
        <div className="bg-base-100 rounded-box p-6 shadow-sm border border-base-200">
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            Tableau de bord 👋
          </motion.h1>
          <p className="text-base-content/70">
            Bienvenue sur votre tableau de bord
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total pointages"
            value={stats.totalPointages.toString()}
            icon={<Icons.history className="w-6 h-6 text-primary" />}
            color="text-primary"
          />
          <StatCard
            title="Pointages aujourd'hui"
            value={stats.pointagesAujourdhui.toString()}
            icon={<Icons.clock className="w-6 h-6 text-secondary" />}
            color="text-secondary"
          />
          <StatCard
            title="Heures travaillées"
            value={stats.heuresTravaillees}
            icon={<Icons.timer className="w-6 h-6 text-accent" />}
            color="text-accent"
          />
          <StatCard
            title="Dernier pointage"
            value={stats.dernierPointage}
            icon={<Icons.check className="w-6 h-6 text-success" />}
            color="text-success"
          />
        </div>

        {/* Statistiques des heures */}
        <div className="bg-base-100 rounded-box p-6 shadow-sm border border-base-200">
          <h2 className="text-xl font-bold mb-4">Quota mensuel</h2>
          <div className="flex flex-col gap-4">
            <div className="w-full bg-base-200 rounded-full h-4">
              <div 
                className="bg-primary rounded-full h-4 transition-all duration-500"
                style={{ width: `${Math.min(stats.quotaAtteint, 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-base-content/70">Heures effectuées</p>
                <p className="text-2xl font-bold">{stats.heuresTravaillees}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-base-content/70">Heures restantes</p>
                <p className="text-2xl font-bold">{stats.heuresRestantes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-base-100 rounded-box p-6 shadow-sm border border-base-200">
          <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              className="btn btn-primary btn-lg gap-3"
              onClick={handlePointer}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icons.clock className="w-6 h-6" />
              Pointer maintenant
            </motion.button>
            <motion.button
              className="btn btn-secondary btn-lg gap-3"
              onClick={handleHistorique}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icons.history className="w-6 h-6" />
              Voir l&apos;historique
            </motion.button>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Heures travaillées</div>
            <div className="stat-value">{stats.heuresTravaillees}</div>
            <div className="stat-desc">
              {stats.quotaAtteint.toFixed(1)}% du quota mensuel
            </div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Heures restantes</div>
            <div className="stat-value">{stats.heuresRestantes}</div>
            <div className="stat-desc">
              sur {formatDureeEnHM(173.3)} heures mensuelles
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
