import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'

const service = axios.create({
  baseURL: 'http://150.158.155.57',
  timeout: 180000,
})

service.interceptors.request.use(
  (config) => {
    config.headers['Form-type'] = 'chatgpt'
    const token = useAuthStore().getToken()
    if (token)
      config.headers['Authori-zation'] = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

service.defaults.timeout = 180000
export default service
