// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public')

import { join } from 'path'

const url = require('url')
// const path = require('path')
import { app, BrowserWindow,ipcMain,protocol,net} from 'electron'
console.log(app.getAppPath())

let win: BrowserWindow | null
// Here, you can also use other preload
const preload = join(__dirname, './preload.js')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x

let _url = process.env['VITE_DEV_SERVER_URL']?process.env['VITE_DEV_SERVER_URL']:join(process.env.DIST, 'index.html')

function createWindow() {
  win = new BrowserWindow({
    icon: join(process.env.PUBLIC, 'logo.svg'),
    webPreferences: {
      webSecurity: false,
      contextIsolation: false,
      nodeIntegration: true,
      preload,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  win.loadURL(_url)
  win.webContents.openDevTools()
}

app.on('window-all-closed', () => {
  win = null
})

const dirPath =  (app.getPath("documents")+'/ai/images');

app.whenReady().then(createWindow).then(()=>{
  // ipcMain.on('getAppPath', (event, arg) => {
  //   // 执行一些操作，如从文件中读取数据
  //   // const data = readDataFromFile();
  //   event.reply('data',app.getAppPath());
  //   // 返回数据给渲染进程
  //   // event.reply('data', data);
  // });
  ipcMain.on('openWindow', function (event,arg) {
    console.log(arg)
    //调用 BrowserWindow打开新窗口
    const win2 = new BrowserWindow({
        // width:400,
        // height:300,
        
        webPreferences: {
        devTools: true,
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
    },
    })
    win2.loadURL(_url+'#'+arg)
    win2.webContents.openDevTools()
  })


  protocol.handle('atom', (request) =>{
    const filePath = request.url.slice('atom://'.length)
    let path = join((app.getPath("documents")+'/ai/images'), filePath);
    console.log(path)
    return net.fetch(url.pathToFileURL(path).toString())
  })

  ipcMain.handle('saveBase64Image',(event,arg)=>{
    var timestamp = new Date().getTime().toString();
    let dirname = timestamp+'.png';

    console.log(arg)
    let filePath =join(dirPath,dirname);
    const base64Regex = /^data:image\/(png|jpeg|jpg);base64,/;
    const base64DataWithoutPrefix = arg.replace(base64Regex, '');

  // 将base64数据转换为buffer
    const buffer = Buffer.from(base64DataWithoutPrefix, 'base64');

    fs.writeFileSync(filePath, buffer);
    return dirname;
  })

  const fs = require("fs");
  ipcMain.handle('getAppPath', () => {
    console.log('getAppPath')

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath,{ recursive: true });
    }
      return  dirPath
  });

})
