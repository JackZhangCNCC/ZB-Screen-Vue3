import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import type {RouteRecordRaw} from "vue-router"
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/drugRegulation',
  },
  // 药品监管
  {
    path: '/drugRegulation',
    name: 'drugRegulation',
    component: () => import('@/views/HomeView.vue'),
    children:[
      {
        path: '',
        name: 'drugRegulation',
        component: () => import('@/views/drugRegulation/index.vue'),
      }
    ]
  },
  // 分级诊疗
  {
    path: '/tieredMedical',
    name: 'tieredMedical',
    component: () => import('@/views/HomeView.vue'),
    children:[
      {
        path: '',
        name: 'tieredMedical',
        component: () => import('@/views/tieredMedical/index.vue'),
      }
    ]
  },
  // 远程医疗
  {
    path: '/telemedicine',
    name: 'telemedicine',
    component: () => import('@/views/HomeView.vue'),
    children:[
      {
        path: '',
        name: 'telemedicine',
        component: () => import('@/views/telemedicine/index.vue'),
      }
    ]
  },
  // 全民健康
  {
    path: '/nationalHealth',
    name: 'nationalHealth',
    component: () => import('@/views/HomeView.vue'),
    children:[
      {
        path: '',
        name: 'nationalHealth',
        component: () => import('@/views/nationalHealth/index.vue'),
      }
    ]
  }
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  next();
})

export default router
