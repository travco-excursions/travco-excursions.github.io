const CACHE_NAME = 'cache-v1.0.1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/res/js/index.js',
  '/res/css/index.css',
  '/manifest.json',
  '/res/libs/vue/vue.global.prod.js',
  '/res/libs/vue/vue-router.global.prod.js',
  '/res/libs/vue/vuex.global.prod.js',
  '/res/libs/beercss/beer.min.js',
  '/res/libs/beercss/beer.min.css'
];

// INSTALL
self.addEventListener('install', e => e.waitUntil((async () => {
  const c = await caches.open(CACHE_NAME);
  
  for (const a of STATIC_ASSETS) {
    try {
      const r = await fetch(a, { cache: 'no-cache' });
      if (r.ok) await c.put(a, r.clone());
    } catch (err) {
      console.error('Cache failed:', a, err);
    }
  }
  
  await self.skipWaiting();
  
})()));

// ACTIVATE
self.addEventListener('activate', e => e.waitUntil(
  caches.keys()
  .then(keys => Promise.all(
    keys.map(k => k !== CACHE_NAME && caches.delete(k))
  ))
  .then(() => self.clients.claim())
));

// MESSAGE
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// FETCH
self.addEventListener('fetch', e => {
  
  if (e.request.method !== 'GET') return;
  
  e.respondWith((async () => {
    
    try {
      
      // ALWAYS GET FRESH DATA
      const networkResponse = await fetch(e.request, {
        cache: 'no-store'
      });
      
      // ONLY CACHE STATIC FILES
      const isStatic =
        STATIC_ASSETS.includes(
          new URL(e.request.url).pathname
        );
      
      if (
        isStatic &&
        networkResponse &&
        networkResponse.status === 200
      ) {
        const c = await caches.open(CACHE_NAME);
        c.put(e.request, networkResponse.clone());
      }
      
      return networkResponse;
      
    } catch (err) {
      
      // OFFLINE FALLBACK
      const cached = await caches.match(e.request);
      
      if (cached) return cached;
      
      throw err;
      
    }
    
  })());
  
});



// REGISTER SW
if ('serviceWorker' in navigator) {
  
  window.addEventListener('load', async () => {
    
    let refreshing = false;
    
    try {
      
      const registration =
        await navigator.serviceWorker.register('/sw.js');
      
      console.log(
        'SW registered:',
        registration.scope
      );
      
      // CHECK FOR UPDATES
      setInterval(() => {
        registration.update();
      }, 1000 * 60);
      
      // ACTIVATE WAITING WORKER
      if (
        registration.waiting &&
        navigator.serviceWorker.controller
      ) {
        registration.waiting.postMessage({
          type: 'SKIP_WAITING'
        });
      }
      
      // DETECT NEW VERSION
      registration.addEventListener(
        'updatefound',
        () => {
          
          const newWorker =
            registration.installing;
          
          if (!newWorker) return;
          
          newWorker.addEventListener(
            'statechange',
            () => {
              
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                
                newWorker.postMessage({
                  type: 'SKIP_WAITING'
                });
                
              }
              
            }
          );
          
        }
      );
      
    } catch (err) {
      
      console.error(
        'SW registration failed:',
        err
      );
      
    }
    
    // RELOAD ON UPDATE
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      () => {
        
        if (refreshing) return;
        
        refreshing = true;
        
        window.location.reload();
        
      }
    );
    
  });
  
}