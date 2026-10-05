# Verificación de la versión integrada

Comprobaciones realizadas el 26 de septiembre de 2026.

## Código y compilación

- Revisión ESLint sin correcciones automáticas: aprobada, sin errores.
- Compilación de producción con Vue CLI: aprobada.
- La compilación requirió desactivar `parallel` en `vue.config.js` por una restricción del entorno Windows al crear procesos secundarios.

## Pruebas en el navegador

Se utilizó la aplicación compilada y una API json-server con una copia temporal de `db.json`. Los datos entregados y los dos proyectos de origen no fueron modificados durante las pruebas.

| Prueba | Resultado |
| --- | --- |
| Bienvenida y navegación al catálogo | Correcto |
| Tres libros originales | Correcto |
| Campos obligatorios del formulario | Correcto |
| Crear un libro por API | Correcto |
| Búsqueda por autor | Correcto |
| Marcar favorito y activar su filtro | Correcto |
| Abrir la edición desde la tarjeta | Correcto |
| Guardar la edición y recargar | El título editado permanece |
| Cancelar un borrador | El título guardado permanece |
| Cambiar a publicado | Se actualiza el estado |
| Contador de libros agregados hoy | Mostró el libro de prueba |
| Eliminar el libro de prueba | Desaparece del catálogo |
| Abrir directamente el libro eliminado | Muestra «Libro no encontrado» |
| Dirección inexistente | Muestra la página 404 |
| Abrir un detalle con la API apagada | Muestra error de conexión, sin confundirlo con un libro inexistente |
| Encender API y reintentar | Recupera el libro |
| Guardar una edición con la API apagada | Muestra error y conserva el borrador |
| Vista de escritorio | Revisada visualmente |

No se realizó una revisión exhaustiva de navegadores ni de tamaños de pantalla. La pauta de evaluación de la profesora no fue proporcionada; el alcance se basa en API, 404, editar y Vuex, más las funciones del ejemplo incorporadas y descritas en README.
