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
        'dojo/_base/lang',
        'dojo/string',
        'dojo/_base/url',
        'esri/core/urlUtils',
        'esri/layers/BaseTileLayer',
        'esri/layers/WebTileLayer',
        'esri/geometry/SpatialReference',
        'esri/geometry/Extent',
        'esri/layers/support/TileInfo',
        'esri/widgets/Search',
        'dojo/domReady!'
      ])
        .then(this.loading)
        .then(obj => {
          this.initMap(obj)
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    loading ([Map, MapView, SceneView, Basemap, lang, string, Url, urlUtils, BaseTileLayer, WebTileLayer, SpatialReference, Extent, TileInfo, Search]) {
      // let _this = this
      let TDT = WebTileLayer.createSubclass({
        declaredClass: 'TDT',
        properties: {
          copyright: '',
          legendEnabled: {
            json: {
              readFrom: ['showLegend'],
              read: function (b, c) {
                return c.showLegend != null ? c.showLegend : !0
              }
            }
          },
          levelValues: {
            dependsOn: ['tileInfo'],
            get: function () {
              let b = []
              if (!this.tileInfo) return null
              this.tileInfo.lods.forEach(function (c) {
                b[c.level] = c.levelValue || c.level
              }, this)
              return b
            }
          },
          popupEnabled: {
            json: {
              readFrom: ['disablePopup'],
              read: function (b, c) {
                return c.disablePopup != null ? !c.disablePopup : !0
              }
            }
          },
          spatialReference: new SpatialReference({ wkid: 4326 }),
          tileServers: {
            value: null,
            dependsOn: ['urlTemplate', 'subDomains', 'urlPath'],
            get: function () {
              let b = new Url(this.urlTemplate)
              let c = b.scheme ? b.scheme + '://' : '//'
              let a = c + b.authority + '/'
              let e = this.subDomains
              let d; let f = []
              b.authority.indexOf('{subDomain}') === -1 && f.push(a)
              e && (e.length > 0 && b.authority.split('.').length > 1) && e.forEach(function (a, e) {
                b.authority.indexOf('{subDomain}') > -1 && (d = c + b.authority.replace(/\{subDomain\}/gi, a) + '/')
                f.push(d)
              }, this)
              /* no-return-asign */
              f = f.map(function (b) {
                b.charAt(b.length - 1) !== '/' && (b +=
                    '/')
                return b
              })
              return f
            }
          },
          urlPath: {
            dependsOn: ['urlTemplate'],
            get: function () {
              if (!this.urlTemplate) return null
              let b = this.urlTemplate
              let a = new Url(b)
              return b.substring(((a.scheme ? a.scheme + '://' : '//') + a.authority + '/').length)
            }
          },
          urlTemplate: null
        },
        normalizeCtorArgs: function (b, c) {
          return typeof b === 'string' ? lang.mixin({ urlTemplate: b }, c || {}) : b
        },
        /**
           * 构造方法
           *  * mapTypeName
           *      vec: 矢量底图
           *      cva: 矢量注记图层
           *      eva: 矢量注记图层-英文注记
           *
           *      img: 影像底图
           *      cia: 影像注记图层
           *      eia: 影像注记图层 -英文注记
           *
           *      ter: 地形底图
           *      cta: 地形注记图层
           *   * typeMatrixSet
           *      c: 地理坐标系
           *      w: 投影坐标系为
           * @param mapTypeName   天地图类型
           * @param typeMatrixSet 坐标系
           */
        // getDefaults: function () {
        //   return lang.mixin(this.inherited(arguments), {
        //     // fullExtent: new Extent(-180, -90, 180, 90, this.spatialReference),
        //     tileInfo: new TileInfo({
        //       rows: 256,
        //       cols: 256,
        //       dpi: 90.71428571428571,
        //       format: 'PNG8',
        //       compressionQuality: 0,
        //       origin: { x: -180, y: 90 },
        //       // spatialReference: new SpatialReference({ wkid: 4326 }),
        //       lods: [
        //         { 'level': 1, 'resolution': 0.7031249999891485, 'scale': 2.958293554545656E8 },
        //         { 'level': 2, 'resolution': 0.35156249999999994, 'scale': 1.479146777272828E8 },
        //         { 'level': 3, 'resolution': 0.17578124999999997, 'scale': 7.39573388636414E7 },
        //         { 'level': 4, 'resolution': 0.08789062500000014, 'scale': 3.69786694318207E7 },
        //         { 'level': 5, 'resolution': 0.04394531250000007, 'scale': 1.848933471591035E7 },
        //         { 'level': 6, 'resolution': 0.021972656250000007, 'scale': 9244667.357955175 },
        //         { 'level': 7, 'resolution': 0.01098632812500002, 'scale': 4622333.678977588 },
        //         { 'level': 8, 'resolution': 0.00549316406250001, 'scale': 2311166.839488794 },
        //         { 'level': 9, 'resolution': 0.0027465820312500017, 'scale': 1155583.419744397 },
        //         { 'level': 10, 'resolution': 0.0013732910156250009, 'scale': 577791.7098721985 },
        //         { 'level': 11, 'resolution': 0.000686645507812499, 'scale': 288895.85493609926 },
        //         { 'level': 12, 'resolution': 0.0003433227539062495, 'scale': 144447.92746804963 },
        //         { 'level': 13, 'resolution': 0.00017166137695312503, 'scale': 72223.96373402482 },
        //         { 'level': 14, 'resolution': 0.00008583068847656251, 'scale': 36111.98186701241 },
        //         { 'level': 15, 'resolution': 0.000042915344238281406, 'scale': 18055.990933506204 },
        //         { 'level': 16, 'resolution': 0.000021457672119140645, 'scale': 9027.995466753102 },
        //         { 'level': 17, 'resolution': 0.000010728836059570307, 'scale': 4513.997733376551 },
        //         { 'level': 18, 'resolution': 0.000005364418029785169, 'scale': 2256.998866688275 },
        //         { 'level': 19, 'resolution': 2.68220901485e-6, 'scale': 1128.499433344138 },
        //         { 'level': 20, 'resolution': 1.341104507425e-6, 'scale': 564.2497166720688 }
        //       ]
        //     })
        //   })
        // },
        // getTileUrl: function (level, row, col) {
        //   let tk = 'dfaa0a6f5e5645a9fcf1b449d326a883'
        //   return 'https://t' + col % 8 + '.tianditu.com/DataServer?T=' + this._mapTypeName + '&tk=' + tk + '&x=' + col + '&y=' + row + '&l=' + level
        //   // return 'https://{subDomain}.tianditu.com/DataServer?T=' + this._mapTypeName + '_' + this._typeMatrixSet + '&tk=' + tk + '&x=' + col + '&y=' + row + '&l=' + level
        // },
        getTileUrl: function (b, a, d) {
          b = this.levelValues[b]
          let e = this.tileServers[a % this.tileServers.length] + string.substitute(this.urlPath, {
            level: b,
            col: d,
            row: a
          })
          e = e.replace(/\{level\}/gi, b).replace(/\{row\}/gi, a).replace(/\{col\}/gi, d)
          return urlUtils.addProxy(e)
        }
      })
      return { Map, MapView, SceneView, Basemap, lang, WebTileLayer, SpatialReference, Extent, TileInfo, Search, TDT }
    },
    initMap (obj) {
      console.log(obj)
      // this.mapInstance = new obj.Map({
      //   basemap: 'topo'
      // })
      // 矢量
      // let tdtMapLayer = new obj.TDT('vec', 'c')
      // let tdtMapAnno = new obj.TDT('cva', 'c')
      // 影像
      // let tdtMapLayer = new obj.TDT('img', 'c')
      // let tdtMapAnno = new obj.TDT('cia', 'c')
      // 地形
      let tk = 'dfaa0a6f5e5645a9fcf1b449d326a883'
      let options = {
        style: 'default',
        format: 'tiles',
        copyright: '天地图',
        subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        urlTemplate: 'https://{subDomain}.tianditu.com/DataServer?T=vec_w&tk=' + tk + '&x={col}&y={row}&l={level}'
      }
      let tdtMapLayer = new obj.TDT(options)
      options.urlTemplate = 'https://{subDomain}.tianditu.com/DataServer?T=cva_w&tk=' + tk + '&x={col}&y={row}&l={level}'
      let tdtMapAnno = new obj.TDT(options)
      this.mapInstance = new obj.Map({
        basemap: new obj.Basemap({
          baseLayers: [tdtMapLayer, tdtMapAnno],
          title: 'Custom Basemap',
          id: 'myBasemap'
        })
      })
      this.viewerInstance = new obj.SceneView({
        // spatialReference: new obj.SpatialReference({ wkid: 4326 }),
        map: this.mapInstance,
        container: 'viewContainer',
        zoom: 6,
        center: [113, 32]
      })

      // 搜索工具
      var searchWidget = new obj.Search({ view: this.viewerInstance })
      this.viewerInstance.ui.add(searchWidget, 'top-right')
      // this.viewerInstance = new obj.MapView({
      //   map: this.mapInstance,
      //   container: 'viewContainer',
      //   zoom: 6,
      //   center: [113, 32]
      // })

      console.log(this.viewerInstance)
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
