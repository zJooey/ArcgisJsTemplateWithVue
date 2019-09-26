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
  created () {},
  mounted () {
    this.initBaseMap()
  },
  methods: {
    initBaseMap () {
      // 加载模块
      this.$esriLoader.loadModules([
        'esri/Map',
        'esri/views/SceneView',
        'esri/Basemap',
        'dojo/_base/lang',
        'esri/layers/WebTileLayer',
        'esri/geometry/SpatialReference',
        'esri/geometry/Extent',
        'esri/layers/support/TileInfo'
      ])
        .then(this.loading)
        .then(obj => {
          this.initMap(obj)
        })
        .catch((error) => {
          console.log(error.message)
        })
    },
    loading ([Map, SceneView, Basemap, lang, WebTileLayer, SpatialReference, Extent, TileInfo]) {
      let TDT = WebTileLayer.createSubclass({
        declaredClass: 'TDT',
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
           * @param typeMatrixSet
           */
        constructor (mapTypeName, typeMatrixSet) {
          if (!typeMatrixSet) typeMatrixSet = 'c'
          let cornerCoordinate = 20037508.3427892
          this.spatialReference = typeMatrixSet === 'w' ? new SpatialReference({ wkid: 102100 }) : new SpatialReference({ wkid: 4326 })
          this.extent = typeMatrixSet === 'w' ? new Extent(-cornerCoordinate, -cornerCoordinate, cornerCoordinate, cornerCoordinate, this.spatialReference) : new Extent(-180, -90, 180, 90, this.spatialReference)

          this._mapTypeName = mapTypeName
          this._typeMatrixSet = typeMatrixSet
          // 定义切片信息
          // this.tileInfo = new TileInfo({
          //   'rows': 256,
          //   'cols': 256,
          //   'compressionQuality': 0,
          //   'origin': {
          //     'x': -180,
          //     'y': 90
          //   },
          //   'spatialReference': {
          //     'wkid': 4326
          //   },
          //   'lods': [
          //     { 'level': 2, 'resolution': 0.3515625, 'scale': 147748796.52937502 },
          //     { 'level': 3, 'resolution': 0.17578125, 'scale': 73874398.264687508 },
          //     { 'level': 4, 'resolution': 0.087890625, 'scale': 36937199.132343754 },
          //     { 'level': 5, 'resolution': 0.0439453125, 'scale': 18468599.566171877 },
          //     { 'level': 6, 'resolution': 0.02197265625, 'scale': 9234299.7830859385 },
          //     { 'level': 7, 'resolution': 0.010986328125, 'scale': 4617149.8915429693 },
          //     { 'level': 8, 'resolution': 0.0054931640625, 'scale': 2308574.9457714846 },
          //     { 'level': 9, 'resolution': 0.00274658203125, 'scale': 1154287.4728857423 },
          //     { 'level': 10, 'resolution': 0.001373291015625, 'scale': 577143.73644287116 },
          //     { 'level': 11, 'resolution': 0.0006866455078125, 'scale': 288571.86822143558 },
          //     { 'level': 12, 'resolution': 0.00034332275390625, 'scale': 144285.93411071779 },
          //     { 'level': 13, 'resolution': 0.000171661376953125, 'scale': 72142.967055358895 },
          //     { 'level': 14, 'resolution': 8.58306884765625e-005, 'scale': 36071.483527679447 },
          //     { 'level': 15, 'resolution': 4.291534423828125e-005, 'scale': 18035.741763839724 },
          //     { 'level': 16, 'resolution': 2.1457672119140625e-005, 'scale': 9017.8708819198619 },
          //     { 'level': 17, 'resolution': 1.0728836059570313e-005, 'scale': 4508.9354409599309 },
          //     { 'level': 18, 'resolution': 5.3644180297851563e-006, 'scale': 2254.4677204799655 }
          //   ]
          // })
        },
        getDefaults: function () {
          return lang.mixin(this.inherited(arguments), {
            fullExtent: this.extent,
            tileInfo: new TileInfo({
              rows: 256,
              cols: 256,
              dpi: 90.71428571428571,
              format: 'PNG8',
              compressionQuality: 0,
              origin: this._typeMatrixSet === 'w' ? { 'x': -20037508.342787, 'y': 20037508.342787 } : {
                'x': -180,
                'y': 90
              },
              spatialReference: this.spatialReference,
              lods: this._typeMatrixSet === 'w' ? [
                { 'level': 1, 'resolution': 78271.51696402048, 'scale': 2.958293554545656E8 },
                { 'level': 2, 'resolution': 39135.75848201024, 'scale': 1.479146777272828E8 },
                { 'level': 3, 'resolution': 19567.87924100512, 'scale': 7.39573388636414E7 },
                { 'level': 4, 'resolution': 9783.93962050256, 'scale': 3.69786694318207E7 },
                { 'level': 5, 'resolution': 4891.96981025128, 'scale': 1.848933471591035E7 },
                { 'level': 6, 'resolution': 2445.98490512564, 'scale': 9244667.357955175 },
                { 'level': 7, 'resolution': 1222.99245256282, 'scale': 4622333.678977588 },
                { 'level': 8, 'resolution': 611.49622628141, 'scale': 2311166.839488794 },
                { 'level': 9, 'resolution': 305.748113140705, 'scale': 1155583.419744397 },
                { 'level': 10, 'resolution': 152.8740565703525, 'scale': 577791.7098721985 },
                { 'level': 11, 'resolution': 76.43702828517625, 'scale': 288895.85493609926 },
                { 'level': 12, 'resolution': 38.21851414258813, 'scale': 144447.92746804963 },
                { 'level': 13, 'resolution': 19.109257071294063, 'scale': 72223.96373402482 },
                { 'level': 14, 'resolution': 9.554628535647032, 'scale': 36111.98186701241 },
                { 'level': 15, 'resolution': 4.777314267823516, 'scale': 18055.990933506204 },
                { 'level': 16, 'resolution': 2.388657133911758, 'scale': 9027.995466753102 },
                { 'level': 17, 'resolution': 1.194328566955879, 'scale': 4513.997733376551 },
                { 'level': 18, 'resolution': 0.5971642834779395, 'scale': 2256.998866688275 },
                { 'level': 19, 'resolution': 0.2985821417389698, 'scale': 1128.499433344138 },
                { 'level': 20, 'resolution': 0.1492910708694849, 'scale': 564.2497166720688 }
              ] : [
                { 'level': 1, 'resolution': 0.7031249999891485, 'scale': 2.958293554545656E8 },
                { 'level': 2, 'resolution': 0.35156249999999994, 'scale': 1.479146777272828E8 },
                { 'level': 3, 'resolution': 0.17578124999999997, 'scale': 7.39573388636414E7 },
                { 'level': 4, 'resolution': 0.08789062500000014, 'scale': 3.69786694318207E7 },
                { 'level': 5, 'resolution': 0.04394531250000007, 'scale': 1.848933471591035E7 },
                { 'level': 6, 'resolution': 0.021972656250000007, 'scale': 9244667.357955175 },
                { 'level': 7, 'resolution': 0.01098632812500002, 'scale': 4622333.678977588 },
                { 'level': 8, 'resolution': 0.00549316406250001, 'scale': 2311166.839488794 },
                { 'level': 9, 'resolution': 0.0027465820312500017, 'scale': 1155583.419744397 },
                { 'level': 10, 'resolution': 0.0013732910156250009, 'scale': 577791.7098721985 },
                { 'level': 11, 'resolution': 0.000686645507812499, 'scale': 288895.85493609926 },
                { 'level': 12, 'resolution': 0.0003433227539062495, 'scale': 144447.92746804963 },
                { 'level': 13, 'resolution': 0.00017166137695312503, 'scale': 72223.96373402482 },
                { 'level': 14, 'resolution': 0.00008583068847656251, 'scale': 36111.98186701241 },
                { 'level': 15, 'resolution': 0.000042915344238281406, 'scale': 18055.990933506204 },
                { 'level': 16, 'resolution': 0.000021457672119140645, 'scale': 9027.995466753102 },
                { 'level': 17, 'resolution': 0.000010728836059570307, 'scale': 4513.997733376551 },
                { 'level': 18, 'resolution': 0.000005364418029785169, 'scale': 2256.998866688275 },
                { 'level': 19, 'resolution': 2.68220901485e-6, 'scale': 1128.499433344138 },
                { 'level': 20, 'resolution': 1.341104507425e-6, 'scale': 564.2497166720688 }
              ]
            })
          })
        },
        getTileUrl: function (level, row, col) {
          let tk = 'dfaa0a6f5e5645a9fcf1b449d326a883'
          return 'https://t' + col % 8 + '.tianditu.com/DataServer?T=' + this._mapTypeName + '_' + this._typeMatrixSet + '&tk=' + tk + '&x=' + col + '&y=' + row + '&l=' + level
        }
      })
      return { Map, SceneView, Basemap, lang, WebTileLayer, SpatialReference, Extent, TileInfo, TDT }
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
      let tdtMapLayer = new obj.TDT('ter', 'c')
      let tdtMapAnno = new obj.TDT('cta', 'c')
      this.mapInstance = new obj.Map({
        basemap: new obj.Basemap({
          baseLayers: [tdtMapLayer, tdtMapAnno],
          title: 'Custom Basemap',
          id: 'myBasemap'
        }),
        ground: 'world-elevation'
      })
      this.viewerInstance = new obj.SceneView({
        map: this.mapInstance,
        container: 'viewContainer',
        zoom: 6,
        center: [113, 32]
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
