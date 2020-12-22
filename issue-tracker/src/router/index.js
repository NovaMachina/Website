import Vue from 'vue'
import VueRouter from 'vue-router'

import Lander from '@/views/Lander.vue'
import IssuePage from '@/views/IssuePage.vue'
import Admin from '@/views/Admin.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    redirect: '/main'
  },
  {
    path: '/main',
    name: 'Lander',
    component: Lander
  },
  {
    path: '/issue/:slug',
    name: 'IssuePage',
    component: IssuePage
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
