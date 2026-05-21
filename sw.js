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

// Install event - caches specified files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Cache Cleanup - removes old cache versions
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

// Listen for SKIP_WAITING command
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Network-First Strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const isGetRequest = event.request.method === 'GET';
        // FIX: Supports caching both local paths and external CDN HTTP/HTTPS protocols
        const isValidProtocol = event.request.url.startsWith('http');

        if (networkResponse && networkResponse.status === 200 && isGetRequest && isValidProtocol) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request);
      })
  );
});
