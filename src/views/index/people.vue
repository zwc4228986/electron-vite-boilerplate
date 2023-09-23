<script setup lang="ts">
import { NButton, NCard, NGrid, NGridItem, NPopconfirm, NDrawerContent,NDrawer } from 'naive-ui'
import { onMounted, ref } from 'vue'
import Add from './add.vue'
import { deletePeople, getMyPeople, getToolTypeLists } from '@/api'
import { SvgIcon } from '@/components/common'

interface roleItem {
  desc: string
  name: string
  id: number
}

const roleList = ref<roleItem[]>([])

const toolTypeData = ref<any[]>([])

getToolTypeLists().then((res) => {
  toolTypeData.value = res.data
})

function getMyPeopleList() {
  getMyPeople().then((res) => {
    const data = res.data.data
    roleList.value = data
  })
}

onMounted(() => {
    getMyPeopleList()
})

const addTool = ref()

const toolDetail = ref()

function editTool(item) {
  addTool.value.edit(item)
}
function deleteToolAction(item) {
  deletePeople(item).then((res) => {
    getMyPeopleList()
  })
}

function toolDetailAction(id: any) {
  toolDetail.value.show(id)
}
const showInner = ref(false)

function show(item) {
  // form.value.id = item.id
  // form.value.title = item.title
  showInner.value = true
}

defineExpose({
  show,
})

</script>

<template>
  <div>
    <Detail ref="toolDetail" />
    <NDrawer v-model:show="showInner" width="100%" placement="right">
      <NDrawerContent :title="title" closable>
        <div class="px-4">
          <Add ref="addTool" @fresh="getMyPeopleList" />
          <div class="tool-box w-full flex mt-2">
            <NGrid cols="3 s:4 m:5" class="p-2" style="gap:0.5rem" responsive="screen">
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
        </NDrawerContent>
        </NDrawer>
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


