import { post } from '@/utils/request/index_sd'

export function txt2img<T>(prompt) {
    return post<T>({
      url: '/sdapi/v1/txt2img',
      data: {
        'prompt':prompt,
        'negative_prompt':'nsfw,nude,exposed,naked',
        'steps':30,
        'width':512,
        'height':512,
        'override_settings_restore_afterwards': false,
        'override_settings':{
            'sd_model_checkpoint':'anything-v5-PrtRE.safetensors [7f96a1a9ca]'
        },
      },
    }).then(res=>{
        console.log(res,'111')
        return res.images
    })
}
