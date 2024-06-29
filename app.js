if ('serviceWorker' in navigator) {
       // Registrar el SW
    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log('Se ha registrado el Service Worker con éxito:', registration);
        })
        .catch(error => {
            console.error('Error al registrar el Service Worker:', error);
        });
    //Imprimo los objetos registration y error en la consola 
    //para conocer información útil para depurar y entender lo que está sucediendo en mi app
  } else {
    alert('Tu navegador no soporta esta Web APP');
  }
  //Imprimo los objetos registration y error en la consola 
  //para conocer información útil para depurar y entender lo que está sucediendo en mi app

const btnBuscar = document.querySelector('#btnBuscar');
const btnFavoritas = document.querySelector('#btnFavoritas');
const resultados = document.querySelector('#resultados');
const form = document.querySelector('#form');
const titulo = document.querySelector('#titulo');

// API key de OMDB
const apiKey = '525f3483';

// Función para realizar la búsqueda
btnBuscar.addEventListener('click', async () => {
    await realizarBusqueda();
});

// Controla el evento del formulario, nos permite enviar la búsqueda pulsando enter y mejorar la usabilidad
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await realizarBusqueda();
});

btnFavoritas.addEventListener('click', () => {
    window.location.href = 'favoritas.html';
});

const realizarBusqueda = async () => {
    try {
        const endPoint = `http://www.omdbapi.com/?apikey=${apiKey}&s=${titulo.value}`;
        const resp = await fetch(endPoint);
        const data = await resp.json();
        if (data.Response === "True") {
            renderPelis(data.Search);
        } else {
            Swal.fire({
                title: "No se encontraron resultados",
                text: "Intenta buscar otro título",
                icon: "warning"
            });
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: "Vaya",
            text: "Parece que ocurrió un error en el servidor",
            icon: "error"
        });
    }
};

// Con esta función se renderizan las películas de la API
const renderPelis = (peliculas) => {
    // Se elimina cualquier contenido previo del elemento (si lo hay)
    resultados.innerHTML = '';

    // En el caso de que haya "match" y haya encontrado al menos una peli
    if (peliculas.length > 0) {
        let row;
        peliculas.forEach((pelicula, index) => {
            // Crear una nueva fila cada 2 películas
            if (index % 2 === 0) {
                row = document.createElement('div');
                row.classList.add('row', 'mb-3');
                resultados.appendChild(row);
            }

            // Con este operador ternario indico que si el poster es distinto de "N/A" se guarde la imagen de la API, en caso de que no haya imagen cargo una imagen por defecto.
            const poster = pelicula.Poster !== "N/A" ? pelicula.Poster : "imagenes/nohaypeli.png";

            // Crear el elemento contenedor para la película
            const peliculaElemento = document.createElement('div');
            peliculaElemento.classList.add('col-md-6', 'mb-3');

            // Crear el contenido de la tarjeta
            peliculaElemento.innerHTML = `
                <div class="card">
                    <img src="${poster}" class="card-img-top" alt="${pelicula.Title}">
                    <div class="card-body">
                        <h5 class="card-title">${pelicula.Title}</h5>
                        <p class="card-text">Año: ${pelicula.Year}</p>
                        <button class="btn btn-success mt-2" onclick="guardarPelicula('${pelicula.Title}', '${pelicula.Year}', '${poster}')">Guardar</button>
                    </div>
                </div>
            `;

            // Agrega otra tarjeta de película cuando el arreglo de películas tiene más de 1
            row.appendChild(peliculaElemento);
        });
    } else {
        // Mostrar mensaje en caso de que no tenga éxito la búsqueda.
        const mensaje = document.createElement('div');
        mensaje.classList.add('col');
        mensaje.innerHTML = `<p>Película no encontrada.</p>`;
        resultados.appendChild(mensaje);
    }
};

// Función para guardar la película en el localStorage
const guardarPelicula = (title, year, poster) => {
    // Creo el objeto película para guardar las propiedades que quiero salvar
    const pelicula = {
        Title: title,
        Year: year,
        Poster: poster
    };

    // La variable favoritas será un arreglo de objetos cuando se vaya llenando o si está vacía un arreglo vacío. Su función es recuperar la lista de películas favoritas del localStorage y convertirlas en un arreglo. Si esta operación perderíamos los datos anteriores y al hacer "push" se tendría solo una peli.
    let favoritas = JSON.parse(localStorage.getItem('favoritas')) || [];

    // Verificar si la película ya está en favoritas. El método find() compara cada valor de le película actual con los valores guardados dentro del arreglo de objetos favoritas.
    const peliculaExistente = favoritas.find(item => item.Title === title && item.Year === year);
    if (peliculaExistente) {
        // Hago saltar la alarma si ya está la película en la lista y no se graba.
        Swal.fire({
            title: "¡Otra vez!",
            text: "La película ya está entre las favoritas...",
            icon: "warning"
        });
        return;
    }

    // El método push agrega un nuevo objeto al arreglo "favoritas"
    favoritas.push(pelicula);
    // Convierte el un objeto JavaScript a una cadena JSON 
    localStorage.setItem('favoritas', JSON.stringify(favoritas));
    Swal.fire({
        title: "Guardada",
        text: "Otra película más en la colección.",
        icon: "success"
    });
};


//Manejo del caché
const version = 'cache-v1';
const version2 = 'cache-v2';

// Creo o Abro un cache
caches.open(version).then(cache => {
    cache.add('readme.txt');
});

caches.open(version2);

// Compruebo si existe un cache llamado 'mi-cache'
caches.has(version).then(resp => {
    console.log(resp)
});

// Agrego un escuchador de eventos al botón de eliminación
btnDelete.addEventListener('click', async () => {
    const resp = await caches.delete(version);
    if (resp) {
        Swal.fire({
            title: "Todo Cine",
            text: "Se eliminó el Caché",
            icon: "success"
        });
    }
});

//Mostramos los caches guardados
caches.keys().then(keys => {
    console.log(keys);
});

//Guardamos un archivo en el cache
btnSave.addEventListener( 'click', async () => {
    const cache = await caches.open(version);
    await cache.add('imagenes/nohaypeli.png');
})

// Leemos los archivos del caché
caches.open(version).then( cache => {
    cache.match('readme.txt').then( archivo => {
        console.log(archivo);
    })
})

btnRead.addEventListener('click', async () => {
    const cache = await caches.open(version);
    const response = await cache.match('imagenes/nohaypeli.png');
    if ( !response){
        Swal.fire({
            title: "Todo Cine",
            text: "No existe el archivo en el Caché",
            icon: "info"
        });
    }
    console.log(response);
})

