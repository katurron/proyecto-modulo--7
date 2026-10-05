export default {
  namespaced: true,
  state: () => ({ ids: [] }),
  mutations: {
    LIMPIAR(state) { state.ids = [] },
    TOGGLE_FAVORITO(state, id) {
      const clave = String(id)
      state.ids = state.ids.includes(clave) ? state.ids.filter(item => item !== clave) : [...state.ids, clave]
    },
    QUITAR_FAVORITO(state, id) { state.ids = state.ids.filter(item => item !== String(id)) }
  },
  getters: { ids: state => state.ids }
}
