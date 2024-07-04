// Si el SW esta en el navegador entonces se registra en el. Una vez registrado por consola podran salir 2 tipos de informacion
// Si el SW se ha registrado, saldrá el mensaje de exito, caso contrario saldra un mensaje de error informando lo mismo.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/pwa_tp2/sw.js')
        .then(registration => {
            console.log('Se ha registrado el Service Worker con éxito:', registration);
        })
        .catch(error => {
            console.error('Error al registrar el Service Worker:', error);
        });
} else {
    alert('Tu navegador no soporta esta Web APP');
}
//Por un tema de hacerle al usuario mas facil su experiencia web, en caso de que su ordenador no soporte
//la web app, habrá un alert indicando lo mismo.

//Creamos las constantes y con un querySelector buscamos los ID's de cada elemento del html
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
    window.location.href = '/pwa_tp2/favoritas.html';
});

// Para buscar las peliculas, creamos una función asincrona la cual se encargará de ello. Siendo que es
// asincrona usamos un try catch para decirle que queremos que intente que haga, y si no lo hace, que es lo 
// que tiene que hacer con el error que salga
const realizarBusqueda = async () => {
    try {
        // Mediante consola informamos al usuario que se está buscando la pelicula que el quiere.
        console.log(`Realizando búsqueda para: ${titulo.value}`);
        // Creamos una constante llamada endPoint la cual tiene la URL en donde deberia de buscar la pelicula con
        // su apiKey el titulo.value, o sea, el titulo provisto por el user
        const endPoint = `https://www.omdbapi.com/?apikey=${apiKey}&s=${titulo.value}`;
        // Creamos una constante llamada resp la cual es la response de la api. Esperamos a que se haga un fetch a esa
        // api, por lo que usaremos un await
        const resp = await fetch(endPoint);
        // Creamos otra constante llamada data la cual haremos que esta response se vuelva un archivo .JSON
        const data = await resp.json();
        // Hacemos un log para el usuario con la respuesta de la api
        console.log('Respuesta de la API:', data);
        // Si la data.Response da como resultado True, se llama a la funcoin renderPelis con el parametro de data.Search
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
        console.error('Error en realizarBusqueda:', error);
        Swal.fire({
            title: "Vaya",
            text: "Parece que ocurrió un error en el servidor",
            icon: "error"
        });
    }
};

// Con esta función se renderizan las películas de la API
const renderPelis = (peliculas) => {
    resultados.innerHTML = '';

    if (peliculas.length > 0) {
        let row;
        peliculas.forEach((pelicula, index) => {
            if (index % 2 === 0) {
                row = document.createElement('div');
                row.classList.add('row', 'mb-3');
                resultados.appendChild(row);
            }

            const poster = pelicula.Poster !== "N/A" ? pelicula.Poster : "imagenes/nohaypeli.png";
            const peliculaElemento = document.createElement('div');
            peliculaElemento.classList.add('col-md-6', 'mb-3');

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

            row.appendChild(peliculaElemento);
        });
    } else {
        const mensaje = document.createElement('div');
        mensaje.classList.add('col');
        mensaje.innerHTML = `<p>Película no encontrada.</p>`;
        resultados.appendChild(mensaje);
    }
};

// Función para guardar la película en IndexedDB
const guardarPelicula = async (title, year, poster) => {
    const pelicula = {
        Title: title,
        Year: year,
        Poster: poster
    };

    try {
        await openDatabase();
        const favoritas = await obtenerPeliculas();
        const peliculaExistente = favoritas.find(item => item.Title === title && item.Year === year);

        if (peliculaExistente) {
            Swal.fire({
                title: "¡Otra vez!",
                text: "La película ya está entre las favoritas...",
                icon: "warning"
            });
            return;
        }

        await agregarPelicula(pelicula);
        Swal.fire({
            title: "Guardada",
            text: "Otra película más en la colección.",
            icon: "success"
        });
        console.log('Película guardada en IndexedDB:', pelicula);
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al guardar la película.",
            icon: "error"
        });
        console.error("Error al guardar la película:", error);
    }
};
