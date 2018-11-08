import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

import ajaxLoading from './modules/ajax_loading'
import loading from './modules/loading'
import allnav from './modules/allnav' //最左边的汉堡导航
import user from './modules/user'
import map3d from './modules/map3d'
import camera from './modules/camera'
import bz from './modules/bz'
import czml from './modules/czml'

import axios from '@/http/http.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    ajaxLoading,
    loading,
    allnav,
    user,
    map3d,
    camera,
    bz,
    czml,
  },
  getters
})

axios.interceptors.request.use(config => {
  console.log('ajax begin request')
  store.commit('ajaxStart')
  return config
})

axios.interceptors.response.use(config => {
  console.log('ajax get response')
  store.commit('ajaxEnd')
  return config
})

export default store