
const PREFIX = 'seatreasures:';
const CACHE = PREFIX + "362fe0739e9d8641";
const FILES = ["./","./assets/FieldPlates-BXeeV5EK.css","./assets/FieldPlates-DHLK1LFm.js","./assets/ShellLab-BA_vhrJp.js","./assets/Stage-DHTxt3sS.js","./assets/index-BwBzdA2b.css","./assets/index-CdF6Un90.js","./assets/ink-3mReHegO.js","./assets/inter-cyrillic-ext-wght-normal-BOeWTOD4.woff2","./assets/inter-cyrillic-wght-normal-DqGufNeO.woff2","./assets/inter-greek-ext-wght-normal-DlzME5K_.woff2","./assets/inter-greek-wght-normal-CkhJZR-_.woff2","./assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2","./assets/inter-latin-wght-normal-Dx4kXJAl.woff2","./assets/inter-vietnamese-wght-normal-CBcvBZtf.woff2","./assets/source-serif-4-cyrillic-ext-wght-normal-DHTKMUil.woff2","./assets/source-serif-4-cyrillic-wght-normal-B1g8a0vD.woff2","./assets/source-serif-4-greek-wght-normal-BpXpdlRW.woff2","./assets/source-serif-4-latin-ext-wght-normal-BVZ5su8S.woff2","./assets/source-serif-4-latin-wght-normal-DMe4EKeb.woff2","./assets/source-serif-4-vietnamese-wght-normal-BsaNuasd.woff2","./index.html","./manifest.webmanifest","./shell-icon-180.png","./shell-icon-192.png","./shell-icon-512.png","./shell-mark.svg"];
// Only these prebuilt assets are invariant across a server's CORS Vary headers.
const ASSETS = new Set(FILES.map((file) => new URL(file, self.registration.scope).href));
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((key) => key.startsWith(PREFIX) && key !== CACHE).map((key) => caches.delete(key)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin ||
      !url.href.startsWith(self.registration.scope)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(async (error) => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(new URL('./index.html', self.registration.scope), { ignoreVary: true });
      if (!cached) throw error;
      return cached;
    }));
  } else if (ASSETS.has(url.href)) {
    event.respondWith(caches.open(CACHE)
      .then((cache) => cache.match(url.href, { ignoreVary: true }))
      .then((cached) => cached || fetch(event.request)));
  }
});
