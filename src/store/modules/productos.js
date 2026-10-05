import api from '@/api'

const mismoId = (a, b) => String(a) === String(b)

export default {
  namespaced: true,
  state: () => ({ libros: [], loading: false, error: null, cargado: false }),
  mutations: {
    SET_LIBROS(state, libros) { state.libros = libros; state.cargado = true },
    SET_LOADING(state, valor) { state.loading = valor },
    SET_ERROR(state, valor) { state.error = valor },
    AGREGAR_LIBRO(state, libro) { state.libros.push(libro) },
    EDITAR_LIBRO(state, libro) {
      const indice = state.libros.findIndex(item => mismoId(item.id, libro.id))
      if (indice !== -1) state.libros.splice(indice, 1, libro)
    },
    ELIMINAR_LIBRO(state, id) {
      state.libros = state.libros.filter(libro => !mismoId(libro.id, id))
    }
  },
  actions: {
    async cargarLibros({ commit, state }, forzar = false) {
      if (state.loading || (state.cargado && !forzar)) return
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const { data } = await api.get('/libros')
        commit('SET_LIBROS', data)
      } catch (error) {
        commit('SET_ERROR', 'No se pudo cargar el catálogo. Revisa que la API esté encendida e intenta nuevamente.')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async agregarLibro({ commit }, datos) {
      const { data } = await api.post('/libros', {
        ...datos,
        fechaRegistro: new Date().toLocaleDateString('sv-SE'),
        publicado: false
      })
      commit('AGREGAR_LIBRO', data)
      return data
    },
    async editarLibro({ commit }, libro) {
      const { data } = await api.put(`/libros/${encodeURIComponent(libro.id)}`, libro)
      commit('EDITAR_LIBRO', data)
      return data
    },
    async eliminarLibro({ commit }, id) {
      await api.delete(`/libros/${encodeURIComponent(id)}`)
      commit('ELIMINAR_LIBRO', id)
      commit('favoritos/QUITAR_FAVORITO', id, { root: true })
    },
    
  },
  getters: {
    libros: state => state.libros,
    loading: state => state.loading,
    error: state => state.error,
    libroPorId: state => id => state.libros.find(libro => mismoId(libro.id, id)),
    librosAgregadosHoy: state => state.libros.filter(libro => libro.fechaRegistro === new Date().toLocaleDateString('sv-SE')).length
  }
}
