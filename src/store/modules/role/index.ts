import { defineStore } from 'pinia'
import { getLocalState, setLocalState } from './helper'

interface Role {
  role_id: number
  role_name: string
}

export const useRoleStore = defineStore('role-store', {
  state: (): Role => getLocalState(),
  actions: {
    update(role_id: number, role_name: string) {
      this.role_id = role_id
      this.role_name = role_name
      this.recordState()
    },
    recordState() {
      setLocalState(this.$state)
    },
  },
})
