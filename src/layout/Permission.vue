<script setup lang='ts'>
import { computed, watch } from 'vue'
import { NImage, NModal } from 'naive-ui'
import Observer from '../../chat/socket-server/Observer'
import { useAuthStore } from '@/store'
import { isMobileWeixin } from '@/utils/functions'
// const ms = useMessage()
interface Props {
  visible: boolean
}

const props = defineProps<Props>()

const authStore = useAuthStore()

const isWeixin: boolean = isMobileWeixin()
// const loading = ref(false)
// const token = ref('')
// const image = ref('')
const image = computed(() => authStore.image)
// const image = ref('https://image1.douresources.com/system/logo.jpg')

// async function handleVerify() {
//   const secretKey = token.value.trim()

//   if (!secretKey)
//     return

//   try {
//     loading.value = true
//     await fetchVerify(secretKey)
//     authStore.setToken(secretKey)
//     ms.success('success')
//     window.location.reload()
//   }
//   catch (error: any) {
//     ms.error(error.message ?? 'error')
//     authStore.removeToken()
//     token.value = ''
//   }
//   finally {
//     loading.value = false
//   }
// }

// const token = ref()
// const login = () => {
//   console.log(token)
//   authStore.setToken(token.value)
// }

watch(
  () => props.visible, (newVal) => {
    // 在这里处理visible属性的变化
    console.log(newVal)
    new Observer(import.meta.env.VITE_GLOB_WS_URL)
  },
)
</script>

<template>
  <NModal :show="visible" style="width: 90%; max-width: 640px">
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            {{ isWeixin ? '长按二维码登录' : '请使用微信扫一扫登录' }}
          </h2>
          <!-- <Icon403 class="w-[200px] m-auto" /> -->
          <div class="flex">
            <NImage
              class="m-auto"
              width="200"
              height="200"
              :src="image as string"
              :previewed-img-props="{ style: { border: '8px solid white' } }"
            />
          </div>

          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            关注“抖资源”微信公众号
          </p>
        </header>
      </div>
    </div>
  </NModal>
</template>
