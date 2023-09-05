import { defineStore } from 'pinia'
import type { UserInfo, UserState } from './helper'
import { defaultSetting, getLocalState, setLocalState } from './helper'
import { getUserDetail } from '@/api'

export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalState(),
  actions: {
    updateUserInfo(userInfo: Partial<UserInfo>) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      this.recordState()
    },
    resetUserInfo() {
      this.userInfo = { ...defaultSetting().userInfo }
      this.recordState()
    },
    async getUserInfo() {
      const UserDetail = await getUserDetail({})
      const user: any = UserDetail.data
      // this.$state.userInfo.share_url = user.invite_url
      this.updateUserInfo({
        invite_url: user.invite_url,
        id: user.id,
        is_vip: user.vip_status_format > 0,
        // nickname: user.nickname,
        // vip_status_format: user.vip_status_format,
      })
    },
    recordState() {
      setLocalState(this.$state)
    },
  },
})
