import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'

Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
// const requireAll = requireContext => requireContext.keys().map(requireContext)
// const iconMap = requireAll(req)
// console.log(iconMap, req)

const cache = {}

function importAll (r) {
  r.keys().forEach(key => cache[key] = r(key))
}

importAll(req)
