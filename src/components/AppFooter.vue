<template>
  <footer class="pie-pagina">
    <p class="marca">📚 BookList · Editorial Nova</p>
    <p>Tu biblioteca, organizada en un solo lugar.</p>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.pie-pagina {
  padding: 24px 20px;
  border-top: 1px solid var(--bl-borde);
  background: var(--bl-panel);
  color: var(--bl-secundario);
  text-align: center;
}

.pie-pagina p {
  margin: 6px 0;
}

.marca {
  color: var(--bl-acento);
  font-weight: bold;
}
</style>