<template>
  <div id="viewContainer" class="map">
    <div class="topbar">
      <button
        :class="pointClassName"
        id="distanceButton"
        type="button"
        title="Measure distance between two points"
        @click="setActiveWidget('distance')"
      ></button>
      <button
        :class="areaClassName"
        id="areaButton"
        type="button"
        title="Measure area"
        @click="setActiveWidget('area')"
      ></button>
    </div>
    <div class="topPosition">
      <button
        class="action-button"
        id="setPosition"
        type="button"
        title="定位"
        @click="setPosition()"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Map',
  data () {
    return {
      pointClassName: 'action-button esri-icon-minus',
      areaClassName: 'action-button esri-icon-polygon',
      load: null,
      viewer: null,
      viewConfig: {
        map: null,
        dimension: '3D', // 地图的维度
        container: 'viewContainer', // 地图容器
        scale: 110329633.40563367, // 3D视图下的比例尺
        zoom: 2, // 2D视图下的比例尺
        center: [114.606, 38.062071],
        graphics: null
      },
      // 切换的底图
      basemaps: null,
      activeWidget: null
    }
  },
  created () {
  },
  mounted () {
    this.viewConfig.zoom = this.zoomScaleExchange(this.viewConfig.scale)
    this.initMap()
    this.set3DMap()
  },
  methods: {
    /* 比例尺与放大级别转换 */
    zoomScaleExchange: function (value) {
      let exchangeInfo = [
        591657550.500000,
        295828775.300000,
        147914387.600000,
        73957193.820000,
        36978596.910000,
        18489298.450000,
        9244649.227000,
        4622324.614000,
        2311162.307000,
        1155581.153000,
        577790.576700,
        288895.288400,
        144447.644200,
        72223.822090,
        36111.911040,
        18055.955520,
        9027.977761,
        4513.988880,
        2256.994440,
        1128.497220
      ]
      if (value < 21) {
        return exchangeInfo[value - 1]
      } else {
        if (value > exchangeInfo[0]) {
          return 1
        } else if (value < 1128.497220) {
          return 20
        } else {
          for (let index = 0; index < exchangeInfo.length; index++) {
            if (exchangeInfo[index] < value) {
              return index - 1
            }
          }
        }
      }
    },
    // 加载Map
    initMap () {
      let _this = this
      // 加载模块
      _this.$esriLoader.loadModules([
        'esri/Map',
        'esri/Basemap',
        'esri/layers/WebTileLayer',
        'esri/layers/ElevationLayer',
        'esri/layers/BaseElevationLayer',
        'dojo/domReady!'
      ]).then(([Map, Basemap, WebTileLayer, ElevationLayer, BaseElevationLayer]) => {
        // 地图3D效果 (有点卡，先注释掉)
        // let ExaggeratedElevationLayer = BaseElevationLayer.createSubclass({
        //   properties: {
        //     // 定义拉伸系数100倍
        //     exaggeration: 30
        //   },
        //   // 在添加图层至map后，图层绘制前，会调用load()方法
        //   load: function () {
        //     this._elevation = new ElevationLayer({
        //       url: '//elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'
        //     })
        //     // 在解析load()之前等待高程图层加载
        //     this.addResolvingPromise(this._elevation.load())
        //   },
        //   // 获取view中可见的切片
        //   fetchTile: function (level, row, col) {
        //     return this._elevation.fetchTile(level, row, col).then(
        //       function (data) {
        //         // `data`包含tile的宽度（以像素为单位），tile的高度（以像素为单位）以及每个像素的值
        //         var exaggeration = this.exaggeration
        //         for (var i = 0; i < data.values.length; i++) {
        //           // values为高程信息，乘以拉伸系数后重新赋值
        //           data.values[i] = data.values[i] * exaggeration
        //         }
        //         return data
        //       }.bind(this)
        //     )
        //   }
        // })
        let tk = 'dfaa0a6f5e5645a9fcf1b449d326a883'
        let tiledLayer1 = new WebTileLayer({
          urlTemplate: 'https://{subDomain}.tianditu.com/DataServer?T=vec_w&tk=' + tk + '&x={col}&y={row}&l={level}',
          subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
        })
        let tiledAnno1 = new WebTileLayer({
          urlTemplate: 'https://{subDomain}.tianditu.com/DataServer?T=cva_w&tk=' + tk + '&x={col}&y={row}&l={level}',
          subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
        })

        let tiledLayer2 = new WebTileLayer({
          urlTemplate: 'https://{subDomain}.tianditu.com/DataServer?T=img_w&tk=' + tk + '&x={col}&y={row}&l={level}',
          subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
        })
        let tiledAnno2 = new WebTileLayer({
          urlTemplate: 'https://{subDomain}.tianditu.com/DataServer?T=cia_w&tk=' + tk + '&x={col}&y={row}&l={level}',
          subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
        })

        let tiledLayer3 = new WebTileLayer({
          urlTemplate: 'https://{subDomain}.tianditu.com/DataServer?T=ter_w&tk=' + tk + '&x={col}&y={row}&l={level}',
          subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
        })
        let tiledAnno3 = new WebTileLayer({
          urlTemplate: 'https://{subDomain}.tianditu.com/DataServer?T=cta_w&tk=' + tk + '&x={col}&y={row}&l={level}',
          subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
        })

        let customBasemap1 = new Basemap({
          baseLayers: [tiledLayer1, tiledAnno1],
          title: '天地图矢量底图',
          id: 'customBasemap1',
          thumbnailUrl: require('@/assets/img/basemap/vec_c.png')
        })
        let customBasemap2 = new Basemap({
          baseLayers: [tiledLayer2, tiledAnno2],
          title: '天地图影像底图',
          id: 'customBasemap2',
          thumbnailUrl: require('@/assets/img/basemap/img_c.png')
        })
        let customBasemap3 = new Basemap({
          baseLayers: [tiledLayer3, tiledAnno3],
          title: '天地图地形底图',
          id: 'customBasemap3',
          thumbnailUrl: require('@/assets/img/basemap/ter_c.png')
        })
        _this.basemaps = [customBasemap1, customBasemap2, customBasemap3]
        _this.viewConfig.map = new Map({
          basemap: customBasemap3
          // ,ground: {
          //   layers: [new ExaggeratedElevationLayer()]
          // }
        })
      }).catch((error) => {
        console.log(error.message)
      })
    },
    // 初始化组件
    initWidgets () {
      let _this = this
      // 加载模块
      _this.$esriLoader.loadModules([
        'esri/widgets/Search',
        'esri/widgets/BasemapGallery',
        'esri/widgets/Expand',
        'dojo/domReady!'
      ]).then(([Search, BasemapGallery, Expand]) => {
        // 底图切换
        let basemapGallery = new BasemapGallery({
          view: _this.viewer,
          container: document.createElement('div'),
          source: _this.basemaps
        })
        let bgExpand = new Expand({
          view: _this.viewer,
          content: basemapGallery
        })
        basemapGallery.watch('activeBasemap', function () {
          let mobileSize = _this.viewer.heightBreakpoint === 'xsmall' || _this.viewer.widthBreakpoint === 'xsmall'
          if (mobileSize) {
            bgExpand.collapse()
          }
        })
        _this.viewer.ui.add(bgExpand, { position: 'top-right' })

        // 搜索工具
        let searchWidget = new Search({ view: _this.viewer })
        _this.viewer.ui.add(searchWidget, 'top-right')
        // 二三维切换
        let dimensionButton = document.createElement('div')
        dimensionButton.className = 'esri-widget--button esri-widget esri-interactive'
        dimensionButton.innerHTML = _this.viewConfig.dimension === '3D' ? '2D' : '3D'
        _this.viewer.ui.add(dimensionButton, 'top-left')
        dimensionButton.addEventListener('click', function (e) {
          let dimension = e.target.innerHTML
          if (dimension === '2D') {
            _this.set2DMap()
            // e.target.innerHTML = '3D'
          } else {
            _this.set3DMap()
            // e.target.innerHTML = '2D'
          }
        })
      }).catch(error => console.log(error.message))
    },
    // 2D
    set2DMap () {
      this.viewConfig.dimension = '2D'
      this.$esriLoader.loadModules([
        'esri/views/MapView',
        'esri/core/watchUtils',
        'dojo/domReady!'
      ]).then(([MapView, watchUtils]) => {
        let _this = this
        _this.viewer = new MapView(this.viewConfig)
        _this.initWidgets()
        watchUtils.whenTrue(_this.viewer, 'stationary', function () {
          _this.viewConfig.center = [_this.viewer.center.longitude, _this.viewer.center.latitude]
          if (_this.viewer.viewpoint) {
            _this.viewConfig.scale = _this.viewer.viewpoint.scale
            _this.viewConfig.zoom = _this.zoomScaleExchange(_this.viewConfig.scale)
          }
        })
        // _this.viewConfig.graphics = _this.viewer.graphics
      }).catch(error => console.log(error.message))
    },
    // 3D
    set3DMap () {
      this.viewConfig.dimension = '3D'
      this.$esriLoader.loadModules([
        'esri/views/SceneView',
        'esri/core/watchUtils',
        'dojo/domReady!'
      ]).then(([SceneView, watchUtils]) => {
        let _this = this
        this.viewer = new SceneView(this.viewConfig)
        _this.initWidgets()
        console.log(this.viewer)
        watchUtils.whenTrue(_this.viewer, 'stationary', function () {
          _this.viewConfig.center = [_this.viewer.center.longitude, _this.viewer.center.latitude]
          if (_this.viewer.viewpoint) {
            _this.viewConfig.scale = _this.viewer.viewpoint.scale
            _this.viewConfig.zoom = _this.zoomScaleExchange(_this.viewConfig.scale)
          }
        })
        // _this.viewConfig.graphics = _this.viewer.graphics
      }).catch(error => {
        console.log(error.message)
      })
    },
    setActiveWidget (type) {
      let _this = this
      this.$esriLoader.loadModules([
        'esri/WebScene',
        'esri/views/SceneView',
        'esri/widgets/DirectLineMeasurement3D',
        'esri/widgets/AreaMeasurement3D'
      ]).then(([WebScene, SceneView, DirectLineMeasurement3D, AreaMeasurement3D]) => {
        _this.removeActiveWidget()
        switch (type) {
          case 'distance':
            if (_this.pointClassName.indexOf('active') === -1) {
              _this.activeWidget = new DirectLineMeasurement3D({
                view: _this.viewer
              })
              _this.activeWidget.viewModel.newMeasurement()
              _this.viewer.ui.add(_this.activeWidget, 'top-right')
              _this.pointClassName = 'action-button esri-icon-minus active'
              _this.areaClassName = 'action-button esri-icon-polygon'
            } else {
              _this.pointClassName = 'action-button esri-icon-minus'
              _this.areaClassName = 'action-button esri-icon-polygon'
            }
            break
          case 'area':
            if (_this.areaClassName.indexOf('active') === -1) {
              _this.activeWidget = new AreaMeasurement3D({
                view: _this.viewer
              })
              // skip the initial 'new measurement' button
              _this.activeWidget.viewModel.newMeasurement()
              _this.viewer.ui.add(_this.activeWidget, 'top-right')
              _this.areaClassName = 'action-button esri-icon-polygon active'
              _this.pointClassName = 'action-button esri-icon-minus'
            } else {
              _this.areaClassName = 'action-button esri-icon-polygon'
              _this.pointClassName = 'action-button esri-icon-minus'
            }
            break
          default:
            break
        }
      })
    },
    removeActiveWidget () {
      if (this.activeWidget) {
        this.viewer.ui.remove(this.activeWidget)
        this.activeWidget.destroy()
        this.activeWidget = null
      }
    },
    setPosition () {
      let _this = this
      this.viewer.goTo({
        position: {
          x: 121.4,
          y: 20,
          z: 700000
        },
        heading: 0,
        tilt: 60
      }, {
        speedFactor: 0.3,
        easing: _this.customEasing
      })
    },
    customEasing (t) {
      return 1 - Math.abs(Math.sin(-1.7 + t * 4.5 * Math.PI)) * Math.pow(
        0.5, t * 10)
    }
  }
}
</script>

<style>
  #viewContainer .esri-view-root .esri-ui .esri-ui-corner-container .esri-ui-top-left {
    top: 5% !important;
  }
</style>

<style scoped>
  .map {
    width: 100%;
    height: 100%;
    background-color: #666;
  }

  .topPosition {
    background: #fff;
    padding: 10px;
    position: fixed;
    right: 100px;
    top: 200px;
  }

  .topbar {
    background: #fff;
    padding: 10px;
    position: fixed;
    right: 0;
    top: 200px;
  }

  .action-button {
    font-size: 16px;
    background-color: transparent;
    border: 1px solid #d3d3d3;
    color: #6e6e6e;
    height: 32px;
    width: 32px;
    text-align: center;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
  }

  .action-button:hover,
  .action-button:focus {
    background: #0079c1;
    color: #e4e4e4;
  }

  .active {
    background: #0079c1;
    color: #e4e4e4;
  }
</style>
