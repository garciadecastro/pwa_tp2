# pwa_tp2
**********************************************************
## *** TODO CINE ***
"Todo Cine" es una aplicación web realizada como TP1 de la materia Aplicaciones Web Progresivas por Carlos García de Castro. La aplicación permite al usuario acceder a información de películas gracias al uso de la API OMDB (Open Movie Database). La información de las películas se almacena localmente en el navegador y permite hacer listas de películas favoritas.

La aplicación cuenta con 4 archivos principales: `index.html`, `app.js`, `favoritas.html` y `favoritas.js`.

- El archivo `index.html` ofrece una interfaz de usuario que permite buscar películas ingresando el título en un formulario, los resultados se muestran a la izquierda del buscador. Además, cuenta con un botón para guardar las pelis en una lista de favoritas y otro para acceder a dicha lista.
- Las películas guardadas se muestran en `favoritas.html`. La página permite visualizar las películas almacenadas y eliminar la colección para empezar de nuevo.
- La lógica principal de la aplicación se encuentra en `app.js`, aquí se gestionan eventos como la búsqueda de películas a través de la API de OMDB o almacenar las películas elegidas en el `localStorage` del navegador.
- En `favoritas.js` encontramos más lógica para mostrar las películas almacenadas en el `localStorage` y además vaciarlo para empezar a almacenar películas de nuevo.
- Existe también una hoja de estilos `style.css` para generar una vista más agradable de la interfaz y adaptarla a diferentes pantallas.

## *** FUNCIONES PRESENTES EN EL CÓDIGO ***
### app.js
1. **`btnBuscar.addEventListener('click', async () => { ... })`**
   - Se ejecuta al hacer click en el botón de búsqueda. Tras ello con la llave y el título de la película se envía una URL a la API de OMDB que realiza una solicitud `fetch` a dicha URL y luego pasa los datos como argumento a mi función `renderPelis()`. Si hay error se captura y se muestra con las alertas divertidas de la biblioteca de JS `SweetAlert2`.

2. **`form.addEventListener('submit', async (event) => { ... })`**
   - Esta función se ejecuta al enviar el formulario con nuestra búsqueda, permitiendo pulsar ENTER tras escribir un título, mejorando la usabilidad y permitiendo realizar nuestra búsqueda sin necesidad de pulsar el botón. Es bastante similar a la anterior.
   - Esta función se ejecuta cuando se envía el formulario de búsqueda. Previene el comportamiento por defecto del formulario, captura el título de la película, construye la solicitud y muestra los resultados.

3. **`btnFavoritas.addEventListener('click', () => { ... })`**
   - Una función muy simple, al hacer click en el botón "Mis Películas" vamos a la página `favoritas.html` donde están las películas que hemos ido guardando.

4. **`renderPelis = (peliculas) => { ... }`**
   - Esta es una de las funciones más importantes, tras recibir los datos de la película procedentes de la API de OMDB los muestra renderizados en la página. Cuando nuestra petición tiene éxito (`data.Response === "True"`) se crean tarjetas con la información de las películas que además muestran un botón que permite, si se quiere, guardar la película en la lista de favoritas.
   - En caso de que la película no se encuentre se muestra el sencillo mensaje de "Película no encontrada".

5. **`guardarPelicula = (title, year, director, poster) => { ... }`**
   - Gracias a esta función podemos contar con nuestra colección de película. Al hacer click en el botón la información de la película es guardada en el almacenamiento local (`localStorage`). Además la función puede verificar si existe la peli, en cuyo caso no la añade para evitar duplicados y muestra un mensaje de alerta. Si se guarda con éxito muestra también un mensaje de alerta indicando que ha tenido éxito.

### favoritas.js
6. **`document.addEventListener('DOMContentLoaded', function() { ... })`**
   - Esta función se ejecuta cuando el contenido del documento HTML ha sido completamente cargado. Llama a la función `mostrarFavoritas` para cargar y mostrar las películas favoritas, y agrega un evento al botón de borrar para ejecutar la función `borrarFavoritas`.

7. **`mostrarFavoritas = () => { ... }`**
   - La función carga las películas que tenemos almacenadas en `localStorage` y las muestra en la página rellenando un contenedor DIV. Si no hay pelis lo indica en un mensaje.

8. **`borrarFavoritas = () => { ... }`**
   - La función vacía las películas almacenadas en el `localStorage` y luego muestra una alerta de éxito. Tras ello, llama a `mostrarFavoritas` para actualizar la página, que ahora estará vacía.

## *** TECNOLOGÍAS UTILIZADAS ***
- **HTML5**: `index.html` y `favoritas.html`
- **CSS3**: `style.css`
- **JavaScript**: Lógica de la aplicación, manipulación del DOM, y manejo de eventos en `app.js` y `favoritas.js`.
- **Bootstrap**: `index.html` y `favoritas.html`
- **API de OMDB**: Externo, para obtener información de películas.
- **localStorage**: Para guardar películas en el almacenamiento local
- **SweetAlert2**: Biblioteca JS para alertas divertidas

## *** FLUJO DE TRABAJO ***
1. **Inicio y Búsqueda de Películas**:
   - El usuario accede a la página principal `index.html`.
   - El usuario realiza una búsqueda usando el formulario más ENTER o haciendo click.
   - La aplicación realiza una solicitud a la API de OMDB y muestra la información de la película en la página.

2. **Guardado de Películas**:
   - Al mostrar una película existe un botón "guardar" para añadir a favoritas.
   - La aplicación verifica si no está repetida y la agrega.

3. **Ver películas favoritas y gestionarlas**:
   - A través del botón "Mis Pelis" el usuario accede a su colección en `favoritas.html`.
   - El usuario puede borrar la lista y recomenzar de nuevo con el botón "Eliminar Colección", que vacía el `localStorage`.
**********************************************************
