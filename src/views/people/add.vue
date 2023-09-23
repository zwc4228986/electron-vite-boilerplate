<script setup lang="ts">
import { computed, ref } from 'vue'
import { NAlert, NButton, NDrawer, NDrawerContent, NForm, NFormItem, NInput ,NSlider,NSelect} from 'naive-ui'
import { createPeople, editPeople,getVoiceLists } from '@/api'
import { SvgIcon } from '@/components/common'

interface Props {
  novel_id: number
}

const props = defineProps<Props>()

const voiceLists = ref([]);

function getVoice(){
  getVoiceLists({}).then((res)=>{
    let data:any = res.data;
    voiceLists.value = data;
  })
}

getVoice();

interface Emit {
  (e: 'fresh'): void
}

const emit = defineEmits<Emit>()

const showInner = ref(false)

interface Form {
  prompt: string
  id: number
  novel_id: number
  name: string
  voice: string
  voice_speed: number
}

const form = ref<Form>({
  id: 0,
  prompt: '',
  name: '',
  novel_id: 0,
  voice: '',
  voice_speed: 1,
})

function load() {
  emit('fresh')
  showInner.value = false
}

function saveRole() {
  form.value.novel_id = props.novel_id
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
            <NFormItem label="指令">
              <div class="flex flex-col w-full">
                <NInput
                  v-model:value="form.prompt"
                  class="w-full"
                  round
                  :rows="5"
                  type="textarea"
                  placeholder="指令"
                />
              </div>
            </NFormItem>
            <NFormItem label="配音">
              <NSelect  v-model:value="form.voice" value-field="code" label-field="name" :options="voiceLists"  placeholder="配音"/>
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
