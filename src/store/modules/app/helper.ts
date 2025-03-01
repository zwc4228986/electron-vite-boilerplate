import { fetchChatConfig } from '@/api'
import { ss } from '@/utils/storage'

const LOCAL_NAME = 'appSetting'

export type Theme = 'light' | 'dark' | 'auto'

export type Language = 'zh-CN' | 'zh-TW' | 'en-US' | 'ko-KR'

export interface AppState {
  siderCollapsed: boolean
  site_name: string
  theme: Theme
  language: Language
}

export async function getAndSettingSetting() {
  const setting = await fetchChatConfig()
  setLocalSetting(setting.data)
}

export function defaultSetting(): AppState {
  return { siderCollapsed: false, theme: 'light', language: 'zh-CN', site_name: '' }
}

export function getLocalSetting(): AppState {
  const localSetting: AppState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalSetting(setting: AppState): void {
  ss.set(LOCAL_NAME, setting)
}
