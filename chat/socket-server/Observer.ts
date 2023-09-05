import { useUserStore } from '@/store'
import { useAuthStoreWithout } from '@/store/modules/auth'
import { getU } from '@/store/modules/auth/helper'
export default class {
  private readonly connectionUrl: string
  public reconnection: boolean
  public reconnectionSetInterval: any
  public setInterval: any
  public heartbeatSetInterval: any
  public pingInterval: number
  public pingTimeout: number
  public WebSocket: WebSocket | undefined
  constructor(connectionUrl: string, opts: void) {
    console.log(opts)
    this.connectionUrl = connectionUrl
    this.reconnection = true
    this.connect()
    this.onEvent()
    this.pingInterval = 2000
    this.pingTimeout = 6000
    this.reconnectionSetInterval = null
    this.setInterval = null
    this.heartbeatSetInterval = null
  }

  connect() {
    console.log(this.connectionUrl)
    console.log(getU())
    if (this.WebSocket) {
      if (this.WebSocket.readyState == this.WebSocket.OPEN)
        return false
    }

    if (this.reconnectionSetInterval)
      console.log('网络连接已断开，正在尝试重新连接...')

    let url = this.connectionUrl
    if (getU())
      url = `${url}?u=${getU()}`

    this.WebSocket = new WebSocket(url)

    return this.WebSocket
  }

  onEvent(): void {
    if (this.WebSocket) {
      this.WebSocket.onerror = this.onError.bind(this)
      this.WebSocket.onopen = this.onOpen.bind(this)
      this.WebSocket.onmessage = this.onMessage.bind(this)
      this.WebSocket.onclose = this.onClose.bind(this)
    }
  }

  heartbeat() {
    console.log('开始ping')
    // this.heartbeatSetInterval = setInterval(()=>{
    //   console.log('ping');
    //   this.sendEvent('ping');
    // }, 5000);
  }

  onError(message: any) {
    console.log('onError', message)
  }

  sendEvent(event: string, data = {}) {
    if (this.WebSocket)

      this.WebSocket.send(JSON.stringify({ event, data }))
  }

  reConnection() {
    if (this.reconnectionSetInterval == null) {
      clearTimeout(this.reconnectionSetInterval)
      this.reconnectionSetInterval = setInterval(() => {
        this.connect()
      }, 2000)
      this.connect()
    }
  }

  onClose(message: any) {
    console.log(message)
    // console.log('onClose', message)
    // this.closeConnect();
    // 	this.clearhearbeat();
    // // clearInterval(this.config.headerbeat.setInterval)
    // this.reConnection()
  }

  onOpen() {
    // if(get_token()){
    // this.heartbeat();
    // }

    // const auth = useAuthStoreWithout()

    // console.log('websocket-open', evt)
    // if (this.config.reconnect.setInterval) {
    //   console.log('重连成功')
    //   clearInterval(this.config.reconnect.setInterval)
    //   this.config.reconnect.setInterval = null
    // }
  }

  clearhearbeat() {
    this.heartbeatSetInterval = null
  }

  	closeConnect() {
    clearInterval(this.reconnectionSetInterval)
    this.reconnectionSetInterval = null
    if (this.WebSocket)
      this.WebSocket.close()
  }

  onMessage(e: any): void {
    console.log(`onmessage: ${e.data}`)
    const authStore = useAuthStoreWithout()
    const userStore = useUserStore()
    const data = JSON.parse(e.data)
    if (data.event === 'create_wechat_qrcode')
      authStore.setImage(data.data.image)
    if (data.event === 'login_success') {
      authStore.setToken(data.data.token)
      userStore.getUserInfo()
    }

    if (data.event === 'set_context')
      userStore.updateUserInfo({ context_time: data.data.context_time })

    //         if (data['event'] == 'login_success') {
    //             axios.post('/web/api/set_token', {token: data['data']['token']}).then(res => {
    //                 console.log(res);
    //                 window.location.reload();
    //             })
    //         }
    // this.lastTime = new Date().getTime()
    // const result = this.onParse(evt)
    // if (Object.prototype.hasOwnProperty.call(this.onCallBacks, result.event)) {
    //   console.log(result)
    //   this.onCallBacks[result.event](result.data, result.originData)
    // }
    // else {
    //   console.warn(`websocket 消息事件【${result.event}】未绑定`)
    // }
  }
}
// function get_token() {
//   throw new Error('Function not implemented.')
// }
