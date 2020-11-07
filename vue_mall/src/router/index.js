import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})
// global before guards
router.beforeEach((to, from, next) => {
  // to: the target Route Object being navigated to
  // from: the current route being navigated away from
  // next is a function, means move on next()  next('/login) redirect

  if (to.path === '/login') return next()
  /* get token */
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
