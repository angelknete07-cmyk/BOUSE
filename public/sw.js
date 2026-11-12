/* BOUSE service worker — offline reading, no data collection.
 * Pages: network first, cached copy when offline.
 * Built assets (/assets, /fonts, /icons): cache first; their names are hashed
 * or versioned, so a cached file never goes stale.
 * Cross-origin requests (account sync, mentor) are never touched.
 * ignoreVary: module scripts are requested with crossorigin (Origin header)
 * while the precache stored them without it; files are content-addressed. */
const VERSION = "bouse-dev";
// Replaced at build time with every emitted file (see vite.config.ts).
const PRECACHE = [];
const SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icons/favicon-32.png",
  "/icons/icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll([...new Set([...SHELL, ...PRECACHE])])),
  );
});

// The person asked for the update (button in the app): activate now.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("bouse-") && key !== VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    // Keep the shell and its hashed assets on the same release. An update
    // waits until existing tabs close; it never evicts assets under a live tab.
    event.respondWith(
      caches
        .open(VERSION)
        .then((cache) =>
          cache
            .match("/", { ignoreVary: true })
            .then((cached) => cached || fetch(request)),
        ),
    );
    return;
  }

  if (
    /^\/(assets|fonts|icons)\//.test(url.pathname) ||
    SHELL.includes(url.pathname)
  ) {
    event.respondWith(
      caches.match(request, { ignoreVary: true }).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(VERSION).then((cache) => cache.put(request, copy));
            }
            return response;
          }),
      ),
    );
  }
});
