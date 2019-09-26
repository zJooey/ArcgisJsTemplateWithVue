<template>
  <div id="viewContainer"></div>
</template>

<script>
import esriLoader from 'esri-loader'

export default {
  name: 'Map',
  data () {
    return {
      mapInstance: null,
      viewerInstance: null
    }
  },
  mounted () {
    this.initBaseMap()
  },
  methods: {
    // 初始化地图
    initBaseMap () {
      let _this = this
      // 单独使用esriLoader
      // 加载css,可写参数(css的url或版本),不写则默认4.11版本的
      esriLoader.loadCss('https://js.arcgis.com/4.11/esri/css/main.css')
      // arcgis js的url,不写则默认4.11版本的
      const options = {
        url: 'https://js.arcgis.com/4.11/'
      }
      esriLoader.loadModules([
        'esri/Map',
        'esri/views/SceneView',
        'dojo/domReady!'
      ], options).then(([Map, SceneView]) => {
        _this.mapInstance = new Map({
          basemap: 'topo'
        })
        _this.viewerInstance = new SceneView({
          map: _this.mapInstance,
          container: 'viewContainer',
          zoom: 6,
          center: [113, 32]
        })
      }).catch(error => {
        console.log(error.message)
      })
    }
  }
}
</script>

<style scoped>
#viewContainer {
  width: 100%;
  height: 100%;
}
</style>
