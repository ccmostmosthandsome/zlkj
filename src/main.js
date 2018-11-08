import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './http/http.js'
import store from './store/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/icons'
import './permission'
import LazyLoad from '@/utils/lazyLoad.js'

import Cesium from 'cesium/Cesium' //3D引擎

// global css
import '@/styles/index.scss'

Vue.prototype.axios = axios

Vue.prototype.cesium = Cesium

Vue.use(ElementUI)

Vue.use(LazyLoad)

Vue.config.productionTip = false

new Vue({
  router,
  // axios,
  store,
  render: h => h(App)
}).$mount('#app')
