const CACHE = 'concept-cracker-v2';
const ASSETS = [
  '/concept-cracker/',
  '/concept-cracker/index.html',
  '/concept-cracker/manifest.json',
  '/concept-cracker/icons/icon-192.png',
  '/concept-cracker/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  // Only handle our own site's files. Firebase / Firestore / Google / CDN
  // requests go straight to the network so data is never served stale.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // Network first, and always re-check with the server (skips the 10-minute
  // GitHub Pages browser cache). Cache is used only when offline.
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
