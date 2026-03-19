/// <reference lib="webworker" />

const CACHE_NAME = "earthecho-v2";
const OFFLINE_URL = "/offline";

// Static assets to pre-cache on install
const PRECACHE_URLS = [
  "/",
  "/offline",
  "/icon.png",
  "/icon-192.png",
  "/assets/ee-logo.webp",
  "/manifest.json",
];

// ===== Install: pre-cache the app shell =====
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ===== Activate: clean up old caches =====
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

// ===== Fetch: cache strategies =====
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (POST for server actions, etc.)
  if (request.method !== "GET") return;

  // Skip chrome-extension, webpack HMR, and other non-http(s) schemes
  if (!url.protocol.startsWith("http")) return;

  // Strategy 1: Cache-first for static assets (images, fonts, icons, CSS, JS bundles)
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Strategy 2: Network-first for navigation (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
      )
    );
    return;
  }

  // Strategy 3: Stale-while-revalidate for API/data requests
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

/**
 * Returns true for static assets that benefit from cache-first.
 */
function isStaticAsset(url) {
  const path = url.pathname;
  return (
    path.startsWith("/_next/static/") ||
    path.startsWith("/assets/") ||
    path.startsWith("/resources/") ||
    /\.(png|jpg|jpeg|webp|svg|ico|woff2?|ttf|css|js)$/.test(path)
  );
}

// ===== Push notification handler =====
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "Earth Echo", body: event.data.text() };
  }

  const options = {
    body: data.body || "",
    icon: "/icon.png",
    badge: "/icon-192.png",
    tag: data.tag || "earthecho-notification",
    data: { href: data.href || "/dashboard" },
    vibrate: [100, 50, 100],
    actions: data.actions || [],
  };

  event.waitUntil(self.registration.showNotification(data.title || "Earth Echo", options));
});

// ===== Notification click handler =====
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const href = event.notification.data?.href || "/dashboard";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(href);
            return client.focus();
          }
        }
        return self.clients.openWindow(href);
      })
  );
});
