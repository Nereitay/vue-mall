import Vue from 'vue'
import App from './App.vue'
import router from './router'
/* import font icon */
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
/* import text editor */
import VueQuillEditor from 'vue-quill-editor'

/* import global css style */
import './assets/css/global.css'
/* import axios and set base URL */
import axios from 'axios'

import Nprogress from 'nprogress'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
/* configure requests interceptor */
axios.interceptors.request.use(config => {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  /* must return the config parameter in the end */
  return config
})
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
