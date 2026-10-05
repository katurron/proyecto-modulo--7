import { mount, flushPromises } from '@vue/test-utils'
import { createStore } from 'vuex'
import ElementPlus from 'element-plus'
import ListaLibros from '@/views/ListaLibros.vue'
import productos from '@/store/modules/productos'
import filtros from '@/store/modules/filtros'
import favoritos from '@/store/modules/favoritos'
import api from '@/api'

jest.mock('@/api', () => ({ __esModule: true, default: { get: jest.fn() } }))

test('muestra un error de API y permite recuperar el catálogo al reintentar', async () => {
  api.get.mockRejectedValueOnce(new Error('API desconectada'))
  api.get.mockResolvedValueOnce({ data: [] })
  const wrapper = mount(ListaLibros, {
    global: {
      plugins: [createStore({ modules: { productos, filtros, favoritos } }), ElementPlus],
      stubs: { LibroForm: true }
    }
  })
  await flushPromises()
  expect(wrapper.get('[role="alert"]').text()).toContain('No se pudo cargar el catálogo')
  expect(wrapper.find('.el-empty').exists()).toBe(false)
  await wrapper.get('.error-carga button').trigger('click')
  await flushPromises()
  expect(api.get).toHaveBeenCalledTimes(2)
  expect(api.get).toHaveBeenLastCalledWith('/libros')
  expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  expect(wrapper.get('.el-empty').text()).toContain('Aún no hay libros')
  wrapper.unmount()
})
