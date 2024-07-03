// proper initialization
if ('function' === typeof importScripts) {
    importScripts('indexeddb.js');

const CACHE_NAME = 'todo-cine-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/favoritas.html',
    '/style.css',
    '/app.js',
    '/indexeddb.js',
    '/favoritas.js',
    '/imagenes/logopeli.png',
    '/icons',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// Instalación del Service Worker y almacenamiento de recursos en el caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Abierto caché');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activación del Service Worker y limpieza de cachés antiguos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
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

// Interceptar las solicitudes de red y servir los archivos desde el caché
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Si el recurso está en caché, devuélvelo
                }
                return fetch(event.request); // Si no, realiza la solicitud de red
            })
    );
});

// Sincronizar la base de datos de favoritos con el caché
const syncFavoritesWithCache = async () => {
    const db = await openDatabase();
    const favoritas = await obtenerPeliculas();
    const cache = await caches.open(CACHE_NAME);

    favoritas.forEach(pelicula => {
        cache.put(pelicula.Title, new Response(JSON.stringify(pelicula), { headers: { 'Content-Type': 'application/json' } }));
    });
};

self.addEventListener('sync', event => {
    if (event.tag === 'sync-favorites') {
        event.waitUntil(syncFavoritesWithCache());
    }
});
}