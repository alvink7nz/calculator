const CACHE_NAME = 'mathegraphical-cache-afeeeb0';

const urlsToCache = [
  '.',
  'index.html',
  'manifest.json',
  'mathegraphicallogo.svg',
  'mathegraphicallogo2.png'
];

// Install the service worker and cache your files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );

  self.skipWaiting();
});

// Activate worker and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Serve cached content when offline, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});