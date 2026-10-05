import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import LibroCard from '@/components/LibroCard.vue'

test('muestra el libro recibido y enlaza su detalle y edición', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/libros/:id', name: 'detalle-libro', component: { template: '<div />' } }
    ]
  })
  await router.push('/')
  await router.isReady()
  const wrapper = mount(LibroCard, {
    props: { libro: { id: '42', titulo: 'Sub terra', autor: 'Baldomero Lillo', categoria: 'Novela', descripcion: 'Cuentos de mineros.', portada: '/portada.jpg' } },
    global: { plugins: [router, ElementPlus] }
  })
  expect(wrapper.get('h2').text()).toBe('Sub terra')
  expect(wrapper.get('.autor').text()).toContain('Baldomero Lillo')
  expect(wrapper.get('.el-tag').text()).toBe('Novela')
  expect(wrapper.get('.descripcion').text()).toBe('Cuentos de mineros.')
  expect(wrapper.get('img').attributes('alt')).toBe('Portada de Sub terra')
  expect(wrapper.get('a[href="/libros/42"]').text()).toBe('Ver detalle')
  expect(wrapper.get('a[href="/libros/42?editar=1"]').text()).toBe('Editar')
  await wrapper.get('button[aria-pressed]').trigger('click')
  expect(wrapper.emitted('favorito')).toEqual([['42']])
  wrapper.unmount()
})
