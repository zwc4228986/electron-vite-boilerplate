<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { NButton, NLayoutSider,NScrollbar,NPopconfirm,NInput } from 'naive-ui'

import { useAppStore ,useNovelStore} from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { addNovel, myNovel,editNovel } from '@/api'

// import { useUsingContext } from '../../hooks/useUsingContext'
import { HoverButton, SvgIcon } from '@/components/common'

const novelStore = useNovelStore()
// const { usingContext, toggleUsingContext } = useUsingContext()

const appStore = useAppStore()

// const userStore = useUserStore()

const { isMobile } = useBasicLayout()


const collapsed = computed(() => appStore.siderCollapsed)
// const context_time = computed(() => chatStore.usingContextTime)

function handleAdd() {
    addNovel({'name':'暂无命名'}).then(res=>{
        getLists()
    })
//   chatStore.addHistory({ title: 'New Chat', uuid: Date.now(), isEdit: false })
//   if (isMobile.value)
//     appStore.setSiderCollapsed(true)
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})


watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)

function handleEdit(item){
  item.isEdit = true;
}

function isWechatBrowser() {
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('micromessenger')
}

function isPhone() {
  const ua = navigator.userAgent.toLowerCase()
  return /mobile/i.test(ua)
}

const isWeixin = isPhone() && isWechatBrowser()
console.log(isPhone(), 'isPhone', isWeixin)

// const handelAd = () => {
//   window.$dialog?.warning({
//     title: '微信扫一扫,观看广告',
//     content: () => h(NImage, { src: 'https://www.douresources.com/ad1.jpg' }),
//   })
// }

interface NovelInfo {  
  name: string;  
  id: number;
  isEdit:boolean
}


function isActive(id: number) {
  return novelStore.novel_id === id
}

function handleSelect(item){
    novelStore.update(item.id,item.name)
}

function handleEnter(item){
    editNovel(item).then(res=>{
      item.isEdit = false
    })
    item.isEdit = false
}

const dataSources = ref<NovelInfo[]>([]);
function getLists(){
    myNovel({}).then(res=>{
        console.log(res)
        let data:any = res.data;
        data.forEach((novel: NovelInfo) => {
            novel.isEdit = false;
        });
        dataSources.value = data
        novelStore.update(data[0]?.id ?? 0,data[0]?.name ?? '请添加作品集')
    })
}

getLists();

</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"
    position="absolute"
    bordered
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NButton dashed block @click="handleAdd">
            新建作品集
          </NButton>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
            <NScrollbar class="px-4">
    <div class="flex flex-col gap-2 text-sm">
      <template v-if="!dataSources.length">
        <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
          <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
          <span>暂无作品集</span>
        </div>
      </template>
      <template v-else>

        <div v-for="(item, index) of dataSources" :key="index">
          <a
          
            class="relative flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]"
            :class="isActive(item.id) && ['border-[#4b9e5f]', 'bg-neutral-100', 'text-[#4b9e5f]', 'dark:bg-[#24272e]', 'dark:border-[#4b9e5f]', 'pr-14']"
            @click="handleSelect(item)"
          >
            <span>
              <SvgIcon icon="bi:collection-play-fill" />
            </span>
            <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
              <NInput
                v-if="item.isEdit"
                v-model:value="item.name" size="tiny"
              />
              <span v-else>{{ item.name }}</span>
            </div>
            
            <div v-if="isActive(item.id)" class="absolute z-10 flex visible right-1">
              <template v-if="item.isEdit">
                <button class="p-1" @click="handleEnter(item)">
                  <SvgIcon icon="ri:save-line" />
                </button>
              </template>
              <template v-else>
                <button class="p-1">
                  <SvgIcon icon="ri:edit-line" @click="handleEdit(item, true, $event)" />
                </button>
                <NPopconfirm placement="bottom" @positive-click="handleDeleteDebounce(index, $event)">
                  <template #trigger>
                    <button class="p-1">
                      <SvgIcon icon="ri:delete-bin-line" />
                    </button>
                  </template>
                  确定删除吗？
                </NPopconfirm>
              </template>
            </div>
          </a>
        </div>
      </template>
    </div>
  </NScrollbar>
        </div>
        <div class="p-4 flex justify-center flex-col">
          <!-- <NButton block @click="show = true">
            {{ $t('store.siderButton') }}
          </NButton> -->
          <!-- <span style="font-variant-numeric: tabular-nums">
            </span>
             -->
          <!-- <NButton size="large" round style="margin-bottom:5px">
            上下文剩余时间
            <NCountdown ref="countdown" :duration="context_time" :active="true" />
           <NCountdown ref="countdown" :duration="86400000" :active="active" />
          </NButton>

          <NButton
            round
            size="large"
            class=" max-w-screen-sm"
            type="error"
            @click="handelAd"
          >
            点击延长时间
            <wx-open-launch-weapp
              v-if="isWeixin"
              id="launch-btn"
              appid="wx96ed9d6460eb122f"
              username="gh_72a4eb2d4324"
              path="/pages/users/user_context/index.html"
              style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index:99999;
                  "
            >
              <div v-is="'script'" type="text/wxtag-template">
                <div style="width: 100%; color: orangered; text-align: center;height:100px" />
              </div>
            </wx-open-launch-weapp>
          </NButton> -->
        </div>
      </main>
      <!-- <Footer /> -->
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 bg-black/40" @click="handleUpdateCollapsed" />
  </template>


</template>
