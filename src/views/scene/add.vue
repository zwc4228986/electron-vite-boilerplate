<script setup lang="ts">
import { computed, ref } from 'vue'
import { NAlert, NButton, NDrawer, NDrawerContent, NForm, NFormItem, NInput } from 'naive-ui'
import { createPeople, editPeople } from '@/api'
import { SvgIcon } from '@/components/common'

interface Emit {
  (e: 'fresh'): void
}

const emit = defineEmits<Emit>()

const showInner = ref(false)

interface Form {
  prompt: string
  id: number
  name: string
}


const form = ref<Form>({
  id: 0,
  prompt: '',
  name: '',
})

function load() {
  emit('fresh')
  showInner.value = false
}

function saveRole() {
  if (form.value.id > 0) {
    editPeople(form.value).then(() => {
      load()
    // 清除form的值
    })
  }
  else {
    createPeople(form.value).then(() => {
      load()
    // 清除form的值
    })
  }
}

function edit(item) {
  form.value.id = item.id
  form.value.name = item.name
  form.value.prompt = item.prompt
  showInner.value = true
}

function showAdd() {
  form.value.id = 0
  form.value.name = ''
  form.value.prompt = ''
  showInner.value = true
}

defineExpose({
  edit,
})

const title = computed(() => {
  return form.value.id === 0 ? '正在新建人物' : '正在编辑人物'
})
</script>

<template>
  <NButton type="primary" secondary round @click="showAdd">
    <template #icon>
      <SvgIcon icon="gg:add" />
    </template>
    创建人物
  </NButton>
  <div class="absolute left-1/2 transform -translate-x-1/2  flex justify-center items-center z-40 mt-2">
    <NDrawer v-model:show="showInner" width="100%" placement="right">
      <NDrawerContent :title="title" closable>
        <div class="p-2">
          <NForm
            :label-width="200"
            :model="form"
            size="large"
          >
            <NFormItem label="名称">
              <NInput
                v-model:value="form.name"
                placeholder="名称"
              />
            </NFormItem>
            <!-- <NFormItem label="描述(展示作用)">
              <NInput
                v-model:value="form.desc"
                :rows="1"
                type="textarea"
                placeholder="描述"
              />
            </NFormItem> -->
            <NFormItem label="指令">
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
            </NFormItem>
          </NForm>
        </div>
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
