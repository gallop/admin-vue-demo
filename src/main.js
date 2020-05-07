import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Cookies from 'js-cookie'
import Element from 'element-ui'
// import vuePicturePreview from 'vue-picture-preview'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/index.scss' // global css

import '@/assets/icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters
import permission from '@/directive/permission/index' // 自定义指令，权限判断指令

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
// Vue.component('Previewer', vuePicturePreview); //图片预览
// Vue.use(vuePicturePreview)
Vue.directive('permission', permission)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
