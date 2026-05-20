const CACHE_NAME='vue-cache-v2',

STATIC_ASSETS=[
'/',
'/offline.html',
'/manifest.json',
'/res/lib/vue/vue.global.prod.js',
'/res/lib/vue/vue-router.global.prod.js',
'/res/lib/vue/vue-i18n.global.prod.js',
'/res/lib/beercss/beer.min.css',
'/res/lib/beercss/beer.min.js',
'/res/lib/beercss/material-symbols-outlined.woff2',
'/res/lib/beercss/material-symbols-rounded.woff2',
'/res/lib/beercss/material-symbols-sharp.woff2',
'/res/lib/beercss/material-symbols-subset.woff2'
];

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(STATIC_ASSETS)).then(()=>self.skipWaiting()))});

self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME&&caches.delete(k)))).then(()=>self.clients.claim()))});

self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put(e.request,c));return r}).catch(async()=>await caches.match(e.request)||await caches.match('/offline.html')));return}e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(!r||r.status!==200||r.type!=='basic')return r;const x=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put(e.request,x));return r}).catch(()=>{})))}); 

self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting()});