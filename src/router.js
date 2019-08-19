import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
// import first from './views/first.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    // {
    //   path: '/first',
    //   name: 'first',
    //   component: first
    // }
  ]
})
