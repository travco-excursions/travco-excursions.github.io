const CACHE_NAME = 'cache-v1.0.0'; 

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/res/js/index.js',
  '/res/css/index.css',
  
  '/manifest.json',

  '/res/libs/vue/vue.global.prod.js',
  '/res/libs/vue/vue-router.global.prod.js',
  '/res/libs/vue/vuex.global.prod.js',
  
  '/res/libs/beercss/beer.min.js',
  '/res/libs/beercss/beer.min.css',
  '/res/libs/beercss/material-symbols-outlined.woff2',
  '/res/libs/beercss/material-symbols-rounded.woff2',
  '/res/libs/beercss/material-symbols-sharp.woff2',
  '/res/libs/beercss/material-symbols-subset.woff2'
];

// Install event - handles caching your specified files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Cache Cleanup - removes old cache buckets automatically
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Listen for SKIP_WAITING command from app.js
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// --- UPDATED STRATEGY: Network-First ---
// Forces live network loading when online, falls back to cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // SAFEGUARD: Only cache standard GET requests from your own origin
        const isGetRequest = event.request.method === 'GET';
        const isLocalOrigin = event.request.url.startsWith(self.location.origin);

        if (networkResponse && networkResponse.status === 200 && isGetRequest && isLocalOrigin) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // OFFLINE FALLBACK: If network fails (no connection), serve from cache
        return caches.match(event.request);
      })
  );
});
