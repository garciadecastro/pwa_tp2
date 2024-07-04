let db; // Variable global que almacena la instancia de la base de datos

const CACHE_NAME = 'my-cache-name'; // Creamos una constante llamada CACHE_NAME para que contenga el nombre del cache

const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('FavoritasDB', 1);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            const store = db.createObjectStore('peliculas', { keyPath: 'Title' });
            store.createIndex('Year', 'Year', { unique: false });
            store.createIndex('Director', 'Director', { unique: false });
            console.log('onupgradeneeded: Base de datos creada o actualizada');
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('onsuccess: Base de datos abierta con éxito');
            resolve(db);
        };

        request.onerror = (event) => {
            Swal.fire({
                title: 'Error',
                text: 'Error al abrir IndexedDB: ' + event.target.errorCode,
                icon: 'error'
            });
            console.error('Error al abrir IndexedDB:', event);
            reject('Error al abrir IndexedDB');
        };
    });
};

const agregarPelicula = (pelicula) => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('La base de datos no está inicializada');
            return;
        }
        const transaction = db.transaction(['peliculas'], 'readwrite');
        const store = transaction.objectStore('peliculas');
        const request = store.add(pelicula);

        request.onsuccess = () => {
            // Sincronizar con el caché
            navigator.serviceWorker.ready.then(registration => {
                registration.sync.register('sync-favorites');
            });
            resolve();
        };

        request.onerror = (event) => {
            console.error('Error al agregar la película a IndexedDB:', event);
            reject('Error al agregar la película', event);
        };
    });
};

const obtenerPeliculas = () => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('La base de datos no está inicializada');
            return;
        }
        const transaction = db.transaction(['peliculas'], 'readonly');
        const store = transaction.objectStore('peliculas');
        const request = store.getAll();

        request.onsuccess = (event) => {
            console.log('Películas obtenidas de IndexedDB:', event.target.result);
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error('Error al obtener películas de IndexedDB:', event);
            reject('Error al obtener películas', event);
        };
    });
};

const eliminarPelicula = (title) => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('La base de datos no está inicializada');
            return;
        }
        const transaction = db.transaction(['peliculas'], 'readwrite');
        const store = transaction.objectStore('peliculas');
        const request = store.delete(title);

        request.onsuccess = () => {
            // Eliminar del caché
            caches.open(CACHE_NAME).then(cache => {
                cache.delete(title);
            });
            resolve();
        };

        request.onerror = (event) => {
            console.error('Error al eliminar la película de IndexedDB:', event);
            reject('Error al eliminar la película', event);
        };
    });
};

const borrarFavoritas = () => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('La base de datos no está inicializada');
            return;
        }
        const transaction = db.transaction(['peliculas'], 'readwrite');
        const store = transaction.objectStore('peliculas');
        const request = store.clear();

        request.onsuccess = () => {
            // Limpiar el caché
            caches.open(CACHE_NAME).then(cache => {
                cache.keys().then(keys => {
                    keys.forEach(key => cache.delete(key));
                });
            });
            resolve();
        };

        request.onerror = (event) => {
            console.error('Error al borrar la colección de películas de IndexedDB:', event);
            reject('Error al borrar la colección', event);
        };
    });
};
