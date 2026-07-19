const C = "ks-lern-v9";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(C).then(c => c.put(e.request, copy));
      return resp;
    }).catch(() => caches.match("./index.html")))
  );
});
