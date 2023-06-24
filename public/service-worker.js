const VERSION = '1.0.0';

const CACHE_NAME = `pwa-cache-${VERSION}`;

const INITIAL_CACHED_RESOURCES = [
  '/login/',
  '/error/',
  '/notallowed/',
  '/signup/',
];

// install event handler (note async operation)
// opens named cache, pre-caches identified resources above
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(INITIAL_CACHED_RESOURCES);
    })()
  );
});

self.addEventListener('fetch', () => {
  return;
});
