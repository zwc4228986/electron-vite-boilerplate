import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export interface UserInfo {
  avatar: string
  context_time: number
  name: string
  id: any
  is_vip: boolean
  description: string
  invite_url: string
}

export interface UserState {
  userInfo: UserInfo
}
export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting)
}

export function defaultSetting(): UserState {
  return {
    userInfo: {
      invite_url: '',
      is_vip: false,
      context_time: 0,
      avatar: 'https://raw.githubusercontent.com/Chanzhaoyu/chatgpt-web/main/src/assets/avatar.jpg',
      name: '',
      description: '',
      id: 0,
    },
  }
}

export function getLocalState(): UserState {
  const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}
