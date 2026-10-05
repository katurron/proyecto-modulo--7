<template>
  <div class="estructura-app">
    <AppHeader />

    <main class="contenido">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>
<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  }
}
</script>
