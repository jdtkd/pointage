export const MicroFrontendConfig = {
  modules: {
    clock: {
      path: '/apps/clock',
      name: 'Clock Module',
      description: 'Affiche l\'heure actuelle',
    },
    timeClock: {
      path: '/apps/time-clock',
      name: 'Time Clock Module',
      description: 'Gestion des pointages',
    },
    dashboard: {
      path: '/apps/dashboard',
      name: 'Dashboard Module',
      description: 'Statistiques de pointage',
    },
    history: {
      path: '/apps/history',
      name: 'History Module',
      description: 'Historique des pointages',
    },
  },
  shared: {
    components: '/components',
    hooks: '/hooks',
    services: '/lib/services',
  },
}; 