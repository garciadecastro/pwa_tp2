//DOMContentLoaded se dispara cuando todo el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    //Ejecuta la función que carga las pelis almacenadas en el localStorage
    mostrarFavoritas();

    //Asignamos el botón de borrar a la constante btnBorrar
    const btnBorrar = document.getElementById('btnBorrar');
    //Al hacer click opera la función borrarFavoritas
    btnBorrar.addEventListener('click', borrarFavoritas);
});

//Función para mostrar las películas favoritas
const mostrarFavoritas = () => {
    //Aquí recupero la cadena JSON almacenada con la clave 'favoritas' en localStorage y la convierto en un arreglo de objetos JavaScript
    const favoritas = JSON.parse(localStorage.getItem('favoritas')) || [];
    //Asignamos el div con la id "favoritas" a la constante que usaremos para ver la colección
    const divFavoritas = document.getElementById('favoritas');
    // Vacíamos el contenido
    divFavoritas.innerHTML = '';
    // Mostramos mensaje si no hay nada.
    if (favoritas.length === 0) {
        divFavoritas.innerHTML = '<p>No hay pelis favoritas de momento.</p>';
        return;
    }

    // Generamos una tarjeta con la info de cada película y su poster.
    favoritas.forEach(pelicula => {
        const poster = pelicula.Poster !== "N/A" ? pelicula.Poster : "/imagenes/nohaypeli.png";
        divFavoritas.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card">
                    <img src="${poster}" class="card-img-top" alt="${pelicula.Title}">
                    <div class="card-body">
                        <h5 class="card-title">${pelicula.Title}</h5>
                        <p class="card-text">Año: ${pelicula.Year}</p>
                        <p class="card-text">Director: ${pelicula.Director}</p>
                    </div>
                </div>
            </div>
        `;
    });
};

// Función para borrar todas las películas favoritas
const borrarFavoritas = () => {
    // Eliminamos el objeto JSON con la clave "favoritas" del localStorage
    localStorage.removeItem('favoritas');
    // Mostramos alerta de que ya no hay pelis
    Swal.fire({
        title: 'Favoritas Borrado',
        text: 'Colección de películas borrada.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        // Actualiza la visualización después de borrar
        mostrarFavoritas(); 
    });
};
