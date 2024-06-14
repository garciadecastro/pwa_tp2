//Archivos del cache
const archivoCache = [
  '/',
  'index.html',
  'favoritas.html',
  'app.js',
  'favoritas.js',
  'style.css',
  'favicon.ico',
  'images/logopeli.png',
  'images/nohaypeli.png'
];


// Se ejecuta una sola vez
self.addEventListener('install', () => {
    console.log('SW: Install');
  });

  self.addEventListener('install', evento => {
    // Abro un caché
    const cache = caches.open('mi-cache-1').then(cache => {
      // Guarda los datos del caché necesario para que la app funcione sin conexión
      return cache.addAll(['/', 'favoritas.html','index.html', 'style.css', 'favicon.ico']);
    })
    // Espera hasta que la promesa se resuelva
    evento.waitUntil(cache)
  })
  
  
  // Cuando se instala se activa
  self.addEventListener('activate', () => {
    console.log('SW: Activado');
  });

// Evento Fetch -> cada request al Servidor
self.addEventListener('fetch', (evento) => {
    const url = evento.request.url;
    
  });