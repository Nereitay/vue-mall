import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
/* import font icon */
import './assets/fonts/iconfont.css'
/* import global css style */
import './assets/css/global.css'
/* import axios and set base URL */
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
