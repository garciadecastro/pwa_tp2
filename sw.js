//Creacion de constante para guardar el cache
const CACHE_NAME = 'my-cache-v1';

//Ponemos todo lo que queremos cachear, desde los archivos base como los index y .js hasta imagenes
//importantes como el logo y nuestros frameworks y librerias
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/indexeddb.js',
    '/imagenes/logopeli.png',
    '/imagenes/todoCinelogoNegativo.png',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

//Instalamos el service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    response => {
                        // Nos fijamos bien si obtuvimos una response valida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clonamos nuestro response ya que el buscador que usemos va a consumirla,
                        // por ende necesitaremos clonarla asi tenemos 2, una para consumo y otra para que esté
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

self.addEventListener('activate', event => {
    var cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
