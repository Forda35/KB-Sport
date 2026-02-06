const CACHE_NAME = "windsurf-pro-v1";
const OFFLINE_URL = "/index.html";

const ASSETS = [
  "index.html",
  "contact.html",
  "css/style.css",
  "js/app.js",
  "manifest.json",
  "images/fmx-logo.webp",
  "images/s2maui-logo.webp",
];

/* ======================
   INSTALL
====================== */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

/* ======================
   ACTIVATE
====================== */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

/* ======================
   FETCH
====================== */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, copy);
          });
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL));
    })
  );
});
