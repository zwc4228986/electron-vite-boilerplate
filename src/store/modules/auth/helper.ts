import { ss } from '@/utils/storage'

const LOCAL_NAME = 'SECRET_TOKEN'

export function getToken() {
  return ss.get(LOCAL_NAME)
}

export function setToken(token: string) {
  return ss.set(LOCAL_NAME, token)
}

export function removeToken() {
  return ss.remove(LOCAL_NAME)
}

const LOCAL_U = 'P_USER_ID'

export function getU() {
  return ss.get(LOCAL_U)
}

export function setU(u: string) {
  return ss.set(LOCAL_U, u)
}
