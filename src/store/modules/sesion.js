const claveSesion = 'booklist_sesion'

export default {
  namespaced: true,
  state: () => ({ nombre: sessionStorage.getItem(claveSesion) || '' }),
  getters: {
    nombre: state => state.nombre,
    activa: state => Boolean(state.nombre)
  },
  mutations: {
    SET_NOMBRE(state, nombre) { state.nombre = nombre }
  },
  actions: {
    iniciar({ commit }, nombre) {
      const limpio = nombre.trim().slice(0, 50)
      if (!limpio) return false
      sessionStorage.setItem(claveSesion, limpio)
      localStorage.setItem('booklist_usuario', limpio)
      commit('SET_NOMBRE', limpio)
      return true
    },
    cerrar({ commit }) {
      sessionStorage.removeItem(claveSesion)
      commit('SET_NOMBRE', '')
      commit('filtros/LIMPIAR', null, { root: true })
      commit('favoritos/LIMPIAR', null, { root: true })
    }
  }
}
