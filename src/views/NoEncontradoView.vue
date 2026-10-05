<template>
  <section class="no-encontrado">
    <p>404</p>
    <h1>Página no encontrada</h1>
    <p>La dirección que ingresaste no existe.</p>
    <router-link to="/">Volver al inicio</router-link>
    · <router-link to="/libros">Ir al catálogo</router-link>
  </section>
</template>
<script>
export default { name: 'NoEncontradoView' }
</script>
<style scoped>
.no-encontrado { background: var(--bl-panel); border-radius: 16px; padding: 35px; text-align: center; }
a { color: var(--bl-acento); }
</style>
