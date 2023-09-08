import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
// import { setupPageGuard } from './permission'
import { ChatLayout } from '@/layout'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'chat',  
    component: ChatLayout,
    redirect:"/chat",
    children: [
      {
        path: '/chat',
        name: 'chat',
        meta: {
          path: 'chat',
        },
       component: () => import('@/views/index/index.vue'),
      },
    ],
  },
  {
    path: '/run/:id',
    name: 'run',  
    component: () => import('@/views/index/run.vue'),
  },
  {
    path: '/people',
    name: 'people',
    component: ChatLayout,
    redirect: '/people/index',
    children: [
      {
        path: '/people/index',
        name: 'people/index',
        meta: {
          path: 'people',
        },
        component: () => import('@/views/people/index.vue'),
      },
    ],
  },{
    path: '/scene',
    name: 'scene',
    component: ChatLayout,
    redirect: '/scene/index',
    children: [
      {
        path: '/scene/index',
        name: 'scene/index',
        meta: {
          path: 'scene',
        },
        component: () => import('@/views/scene/index.vue'),
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})


export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
