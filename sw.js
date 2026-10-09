// Service worker de Mi Sistema Personal (archivo GENERADO por tools/generar-sw.mjs: no editar a mano).
// Guarda en el teléfono todos los archivos de la app para que funcione sin internet.
// Tus datos NO pasan por aquí: viven en IndexedDB y nunca se envían a ningún sitio.

const VERSION = 'b3129abef0';
const CACHE = `mi-sistema-${VERSION}`;
const ARCHIVOS = [
  "./",
  "./apple-touch-icon.png",
  "./icono-192.png",
  "./icono-512.png",
  "./icono-adaptable-512.png",
  "./icono.svg",
  "./index.html",
  "./manifest.webmanifest"
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ARCHIVOS)));
  // No se activa solo: espera a que el usuario pulse "Actualizar" en la app.
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((c) => c.startsWith('mi-sistema-') && c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (evento) => {
  if (evento.data === 'actualizar') self.skipWaiting();
  if (evento.data === 'version' && evento.ports[0]) evento.ports[0].postMessage(VERSION);
});

// Primero la copia guardada (rápido y sin conexión); si no está, la red.
self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET') return;
  const url = new URL(peticion.url);
  if (url.origin !== self.location.origin) return; // nunca toca otros sitios
  if (peticion.mode === 'navigate') {
    evento.respondWith(caches.match('./index.html', { cacheName: CACHE }).then((r) => r || fetch(peticion)));
    return;
  }
  evento.respondWith(caches.match(peticion, { cacheName: CACHE, ignoreSearch: true }).then((r) => r || fetch(peticion)));
});
