import { router } from '@/router'

export function getCurrentDate() {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

export function to(url:any) {
  router.push(url)
}

function isWechatBrowser() {
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('micromessenger')
}

function isPhone() {
  const ua = navigator.userAgent.toLowerCase()
  return /mobile/i.test(ua)
}

export function isMobileWeixin() {
  return isPhone() && isWechatBrowser()
}
