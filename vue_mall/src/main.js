import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
/* import font icon */
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
/* import global css style */
import './assets/css/global.css'
/* import axios and set base URL */
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
/* configure requests interceptor */
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  /* must return the config parameter in the end */
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
