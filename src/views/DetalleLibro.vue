<template>
  <p v-if="cargando" role="status">Cargando libro…</p>
  <div v-else-if="errorCarga"><el-alert :title="errorCarga" type="error" show-icon :closable="false" /><el-button type="primary" @click="cargar(true)">Reintentar</el-button></div>
  <section v-else-if="libro" class="detalle">
    <router-link to="/libros" class="volver">
      ← Volver al catálogo
    </router-link>

    <LibroForm v-if="editando" :key="id" :libro-editar="libro" @guardado="cerrarEdicion" @cancelar="cerrarEdicion" />
    <div v-else>
    <el-tag class="categoria">{{ libro.categoria }}</el-tag>
    <h1>{{ libro.titulo }}</h1>
    <p class="autor">por {{ libro.autor }}</p>

    <p v-if="libro.descripcion" class="descripcion">
      {{ libro.descripcion }}
    </p>

    <p v-else class="descripcion">
      Este libro no tiene descripción.
    </p>
    <el-button type="primary" @click="editando = true">Editar</el-button>
    <el-button :type="esFavorito ? 'warning' : 'default'" :aria-pressed="esFavorito" @click="$store.commit('favoritos/TOGGLE_FAVORITO', libro.id)">{{ esFavorito ? '★ Quitar favorito' : '☆ Favorito' }}</el-button>
    </div>
  </section>

  <section v-else class="no-encontrado">
    <h1>Libro no encontrado</h1>
    <router-link to="/libros">Volver al catálogo</router-link>
  </section>
</template>

<script>
import LibroForm from '@/components/LibroForm.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'DetalleLibro',
  components: { LibroForm },
  props: { id: { type: String, required: true } },
data() {
  return {
    editando: this.$route.query.editar === '1'
  }
},
  computed: {
    ...mapGetters('productos', { cargando: 'loading', errorCarga: 'error' }),
    libro() { return this.$store.getters['productos/libroPorId'](this.id) },
    esFavorito() { return this.$store.getters['favoritos/ids'].includes(String(this.id)) }
  },
  watch: {
    '$route.fullPath'() { this.editando = this.$route.query.editar === '1';  this.cargar() }
  },
  created() { this.cargar() },
  methods: {
    ...mapActions('productos', { cargar: 'cargarLibros' }),
    cerrarEdicion() {
      this.editando = false
      if (this.$route.query.editar) this.$router.replace({ name: 'detalle-libro', params: { id: this.id } })
    },
    
    }
  }

</script>

<style scoped>
.detalle,
.no-encontrado {
  max-width: 700px;
  margin: 40px auto;
  padding: 35px;
  border-radius: 16px;
  background: var(--bl-panel);
}

.volver {
  color: var(--bl-acento);
  text-decoration: none;
}

.categoria { margin-top: 20px; }

.autor {
  color: var(--bl-secundario);
  font-size: 18px;
}

.descripcion {
  line-height: 1.7;
}
@media (max-width: 600px) {
  .detalle, .no-encontrado { padding: 20px; margin: 20px auto; }
}
</style>
