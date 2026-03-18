/// <reference lib="webworker" />

const CACHE_NAME = "earthecho-v1";
const OFFLINE_URL = "/offline";

// Install: cache the app shell
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Push notification handler
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
    badge: "/icon.png",
    tag: data.tag || "earthecho-notification",
    data: { href: data.href || "/dashboard" },
    vibrate: [100, 50, 100],
    actions: data.actions || [],
  };

  event.waitUntil(self.registration.showNotification(data.title || "Earth Echo", options));
});

// Notification click handler — open the relevant page
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const href = event.notification.data?.href || "/dashboard";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Focus existing tab if one is open
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(href);
            return client.focus();
          }
        }
        // Otherwise open a new window
        return self.clients.openWindow(href);
      })
  );
});
