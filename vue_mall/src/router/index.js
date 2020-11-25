import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '@/components/Login'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login.vue')
// import Home from '@/components/Home'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Home')
// import Welcome from '@/components/Welcome'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome')

// import Users from '@/components/user/Users'
const Users = () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/user/Users')
// import Rights from '@/components/authority/Rights'
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/authority/Rights')
// import Roles from '@/components/authority/Roles'
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/authority/Roles')

// import Cate from '@/components/goods/Cate'
const Cate = () => import(/* webpackChunkName: "cate_params" */ '@/components/goods/Cate')
// import Params from '@/components/goods/Params'
const Params = () => import(/* webpackChunkName: "cate_params" */ '@/components/goods/Params')

// import List from '@/components/goods/List'
const List = () => import(/* webpackChunkName: "list_add" */ '@/components/goods/List')
// import Add from '@/components/goods/Add'
const Add = () => import(/* webpackChunkName: "list_add" */ '@/components/goods/Add')

// import Order from '@/components/order/Order'
const Order = () => import(/* webpackChunkName: "order_report" */ '@/components/order/Order')
// import Report from '@/components/report/Report'
const Report = () => import(/* webpackChunkName: "order_report" */ '@/components/report/Report')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
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
