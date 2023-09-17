// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = join(__dirname, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST, "../public");

import { join } from "path";
const ffmpeg = require("fluent-ffmpeg");
const ffprobePath = require("ffprobe-static").path;
ffmpeg.setFfprobePath(ffprobePath);

const url = require("url");
// const path = require('path')
import { app, BrowserWindow, ipcMain, protocol, net } from "electron";
import api from "./utils/api";
console.log(app.getAppPath());

let win: BrowserWindow | null;
// Here, you can also use other preload
const preload = join(__dirname, "./preload.js");
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x

let _url = process.env["VITE_DEV_SERVER_URL"]
  ? process.env["VITE_DEV_SERVER_URL"]
  : join(process.env.DIST, "index.html");

function createWindow() {
  win = new BrowserWindow({
    icon: join(process.env.PUBLIC, "logo.svg"),
    webPreferences: {
      webSecurity: false,
      contextIsolation: false,
      nodeIntegration: true,
      preload,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  win.loadURL(_url);
  win.webContents.openDevTools();
}

app.on("window-all-closed", () => {
  win = null;
});

const dirPath = app.getPath("documents") + "/ai/images";
const jyPath = app.getPath("documents") + "/ai/JianyingPro Drafts";

function getMP3Duration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;
        resolve(duration);
      }
    });
  });
}

app
  .whenReady()
  .then(createWindow)
  .then(() => {
    // ipcMain.on('getAppPath', (event, arg) => {
    //   // 执行一些操作，如从文件中读取数据
    //   // const data = readDataFromFile();
    //   event.reply('data',app.getAppPath());
    //   // 返回数据给渲染进程
    //   // event.reply('data', data);
    // });
    ipcMain.on("openWindow", function (event, arg) {
      console.log(arg);
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
      });
      win2.loadURL(_url + "#" + arg);
      win2.webContents.openDevTools();
    });

    ipcMain.handle("speech", async (event, ssml) => {
      console.log(ssml);
      const res = await api.speechApi(ssml);
      console.log(res);

      var timestamp = new Date().getTime().toString();

      let filePath = timestamp + ".mp3";
      fs.writeFileSync(join(dirPath, filePath), res);
      let audio_duration = await getMP3Duration(join(dirPath, filePath));
      console.log(audio_duration, "videoDuration");

      return {
        code:0,
        audio_path:filePath,
        audio_duration:audio_duration
        };
    });

    protocol.handle("atom", (request) => {
      const filePath = request.url.slice("atom://".length);
      let path = join(dirPath, filePath);
      console.log(path);
      return net.fetch(url.pathToFileURL(path).toString());
    });

    ipcMain.handle("saveBase64Image", (event, arg) => {
      var timestamp = new Date().getTime().toString();
      let dirname = timestamp + ".png";

      console.log(arg);
      let filePath = join(dirPath, dirname);
      const base64Regex = /^data:image\/(png|jpeg|jpg);base64,/;
      const base64DataWithoutPrefix = arg.replace(base64Regex, "");

      // 将base64数据转换为buffer
      const buffer = Buffer.from(base64DataWithoutPrefix, "base64");

      fs.writeFileSync(filePath, buffer);
      return dirname;
    });

    function generateUUID() {
      var d = new Date().getTime();
      if (
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
      ) {
        d += performance.now();
      }
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    }

    ipcMain.handle("saveJianying", (event, arg) => {
      let aiData = JSON.parse(arg);
      let total_lens = 0;
      console.log(aiData);

      //复制文件到剪映
      let jyOnePath = join(jyPath, new Date().getTime().toString());

      if (!fs.existsSync(jyOnePath)) {
        fs.mkdirSync(jyOnePath, { recursive: true });
      }

      let jyOneFile = join(jyOnePath, "draft_meta_info.json");
      fs.writeFileSync(jyOneFile, "{}");

      let jyContentFile = join(jyOnePath, "draft_content.json");

      let jsonData: any = {
        canvas_config: {
          height: 1920,
          ratio: "9:16",
          width: 1080,
        },
        color_space: 0,
        config: {
          adjust_max_index: 1,
          attachment_info: [],
          combination_max_index: 1,
          export_range: null,
          extract_audio_last_index: 1,
          lyrics_recognition_id: "",
          lyrics_sync: true,
          lyrics_taskinfo: [],
          maintrack_adsorb: true,
          material_save_mode: 0,
          original_sound_last_index: 1,
          record_audio_last_index: 1,
          sticker_max_index: 1,
          subtitle_recognition_id: "",
          subtitle_sync: true,
          subtitle_taskinfo: [],
          system_font_list: [],
          video_mute: false,
          zoom_info_params: null,
        },
        cover: null,
        create_time: 0,
        duration: 10000000,
        extra_info: null,
        fps: 30.0,
        free_render_index_mode_on: false,
        group_container: null,
        id: "FF334D99-55F1-4AFF-A920-65D98EC9F8AF",
        keyframe_graph_list: [],
        keyframes: {
          adjusts: [],
          audios: [],
          effects: [],
          filters: [],
          handwrites: [],
          stickers: [],
          texts: [],
          videos: [],
        },
        last_modified_platform: {
          app_id: 3704,
          app_source: "lv",
          app_version: "4.5.2",
          device_id: "02376bcb864a99d14ab3b5cddb51a1b5",
          hard_disk_id: "368cf4c2c2f13f8881beef097aed6d61",
          mac_address: "7b732b050a60a9c73d615b7ddcfdf33b",
          os: "mac",
          os_version: "12.6",
        },
        materials: {
          audio_balances: [],
          audio_effects: [],
          audio_fades: [],
          audios: [],
          beats: [],
          canvases: [],
          chromas: [],
          color_curves: [],
          digital_humans: [],
          drafts: [],
          effects: [],
          flowers: [],
          green_screens: [],
          handwrites: [],
          hsl: [],
          images: [],
          log_color_wheels: [],
          manual_deformations: [],
          masks: [],
          material_animations: [],
          material_colors: [],
          placeholders: [],
          plugin_effects: [],
          primary_color_wheels: [],
          realtime_denoises: [],
          shapes: [],
          smart_crops: [],
          sound_channel_mappings: [],
          speeds: [],
          stickers: [],
          tail_leaders: [],
          text_templates: [],
          texts: [],
          transitions: [],
          video_effects: [],
          video_trackings: [],
          videos: [],
        },
        mutable_config: null,
        name: "",
        new_version: "81.0.0",
        platform: {
          app_id: 3704,
          app_source: "lv",
          app_version: "4.5.2",
          device_id: "02376bcb864a99d14ab3b5cddb51a1b5",
          hard_disk_id: "368cf4c2c2f13f8881beef097aed6d61",
          mac_address: "7b732b050a60a9c73d615b7ddcfdf33b",
          os: "mac",
          os_version: "12.6",
        },
        relationships: [],
        render_index_track_mode_on: false,
        retouch_cover: null,
        source: "default",
        static_cover_image_path: "",
        tracks: [
          {
            attribute: 0,
            flag: 0,
            id: "3FFC9D85-20C7-4BD6-A1B2-6B976B20DC26",
            is_default_name: true,
            name: "",
            segments: [],
            type: "video",
          },
          {
            attribute: 0,
            flag: 0,
            id: "7A92725E-045C-48F2-B6F8-383485E89E41",
            is_default_name: true,
            name: "",
            segments: [],
            type: "text",
          },
          {
            attribute: 0,
            flag: 0,
            id: "D17DB033-906B-4EF6-8E96-30DD54C8E172",
            is_default_name: true,
            name: "",
            segments: [],
            type: "audio",
          },
        ],
        update_time: 0,
        version: 360000,
      };

    let tx = [
        {
            "id": "505dbee1-13fa-8161-c4fd-412afd55a5be",
            "keyframe_list": [
                {
                    "curveType": "Line",
                    "graphID": "",
                    "id": "a5e45873-47d4-c076-0cfd-a3c81d5dc87d",
                    "left_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "right_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "time_offset": 0,
                    "values": [
                        0.0
                    ]
                },
                {
                    "curveType": "Line",
                    "graphID": "",
                    "id": "0CBE3800-3367-415e-9549-3F3E17491EB5",
                    "left_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "right_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "time_offset": 1566666,
                    "values": [
                        0.0
                    ]
                },
                {
                    "curveType": "Line",
                    "graphID": "",
                    "id": "5a68cee9-3385-386a-011f-d8027e2a5a4a",
                    "left_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "right_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "time_offset": 2099000,
                    "values": [
                        0.0
                    ]
                }
            ],
            "material_id": "",
            "property_type": "KFTypePositionX"
        },
        {
            "id": "454f25bc-f8c6-63b9-3ccb-498936e35fac",
            "keyframe_list": [
                {
                    "curveType": "Line",
                    "graphID": "",
                    "id": "402ef89d-12ac-ca6b-9e01-33f65e2faff7",
                    "left_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "right_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "time_offset": 0,
                    "values": [
                        0.0
                    ]
                },
                {
                    "curveType": "Line",
                    "graphID": "",
                    "id": "DAB72C33-4C13-4174-A840-38D53C71256C",
                    "left_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "right_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "time_offset": 1566666,
                    "values": [
                        0.3
                    ]
                },
                {
                    "curveType": "Line",
                    "graphID": "",
                    "id": "35c70246-a7ef-4111-ae7d-267e27583123",
                    "left_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "right_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "time_offset": 2099000,
                    "values": [
                        0.4
                    ]
                }
            ],
            "material_id": "",
            "property_type": "KFTypePositionY"
        },
        {
            "id": "AD6878B6-A8BE-4afb-96A0-321427683E91",
            "keyframe_list": [
                {
                    "curveType": "Line",
                    "graphID": "",
                    "id": "D37CE0A8-85E6-424e-8FD2-46AC71807D99",
                    "left_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "right_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "time_offset": 0,
                    "values": [
                        1.0
                    ]
                },
                {
                    "curveType": "Line",
                    "graphID": "",
                    "id": "EE18847B-D4E1-475c-B8C7-3380179B1E4D",
                    "left_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "right_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "time_offset": 2099000,
                    "values": [
                        1.3
                    ]
                }
            ],
            "material_id": "",
            "property_type": "KFTypeScaleX"
        }
    ];


      
      let jsonDataMaterialsCanvases: any = {
        album_image: "",
        blur: 0.0,
        color: "",
        id: "6069C395-771C-4015-8641-F711F70E5C6BDA",
        image: "",
        image_id: "",
        image_name: "",
        source_platform: 0,
        team_id: "",
        type: "canvas_color",
      };
      let len = 150000;
      let a_duration = 0;
      let duration = 0;
      let v_duration = 0;
      let durations = <any>[];
      aiData.forEach((element, index) => {
        console.log(element.imgs)
        element.img = element.imgs[element.select_index].path;

        let words = element.word;
        // if (!element.audio) {
        //   return true;
        // }
        v_duration = 0;
        words.forEach((audio, index) => {
          durations[index] = audio.audio_duration * 1000000;
          v_duration += durations[index];
        });

        console.log(duration, durations, v_duration);
        
        if (!element.img) {
          return true;
        }
        let sourcePath = join(dirPath, element.img);
        let jyFilePath = join(jyOnePath, "images");

        if (!fs.existsSync(jyFilePath)) {
          fs.mkdirSync(jyFilePath);
        }

        a_duration = duration;
        //audio
        words.forEach((video, index) => {
          let videoFile = join(jyFilePath, video.audio_path);
          let sourcevideoFile = join(dirPath, video.audio_path);

          fs.copyFile(sourcevideoFile, videoFile, (err) => {
            if (err) throw err;
            console.log("文件成功复制到目标目录！");
          });

          jsonData.materials.audios.push({
            app_id: 0,
            category_id: "",
            category_name: "",
            check_flag: 1,
            duration: durations[index],
            effect_id: "",
            formula_id: "",
            id: "a-" + index + "-" + element.uuid,
            intensifies_path: "",
            local_material_id: "",
            music_id: "",
            name: video[1],
            path: videoFile,
            request_id: "",
            resource_id: "7170964808357909005",
            source_platform: 0,
            team_id: "",
            text_id: "a-" + index + "-" + element.uuid,
            tone_category_id: "",
            tone_category_name: "",
            tone_effect_id: "",
            tone_effect_name: "",
            tone_speaker: "zh_male_xionger_stream_gpu",
            tone_type: "熊二",
            type: "text_to_audio",
            video_id: "",
            wave_points: [],
          });

          jsonData.tracks[2].segments.push({
            cartoon: false,
            clip: null,
            common_keyframes: [],
            enable_adjust: false,
            enable_color_curves: true,
            enable_color_wheels: true,
            enable_lut: false,
            enable_smart_color_adjust: false,
            extra_material_refs: [
              "1D2BE01A-2CB5-4078-B5B2-6D8EDA16C2D1",
              "82523724-6A42-4891-9999-C3E02C952ACD",
              "FCD995BF-1B8C-467F-B747-8D7E23B9E791",
            ],
            group_id: "",
            hdr_settings: null,
            id: "a-" + index + "-" + element.uuid,
            intensifies_audio: false,
            is_placeholder: false,
            is_tone_modify: false,
            keyframe_refs: [],
            last_nonzero_volume: 1.0,
            material_id: "a-" + index + "-" + element.uuid,
            render_index: 0,
            responsive_layout: {
              enable: false,
              horizontal_pos_layout: 0,
              size_layout: 0,
              target_follow: "",
              vertical_pos_layout: 0,
            },
            reverse: false,
            source_timerange: {
              duration: durations[index],
              start: 0,
            },
            speed: 1.0,
            target_timerange: {
              duration: durations[index],
              start: a_duration,
            },
            template_id: "",
            template_scene: "default",
            track_attribute: 0,
            track_render_index: 0,
            uniform_scale: null,
            visible: true,
            volume: 1.0,
          });
          a_duration += durations[index];
          return true;
        });

        a_duration = duration;

        let jyFile = join(jyFilePath, element.img);
        console.log(jyFile, sourcePath);
        fs.copyFile(sourcePath, jyFile, (err) => {
          if (err) throw err;
          console.log("文件成功复制到目标目录！");
        });

        jsonData.materials.canvases.push(jsonDataMaterialsCanvases);

        jsonData.materials.sound_channel_mappings.push({
          audio_channel_mapping: 0,
          id: element.uuid + 12,
          is_config_open: false,
          type: "",
        });

        jsonData.materials.speeds.push({
          curve_speed: null,
          id: element.uuid + 10,
          mode: 0,
          speed: 1.0,
          type: "speed",
        });

        let lens = 0;
        let video_length = 0;
        words.forEach((w, index) => {
          lens += w.length * len;
          video_length += lens;
          jsonData.materials.texts.push({
            add_type: 0,
            alignment: 1,
            background_alpha: 1.0,
            background_color: "",
            background_height: 0.14,
            background_horizontal_offset: 0.0,
            background_round_radius: 0.0,
            background_style: 0,
            background_vertical_offset: 0.0,
            background_width: 0.14,
            bold_width: 0.0,
            border_alpha: 1.0,
            border_color: "",
            border_width: 0.08,
            caption_template_info: {
              category_id: "",
              category_name: "",
              effect_id: "",
              resource_id: "",
              resource_name: "",
            },
            check_flag: 7,
            combo_info: {
              text_templates: [],
            },
            content:
              '<useLetterColor><size=12><color=(0.96863,0.74118,0.0039216,1)><font id="7260808713844298295" path="/Users/anviz/Library/Containers/com.lemon.lvpro/Data/Movies/JianyingPro/User Data/Cache/effect/19366221/dd565912c20ce61f6f71a33bcb30faf8/优设标题圆.otf">[' +
              w.word +
              "]</font></color></size></useLetterColor>",
            fixed_height: -1.0,
            fixed_width: -1.0,
            font_category_id: "",
            font_category_name: "",
            font_id: "",
            font_name: "",
            font_path:
              "/Users/anviz/Library/Containers/com.lemon.lvpro/Data/Movies/JianyingPro/User Data/Cache/effect/19366221/dd565912c20ce61f6f71a33bcb30faf8/优设标题圆.otf",
            font_resource_id: "",
            font_size: 11.0,
            font_source_platform: 0,
            font_team_id: "",
            font_title: "none",
            font_url: "",
            fonts: [],
            force_apply_line_max_width: false,
            global_alpha: 1.0,
            group_id: "",
            has_shadow: false,
            id: "t-" + index + "-" + element.uuid,
            initial_scale: 1.0,
            is_rich_text: false,
            italic_degree: 0,
            ktv_color: "",
            language: "",
            layer_weight: 1,
            letter_spacing: 0.0,
            line_feed: 1,
            line_spacing: 0.02,
            name: "",
            original_size: [],
            preset_category: "",
            preset_category_id: "",
            preset_has_set_alignment: false,
            preset_id: "",
            preset_index: 0,
            preset_name: "",
            recognize_type: 0,
            relevance_segment: [],
            shadow_alpha: 0.8,
            shadow_angle: -45.0,
            shadow_color: "",
            shadow_distance: 8.0,
            shadow_point: {
              x: 1.0182337649086284,
              y: -1.0182337649086284,
            },
            shadow_smoothing: 1.0,
            shape_clip_x: false,
            shape_clip_y: false,
            style_name: "",
            sub_type: 0,
            text_alpha: 1.0,
            text_color: "#FFFFFF",
            text_preset_resource_id: "",
            text_size: 30,
            text_to_audio_ids: [],
            tts_auto_update: false,
            type: "text",
            typesetting: 0,
            underline: false,
            underline_offset: 0.22,
            underline_width: 0.05,
            use_effect_default_color: true,
            words: {
              end_time: [],
              start_time: [],
              text: [],
            },
          });

          jsonData.tracks[1].segments.push({
            cartoon: false,
            clip: {
              alpha: 1.0,
              flip: {
                horizontal: false,
                vertical: false,
              },
              rotation: 0.0,
              scale: {
                x: 1.0,
                y: 1.0,
              },
              transform: {
                x: 0.0,
                y: -0.47,
              },
            },
            common_keyframes: [],
            enable_adjust: true,
            enable_color_curves: true,
            enable_color_wheels: true,
            enable_lut: true,
            enable_smart_color_adjust: false,
            extra_material_refs: [
              "0F90E6BB-71E2-42B5-B0AE-0699EA292530",
              "8B39A10F-F062-47B4-BC7E-D8B888CB8008",
              "AD006047-AB73-4CB9-A227-CC2E16C99E12",
            ],
            group_id: "",
            hdr_settings: {
              intensity: 1.0,
              mode: 1,
              nits: 1000,
            },
            id: "t-" + index + "-" + element.uuid,
            intensifies_audio: false,
            is_placeholder: false,
            is_tone_modify: false,
            keyframe_refs: [],
            last_nonzero_volume: 1.0,
            material_id: "t-" + index + "-" + element.uuid,
            render_index: 0,
            responsive_layout: {
              enable: false,
              horizontal_pos_layout: 0,
              size_layout: 0,
              target_follow: "",
              vertical_pos_layout: 0,
            },
            reverse: false,
            source_timerange: {
              duration: durations[index],
              start: 0,
            },
            speed: 1.0,
            target_timerange: {
              duration: durations[index],
              start: a_duration,
            },
            template_id: "",
            template_scene: "default",
            track_attribute: 0,
            track_render_index: 0,
            uniform_scale: {
              on: true,
              value: 1.0,
            },
            visible: true,
            volume: 1.0,
          });

          a_duration += durations[index];
          return true;
        });

        jsonData.materials.videos.push({
          audio_fade: null,
          cartoon_path: "",
          category_id: "",
          category_name: "local",
          check_flag: 63487,
          crop: {
            lower_left_x: 0.0,
            lower_left_y: 1.0,
            lower_right_x: 1.0,
            lower_right_y: 1.0,
            upper_left_x: 0.0,
            upper_left_y: 0.0,
            upper_right_x: 1.0,
            upper_right_y: 0.0,
          },
          crop_ratio: "free",
          crop_scale: 1.0,
          duration: video_length,
          extra_type_option: 0,
          formula_id: "",
          freeze: null,
          gameplay: null,
          has_audio: false,
          height: 512,
          id: "v-" + element.uuid,
          intensifies_audio_path: "",
          intensifies_path: "",
          is_ai_generate_content: false,
          is_unified_beauty_mode: false,
          local_id: "",
          local_material_id: "",
          material_id: "",
          material_name: "1693984858237.png",
          material_url: "",
          matting: {
            flag: 0,
            has_use_quick_brush: false,
            has_use_quick_eraser: false,
            interactiveTime: [],
            path: "",
            strokes: [],
          },
          media_path: "",
          object_locked: null,
          origin_material_id: "",
          path: jyFile,
          picture_from: "none",
          picture_set_category_id: "",
          picture_set_category_name: "",
          request_id: "",
          reverse_intensifies_path: "",
          reverse_path: "",
          smart_motion: null,
          source: 1,
          source_platform: 0,
          stable: null,
          team_id: "",
          type: "photo",
          video_algorithm: {
            algorithms: [],
            deflicker: null,
            motion_blur_config: null,
            noise_reduction: null,
            path: "",
            time_range: null,
          },
          width: 512,
        });

        jsonData.tracks[0].segments.push({
          cartoon: false,
          clip: {
            alpha: 1.0,
            flip: {
              horizontal: false,
              vertical: false,
            },
            rotation: 0.0,
            scale: {
              x: 1.1,
              y: 1.1,
            },
            transform: {
              x: 0.0,
              y: 0.0,
            },
          },
          common_keyframes: [{
                            "id": "454f25bc-f8c6-63b9-3ccb-498936e35fac",
                            "keyframe_list": [
                                {
                                    "curveType": "Line",
                                    "graphID": "",
                                    "id": "402ef89d-12ac-ca6b-9e01-33f65e2faff7",
                                    "left_control": {
                                        "x": 0.0,
                                        "y": 0.0
                                    },
                                    "right_control": {
                                        "x": 0.0,
                                        "y": 0.0
                                    },
                                    "time_offset": 0,
                                    "values": [
                                        0.0
                                    ]
                                },
                                {
                                    "curveType": "Line",
                                    "graphID": "",
                                    "id": "35c70246-a7ef-4111-ae7d-267e27583123",
                                    "left_control": {
                                        "x": 0.0,
                                        "y": 0.0
                                    },
                                    "right_control": {
                                        "x": 0.0,
                                        "y": 0.0
                                    },
                                    "time_offset": v_duration,
                                    "values": [
                                        0.3
                                    ]
                                }
                            ],
                            "material_id": "",
                            "property_type": "KFTypePositionY"
          }, {
            "id": "AD6878B6-A8BE-4afb-96A0-321427683E91",
            "keyframe_list": [
                {
                    "curveType": "Line",
                    "graphID": "",
                    "id": "D37CE0A8-85E6-424e-8FD2-46AC71807D99",
                    "left_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "right_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "time_offset": 0,
                    "values": [
                        1.3
                    ]
                },
                {
                    "curveType": "Line",
                    "graphID": "",
                    "id": "EE18847B-D4E1-475c-B8C7-3380179B1E4D",
                    "left_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "right_control": {
                        "x": 0.0,
                        "y": 0.0
                    },
                    "time_offset": v_duration,
                    "values": [
                        1.3
                    ]
                }
            ],
            "material_id": "",
            "property_type": "KFTypeScaleY"
        }],
          enable_adjust: true,
          enable_color_curves: true,
          enable_color_wheels: true,
          enable_lut: true,
          enable_smart_color_adjust: false,
          extra_material_refs: [
            "000EAD9B-F349-4983-A3E0-E74FD8034F81",
            "6069C395-771C-4015-8641-F7F70E5C6BDA",
            "92396074-7E17-4A28-ABA0-C303BBC3078B",
          ],
          group_id: "",
          hdr_settings: {
            intensity: 1.0,
            mode: 1,
            nits: 1000,
          },
          id: "v-" + element.uuid,
          intensifies_audio: false,
          is_placeholder: false,
          is_tone_modify: false,
          keyframe_refs: [],
          last_nonzero_volume: 1.0,
          material_id: "v-" + element.uuid,
          render_index: 0,
          responsive_layout: {
            enable: false,
            horizontal_pos_layout: 0,
            size_layout: 0,
            target_follow: "",
            vertical_pos_layout: 0,
          },
          reverse: false,
          source_timerange: {
            duration: v_duration,
            start: 0,
          },
          speed: 1.0,
          target_timerange: {
            duration: v_duration,
            start: duration,
          },
          template_id: "",
          template_scene: "default",
          track_attribute: 0,
          track_render_index: 0,
          uniform_scale: {
            on: true,
            value: 1.0,
          },
          visible: true,
          volume: 1.0,
        });

        duration += v_duration;
        return true;
  
      });

   
      jsonData.duration = duration;

      fs.writeFileSync(jyContentFile, JSON.stringify(jsonData));

      //   var timestamp = new Date().getTime().toString();
      //   let dirname = timestamp+'.png';

      //   console.log(arg)
      //   let filePath =join(dirPath,dirname);
      //   const base64Regex = /^data:image\/(png|jpeg|jpg);base64,/;
      //   const base64DataWithoutPrefix = arg.replace(base64Regex, '');

      // // 将base64数据转换为buffer
      //   const buffer = Buffer.from(base64DataWithoutPrefix, 'base64');

      //   fs.writeFileSync(filePath, buffer);
      //   return dirname;
    });

    const fs = require("fs");
    ipcMain.handle("getAppPath", () => {
      console.log("getAppPath");

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      return dirPath;
    });
  });
