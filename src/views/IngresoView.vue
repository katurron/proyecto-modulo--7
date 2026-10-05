<template>
  <section class="ingreso">
    <BibliotecaIlustracion class="ilustracion" />
    <el-card class="tarjeta-ingreso" shadow="never">
      <p class="etiqueta">Tu espacio de lectura</p>
      <h1>Bienvenido a BookList</h1>
      <p>Ingresa tu nombre para abrir tu panel y organizar tus libros.</p>
      <form @submit.prevent="ingresar">
        <label for="nombre-sesion">Tu nombre</label>
        <el-input id="nombre-sesion" v-model="nombre" maxlength="50" autocomplete="given-name" placeholder="Escribe tu nombre" />
        <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />
        <el-button type="primary" native-type="submit">Iniciar sesión</el-button>
      </form>
      <p class="nota">Sesión de demostración: solo necesitas tu nombre, sin contraseña. El catálogo es compartido.</p>
    </el-card>
  </section>
</template>
<script>
import BibliotecaIlustracion from '@/components/BibliotecaIlustracion.vue'
export default {
  name: 'IngresoView',
  components: { BibliotecaIlustracion },
  data: () => ({ nombre: localStorage.getItem('booklist_usuario') || '', error: '' }),
  methods: {
    async ingresar() {
      if (!await this.$store.dispatch('sesion/iniciar', this.nombre)) {
        this.error = 'Escribe tu nombre para continuar.'
        return
      }
      const siguiente = this.$route.query.siguiente
      const ruta = typeof siguiente === 'string' && siguiente.startsWith('/') && !siguiente.startsWith('//')
        ? this.$router.resolve(siguiente) : null
      this.$router.replace(ruta && ruta.meta.requiereSesion ? siguiente : { name: 'panel' })
    }
  }
}
</script>
<style scoped>
.ingreso { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 36px; margin: 35px auto; }
.ilustracion { width: 100%; }
.tarjeta-ingreso { border-radius: 20px; }
h1 { font-size: 30px; margin: 12px 0; }
p { line-height: 1.6; }
form { display: grid; gap: 14px; margin: 24px 0; }
label { font-weight: bold; }
.nota { font-size: 13px; color: var(--bl-secundario); }
@media (max-width: 650px) { .ingreso { grid-template-columns: minmax(0, 1fr); gap: 20px; margin: 0 auto; } .ilustracion { max-width: 260px; justify-self: center; } }
</style>
