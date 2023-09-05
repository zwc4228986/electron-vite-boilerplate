import type { Pinia } from 'pinia'
import { defineStore } from 'pinia'
import { getToken, getU, removeToken, setToken } from './helper'
import { store } from '@/store'

interface SessionResponse {
  auth: boolean
  model: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI'
}

export interface AuthState {
  u: string | null
  image: string | null
  token: string | undefined
  session: SessionResponse | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    image: null,
    u: getU(),
    token: getToken(),
    session: null,
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      return state.session?.model === 'ChatGPTAPI'
    },
  },

  actions: {
    async getSession() {
      try {
        // const { data } = await fetchSession<SessionResponse>()
        const data: SessionResponse = {
          auth: true,
          model: 'ChatGPTAPI',
        }
        this.session = data
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },
    setImage(url: string) {
      this.image = url
    },
    setToken(token: string) {
      this.token = token
      setToken(token)
    },
    getToken() {
      this.token = getToken()
      return this.token
    },
    removeToken() {
      this.token = undefined
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}

export function useAuthStoreWith(store: Pinia | null | undefined) {
  return useAuthStore(store)
}
