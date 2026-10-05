<template>
  <section>
    <LibroForm />
    <div class="encabezado">
      <div>
        <p class="etiqueta">Catálogo</p>
        <h1>Mis libros</h1>
      </div>
      <div class="filtros">
  <el-input
    aria-label="Buscar por título o autor"
    clearable
    v-model="busqueda"
    type="search"
    placeholder="Buscar por título o autor"
  />

  <el-select data-testid="filtro-categoria" v-model="categoriaSeleccionada" placeholder="Todas las categorías" aria-label="Filtrar por categoría">
    <el-option label="Todas las categorías" value="" />
    <el-option label="Novela" value="Novela" />
    <el-option label="Fantasía" value="Fantasía" />
    <el-option label="Ciencia ficción" value="Ciencia ficción" />
    <el-option label="Historia" value="Historia" />
    <el-option label="Otro" value="Otro" />
  </el-select>
</div>

      <p>{{ libros.length }} libros registrados</p>
    </div>

    <div class="opciones-filtro">
      <el-checkbox v-model="soloFavoritos">Ver solo favoritos</el-checkbox>
      <el-button native-type="button" @click="$store.commit('filtros/LIMPIAR')">Limpiar filtros</el-button>
    </div>
    <el-alert v-if="errorAccion" :title="errorAccion" type="error" show-icon :closable="false" />
    <div v-if="cargando" role="status" aria-live="polite">
      <p>Cargando catálogo…</p>
      <el-skeleton :rows="3" animated />
    </div>
    <div v-else-if="errorCarga" class="error-carga">
      <el-alert :title="errorCarga" type="error" show-icon :closable="false" />
      <el-button type="primary" @click="cargar(true)">Reintentar</el-button>
    </div>
    <el-empty
      v-else-if="librosFiltrados.length === 0"
      :description="libros.length === 0 ? 'Aún no hay libros. Agrega el primero con el formulario.' : 'No se encontraron libros con estos filtros.'"
    />

    <div v-else class="lista-libros">
      <LibroCard
  v-for="libro in librosFiltrados"
  :key="libro.id"
  :libro="libro"
  :ocupado="ocupado"
  :es-favorito="idsFavoritos.includes(String(libro.id))"
  @favorito="$store.commit('favoritos/TOGGLE_FAVORITO', libro.id)"
  @eliminar="eliminarLibro"
/>
    </div>
  </section>
</template>

<script>
import LibroCard from '@/components/LibroCard.vue'
import LibroForm from '@/components/LibroForm.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ListaLibros',
  components: { LibroCard, LibroForm },
  data: () => ({ ocupado: false, errorAccion: '' }),
  computed: {
    ...mapGetters('productos', { libros: 'libros', cargando: 'loading', errorCarga: 'error' }),
    ...mapGetters('filtros', ['librosFiltrados']),
    ...mapGetters('favoritos', { idsFavoritos: 'ids' }),
    busqueda: {
      get() { return this.$store.state.filtros.busqueda },
      set(valor) { this.$store.commit('filtros/SET_BUSQUEDA', valor) }
    },
    categoriaSeleccionada: {
      get() { return this.$store.state.filtros.categoria },
      set(valor) { this.$store.commit('filtros/SET_CATEGORIA', valor) }
    },
    soloFavoritos: {
      get() { return this.$store.state.filtros.soloFavoritos },
      set(valor) { this.$store.commit('filtros/SET_SOLO_FAVORITOS', valor) }
    }
  },
  created() { this.cargar() },
  methods: {
    ...mapActions('productos', { cargar: 'cargarLibros' }),
    eliminarLibro(id) { return this.ejecutar('eliminarLibro', id) },
    async ejecutar(accion, id) {
      if (this.ocupado) return
      this.ocupado = true
      this.errorAccion = ''
      try { await this.$store.dispatch(`productos/${accion}`, id) }
      catch (error) { this.errorAccion = 'No se pudo completar la operación. Revisa la API e intenta nuevamente.' }
      finally { this.ocupado = false }
    }
  }
}
</script>

<style scoped>
.encabezado {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin: 30px 0;
}

.encabezado h1 {
  margin: 5px 0;
}

.etiqueta {
  margin: 0;
  color: var(--bl-acento);
  font-weight: bold;
  text-transform: uppercase;
}

.lista-libros {
  display: grid;
  gap: 18px;
}

.sin-libros {
  padding: 30px;
  border-radius: 12px;
  background: var(--bl-panel);
  text-align: center;
}
.filtros {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.filtros { flex: 1; min-width: 0; }
.filtros :deep(.el-select) { min-width: 180px; }
.opciones-filtro { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 20px; }
.error-carga { display: grid; gap: 12px; margin: 20px 0; }
.error-carga .el-button { justify-self: start; }

@media (max-width: 600px) {
  .filtros {
    flex-direction: column;
  }
}
</style>
