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
        // Si la data.Response da como resultado True, se llama a la funcion renderPelis con el parametro de data.Search
        if (data.Response === "True") {
            renderPelis(data.Search);
        } else { // En caso de que data.response no de true, mostrará una alerta personalizada que no se ha podido encontrar resultados de busqueda
            Swal.fire({
                title: "No se encontraron resultados",
                text: "Intenta buscar otro título",
                icon: "warning"
            });
        }
    } catch (error) { //Si hay un error, tambien se informara al usuario mediante una alerta personalizada
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

    // Si hay aunque sea 1 pelicula, se creará un row que servirá para los estilos.
    if (peliculas.length > 0) {
        let row;
        // Se hace un forEach para recorrer las peliculas
        peliculas.forEach((pelicula, index) => {
            if (index % 2 === 0) {
                row = document.createElement('div');
                row.classList.add('row', 'mb-3');
                resultados.appendChild(row);
            }

            // Se crear la constante poster la cual tendra el poster que nos provee la api
            const poster = pelicula.Poster !== "N/A" ? pelicula.Poster : "imagenes/nohaypeli.png";
            // Se crea una constante llamada peliculaElemento la cual creará un div y se le agrega clases de bootstrap
            const peliculaElemento = document.createElement('div');
            peliculaElemento.classList.add('col-md-6', 'mb-3');

            //innerHTML desde .js para crearel card que contendrá los datos
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
            //append para que se muestre
            row.appendChild(peliculaElemento);
        });
    // En caso de que no haya una pelicula, se mostrá con las siguientes etiquetas y estilos
    } else {
        const mensaje = document.createElement('div');
        mensaje.classList.add('col');
        mensaje.innerHTML = `<p>Película no encontrada.</p>`;
        resultados.appendChild(mensaje);
    }
};

// Función para guardar la película en IndexedDB, ya que es asincrona usamos try catch.
const guardarPelicula = async (title, year, poster) => {
    const pelicula = {
        Title: title,
        Year: year,
        Poster: poster
    };
    
    // Con el try, esperamos a que se abra la database en primer lugar
    try {
        await openDatabase();
        // Creamos una constante favoritas para guardar las peliculas favoritas y esperamos
        const favoritas = await obtenerPeliculas();

        // Una vez se haya completado la espera del await, a nuestra constante peliculaExistente
        // con el metodo.find encontramos el titulo y el año. Esto es para que no se guarde una peli
        // por segunda vez
        const peliculaExistente = favoritas.find(item => item.Title === title && item.Year === year);

        //Si la pelicula ya esta guardada se le informa al usario mediante una alerta
        if (peliculaExistente) {
            Swal.fire({
                title: "¡Otra vez!",
                text: "La película ya está entre las favoritas...",
                icon: "warning"
            });
            return;
        }
        // En caso de que no este repetida, con un await se agrega la pelicula y se le informa al usuario
        await agregarPelicula(pelicula);
        Swal.fire({
            title: "Guardada",
            text: "Otra película más en la colección.",
            icon: "success"
        });

        // Se hace un console log adicional para mostrar que efectivamente se guardo.
        console.log('Película guardada en IndexedDB:', pelicula);
    
    //En caso de que hay un error, se le informa al usuario mediante una alerta y por consola
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al guardar la película.",
            icon: "error"
        });
        console.error("Error al guardar la película:", error);
    }
};
