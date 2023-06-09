import { createApp } from 'vue'
import router from './router'
import './style.css'
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
import App from './App.vue'
import {createPinia} from 'pinia'
app.use(router).use(createPinia()).mount('#app')
