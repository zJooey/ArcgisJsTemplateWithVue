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
// esriLoader.loadCss('https://js.arcgis.com/4.11/esri/css/main.css')
// esriLoader.loadScript({ // 加载js
//   url: 'https://js.arcgis.com/4.11/dojo/dojo.js'
// })

// 本地服务引入 (解决跨域[IIS与Tomcat]与.wsv文件的MIME问题['application/octet-stream'])
// IIS
esriLoader.loadCss('http://10.104.207.201:8066/arcgis_js_api/library/4.11/esri/css/main.css')
esriLoader.loadScript({ // 加载js
  url: 'http://10.104.207.201:8066/arcgis_js_api/library/4.11/init.js'
})
// Tomcat
// esriLoader.loadCss('http://localhost:8888/arcgis_js_api/library/4.11/esri/css/main.css')
// esriLoader.loadScript({ // 加载js
//   url: 'http://localhost:8888/arcgis_js_api/library/4.11/init.js'
// })
Vue.prototype.$esriLoader = esriLoader

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
