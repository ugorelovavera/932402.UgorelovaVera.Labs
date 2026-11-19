const CACHE_NAME = "lab6-v1";
const STATIC_ASSETS = [
    "/",
    "/index.html",
    "/about.html",
    "/manifest.json",
    "/app.js",
    "/icons/icon-192.png",
    "/icons/icon-512.png"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys
                    .filter(function (key) { return key !== CACHE_NAME; })
                    .map(function (key) { return caches.delete(key); })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", function (event) {
    const url = new URL(event.request.url);

    if (url.pathname.startsWith("/api/")) {
        event.respondWith(
            fetch(event.request).catch(function () {
                return new Response(
                    JSON.stringify({ error: "Offline", message: "Нет сети" }),
                    { status: 503, headers: { "Content-Type": "application/json" } }
                );
            })
        );
        return;
    }

    if (event.request.method !== "GET") {
    return;}

    event.respondWith(
        caches.match(event.request).then(function (cached) {
            if (cached) return cached;

            return fetch(event.request).then(function (response) {
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, copy);
                    });
                }
                return response;
            });
        })
    );
});