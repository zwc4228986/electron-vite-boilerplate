import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import imi from '../chat/Main'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'

async function bootstrap() {

  const app = createApp(App)
  setupStore(app)
  await setupRouter(app)
  setupAssets()

  setupScrollbarStyle()
  app.use(imi, import.meta.env.VITE_GLOB_WS_URL)
  app.mount('#app')
}

bootstrap()