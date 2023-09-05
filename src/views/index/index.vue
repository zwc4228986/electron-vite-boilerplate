<template>
  <div>
    <NTable :bordered="false" :single-line="false">
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
        <tr>
          <td>1</td>
          <td>
            <NInput type="textarea" placeholder="旁白台词" />
          </td>
          <td>
            <NInput type="textarea" placeholder="生图描述词" />
          </td>
          <td><NButton>一键AI生图</NButton></td>
          <td>
            <NImage
              width="100"
              src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />
          </td>
          <td>
            <NImageGroup>
              <NSpace>
                <NImage
                  width="100"
                  src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                />
                <NImage
                  width="100"
                  src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                />
              </NSpace>
            </NImageGroup>
          </td>
          <td><NButton>删除</NButton></td>
        </tr>
      </tbody>
    </NTable>
    <NButton>添加场景</NButton>
  </div>
</template>

<script setup lang="ts">
import { NTable, NButton, NInput, NImage } from "naive-ui";
const fs = require("fs");
const http = require("https");
const path = require('path');
// console.log(require('electron'));

function saveImageFromUrl(imageUrl, targetFileName) {
//   const appPath = require('electron').remote.app.getAppPath();;
  const targetPath =  targetFileName;

  const file = fs.createWriteStream(targetPath);
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

const targetFolder = 'image.png';
const imagePath = "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg";

saveImageFromUrl(imagePath, targetFolder);

</script>
<style scoped></style>
