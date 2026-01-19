self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Network-first for navigation and same-origin requests, fall back to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const isSameOrigin = request.url.startsWith(self.location.origin);

  if (request.method !== 'GET' || !isSameOrigin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open('watshibo-runtime-v1').then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
