<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { NLayout, NLayoutContent, NLayoutFooter, NLayoutSider, NMenu, NWatermark } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { computed, h, ref, watch } from 'vue'
import Permission from './Permission.vue'
import { SvgIcon } from '@/components/common'
import { useAuthStore, useUserStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const { isMobile } = useBasicLayout()

const userStore = useUserStore()
const uid: any = `${userStore.userInfo.id}-禁止涉政`
const authStore = useAuthStore()


const needPermission = computed(() => !authStore.token)

console.log('needPermission',needPermission);

const router = useRouter()

function renderIcon(icon: string, cl: string | null) {
  return () => h(SvgIcon, { icon, class: cl })
}

const menuOptions: MenuOption[] = [
  {
    label: '对话',
    key: 'chat',
    icon: renderIcon('fluent:chat-32-regular', 'text-xl'),
  },
  {
    label: '绘图',
    key: 'draw',
    icon: renderIcon('streamline:interface-edit-paint-color-colors-design-paint-painting-palette', 'text-xl'),
  },
  // {
  //   label: '知识星球',
  //   key: 'answers',
  //   icon: renderIcon('bxs:planet', 'text-4xl'),
  // },
  {
    label: '应用',
    key: 'tool',
    icon: renderIcon('carbon:tool-box', 'text-xl'),
  },
  {
    label: '我的',
    key: 'user',
    icon: renderIcon('mingcute:user-1-line', 'text-xl'),
  },
]

const route = useRoute()
console.log(route.meta)
const activeKey = ref<any>(route.meta.path)
// active(url,path) {
// 			// console.log('active',val,path);
// 				let urls = url.split("?");
// 				let query = {};
// 				if(urls.length==2){
// 					let arr = urls[1].split("&");
// 					this.$YJ.forEach(arr,res=>{
// 						console.log('active',res);
// 						var data = res.split("=");
// 						query[data[0]] = data[1];
// 					})
// 				}
// 				this.$router.push({
// 					path: url,
// 					query:query
// 				});
// 		},
watch(() => activeKey.value, (url, oldValue) => {
  const query = {}
  if (url) {
    const urls = url.split('?')

    if (urls.length === 2) {
      const arr: any = urls[1].split('&')
      arr.forEach((res) => {
        console.log('active', res)
        const data = res.split('=')
        query[data[0]] = data[1]
      })
    }
  }

  // if (url === 'chat') {
  //   console.log(url)
  //   router.replace({ name: 'Chat', params: { uuid: chatStore.active } }).catch((res) => {
  //     console.log(res)
  //   })
  // }
  // else {
  router.push({
    path: `/${url}`,
    query,
  })
  // }
})
const collapsed = ref(true)

const keepLiveRoute = ref([
  '/chat',
  '/draw/index',
  '/draw',
])
</script>

<template>
  <NWatermark
    :content="uid"
    cross
    fullscreen
    :font-size="14"
    :line-height="16"
    font-color="rgba(128, 128, 128, .2)"
    :width="384"
    :height="384"
    :x-offset="12"
    :y-offset="60"
    :rotate="-15"
  />
  <NLayout v-if="isMobile" class="h-full mobile-layout">
    <NLayoutContent style="height: calc(100% - 64px);">
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          :key="$route.fullPath"
        />
      </router-view>
    </NLayoutContent>
    <NLayoutFooter bordered style="height: 64px;" class="flex justify-center items-center w-full">
      <NMenu v-model:value="activeKey" class="flex" :icon-size="24" mode="horizontal" :options="menuOptions" />
    </NLayoutFooter>
  </NLayout>

  <NLayout v-else class="h-full" has-sider>
    <NLayoutSider
      bordered
      collapse-mode="width"
      :width="130"
      :collapsed-width="64"
      :collapsed="collapsed"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <div class="text-xl font-bold flex items-center justify-center p-4">
        AI
      </div>
      <NMenu
        v-model:value="activeKey"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
      />
    </NLayoutSider>
    <NLayout>
      <NLayoutContent style="height: 100%">
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            :key="$route.fullPath"
          />
        </router-view>
      </NLayoutContent>
    </NLayout>
  </NLayout>

  <Permission :visible="needPermission" />
  <!-- <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-0']">
    <div v-if="!isMobile" class="flex  items-center justify-between p-2">

    </div>

    <div v-if="isMobile" class="flex   justify-center items-center">
      <NMenu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
    </div>

  </div> -->
</template>

<style scoped>
.mobile-layout :deep(.n-menu-item-content){
   display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.mobile-layout :deep(.n-menu){
  width: 100%;
  display: flex;
  padding: 0 10px;
}
.mobile-layout :deep(.n-menu-item){
  height: 47px;
  flex: 1;
}
.mobile-layout :deep(.n-menu-item-content__icon){
  margin-right:0px!important;
}
</style>
