import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/tema.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'


document.documentElement.classList.toggle('dark', localStorage.getItem('booklist_tema') === 'oscuro')

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .mount('#app')