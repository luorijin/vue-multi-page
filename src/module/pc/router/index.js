import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import home from '../views/home.vue'
const routes = [
  { path: '/index', component: home
  }
]
export default new VueRouter({
  mode: 'history',
  base: '/pc',
  routes
})

