const CACHE = "agerdin-static-v86";
const ASSETS = ["/", "/index.html", "/404.html", "/manifest.webmanifest", "/service-worker.js", "/css/style.css", "/app.js", "/assets/agerdin-mark.svg", "/assets/pwa-192.png", "/assets/pwa-512.png", "/assets/fonts/agerdin-sans-regular.ttf", "/assets/fonts/agerdin-sans-bold.ttf", "/assets/fonts/agerdin-serif-regular.ttf", "/assets/fonts/agerdin-serif-bold.ttf", "/game-thumbnails.jpg", "/og-image.png", "/robots.txt", "/sitemap.xml"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("agerdin-static-") && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put("/index.html", copy)); return response;
    }).catch(async () => (await caches.match("/index.html")) || (await caches.match("/"))));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(request, copy)); }
    return response;
  })));
});
