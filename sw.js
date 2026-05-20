const CACHE_NAME = 'vue-cache-v1';
const STATIC_ASSETS = [
  'offline.html',
  'manifest.json',

  'res/lib/vue/vue.global.prod.js',
  'res/lib/vue/vue-router.global.prod.js',
  'res/lib/vue/vue-i18n.global.prod.js',
  
  'res/lib/beercss/beer.min.css',
  'res/lib/beercss/beer.min.js',
  'res/lib/beercss/material-symbols-outlined.woff2',
  'res/lib/beercss/material-symbols-rounded.woff2',
  'res/lib/beercss/material-symbols-sharp.woff2',
  'res/lib/beercss/material-symbols-subset.woff2',
];

// ✅ Install: Only cache static assets (not HTML pages)
self.addEventListener('install', event => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ✅ Activate: Clean up ALL old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ✅ Fetch: Network-first for HTML, cache-first for others
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // 🔁 For full page navigations: try network, fallback to offline.html
    event.respondWith(
      fetch(event.request)
      .then(response => response)
      .catch(() => caches.match('/offline.html'))
    );
  } else {
    // 🎯 For CSS, JS, icons, etc.
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});