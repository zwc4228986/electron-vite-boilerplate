<template>
        <NModal v-model:show="showModal">
            <div class="">
                <NImage
                    width="400"
                    :src="'atom://'+data.path"
                /> 
                <NImage
                    v-if="data.zoom_path"
                    width="400"
                    :src="'atom://'+data.zoom_path"
                /> 
            </div>
        </NModal>
  </template>
  
  <script setup lang="ts">
  import { SvgIcon } from "@/components/common";
  import {
    NModal,
    NImage
  } from "naive-ui";
  import { ref } from "vue";
  
  interface word {
    word: string;
    audio_path: string;
    audio_duration: number;
  }



  const showModal =  ref(false)

  const data = ref({
     path:'',
     zoom_path:'',
  })

  function show(r){
        showModal.value = true
        console.log(r)
        data.value = r
  }

  defineExpose({
    show
  })
  </script>
  
  <style scoped></style>
  