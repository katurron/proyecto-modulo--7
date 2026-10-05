<template>
  <section>
    <p class="etiqueta">Mi biblioteca</p>
    <h1>Hola, {{ nombre }}</h1>
    <p class="introduccion">Este es el resumen de tu catálogo. Elige por dónde continuar.</p>
    <div v-if="cargando" role="status"><p>Cargando tu panel…</p><el-skeleton :rows="3" animated /></div>
    <div v-else-if="errorCarga" class="error-carga">
      <el-alert :title="errorCarga" type="error" show-icon :closable="false" />
      <el-button type="primary" @click="cargar(true)">Reintentar</el-button>
    </div>
    <template v-else>
      <div class="estadisticas">
        <el-card shadow="never"><span aria-hidden="true">📚</span><strong>{{ libros.length }}</strong><p>Libros en el catálogo</p></el-card>
        <el-card shadow="never"><span aria-hidden="true">★</span><strong>{{ totalFavoritos }}</strong><p>Favoritos de esta sesión</p></el-card>
        <el-card shadow="never"><span aria-hidden="true">▤</span><strong>{{ totalCategorias }}</strong><p>Categorías con libros</p></el-card>
      </div>
      <el-empty v-if="!libros.length" description="Tu catálogo está listo para recibir su primer libro." />
    </template>
    <div class="accesos">
      <el-button type="primary" @click="abrirCatalogo(false)">Ver catálogo y agregar libros</el-button>
      <el-button @click="abrirCatalogo(true)">Ver mis favoritos</el-button>
    </div>
  </section>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PanelView',
  computed: {
    ...mapGetters('sesion', ['nombre']),
    ...mapGetters('productos', { libros: 'libros', cargando: 'loading', errorCarga: 'error' }),
    ...mapGetters('favoritos', { idsFavoritos: 'ids' }),
    totalCategorias() { return new Set(this.libros.map(libro => libro.categoria).filter(Boolean)).size },
    totalFavoritos() { return this.libros.filter(libro => this.idsFavoritos.includes(String(libro.id))).length }
  },
  created() { this.cargar() },
  methods: {
    ...mapActions('productos', { cargar: 'cargarLibros' }),
    abrirCatalogo(favoritos) {
      this.$store.commit('filtros/LIMPIAR')
      this.$store.commit('filtros/SET_SOLO_FAVORITOS', favoritos)
      this.$router.push({ name: 'libros' })
    }
  }
}
</script>
<style scoped>
h1 { font-size: 34px; overflow-wrap: anywhere; }
.introduccion { color: var(--bl-secundario); line-height: 1.6; }
.estadisticas { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin: 30px 0; }
.estadisticas .el-card { border-radius: 16px; }
.estadisticas span { display: block; color: var(--bl-acento); font-size: 28px; }
.estadisticas strong { display: block; font-size: 42px; margin-top: 20px; }
.estadisticas p { color: var(--bl-secundario); }
.accesos { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.accesos .el-button { margin: 0; max-width: 100%; white-space: normal; height: auto; min-height: 36px; }
.error-carga { display: grid; gap: 12px; }
@media (max-width: 600px) { .estadisticas { grid-template-columns: minmax(0, 1fr); } }
</style>
