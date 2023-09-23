<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NTabs,NTabPane, NButton, NDrawer, NDrawerContent, NForm, NFormItem, NInput ,NSlider} from 'naive-ui'
import { createNovelChapter, editNovelChapter } from '@/api'
import { SvgIcon } from '@/components/common'

interface Emit {
  (e: 'fresh'): void
}

interface Props {
  novel_id: number
}

const props = defineProps<Props>()


const emit = defineEmits<Emit>()

const showInner = ref(false)

interface Form {
  id: number
  title: string
  novel_id: number
  voice_speed: number
}

const form = ref<Form>({
  id: 0,
  title: '',
  novel_id:0,
  voice_speed:1,
})

function load() {
  emit('fresh')
  showInner.value = false
}

function saveRole() {
  form.value.novel_id = props.novel_id
  if (form.value.id > 0) {
    editNovelChapter(form.value).then(() => {
      load()
    // 清除form的值
    })
  }
  else {
    createNovelChapter(form.value).then(() => {
      load()
    // 清除form的值
    })
  }
}

function edit(item) {
  form.value.id = item.id
  form.value.title = item.title
  showInner.value = true
}

function showAdd() {
  form.value.id = 0
  form.value.title = ''
  showInner.value = true
}

defineExpose({
  edit,
})

const title = computed(() => {
  return form.value.id === 0 ? '正在新建作品' : '正在编辑作品'
})
</script>

<template>
  <NButton type="primary" secondary round @click="showAdd">
    <template #icon>
      <SvgIcon icon="gg:add" />
    </template>
    创建作品
  </NButton>
  <div class="absolute left-1/2 transform -translate-x-1/2  flex justify-center items-center z-40 ">
    <NDrawer v-model:show="showInner" width="100%" placement="right">
      <NDrawerContent :title="title" closable>
        <NTabs
      type="segment"
      animated
      default-value="basic"
    >
      <NTabPane tab="基础" name="basic">
        <div class="p-2">
          <NForm
            :label-width="200"
            :model="form"
            size="large"
          >
            <NFormItem label="作品名称">
              <NInput
                v-model:value="form.title"
                placeholder="名称"
              />
            </NFormItem>

            <NFormItem label="配音语速">
                <NSlider v-model:value="form.voice_speed"  :min="0.5" :max="2" show-tooltip :step="0.1"/>
            </NFormItem>
            
            <!-- <NFormItem label="描述(展示作用)">
              <NInput
                v-model:value="form.desc"
                :rows="1"
                type="textarea"
                placeholder="描述"
              />
            </NFormItem> -->
            <!-- <NFormItem label="指令">
              <div class="flex flex-col w-full">
                <NAlert :show-icon="false">
                  输入[ ]可插入输入框，输入[{选项1,选项2}]可插入下拉选项)
                </NAlert>
                <NInput
                  v-model:value="form.prompt"
                  class="w-full"
                  round
                  :rows="5"
                  type="textarea"
                  placeholder="示例：请将以下内容：[请输入需要翻译的内容]，翻译成[请选择语言{英语,日语,法语}]"
                />
              </div>
            </NFormItem> -->
          </NForm>
        </div>
      </NTabPane>
    </NTabs>
        <template #footer>
          <div class="flex justify-center items-center w-full">
            <NButton size="large" type="primary" round @click="saveRole()">
              保存
            </NButton>
          </div>
        </template>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<style scoped>

</style>
