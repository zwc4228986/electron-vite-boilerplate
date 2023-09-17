import { post } from '@/utils/request/index_sd'

export function txt2img<T>(prompt) {
    return post<T>({
      url: '/sdapi/v1/txt2img',
      data: {
        'prompt':prompt,
        'negative_prompt':'(nsfw:1.5), (ugly face:0.8),cross-eyed,sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, bad anatomy, facing away, tilted head, Multiple people, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worstquality, low quality, normal quality, jpegartifacts, signature, watermark, username, , bad feet, cropped, poorly drawn hands, poorly drawn face, mutation, deformed, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, extra fingers, fewer digits, extra limbs, extra arms,extra legs, malformed limbs, fused fingers, too many fingers, long neck, cross-eyed,mutated hands, polar lowres, bad body, bad proportions, gross proportions, text, error, missing fingers, missing arms, missing legs, extra digit, extra arms, extra leg, extra foot, ((repeating hair))',
        'steps':25,
        'width':512,
        'height':512,
        'override_settings_restore_afterwards': false,
        'override_settings':{
            'sd_model_checkpoint':'kkgufengwkk.safetensors [edbd50aaab]'
        },
      },
    }).then(res=>{
        console.log(res,'111')
        return res.images
    })
}

export function getSdModel(){
  return post({
    url: '/sdapi/v1/sd-models',
    data: {
    }
  });
}


export function hdImage<T>(prompt,base64Image){
  return post<T>({
    url: '/sdapi/v1/img2img',
    data: {
      "prompt": prompt,
      "negative_prompt": "(nsfw:1.5), (ugly face:0.8),cross-eyed,sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, bad anatomy, facing away, tilted head, Multiple people, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worstquality, low quality, normal quality, jpegartifacts, signature, watermark, username, , bad feet, cropped, poorly drawn hands, poorly drawn face, mutation, deformed, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, extra fingers, fewer digits, extra limbs, extra arms,extra legs, malformed limbs, fused fingers, too many fingers, long neck, cross-eyed,mutated hands, polar lowres, bad body, bad proportions, gross proportions, text, error, missing fingers, missing arms, missing legs, extra digit, extra arms, extra leg, extra foot, ((repeating hair))",
      "styles": [
      ],
      "seed": -1,
      "subseed": -1,
      "subseed_strength": 0,
      "seed_resize_from_h": -1,
      "seed_resize_from_w": -1,
      "sampler_name": "",
      "batch_size": 1,
      "n_iter": 1,
      "steps": 50,
      "cfg_scale": 7,
      "width": 512,
      "height": 512,
      "restore_faces": true,
      "tiling": true,
      "do_not_save_samples": false,
      "do_not_save_grid": false,
      "eta": 0,
      "denoising_strength": 0.1,
      "s_min_uncond": 0,
      "s_churn": 0,
      "s_tmax": 0,
      "s_tmin": 0,
      "s_noise": 0,
      "override_settings": {
      },
      "override_settings_restore_afterwards": true,
      "refiner_checkpoint": "",
      "refiner_switch_at": 0,
      "disable_extra_networks": false,
      "comments": {},
      "init_images": [
        base64Image
      ],
      "resize_mode": 0,
      "image_cfg_scale": 0,
      "mask_blur_x": 4,
      "mask_blur_y": 4,
      "mask_blur": 0,
      "inpainting_fill": 0,
      "inpaint_full_res": true,
      "inpaint_full_res_padding": 0,
      "inpainting_mask_invert": 0,
      "initial_noise_multiplier": 0,
      "latent_mask": "",
      "sampler_index": "Euler",
      "include_init_images": false,
      "script_name": "sd upscale",
      "script_args": ["22",64,6,2],
      "send_images": true,
      "save_images": false,
      "alwayson_scripts": {}
    },
  }).then(res=>{
      console.log(res,'111')
      return res.images
  })
}