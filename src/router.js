import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/mas',
      name: 'mas',
      component: () => import(/* webpackChunkName: "mas" */ './views/Mas.vue')
    },
    {
      path: '/mbs',
      name: 'mbs',
      component: () => import(/* webpackChunkName: "mbs" */ './views/Mbs.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import(/* webpackChunkName: "search" */ './views/Search.vue')
    },
    {
      path: '/social',
      name: 'social',
      component: () => import(/* webpackChunkName: "social" */ './views/Social.vue')
    },
    {
      path: '/traffic',
      name: 'traffic',
      component: () => import(/* webpackChunkName: "traffic" */ './views/Traffic.vue')
    },
    {
      path: '/placement',
      name: 'placement',
      component: () => import(/* webpackChunkName: "placement" */ './views/Placement.vue')
    },
  ]
})
