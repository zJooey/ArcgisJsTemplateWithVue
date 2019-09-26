import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

// esriLoader
import esriLoader from 'esri-loader'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// 引入arcgis中css与dojo的url,不写则默认为4.11版本
esriLoader.loadCss('https://js.arcgis.com/4.11/esri/css/main.css')
esriLoader.loadScript({ // 加载js
  url: 'https://js.arcgis.com/4.11//dojo/dojo.js'
})
Vue.prototype.$esriLoader = esriLoader

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
