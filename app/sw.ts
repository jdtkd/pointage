// Service Worker pour le support hors ligne
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'pointage-app-v1';

const STATIC_ASSETS = [
  '/',
  '/pointer',
  '/historique',
  '/parametres',
  '/manifest.json',
  // Ajoutez ici d'autres ressources statiques
] as const;

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourne la ressource du cache si elle existe
      if (response) {
        return response;
      }

      // Sinon, fait la requête réseau
      return fetch(event.request).then((networkResponse) => {
        // Ne met en cache que les requêtes réussies
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        void caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});

// Ajoutez ces types si nécessaire
interface ServiceWorkerGlobalScope extends ServiceWorkerGlobalScopeEventMap {
  addEventListener(
    type: 'install',
    listener: (event: ExtendableEvent) => void
  ): void;
  addEventListener(
    type: 'fetch',
    listener: (event: FetchEvent) => void
  ): void;
} 