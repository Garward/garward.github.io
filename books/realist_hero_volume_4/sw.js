// Cache name (can be book-specific if you want)
const CACHE_NAME = "jnovel-realist_hero_volume_4-v1";

// Files to cache
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./jnovel_reader.js",
  "./jnovel_reader.css"
];

// Install: cache all core files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache first, fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
