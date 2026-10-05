<template>
  <section class="inicio">
    <div class="presentacion">
      <div>
        <p class="etiqueta">Editorial Nova</p>
        <p v-if="activa" class="saludo">Hola, {{ nombre }} 👋</p>
        <el-button v-if="activa" plain @click="cambiarNombre">Cambiar nombre</el-button>
        <h1>Un lugar para todas tus historias</h1>
        <p class="descripcion">Organiza tu biblioteca, encuentra tu próxima lectura y guarda tus favoritos.</p>
        <router-link :to="activa ? '/libros' : '/ingresar'" class="enlace-principal">{{ activa ? 'Explorar catálogo →' : 'Comenzar mi biblioteca →' }}</router-link>
        <router-link v-if="activa" to="/panel" class="enlace-panel">Ver mi panel</router-link>
      </div>
      <BibliotecaIlustracion class="ilustracion" />
    </div>
    <div v-if="activa" class="actividad">
      <button class="boton-acordeon" type="button" :aria-expanded="formularioVisible" aria-controls="formulario-inicio" @click="formularioVisible = !formularioVisible">
        <span aria-hidden="true">＋</span>
        {{ formularioVisible ? 'Ocultar formulario' : 'Agregar un libro' }}
        <span aria-hidden="true">{{ formularioVisible ? '⌃' : '⌄' }}</span>
      </button>
      <div v-show="formularioVisible" id="formulario-inicio" class="panel-formulario">
        <LibroForm @guardado="formularioVisible = false" />
      </div>
      <div v-if="errorCarga" class="error-carga">
        <el-alert :title="errorCarga" type="error" show-icon :closable="false" />
        <el-button @click="cargar(true)">Reintentar</el-button>
      </div>
      <section class="contador" aria-label="Libros agregados hoy">
        <span aria-hidden="true">✨</span>
        <div><p>Libros agregados hoy</p><strong>{{ cargando ? '…' : (errorCarga ? '—' : librosAgregadosHoy) }}</strong></div>
      </section>
    </div>
    <el-dialog v-model="mostrarNombre" title="Cambiar nombre" width="min(420px, 92vw)">
      <form class="formulario-nombre" @submit.prevent="guardarNombre">
        <label for="nombre-nuevo">Tu nombre</label>
        <el-input id="nombre-nuevo" v-model="nombreTemporal" maxlength="50" autocomplete="given-name" />
        <p v-if="errorNombre" role="alert" class="error">{{ errorNombre }}</p>
        <div class="acciones">
          <el-button type="primary" native-type="submit">Guardar nombre</el-button>
          <el-button @click="mostrarNombre = false">Cancelar</el-button>
        </div>
      </form>
    </el-dialog>
  </section>
</template>
<script>
import LibroForm from '@/components/LibroForm.vue'
import BibliotecaIlustracion from '@/components/BibliotecaIlustracion.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'HomeView',
  components: { LibroForm, BibliotecaIlustracion },
  data: () => ({ formularioVisible: false, mostrarNombre: false, nombreTemporal: '', errorNombre: '' }),
  computed: {
    ...mapGetters('sesion', ['activa', 'nombre']),
    ...mapGetters('productos', { librosAgregadosHoy: 'librosAgregadosHoy', cargando: 'loading', errorCarga: 'error' })
  },
  created() { if (this.activa) this.cargar() },
  methods: {
    ...mapActions('productos', { cargar: 'cargarLibros' }),
    cambiarNombre() { this.nombreTemporal = this.nombre; this.errorNombre = ''; this.mostrarNombre = true },
    async guardarNombre() {
      if (!await this.$store.dispatch('sesion/iniciar', this.nombreTemporal)) {
        this.errorNombre = 'Escribe un nombre antes de guardar.'
        return
      }
      this.mostrarNombre = false
    }
  }
}
</script>
<style scoped>
.presentacion { display: grid; grid-template-columns: 1.2fr 1fr; align-items: center; gap: 28px; padding: 22px 0 40px; }
h1 { font-size: clamp(32px, 5vw, 48px); line-height: 1.12; margin: 20px 0; }
.descripcion { color: var(--bl-secundario); line-height: 1.7; font-size: 18px; }
.saludo { color: var(--bl-acento); font-weight: bold; overflow-wrap: anywhere; }
.ilustracion { width: 100%; }
.enlace-principal { display: inline-block; padding: 15px 20px; border-radius: 10px; background: var(--el-color-primary); color: var(--el-color-white); text-decoration: none; font-weight: bold; margin: 10px 16px 10px 0; }
.enlace-panel { color: var(--bl-acento); display: inline-block; margin: 10px 0; }
.actividad { max-width: 780px; margin: auto; }
.boton-acordeon { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 12px; padding: 20px; border: 1px solid var(--bl-borde); border-radius: 14px; color: var(--bl-texto); background: var(--bl-suave); font-weight: bold; text-align: left; }
.panel-formulario { margin: 16px 0; text-align: left; }
.contador { display: flex; align-items: center; justify-content: center; gap: 18px; padding: 24px; margin-top: 18px; border: 1px solid var(--bl-borde); border-radius: 14px; background: var(--bl-panel); }
.contador > span { font-size: 32px; }
.contador p { margin: 0 0 6px; color: var(--bl-secundario); }
.contador strong { color: var(--bl-acento); font-size: 36px; }
.formulario-nombre { display: grid; gap: 14px; }
.error-carga { display: grid; gap: 12px; margin-top: 18px; }
@media (max-width: 650px) { .presentacion { grid-template-columns: minmax(0, 1fr); padding-top: 0; gap: 12px; } .ilustracion { max-width: 300px; justify-self: center; } }
</style>
