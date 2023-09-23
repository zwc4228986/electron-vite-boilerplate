<template>
    <NDrawer v-model:show="showInner" width="100%" placement="right">
      <NDrawerContent title="配置" closable>
        <NForm
            :label-width="200"
            size="large"
          >
         <NFormItem label="配音语速">
                <NSlider  :min="0.5" v-model:value="chapterData.audio_speed" :max="2" show-tooltip :step="0.1"/>
            </NFormItem>
       </NForm>
       <template #footer>
          <div class="flex justify-center items-center w-full">
            <NButton size="large" type="primary" round @click="save()">
              保存
            </NButton>
          </div>
        </template>
      </NDrawerContent>
    </NDrawer>
  </template>
  
  <script setup lang="ts">

  import { editNovelChapter } from "@/api";
import {
    NDrawerContent,
    NDrawer,
    NSlider,
    NFormItem,
    NButton,
    NForm
  } from "naive-ui";
  import { ref } from "vue";

  
  const showInner =  ref(false)

// function getChapterDetail(){
//   NovelChapterDetail({novel_chapter_id}).then(res=>{
//      let data:any = res.data;
//      novel_id = data.novel_id;
//      getMyPeopleList()
//      console.log(data)
//       aiDrawData.value = data;
//       if(data.length == 0){
//         addItem()
//       }
//   })
// }



const chapterData = ref({})

function show(data){
  console.log(data)
   showInner.value = true;
   chapterData.value = data;
}

function save(){
  editNovelChapter(chapterData.value).then(()=>{
    showInner.value = false;
  });
}

  defineExpose({
    show
  })
  </script>
  
  <style scoped></style>
  