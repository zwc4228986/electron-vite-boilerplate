<script setup lang="ts">
const { ipcRenderer } = require("electron");
import { NButton, NCard, NGrid, NGridItem, NPopconfirm,NLayout,NLayoutContent,NTabPane,NTabs } from 'naive-ui'
import { computed, onMounted, ref, watch } from 'vue'
import Add from './add.vue'
import AddPeople from '../people/add.vue'
import People from './people.vue'
import { deletePeople, editPeople, getMyNovelChapter, getMyPeople } from '@/api'
import { SvgIcon } from '@/components/common'
import { useAppStore ,useNovelStore} from '@/store'
import Novel from './novel.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
interface roleItem {
  desc: string
  title: string
  id: number
}

const novelStore = useNovelStore()

const novelList = ref<roleItem[]>([])

function getMyNovelChapterLists() {
  getMyNovelChapter({novel_id:novelStore.novel_id}).then((res) => {
    const data:any = res.data
    novelList.value = data
  })
}


watch(() => novelStore.novel_id, (newValue, oldValue) => {
  getMyNovelChapterLists()
  getMyPeopleList()
})

const addTool = ref()

function editTool(item) {
  addTool.value.edit(item)
}

function deleteToolAction(item) {
  deletePeople(item).then((res) => {
    getMyNovelChapterLists()
  })
}

function toolDetailAction(id: any) {
  // toolDetail.value.show(id)
  ipcRenderer.send("openWindow","run/"+id);
}

const appStore = useAppStore()

const collapsed = computed(() => appStore.siderCollapsed)
const { isMobile } = useBasicLayout()


const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'pl-[260px]': !isMobile.value && !collapsed.value },
  ]
})


const peopleRef = ref()

const editRole = ()=>{
  peopleRef.value.show();
}

interface roleItem {
  desc: string
  name: string
  id: number
}

const roleList = ref<roleItem[]>([])

function getMyPeopleList() {
  getMyPeople({novel_id:novelStore.novel_id}).then((res) => {
    const data:any = res.data
    roleList.value = data
  })
}

</script>

<template>
  <div>
      <!-- <people ref="peopleRef"></？people>   -->
  
     <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
      <Novel></Novel>
      <NLayoutContent class=""  style="height: 100vh;">
    <NTabs
      type="segment"
      animated
      default-value="basic"
    >
      <NTabPane tab="作品" name="basic">
        <div class="p-4  w-full h-full">
          <div class="flex justify-between items-center">
            <h1 class="text-lg">
            {{novelStore.novel_id>0?novelStore.novel_name:''}}
            </h1>
            <Add v-if="novelStore.novel_id>0" :novel_id="novelStore.novel_id" ref="addTool" @fresh="getMyNovelChapterLists" />
          </div>
          <template v-if="!novelList.length">
              <div class="flex flex-col items-center mt-8 text-center text-neutral-300" style="height: 50vh;" >
                  <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
                  <span>暂无作品</span>
              </div>
          </template>
          <div class="tool-box w-full flex mt-2">
            <NGrid cols="1 m:2" style="gap:0.5rem" responsive="screen">
              <NGridItem v-for="item in novelList" :key="item.id">
                <NCard class="hover" :title="item.title">
                  <template #header-extra>
                    <SvgIcon class="text-2xl" icon="uil:edit" @click.stop="editTool(item)" />
                    <SvgIcon class="text-2xl" icon="uil:edit" @click.stop="editRole(item)" />
                    <NPopconfirm
                      @positive-click="deleteToolAction(item)"
                    >
                      <template #trigger>
                        <SvgIcon class="text-3xl" icon="typcn:delete-outline" />
                      </template>
                      确定删除吗？
                    </NPopconfirm>
                  </template>
                  <div class="text-[#999] line-clamp-1 h-5">
                    {{ item.desc }}
                  </div>
                  <!-- <template #action>
                      #action
                    </template> -->
                  <template #action>
                    <div class="flex justify-end">
                      <NButton @click="toolDetailAction(item.id)">
                        <template #icon>
                          <SvgIcon icon="codicon:run-all" />
                        </template>
                      </NButton>
                    </div>
                  </template>
                </NCard>
              </NGridItem>
            </NGrid>
          </div>
        </div>
        </NTabPane>
        <NTabPane   tab="角色" name="role">
          <div class="px-4  h-full">
            
          <AddPeople v-if="novelStore.novel_id>0"  :novel_id="novelStore.novel_id"  ref="addPeople" @fresh="getMyPeopleList" />
            <template v-if="!roleList.length">
              <div class="flex flex-col items-center mt-8 text-center text-neutral-300 justify-center" style="height: 50vh;">
                  <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
                  <span>暂无角色</span>
              </div>
          </template>
          <div class="tool-box w-full flex mt-2">
            <NGrid cols="1 s:2 m:3" class="p-2" style="gap:0.5rem" responsive="screen">
              <NGridItem v-for="item in roleList" :key="item.id">
                <NCard class="hover" :title="item.name">
                  <template #header-extra>
                    <SvgIcon class="text-2xl" icon="uil:edit" @click.stop="editTool(item)" />
                    <NPopconfirm
                      @positive-click="deleteToolAction(item)"
                    >
                      <template #trigger>
                        <SvgIcon class="text-3xl" icon="typcn:delete-outline" />
                      </template>
                      确定删除吗？
                    </NPopconfirm>
                  </template>
                  <div class="text-[#999] line-clamp-1 h-5">
                    {{ item.desc }}
                  </div>
                  <!-- <template #action>
                      #action
                    </template> -->
                  <template #action>
                    <div class="flex justify-end">
                      <NButton @click="toolDetailAction(item.id)">
                        <template #icon>
                          <SvgIcon icon="codicon:run-all" />
                        </template>
                      </NButton>
                    </div>
                  </template>
                </NCard>
              </NGridItem>
            </NGrid>
          </div>
        </div>
        </NTabPane>
        </NTabs>
      </NLayoutContent>
      </NLayout>
      
  </div>
</template>

<style scoped lang="less">
.tool-box{
  .tool-item{
    // box-shadow: 0 10px 30px #0004;
    // box-shadow: rgb(235, 238, 253) 0px 3px 10px;
  }
}
.user-header :deep(.n-card-header__main){
  color: #000000;
  font-size: 1rem;
}
.footer-container {
  margin-top: 30px;
}
.footer-container .footer-item {
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(102, 102, 102, 1);
  display: flex;
  justify-content: space-between;
}
.footer-container .footer-item .footer-item-title {
  display: flex;
}

.user-card {
  border-image-source: url("@/pic/vipbg.png");
  border-image-slice: 82 82 82 82 fill;
  border-image-width: 20px 20px 20px 20px;
  border-image-outset: 0px 0px 0px 0px;
  border-image-repeat: stretch stretch;
  border-style: solid;
  border-radius: 32px;
  height: 250px;
  max-width: 500px;
  width: 100%;
}

.model-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 8px;
  grid-column-gap: 8px;
}

.image-container {
  grid-row-gap: 8px;
  grid-column-gap: 8px;
}

.image-wrap {
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;

  justify-content: center;
}

.model-list-item .image {
  width: 80px !important;
  height: 80px;
  border-radius: 4px;
}

.model-list-item .img-wrap {
  padding: 2px;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.list-item-active .img-wrap {
  border-color: #ad00fe;
}

.model-list-item .name {
  position: absolute;
  bottom: 2px;
  left: 2px;
  right: 2px;
  height: 22px;
  line-height: 22px;
  background-color: rgba(0, 0, 0, 0.4);
  text-align: center;
  font-size: 12px;
  color: #fff;
  border-radius: 0 0 4px 4px;
}

#role_warp :deep(.n-card-header__main){
  overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
}
</style>
