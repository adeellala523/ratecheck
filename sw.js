/* Service worker — offline app shell cache */
const CACHE = 'sams-v1';
const ASSETS = [
  './', './index.html', './manifest.json', './icon.svg',
  './css/style.css',
  './js/i18n.js', './js/store.js', './js/seed.js', './js/app.js',
  './js/modules/dashboard.js', './js/modules/setup.js', './js/modules/books.js',
  './js/modules/syllabus.js', './js/modules/papers.js', './js/modules/scanpaper.js',
  './js/modules/checking.js', './js/modules/results.js', './js/modules/attendance.js',
  './js/modules/fees.js', './js/modules/notices.js', './js/modules/expert.js',
  './js/modules/settings.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()).catch(()=>{}));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch:true}).then(hit => {
      if(hit) return hit;
      return fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
