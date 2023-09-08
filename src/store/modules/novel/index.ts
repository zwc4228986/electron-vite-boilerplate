import { defineStore } from 'pinia'

interface Novel {
  novel_id: number
  novel_name: string
}

export const useNovelStore = defineStore('novel-store', {
  state: (): Novel => ({
    novel_id: 0,
    novel_name: '',
  }),
  actions: {
    update(novel_id: number, novel_name: string) {
      this.novel_id = novel_id
      this.novel_name = novel_name
    }
  },
})