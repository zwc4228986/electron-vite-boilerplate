import type { AxiosProgressEvent } from 'axios'
import { post } from '@/utils/request'
import { useAuthStore } from '@/store'

export function postsCreate<T>(params: any) {
  return post<T>({
    url: 'api/posts/create',
    data: params,
  })
}

export function postsLists<T>(params: any) {
  return post<T>({
    url: 'api/posts/list',
    data: params,
  })
}

export function postsDetail<T>(params: any) {
  return post<T>({
    url: 'api/posts/detail',
    data: params,
  })
}

export function postsReplyList<T>(params: any, page = 1) {
  return post<T>({
    url: `api/posts/reply/get?page=${page}`,
    data: params,
  })
}

export function postsReplyCreate<T>(params: any) {
  return post<T>({
    url: 'api/posts/reply/create',
    data: params,
  })
}

export function AiReplyAPIProcess<T = any>(
  params: {
    type: string
    post_id: number
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  // const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    type: params.type,
    post_id: params.post_id,
  }
  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
    }
  }
  return post<T>({
    url: 'api/post/reply/start',
    data,
    onDownloadProgress: params.onDownloadProgress,
  })
}
