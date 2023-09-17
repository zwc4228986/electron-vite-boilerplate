<template>
  <div class="w-full">
    <imageDialog ref="imageDialogRef"></imageDialog>
  <div class=" bg-white flex justify-between p-4"> 
      <div>
        <NButton @click="createJyCache()" :loading="createJyCacheLoading">生成剪映缓存</NButton>
        <NButton @click="createAllAudio()" :loading="audioing" :disabled="audioing">一键生成旁白</NButton>
        <NButton @click="createJyCache()" :loading="createJyCacheLoading">一键高清</NButton>
      </div>

      <div>
        <NButton @click="save()">保存</NButton>
      </div>
  </div>
  <div class="w-full overflow-x-auto">
    <NTable  :single-line="false">
      <thead>
        <tr>
          <th>序号</th>
          <th style="min-width: 400px;">旁白台词</th>
          <th style="min-width: 300px;">生图描述词</th>
          <th style="max-width: 100px;">功能</th>
          <th style="width: 200px;">使用图片</th>
          <th style="min-width: 300px;">小图预览</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in aiDrawData" :key="index">
          <td>
            <!-- <div class="flex flex-col text-center">
             <div>
              {{ index+1 }}
             </div> 
              <NButton size="small" type="error" >
              <SvgIcon icon="material-symbols:delete-outline" class="text-xl" />
            </NButton>
              <NButton @click="insertItem(index)">添加场景</NButton>
            </div> -->
            <div class="flex justify-center items-center">
              <NButtonGroup size="small" vertical class=" flex ">
              <NButton  round @click="deleteItem(index)">
                <SvgIcon icon="material-symbols:remove" class="text-1xl" />
              </NButton>
              <NButton :disabled="true">
                  {{ index+1 }}
              </NButton>
              <NButton round  @click="insertItem(index)">
                <SvgIcon icon="ion:add" class="text-1xl" />
              </NButton>
          </NButtonGroup>
            </div>
            
          </td>
          <td>
            <word v-model:value="item.word" @parentCreateAudio="createAudio"></word>
            <!-- <audio v-for="audio in item.audio" :src="audio[0]"></audio> -->
            <!-- <NInput :rows="6"  type="textarea" placeholder="旁白台词" v-model:value="item.word" /> -->
          </td>
          <td>
            <NSelect
              v-model:value="item.lora_ids"
              multiple
              value-field="id"
              label-field="name"
              :options="roleList"
            />
            <NInput :rows="6" type="textarea" placeholder="生图描述词"  v-model:value="item.txt"/>
          </td>
          <td>
            <NButtonGroup size="small" vertical class="flex j ">
               <NButton @click="createImage(item)">AI生图</NButton>
               <NButton @click="hdRepairImage(item)">放大高清</NButton>
              <!-- <NButton @click="playVideo(item)">语音播放</NButton> -->
             </NButtonGroup>
          </td>
          <td>
            <NImage
             preview-disabled
             v-if="item.imgs.length>0"
              @click="previewImage(item.imgs[item.select_index])"
              width="200"
              :src="'atom://'+item.imgs[item.select_index].path"
            />
          </td>
          <td>
            <div class="flex flex-wrap">
                <template v-for="(v,i) in item.imgs" >
                  <div v-if="i !== item.select_index"  class="image-box">
                    <div class="image-action">
                    <NButton size="tiny" type="primary">
                      <SvgIcon icon="tabler:select" class="text-lg" @click.stop="selectImage(item,i)" />
                    </NButton>
                    <NButton  size="tiny" type="error">
                      <SvgIcon icon="typcn:delete-outline" class="text-lg" @click.stop="deleteImage(item)" />
                    </NButton>
                  </div>
                  <NImage
                    width="80"
                    height="80"
                    :src="'atom://'+v.path">
                  </NImage>
                  </div>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </NTable>
  </div>
</div>

</template>

<script setup lang="ts">
import { saveNovelChapter,NovelChapterDetail, getMyPeople } from "@/api";
import getTTSData from "@/api/play";
import word from "./component/word.vue"
import imageDialog from "./component/image.vue"
import { txt2img ,hdImage} from "@/api/sd";
import { SvgIcon } from '@/components/common'
import { NTable, NButton, NInput, NImage,NImageGroup,NForm,NButtonGroup,NSelect,NFormItem,NDynamicInput} from "naive-ui";
import { onMounted, ref } from "vue";
import {useRoute}  from "vue-router"
import { preview } from "vite";
// import { app} from 'electron'
const fs = require("fs");
const path = require("path");
const http = require("https");
const { ipcRenderer } = require('electron');
let BASE_DIR=null ;  

interface roleItem {
  desc: string
  name: string
  id: number
}

const roleList = ref<roleItem[]>([])

function getMyPeopleList() {

  getMyPeople().then((res) => {
    const data = res.data.data
    roleList.value = data
  })

}

const aiDrawData = ref<DataItem[]>([]);
const novel_chapter_id = useRoute().params.id;

function getDetail(){
  NovelChapterDetail({novel_chapter_id}).then(res=>{
     let data:any = res.data;
     console.log(data)
      aiDrawData.value = data;
      if(data.length == 0){
        addItem()
      }
  })
}

onMounted(() => {
  getDetail()
  getMyPeopleList()
}),


ipcRenderer.invoke('getAppPath').then((resul) => {
  BASE_DIR=resul;
  const targetFolder = 'image1.png';
  const imagePath = "https://image1.douresources.com/sd/169078003471866.png";
  saveImageFromUrl(imagePath, targetFolder);
})


interface img {
  path:string,
  width:number,
  height:number,
 
  zoom:number,
  zoom_path:string,
  selected:boolean
}

interface word{
  word:string
  audio_path:string
}

interface DataItem {
  txt: string;
  lora_ids:any
  uuid: string;
  select_index:number,
  word: word[];
  imgs: img[];
  audio: string[];
}

function getSelectImage(imgList,obj = 'path') {
  const selectedImg = imgList.find(img => img.selected === true);
  if (selectedImg) {
    return obj==='path'?selectedImg.path:selectedImg;
  }
  return '';
}



function selectImage(arr,i){
    // 遍历数组中的每个元素
    arr.forEach((item, index) => {
      // 将 selected 属性设置为 true 或者 false
      item.selected = index === i;
    });
}

const uniqueId = (): string => {
  return new Date().getTime().toString() + parseInt(String(Math.random() * 10000)).toString();
};

function insertItem(index:number,txt: string = '', word: word[] = [], img: string = '', imgs: img[] = [],uuid=uniqueId(),select_index=0): void {
  const newItem: DataItem = {uuid,txt, word, imgs,lora_ids:[] ,audio:[],select_index}
  aiDrawData.value.splice(index+1,0,newItem)
}

function addItem(txt: string = '', word: word[] = [], img: string = '', imgs: img[] = [],uuid=uniqueId(),select_index=0): void {
  const newItem: DataItem = {uuid,txt, word, imgs,lora_ids:[],audio:[] ,select_index}
  aiDrawData.value.push(newItem)
}

function deleteItem(index){
  aiDrawData.value.splice(index, 1);
}


function save(){
  console.log(aiDrawData)
  saveNovelChapter({data:aiDrawData.value,novel_chapter_id:novel_chapter_id})
}

// addItem();
// const path = require('path');
// console.log(require('electron'));
console.log(window)
// console.log(app)
function saveImageFromUrl(imageUrl, targetFileName) {
//   const appPath = require('electron').remote.app.getAppPath();;
  const targetPath =  targetFileName;
  const dirPath = BASE_DIR;
  console.log(dirPath)
  const file = fs.createWriteStream(dirPath+'/'+targetPath);
  const request = http.get(imageUrl, function (response) {
    response.pipe(file);
  });
  
  request.on("error", function (err) {
    console.error("下载图片失败:", err);
  });
  file.on("finish", function () {
    file.close();
    console.log("图片保存成功！");
  });
  file.on("error", function (err) {
    fs.unlink(targetPath, function () {
      console.error("保存图片到本地失败:", err);
    });
  });
}

const taskruning = ref(false)
taskruning.value = true;


const createJyCacheLoading = ref(false);

const audioing = ref(false);

async function createAllAudio() {
  if(audioing.value === true){
      return 
  }
  audioing.value = true;
  
    for (let i = 0; i < aiDrawData.value.length; i++) {
          for(let j=0;j<aiDrawData.value[i].word.length;j++){
            if(aiDrawData.value[i].word[j].audio_path===''){
              var res = await createAudio(aiDrawData.value[i].word[j].word,'')
              console.log(res);
              aiDrawData.value[i].word[j].audio_path = res.audio_path
              aiDrawData.value[i].word[j].audio_duration = res.audio_duration
            }
          }
    }

    audioing.value = false;

}

async function createJyCache_bak(){


  createJyCacheLoading.value = true;

  var audio = aiDrawData.value.find(function(obj) {
    let word = obj.word.split('\n');
    console.log(word,obj.audio,(Array.isArray(obj.audio) && word.length>obj.audio.length))
    return (Array.isArray(obj.audio) && word.length>obj.audio.length);
  });
  console.log(audio);
  if(audio){
    let a = await playVideo(audio)
    console.log(a);
    if(createJyCacheLoading.value == true){
    // console.log('9');
      setTimeout(() => {
        console.log('10');
        createJyCache();
      }, 3000);
    }
    return true;
  }
    ipcRenderer.invoke('saveJianying',JSON.stringify(aiDrawData.value)).then((resul) => {
      
    })

  }

function  createJyCache(){
    ipcRenderer.invoke('saveJianying',JSON.stringify(aiDrawData.value)).then((resul) => {
      
    })
}

const createImage = (item)=>{

  let prompt = extractTxtValues(item.lora_ids,roleList.value)+item.txt

  txt2img(prompt).then(res=>{
        console.log(res)
        ipcRenderer.invoke('saveBase64Image',res[0]).then((res)=>{
            console.log(res)
            // const index = aiDrawData.value.findIndex(obj => obj.uuid === item.uuid);
            // aiDrawData.value[index].img = res;
            // aiDrawData.value[index].imgs.push(res);
            item.imgs.push({
              path:res,
              width:512,
              height:512,  
              zoom:1,
              zoom_path:'',
              selected:true
            })
        });
  })
}

function extractTxtValues(arr1: number[], arr2: any[]): string {

  const result: string[] = [];
  for (let i = 0; i < arr2.length; i++) {
    const currentId = arr2[i].id;
    console.log(currentId)
    if (arr1.includes(currentId)) {
      result.push(arr2[i].prompt);
    }
  }
  console.log(result)
  let a = '(best quality, 4k, 8k, highres, masterpiece:1.2), (ultra-detailed),';


  return result.join(",");
}

function hdRepairImage(item){

  const selectedImg = item.imgs.find(img => img.selected === true);
  console.log(selectedImg)
  let prompt = extractTxtValues(item.lora_ids,roleList.value)+item.txt
  item.prompt = prompt;
  const imageBuffer = fs.readFileSync(path.join(BASE_DIR,selectedImg.path));

  // 将图片内容转换为 Base64 格式
  const base64Image = imageBuffer.toString('base64');

  hdImage(prompt,base64Image).then(res=>{
        console.log(res)
        ipcRenderer.invoke('saveBase64Image',res[0]).then((res)=>{
            console.log(res)
            selectedImg.zoom = 2;
            selectedImg.zoom_path = res;
            // const index = aiDrawData.value.findIndex(obj => obj.uuid === item.uuid);
            // aiDrawData.value[index].img = res;
            // aiDrawData.value[index].imgs.push(res);
        });
  })
}

async function playVideo(item) {
  console.log(item.word);
  let word = item.word.split('\n');
  // item.audio = [];
  for (let index = 0; index < word.length; index++) {
    if (!item.audio[index]) {
      const res = await getTTSData(
        { activeIndex: 1, inputValue: word[index] },
        'zh-CN-XiaoxiaoNeural',
        'Default'
      );
      await sleep(3000); // 暂停一段时间后再重试
      if (res) {
        item.audio[index] = res;
      }
    }
  }
  return item;
}

async function createAudio(word,callback) {
      const res = await getTTSData(
        { activeIndex: 1, inputValue: word},
        'zh-CN-XiaoxiaoNeural',
        'Default'
      );
      console.log(res);
      if(callback){
        callback(res)
      }
      return res;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const imageDialogRef = ref()
function previewImage(image){
  imageDialogRef.value.show(image)
}
</script>
<style scoped>
.image-box {
  position: relative;
  height: 80px;
  width: 80px;
}
.image-box .image-action{
  position: absolute;
    right: 0;
    top: 0;
    cursor: default;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    /* background-color: rgba(0, 0, 0, .5); */
    transition: opacity .3s;
}
.image-box:hover .image-action{
  opacity: 1;
}

</style>
