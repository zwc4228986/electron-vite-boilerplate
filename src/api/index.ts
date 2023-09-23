import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { useAuthStore, useRoleStore, useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}


export function getRoleLists<T = any>() {
  return post<T>({
    url: 'api/ai/role/lists',
  })
}

export function getMyTool<T = any>() {
  return post<T>({
    url: 'api/tool/my',
  })
}

export function getMyPeople<T = any>(params: any) {
  const data = params
  return post<T>({
    url: 'api/people/my',
    data,
  })
}

export function getToolTypeLists<T = any>() {
  return post<T>({
    url: 'api/tool/type/lists',
  })
}

export function getRoleDetail<T = any>(params: any) {
  const data = params
  return post<T>({
    url: 'api/ai/role/detail',
    data,
  })
}
export function getToolDetail<T = any>(params: any) {
  const data = params
  return post<T>({
    url: 'api/tool/detail',
    data,
  })
}

export function getUserDetail<T = any>(params: any) {
  const data = params
  return post<T>({
    url: 'api/user/detail',
    data,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: 'api/ai/config',
  })
}

export function fetchUser<T = any>() {
  return post<T>({
    url: 'api/user/detail',
  })
}

export function getUserVipConfig<T = any>() {
  return post<T>({
    url: 'api/user/vip/config',
  })
}

export function apiPayMp<T = any>(params: any) {
  const data = params
  return post<T>({
    url: 'api/pay/mp',
    data,
  })
}

export function gptCheck<T = any>(params: any) {
  const data = params
  return post<T>({
    url: 'api/ai/chatgpt/check',
    data,
  })
}

export function apiPayScan<T = any>(params: any) {
  const data = params
  return post<T>({
    url: 'api/pay/scan',
    data,
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    uuid: string
    open_context: number
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const roleStore = useRoleStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    data: params.prompt,
    uuid: params.uuid,
    open_context: params.open_context,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
      role_id: roleStore.role_id,
    }
  }

  return post<T>({
    url: 'api/ai/chatgpt',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function ChatRoleAPIProcess<T = any>(
  params: {
    prompt: string
    role_id: number
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  // const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    role_id: params.role_id,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
    }
  }

  return post<T>({
    url: 'api/ai/role',
    data,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function ToolAPIProcess<T = any>(
  params: {
    params: string
    id: number
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  // const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    params: params.params,
    id: params.id,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
    }
  }

  return post<T>({
    url: 'api/tool/run',
    data,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>(data: any) {
  return post<T>({
    url: '/session',
    data,
  })
}

export function fetchSdkConfig<T>(data: any) {
  return post<T>({
    url: 'api/ai/js-sdk/config',
    data,
  })
}

export function fetchConfig<T>() {
  return post<T>({
    url: '/api/ai/config',
  })
}

export function fetchChatAiImage<T>(params: any) {
  const data = params
  return post<T>({
    url: '/api/ai/chatgpt/image',
    data,
  })
}

export function SdImageLists<T>(params: any) {
  const data = params
  return post<T>({
    url: '/api/sd/image',
    data,
  })
}

export function SdModelLists<T>(params: any) {
  const data = params
  return post<T>({
    url: '/api/sd/model',
    data,
  })
}

export function SdLoraLists<T>(params: any) {
  const data = params
  return post<T>({
    url: '/api/sd/lora',
    data,
  })
}

export function SdImageCreate<T>(params: any) {
  const data = params
  return post<T>({
    url: '/api/sd/textimage',
    data,
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

export function createChatRole<T>(params: any) {
  return post<T>({
    url: 'api/chat/role/create',
    data: params,
  })
}

export function createTool<T>(params: any) {
  return post<T>({
    url: 'api/tool/create',
    data: params,
  })
}

export function editTool<T>(params: any) {
  return post<T>({
    url: 'api/tool/edit',
    data: params,
  })
}

export function deleteTool<T>(params: any) {
  return post<T>({
    url: 'api/tool/delete',
    data: params,
  })
}
export function deletePeople<T>(params: any) {
  return post<T>({
    url: 'api/tool/people',
    data: params,
  })
}

export function createPeople<T>(params: any) {
  return post<T>({
    url: 'api/people/create',
    data: params,
  })
}

export function editPeople<T>(params: any) {
  return post<T>({
    url: 'api/people/edit',
    data: params,
  })
}

export function deletPeople<T>(params: any) {
  return post<T>({
    url: 'api/people/delete',
    data: params,
  })
}

export function EdithatRole<T>(params: any) {
  return post<T>({
    url: 'api/chat/role/edit',
    data: params,
  })
}

export function getChatRole<T>() {
  return post<T>({
    url: 'api/chat/role/lists',
    data: {},
  })
}

export function DeleteChatRole<T>(id: number) {
  return post<T>({
    url: 'api/chat/role/delete',
    data: { id },
  })
}

export function getImageDetail<T>(id: number) {
  return post<T>({
    url: 'api/sd/textimage/detail',
    data: { id },
  })
}
export function useExchange<T>(code: string) {
  return post<T>({
    url: 'api/exchange/use',
    data: { code },
  })
}

export function addNovel<T>(params: any) {
  return post<T>({
    url: 'api/novel/create',
    data:params,
  })
}

export function editNovel<T>(params: any) {
  return post<T>({
    url: 'api/novel/edit',
    data:params,
  })
}

export function createNovelChapter<T>(params: any) {
  return post<T>({
    url: 'api/novel/chapter/create',
    data:params,
  })
}

export function editNovelChapter<T>(params: any) {
  return post<T>({
    url: 'api/novel/chapter/edit',
    data:params,
  })
}

export function saveNovelChapter<T>(params: any) {
  return post<T>({
    url: 'api/novel/chapter/save-all',
    data:params,
  })
}
export function NovelChapterContentDetail<T>(params: any) {
  return post<T>({
    url: 'api/novel/chapter/content/detail',
    data:params,
  })
}

export function NovelChapterDetail<T>(params: any) {
  return post<T>({
    url: 'api/novel/chapter/detail',
    data:params,
  })
}

export function getMyNovelChapter<T>(params: any) {
  return post<T>({
    url: 'api/novel/chapter/my',
    data:params,
  })
}


export function myNovel<T>(params: any) {
  return post<T>({
    url: 'api/novel/my',
    data:params,
  })
}

export function getVoiceLists<T>(params: any) {
  return post<T>({
    url: 'api/voice/lists',
    data:params,
  })
}