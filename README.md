# BookList — Módulo 7

Tercera versión construida sobre el proyecto original, con la lógica del ejemplo de la profesora. Conserva el diseño, la bienvenida, la vista previa, el catálogo, los filtros y el contador diario.

## Cómo ejecutarlo

Requiere Node.js y npm. Abre esta carpeta en Visual Studio Code.

1. En una terminal dentro de esta carpeta, ejecuta `npm ci` para instalar las dependencias si todavía no están instaladas.
2. Ejecuta `npm run mock` para encender la API en `http://localhost:3001`.
3. Abre una segunda terminal en la misma carpeta y ejecuta `npm run serve`.
4. Abre la dirección que indique Vue, normalmente `http://localhost:8080`.

Deja ambas terminales abiertas. Para detenerlas, usa Ctrl+C. Si la API está apagada, la aplicación muestra un mensaje y permite reintentar.

## Funciones integradas

- **API:** Axios consulta y modifica `/libros` con GET, POST, PUT y DELETE. json-server guarda los cambios en `db.json`.
- **Vuex:** módulos `productos`, `filtros` y `favoritos`.
- **Editar:** abre «Editar» desde una tarjeta o el detalle. El formulario se reutiliza para crear y editar. Cancelar descarta el borrador; guardar conserva el identificador, la fecha y los demás campos.
- **404:** las direcciones desconocidas muestran «Página no encontrada». Un libro inexistente muestra «Libro no encontrado» después de consultar la API.
- **Del ejemplo:** favoritos y estado «Publicado» / «En revisión».
- **Carga y errores:** las operaciones muestran mensajes; un error al guardar conserva los datos del formulario.

## Estructura

```text
src/
  api/index.js                  Conexión Axios
  components/
    LibroForm.vue               Crear y editar, validación y vista previa
    LibroCard.vue               Tarjeta con detalle y acciones
  router/index.js               Inicio, catálogo, detalle y 404
  store/
    index.js                    Registro de los módulos Vuex
    modules/
      productos.js              Libros y operaciones con API
      filtros.js                Búsqueda, categoría y filtro de favoritos
      favoritos.js              Identificadores favoritos
  views/
    HomeView.vue                Bienvenida, formulario y contador
    ListaLibros.vue             Catálogo y filtros
    DetalleLibro.vue            Consulta y edición
    NoEncontradoView.vue        Página 404
  App.vue                       Navegación y estilos originales
  main.js                       Instalación de Vuex y Vue Router
db.json                         Datos persistidos por la API
```

## Cómo se conecta la lógica

`LibroForm` despacha una acción de `productos`. La acción realiza la petición a la API y, cuando tiene éxito, ejecuta una mutación de Vuex. Las vistas leen ese estado mediante getters y se actualizan. El evento `guardado` se emite solo después de la confirmación de la API.

Los filtros se actualizan con mutaciones de `filtros`. Su getter combina catálogo, búsqueda, categoría e identificadores de `favoritos`.

Se usa **productos**, en plural, en todo el proyecto, como en el ejemplo completo de los apuntes. Se conservan los nombres originales **LibroForm** y **LibroCard**. Vuex complementa Vue: sigue siendo una aplicación Vue 3. Se mantiene Options API para seguir el estilo del proyecto base.

## Persistencia y alcance

- Los libros, sus ediciones, su publicación y las eliminaciones permanecen en `db.json`.
- El nombre de bienvenida permanece en `localStorage`, como en el original. Es una personalización, no autenticación.
- Favoritos y filtros permanecen durante la navegación; al recargar se reinician, siguiendo el enfoque en memoria del ejemplo.
- Se conservan los tres libros y las categorías iniciales del original. Login y dashboard del ejemplo no se incorporaron porque no son parte de los cuatro requisitos indicados.
- Para cambiar la dirección de la API, copia `.env.example` a `.env.local`, modifica `VUE_APP_API_URL` y reinicia Vue. json-server expone `/libros` directamente: la dirección base no lleva `/api`.

## Comprobaciones

Ejecuta `npm run lint -- --no-fix` y `npm run build`. La compilación genera `dist`. Se desactiva la compilación paralela para reducir la creación de procesos en entornos Windows restringidos.

Si publicas `dist`, el servidor debe devolver `index.html` para las rutas sin archivo, porque se utiliza el modo historial. En desarrollo, Vue CLI ya lo resuelve.

Consulta `VERIFICACION.md` para ver las pruebas realizadas.
