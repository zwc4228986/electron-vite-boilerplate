<template>
  <div class="w-full bg-white flex justify-between p-4"> 
      <div>
        <NButton @click="addItem()">生成剪映缓存</NButton>
      </div>
      <div>
        <NButton @click="addItem()">保存</NButton>
      </div>
  </div>
  <div>
    <NTable  :single-line="false">
      <thead>
        <tr>
          <th>序号</th>
          <th>旁白台词</th>
          <th>生图描述词</th>
          <th>功能</th>
          <th>使用图片</th>
          <th>小图预览</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr  v-for="(item,index) in aiDrawData" :key="index">
          <td>{{ index+1 }}</td>
          <td>
            <NInput type="textarea" placeholder="旁白台词" v-model:value="item.word" />
          </td>
          <td>
            <NInput type="textarea" placeholder="生图描述词"  v-model:value="item.txt"/>
          </td>
          <td><NButton @click="createImage(item)">一键AI生图</NButton></td>
          <td>
            <NImage
              width="100"
              :src="'atom://'+item.img"
            />
          </td>
          <td>
            <NImageGroup>
              <div v-for="v in item.imgs" class="image-box">
                <div class="image-action">
                  <NButton size="tiny" type="primary">
                    <SvgIcon icon="tabler:select" class="text-lg" @click.stop="selectImage(item)" />
                  </NButton>   
                  <NButton  size="tiny" type="error">
                    <SvgIcon icon="typcn:delete-outline" class="text-lg" @click.stop="deleteImage(item)" />
                  </NButton>
                </div>
                <NImage
                  width="80"
                  height="80"
                  :src="'atom://'+v"></NImage>
              </div>
            </NImageGroup>
          </td>
          <td><NButton>删除</NButton></td>
        </tr>
      </tbody>
    </NTable>
    <NButton @click="addItem()">添加场景</NButton>
  </div>
</template>

<script setup lang="ts">
import { txt2img } from "@/api/sd";
import { SvgIcon } from '@/components/common'
import { NTable, NButton, NInput, NImage,NImageGroup,NForm,NSelect,NFormItem} from "naive-ui";
import { ref } from "vue";
// import { app} from 'electron'
const fs = require("fs");
const http = require("https");
const { ipcRenderer } = require('electron');
let BASE_DIR=null ;  

ipcRenderer.invoke('getAppPath').then((resul) => {
  BASE_DIR=resul;
  const targetFolder = 'image1.png';
  const imagePath = "https://image1.douresources.com/sd/169078003471866.png";
  saveImageFromUrl(imagePath, targetFolder);
})


const conditionOptions =ref({})

const params = ref({})

interface DataItem {
  txt: string;
  id: string;
  word: string;
  img: string;
  imgs: string[];
}

function selectImage(item){
  console.log(item);
}

const uniqueId = ():string => {
  return new Date().getTime().toString(36) + '-' + Math.random().toString(36);
}



function addItem(txt: string = '', word: string = '', img: string = '', imgs: string[] = [],id=uniqueId()): void {
  const newItem: DataItem = {id,txt, word, img, imgs }
  aiDrawData.value.push(newItem)
}

const aiDrawData = ref<DataItem[]>([]);

addItem();
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

const createImage = (item)=>{
  console.log(item);
  txt2img(item.txt).then(res=>{
        console.log(res)
        ipcRenderer.invoke('saveBase64Image',res[0]).then((res)=>{
            console.log(res)
            const index = aiDrawData.value.findIndex(obj => obj.id === item.id);
            aiDrawData.value[index].img = res;
            aiDrawData.value[index].imgs.push(res);
        });
  })
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
