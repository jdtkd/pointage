// Service Worker pour le support hors ligne
const CACHE_NAME = 'pointage-app-v1';

const STATIC_ASSETS = [
  '/',
  '/pointer',
  '/historique',
  '/parametres',
  '/manifest.json',
  // Ajoutez ici d'autres ressources statiques
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourne la ressource du cache si elle existe
      if (response) {
        return response;
      }

      // Sinon, fait la requête réseau
      return fetch(event.request).then((response) => {
        // Ne met en cache que les requêtes réussies
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
}); 