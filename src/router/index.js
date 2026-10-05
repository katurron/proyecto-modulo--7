import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import HomeView from '@/views/HomeView.vue'
import ListaLibros from '@/views/ListaLibros.vue'
import DetalleLibro from '@/views/DetalleLibro.vue'
import NoEncontradoView from '@/views/NoEncontradoView.vue'
import IngresoView from '@/views/IngresoView.vue'
import PanelView from '@/views/PanelView.vue'

const routes = [
  { path: '/', name: 'inicio', component: HomeView },
  { path: '/ingresar', name: 'ingresar', component: IngresoView },
  { path: '/panel', name: 'panel', component: PanelView, meta: { requiereSesion: true } },
  { path: '/libros', name: 'libros', component: ListaLibros, meta: { requiereSesion: true } },
  { path: '/libros/:id', name: 'detalle-libro', component: DetalleLibro, props: true, meta: { requiereSesion: true } },
  { path: '/:pathMatch(.*)*', name: 'no-encontrado', component: NoEncontradoView }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach(to => {
  const activa = store.getters['sesion/activa']
  if (to.meta.requiereSesion && !activa) {
    return { name: 'ingresar', query: { siguiente: to.fullPath } }
  }
  if (to.name === 'ingresar' && activa) return { name: 'panel' }
})

export default router
