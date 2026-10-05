<template>
  <section class="formulario-contenedor">
    <form @submit.prevent="guardar">
      <h2>{{ libroEditar ? "Editar libro" : "Agregar libro" }}</h2>

      <label for="titulo">Título</label>
      <el-input
  id="titulo"
  v-model="nuevoLibro.titulo"
  placeholder="Ej: Don Quijote de la Mancha"
/>

      <label for="autor">Autor</label>
<el-input
  id="autor"
  v-model="nuevoLibro.autor"
  placeholder="Ej: Miguel de Cervantes"
/>

      <label for="categoria">Categoría</label>
<el-select
  id="categoria"
  v-model="nuevoLibro.categoria"
  placeholder="Selecciona una categoría"
  style="width: 100%"
>
  <el-option label="Novela" value="Novela" />
  <el-option label="Fantasía" value="Fantasía" />
  <el-option label="Ciencia ficción" value="Ciencia ficción" />
  <el-option label="Historia" value="Historia" />
  <el-option label="Otro" value="Otro" />
</el-select>
      <label for="descripcion">Descripción</label>
<el-input
  id="descripcion"
  v-model="nuevoLibro.descripcion"
  type="textarea"
  :rows="4"
  placeholder="Escribe una breve descripción"
/>

      <el-alert
  v-if="error"
  :title="error"
  type="error"
  show-icon
  :closable="false"
  class="mensaje-error"
/>
      <div class="acciones-formulario">
      <el-button
  type="primary"
  native-type="submit"
  :loading="guardando"
>
  {{ libroEditar ? 'Guardar cambios' : 'Guardar libro' }}
</el-button>

<el-button
  v-if="libroEditar"
  native-type="button"
  :disabled="guardando"
  @click="$emit('cancelar')"
>
  Cancelar
</el-button>
      </div>
    </form>


    <aside class="vista-previa">
      <p class="etiqueta">Vista previa</p>
      <h3>{{ nuevoLibro.titulo || "Título del libro" }}</h3>
      <p>por {{ nuevoLibro.autor || "Autor" }}</p>
      <span>{{ nuevoLibro.categoria || "Categoría" }}</span>
      <p>
        {{ nuevoLibro.descripcion || "La descripción aparecerá aquí." }}
      </p>
    </aside>
  </section>
</template>

<script>
const vacio = () => ({ titulo: '', autor: '', categoria: '', descripcion: '', portada: '' })
export default {
  name: 'LibroForm',
  props: { libroEditar: { type: Object, default: null } },
  emits: ['guardado', 'cancelar'],
  data: () => ({ nuevoLibro: vacio(), guardando: false, error: '' }),
  watch: {
    libroEditar: {
      immediate: true,
      handler(libro) { this.nuevoLibro = libro ? { ...libro } : vacio(); this.error = '' }
    }
  },
  methods: {
    async guardar() {
      if (this.guardando) return
      this.nuevoLibro.titulo = this.nuevoLibro.titulo.trim()
this.nuevoLibro.autor = this.nuevoLibro.autor.trim()
this.nuevoLibro.descripcion = (this.nuevoLibro.descripcion || '').trim()
      this.error = ''
      if (!this.nuevoLibro.titulo || !this.nuevoLibro.autor || !this.nuevoLibro.categoria) {
        this.error = 'Completa título, autor y categoría.'
        return
      }
      this.guardando = true
      try {
        const accion = this.libroEditar ? 'editarLibro' : 'agregarLibro'
        await this.$store.dispatch(`productos/${accion}`, { ...this.nuevoLibro })
        if (!this.libroEditar) this.nuevoLibro = vacio()
        this.$emit('guardado')
      } catch (error) {
        this.error = 'No se pudo guardar el libro. Revisa la API e intenta nuevamente. Tus datos siguen en el formulario.'
      } finally { this.guardando = false }
    }
  }
}
</script>

<style scoped>
.formulario-contenedor {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
}
.mensaje-error {
  margin-top: 16px;
}

form,
.vista-previa {
  padding: 20px;
  border-radius: 12px;
  background: var(--bl-panel);
}

label {
  display: block;
  margin: 14px 0 6px;
  font-weight: bold;
}



.acciones-formulario { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.acciones-formulario :deep(.el-button) { margin: 0; }

.etiqueta {
  color: var(--bl-acento);
  font-weight: bold;
  text-transform: uppercase;
}

.vista-previa span {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  background: var(--bl-suave);
  color: var(--bl-acento);
}

@media (max-width: 700px) {
  .formulario-contenedor {
    grid-template-columns: 1fr;
  }
}
</style>
