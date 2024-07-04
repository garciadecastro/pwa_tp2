if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log('Se ha registrado el Service Worker con éxito:', registration);
        })
        .catch(error => {
            console.error('Error al registrar el Service Worker:', error);
        });
} else {
    alert('Tu navegador no soporta esta Web APP');
}

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
        // const endPoint = `http://www.omdbapi.com/?apikey=${apiKey}&s=${titulo.value}`;
        const endPoint = `https://www.omdbapi.com/?apikey=${apiKey}&s=${titulo.value}`;

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