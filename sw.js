// ציוצייה – service worker: app shell offline + cached tweet images
const SHELL_CACHE = 'tziutziya-shell-v4';
const IMG_CACHE = 'tziutziya-img-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => ![SHELL_CACHE, IMG_CACHE].includes(k)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Page itself: network-first, so a new deploy shows up on the very next open.
  // Falls back to the cached copy when offline.
  if (url.origin === location.origin && req.mode === 'navigate') {
    e.respondWith(caches.open(SHELL_CACHE).then(async cache => {
      try {
        const res = await fetch(req, { cache: 'no-store' });
        if (res.ok) cache.put('./index.html', res.clone());
        return res;
      } catch (err) {
        return (await cache.match('./index.html')) || Response.error();
      }
    }));
    return;
  }

  // Other app files (icons, manifest): stale-while-revalidate
  if (url.origin === location.origin) {
    e.respondWith(caches.open(SHELL_CACHE).then(async cache => {
      const key = req.mode === 'navigate' ? './index.html' : req;
      const cached = await cache.match(key, { ignoreSearch: req.mode === 'navigate' });
      const net = fetch(req).then(res => {
        if (res.ok) cache.put(key, res.clone());
        return res;
      }).catch(() => cached);
      return cached || net;
    }));
    return;
  }

  // Tweet images & avatars: cache-first so saved tweets still show offline
  if (url.hostname === 'pbs.twimg.com') {
    e.respondWith(caches.open(IMG_CACHE).then(async cache => {
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
        return res;
      } catch (err) {
        return cached || Response.error();
      }
    }));
  }
  // Everything else (FxTwitter API, videos): straight to network
});
