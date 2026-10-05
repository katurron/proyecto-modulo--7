export default {
  namespaced: true,
  state: () => ({ busqueda: '', categoria: '', soloFavoritos: false }),
  mutations: {
    SET_BUSQUEDA(state, valor) { state.busqueda = valor },
    SET_CATEGORIA(state, valor) { state.categoria = valor },
    SET_SOLO_FAVORITOS(state, valor) { state.soloFavoritos = valor },
    LIMPIAR(state) { state.busqueda = ''; state.categoria = ''; state.soloFavoritos = false }
  },
  getters: {
    librosFiltrados(state, getters, rootState) {
      const texto = state.busqueda.trim().toLocaleLowerCase('es')
      return rootState.productos.libros.filter(libro =>
        (libro.titulo.toLocaleLowerCase('es').includes(texto) || libro.autor.toLocaleLowerCase('es').includes(texto)) &&
        (!state.categoria || libro.categoria === state.categoria) &&
        (!state.soloFavoritos || rootState.favoritos.ids.includes(String(libro.id)))
      )
    }
  }
}
