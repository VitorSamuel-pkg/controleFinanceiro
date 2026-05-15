// ===============================
// service-worker.js
// ===============================

const CACHE_NAME = 'controle-financeiro-v2';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',

  // Ícones
  './icons/android-chrome-192x192.png',
  './icons/android-chrome-512x512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32x32.png',
  './icons/favicon-16x16.png',
  './icons/favicon.ico',

  // CSS / JS
  './style.css',
  './script.js'
];

// ===============================
// INSTALAÇÃO
// ===============================

self.addEventListener('install', event => {
  console.log('Service Worker instalado');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE);
      })
  );

  self.skipWaiting();
});

// ===============================
// ATIVAÇÃO
// ===============================

self.addEventListener('activate', event => {
  console.log('Service Worker ativado');

  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// ===============================
// INTERCEPTA REQUISIÇÕES
// ===============================

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {

        // Retorna cache se existir
        if (response) {
          return response;
        }

        // Busca da internet
        return fetch(event.request)
          .then(networkResponse => {

            // Salva no cache
            return caches.open(CACHE_NAME)
              .then(cache => {

                cache.put(
                  event.request,
                  networkResponse.clone()
                );

                return networkResponse;
              });
          });
      })
      .catch(() => {

        // Fallback offline opcional
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
}); 