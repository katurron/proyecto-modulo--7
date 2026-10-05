<template>
  <header class="barra-navegacion">
    <router-link to="/" class="logo"><span aria-hidden="true">📚</span> BookList</router-link>
    <nav aria-label="Navegación principal">
      <router-link to="/">Inicio</router-link>
      <router-link to="/libros">Libros</router-link>
      <router-link v-if="activa" to="/panel">Mi panel</router-link>
      <router-link v-else to="/ingresar">Iniciar sesión</router-link>
    </nav>
    <div class="controles">
      <el-button :aria-pressed="oscuro" data-testid="cambiar-tema" @click="cambiarTema">
        {{ oscuro ? '☀ Tema claro' : '☾ Tema oscuro' }}
      </el-button>
      <el-button v-if="activa" plain @click="salir">Cerrar sesión</el-button>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppHeader',
  data: () => ({ oscuro: document.documentElement.classList.contains('dark') }),
  computed: { ...mapGetters('sesion', ['activa']) },
  methods: {
    cambiarTema() {
      this.oscuro = !this.oscuro
      document.documentElement.classList.toggle('dark', this.oscuro)
      localStorage.setItem('booklist_tema', this.oscuro ? 'oscuro' : 'claro')
    },
    async salir() {
      await this.$store.dispatch('sesion/cerrar')
      this.$router.replace({ name: 'ingresar' })
    }
  }
}
</script>

<style scoped>
.barra-navegacion { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 18px; padding: 18px max(20px, calc((100% - 1120px) / 2)); background: var(--bl-panel); border-bottom: 1px solid var(--bl-borde); }
.logo { color: var(--bl-acento); font-size: 22px; font-weight: bold; text-decoration: none; white-space: nowrap; }
nav, .controles { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; }
nav a { color: var(--bl-texto); text-decoration: none; padding: 8px 0; }
nav a.router-link-exact-active { color: var(--bl-acento); font-weight: bold; border-bottom: 2px solid currentColor; }
.controles :deep(.el-button) { margin: 0; }
@media (max-width: 600px) { .barra-navegacion { gap: 12px; } nav { width: 100%; } }
</style>
