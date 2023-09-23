<template>
  <div>
    <!-- {{ roleList }} -->
    <NDynamicInput v-model:value="data" :max="4" :on-create="onCreate">
      <template #default="{ value }">

      <div class="flex">
        <div class="flex flex-col w-40">
            <NSelect v-model:value="value.voice"  :options="roleList" label-field="name" value-field="voice"  placeholder="角色"/>
            <NSelect  :options="volice_express"  placeholder="表情" label-field="name" value-field="code"/>
        </div>
          <NInput v-model:value="value.word" type="text" />
      </div>
        <!-- <div style="display: flex; align-items: center; width: 100%">

        </div> -->
      </template>
      <template #action="{ index, create, remove, value }">
        <NButtonGroup
          size="small"
          class="ml-4 flex justify-center items-center"
        >
          <NButton round @click="create(index)">
            <SvgIcon icon="ion:add" class="text-1xl" />
          </NButton>
          <NButton round @click="createAudio(value,index)">
            <SvgIcon icon="ant-design:audio-outlined" class="text-1xl" />
          </NButton>
        
          <NButton :disabled="!value.audio_path" round @click="remove(index)">
            <SvgIcon icon="cil:audio-spectrum" class="text-1xl" />
          </NButton>
          <NButton round @click="remove(index)">
            <SvgIcon icon="material-symbols:remove" class="text-1xl" />
          </NButton>
        </NButtonGroup>
      </template>
    </NDynamicInput>
  </div>
</template>

<script setup lang="ts">
import { SvgIcon } from "@/components/common";
import {
  NButton,
  NButtonGroup,
  NInput,
  NSelect,
  NInputGroup,
  NDynamicInput,
} from "naive-ui";
import { computed, ref } from "vue";


interface word {
  word: string;
  voice: string;
  audio_path: string;
  audio_duration: number;
}
const emit = defineEmits(["update:value","parentCreateAudio"]);

const props = defineProps(["value","roleList"]);

console.log(props);
// const data =  ref(() => {
//     return props.word.map(res=>{
//         return res.word
//     })
// })




const selectOptions = ref([
]);

const data:any = computed({
  get() {
    return props.value;
  },
  set(data: word[]) {
    // return props.modelValue.map(res=>{
    //     return res.word
    // })
    console.log('update')
    emit("update:value", data);
  },
});

const volice_express = computed(() => {
  return props.roleList.find(item =>data.voice == item.code)?.volice_express??[]
})



function onCreate() {
  return {
    word: "",
    voice: "",
    audio_path: "",
    audio_duration:0,
  };
}

async function createAudio(value,index){
   emit("parentCreateAudio", value.word,function(audio){
      console.log(audio,value.word,data)
      value.audio_path = audio.audio_path
      value.audio_duration = audio.audio_duration
  });
}

</script>

<style scoped></style>
