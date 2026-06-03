import './styles/global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Suppress TypeScript error when .vue module typings are missing
// @ts-ignore
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')