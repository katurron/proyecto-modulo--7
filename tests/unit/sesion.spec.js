import { createStore } from 'vuex'
import sesion from '@/store/modules/sesion'
import favoritos from '@/store/modules/favoritos'
import filtros from '@/store/modules/filtros'

beforeEach(() => { localStorage.clear(); sessionStorage.clear() })

test('valida el nombre, restaura la sesión y la cierra limpiando filtros y favoritos', async () => {
  const store = createStore({ modules: { sesion, favoritos, filtros } })
  expect(await store.dispatch('sesion/iniciar', '   ')).toBe(false)
  expect(store.getters['sesion/activa']).toBe(false)
  await store.dispatch('sesion/iniciar', '  Constanza  ')
  expect(store.getters['sesion/nombre']).toBe('Constanza')
  expect(localStorage.getItem('booklist_usuario')).toBe('Constanza')
  const restaurada = createStore({ modules: { sesion, favoritos, filtros } })
  expect(restaurada.getters['sesion/activa']).toBe(true)
  restaurada.commit('favoritos/TOGGLE_FAVORITO', '42')
  restaurada.commit('filtros/SET_BUSQUEDA', 'sub terra')
  await restaurada.dispatch('sesion/cerrar')
  expect(restaurada.getters['sesion/activa']).toBe(false)
  expect(sessionStorage.getItem('booklist_sesion')).toBeNull()
  expect(restaurada.getters['favoritos/ids']).toEqual([])
  expect(restaurada.state.filtros.busqueda).toBe('')
})
