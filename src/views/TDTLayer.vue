<template>
  <div id="viewContainer"></div>
</template>

<script>
export default {
  name: 'TDT',
  data () {
    return {
      mapInstance: null,
      viewerInstance: null
    }
  },
  created () {
  },
  mounted () {
    this.initBaseMap()
  },
  methods: {
    initBaseMap () {
      // 加载模块
      this.$esriLoader.loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/views/SceneView',
        'esri/Basemap',
        'esri/layers/WebTileLayer',
        'esri/geometry/SpatialReference',
        'esri/geometry/Extent',
        'esri/layers/support/TileInfo',
        'esri/layers/GraphicsLayer',
        'esri/widgets/Search',
        'esri/widgets/Sketch',
        'esri/config',
        'dojo/domReady!'
      ])
        .then(([Map, MapView, SceneView, Basemap, WebTileLayer, SpatialReference, Extent, TileInfo, GraphicsLayer, Search, Sketch, esriConfig]) => {
          // let tileInfo = new TileInfo({
          //   dpi: 90.71428571427429,
          //   rows: 256,
          //   cols: 256,
          //   compressionQuality: 0,
          //   origin: {
          //     x: -180,
          //     y: 90
          //   },
          //   spatialReference: new SpatialReference({ wkid: 4326 }),
          //   lods: [
          //     { 'level': 1, 'resolution': 0.7031249999891485, 'scale': 2.958293554545656E8 },
          //     { 'level': 2, 'resolution': 0.35156249999999994, 'scale': 1.479146777272828E8 },
          //     { 'level': 3, 'resolution': 0.17578124999999997, 'scale': 7.39573388636414E7 },
          //     { 'level': 4, 'resolution': 0.08789062500000014, 'scale': 3.69786694318207E7 },
          //     { 'level': 5, 'resolution': 0.04394531250000007, 'scale': 1.848933471591035E7 },
          //     { 'level': 6, 'resolution': 0.021972656250000007, 'scale': 9244667.357955175 },
          //     { 'level': 7, 'resolution': 0.01098632812500002, 'scale': 4622333.678977588 },
          //     { 'level': 8, 'resolution': 0.00549316406250001, 'scale': 2311166.839488794 },
          //     { 'level': 9, 'resolution': 0.0027465820312500017, 'scale': 1155583.419744397 },
          //     { 'level': 10, 'resolution': 0.0013732910156250009, 'scale': 577791.7098721985 },
          //     { 'level': 11, 'resolution': 0.000686645507812499, 'scale': 288895.85493609926 },
          //     { 'level': 12, 'resolution': 0.0003433227539062495, 'scale': 144447.92746804963 },
          //     { 'level': 13, 'resolution': 0.00017166137695312503, 'scale': 72223.96373402482 },
          //     { 'level': 14, 'resolution': 0.00008583068847656251, 'scale': 36111.98186701241 },
          //     { 'level': 15, 'resolution': 0.000042915344238281406, 'scale': 18055.990933506204 },
          //     { 'level': 16, 'resolution': 0.000021457672119140645, 'scale': 9027.995466753102 },
          //     { 'level': 17, 'resolution': 0.000010728836059570307, 'scale': 4513.997733376551 },
          //     { 'level': 18, 'resolution': 0.000005364418029785169, 'scale': 2256.998866688275 },
          //     { 'level': 19, 'resolution': 2.68220901485e-6, 'scale': 1128.499433344138 },
          //     { 'level': 20, 'resolution': 1.341104507425e-6, 'scale': 564.2497166720688 }
          //   ]
          // })
          let tk = 'dfaa0a6f5e5645a9fcf1b449d326a883'
          let tiledLayer = new WebTileLayer({
            // urlTemplate: 'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}',
            urlTemplate: 'https://{subDomain}.tianditu.com/DataServer?T=vec_c&tk=' + tk + '&x={col}&y={row}&l={level}',
            // urlTemplate: 'http://{subDomain}.tianditu.com/vec_c/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=vec&STYLE=default&FORMAT=tiles&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=' + tk,
            subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
            // tileInfo: tileInfo
          })
          let tiledAnno = new WebTileLayer({
            urlTemplate: 'https://{subDomain}.tianditu.com/DataServer?T=cva_c&tk=' + tk + '&x={col}&y={row}&l={level}',
            subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
            // tileInfo: tileInfo
          })

          // esriConfig.request.corsEnabledServers.push('http://www.google.cn/')

          // 画图(点线面)
          let graphics = new GraphicsLayer()
          this.mapInstance = new Map({
            basemap: {
              // baseLayers: [tiledLayer, tiledAnno]
              baseLayers: [tiledLayer, tiledAnno]
            },
            spatialReference: new SpatialReference({ wkid: 4326 }),
            layers: [graphics]
          })
          // 3D
          this.viewerInstance = new SceneView({
            container: 'viewContainer',
            // spatialReference: new SpatialReference({ wkid: 4326 }),
            map: this.mapInstance,
            center: [117, 35],
            zoom: 10
          })
          // 2D
          // this.viewerInstance = new MapView({
          //   container: 'viewContainer',
          //   spatialReference: {
          //     wkid: 4326
          //   },
          //   map: this.mapInstance,
          //   zoom: 6,
          //   center: [113, 32]
          // })

          // 搜索工具
          var searchWidget = new Search({ view: this.viewerInstance })
          this.viewerInstance.ui.add(searchWidget, 'top-right')

          // 素描小工具
          let sketch1 = new Sketch({
            layer: graphics,
            view: this.viewerInstance
          })

          this.viewerInstance.ui.add(sketch1, 'top-right')
        })
        .catch((error) => {
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
