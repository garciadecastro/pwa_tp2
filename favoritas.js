document.addEventListener('DOMContentLoaded', async () => {
    await openDatabase();
    mostrarFavoritas();

    const btnBorrar = document.getElementById('btnBorrar');
    btnBorrar.addEventListener('click', async () => {
        await borrarFavoritas();
        Swal.fire({
            title: 'Favoritas Borrado',
            text: 'Colección de películas borrada.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
        mostrarFavoritas();
    });
});

const mostrarFavoritas = async () => {
    const favoritas = await obtenerPeliculas();
    const divFavoritas = document.getElementById('favoritas');
    divFavoritas.innerHTML = '';

    if (favoritas.length === 0) {
        divFavoritas.innerHTML = '<p>No hay pelis favoritas de momento.</p>';
        return;
    }

    favoritas.forEach((pelicula, index) => {
        const poster = pelicula.Poster !== "N/A" ? pelicula.Poster : "/imagenes/nohaypeli.png";
        divFavoritas.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card">
                    <img src="${poster}" class="card-img-top" alt="${pelicula.Title}">
                    <div class="card-body">
                        <h5 class="card-title">${pelicula.Title}</h5>
                        <p class="card-text">Año: ${pelicula.Year}</p>
                        <p class="card-text">Director: ${pelicula.Director}</p>
                        <button class="btn btn-danger mt-2" onclick="eliminarPeliculaHandler('${pelicula.Title}')">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    });
};

const eliminarPeliculaHandler = async (title) => {
    await eliminarPelicula(title);
    Swal.fire({
        title: 'Película Eliminada',
        text: 'La película ha sido eliminada de tus favoritas.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
    mostrarFavoritas();
};
