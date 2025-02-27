self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('your-app-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/offline',
        '/manifest.json',
        // Ajoutez ici d'autres ressources à mettre en cache
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    }).catch(function() {
      return caches.match('/offline');
    })
  );
}); 