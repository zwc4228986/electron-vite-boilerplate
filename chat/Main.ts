import type { App } from 'vue'
import Observer from './socket-server/Observer'
import { getToken } from '@/store/modules/auth/helper'
import { useUserStore } from '@/store'

export default {
  install(
    app: App,
    connection: string,
  ): void {
    if (!connection)
      throw new Error('[vue-native-socket] cannot locate connection')
    if (!getToken()) {
      const observer = new Observer(connection)
      app.config.globalProperties.$socket = observer.WebSocket
    }
    else {
      // getUserInfo()
      console.log('11111111111')
      useUserStore().getUserInfo()
    }
  },
}
