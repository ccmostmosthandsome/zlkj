<template>
  <!-- @click="sidebarTab = false -->
  <div id="map3d" oncontextmenu="return false">
    <!-- @showTab="updateTab" :tab="sidebarTab" -->
    <cesium-sidebar :class="['cesium-sidebar', {'hide': isFly || slide || textPopup}]" @light="shadowHandle" :tilesetObj="tilesetObj"></cesium-sidebar>
    <div v-show="isFly" class="flyLinebtn-box">
      <button v-if="play" @click.stop="stopHandle()">
        <span>暂停</span>
      </button>
      <button v-else @click.stop="playHandle(locItem)">
        <span>播放</span>
      </button>
      <button @click.stop="endHandle(locItem)">
        <span>结束</span>
      </button>
    </div>

    <!-- 单体化属性设置窗口 -->
    <div v-show="dthEdit" class="dth-container">
      <div class="dth-top">
        <input type="text" id="titInput" placeholder="单体名称" v-model="addDthTitle">
        <div class="color-picker-box btn" :style="{'backgroundColor': currentDthColor}">
          <span>选择一种颜色</span>
          <input type="color" value="#00c1de" class="color-input" @change="pickColor" />
        </div>
      </div>
      <div class="dth-center">
        <div class="content">
          <table>
            <tbody>
              <tr v-for="(item, index) in dthProps">
                <td>{{item.name}}</td>
                <td>{{item.value}}</td>
                <td><span class="dthProp-del" @click="dthPropDel(item, index)">删除</span></td>
              </tr>
              <tr class="input-tr">
                <td>
                  <input type="text" class="propInput" placeholder="属性名" v-model="addDthName">
                </td>
                <td>
                  <input type="text" class="propInput" placeholder="属性值" v-model="addDthValue">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="dth-bottom">
        <button class="btn confirm" @click="confirm">
          <span>确定</span>
        </button>
        <button class="btn cancle" @click="cancle">
          <span>取消</span>
        </button>
      </div>
    </div>
    <!-- 单体化属性设置窗口结束 -->
    
    <!-- 弹窗 -->
    <div v-if="popup" class="popup">
      <div class="mask" @click="maskHandle"></div>
      <!-- 幻灯片 -->
      <!-- 标注图片视频弹窗 -->
      <div v-if="slide" class="slide-container">
        <div class="slide-main">
          <img v-if="iconType==='pic'" :src="currentSlide">
          <video v-else-if="iconType==='vid'" :src="currentSlide" autoplay controls>
            <source>
              您的浏览器不支持
          </video>
        </div>
        <div class="slide-bottom">
          <div class="arrow-left" @click="leftHandle">＜</div>
          <div class="arrow-right" @click="rightHandle">＞</div>
          <ul :class="['carousel', {'show': index===currentCarouselIndex}]" v-for="(item, index) in files" :key="item.id" @click="itemClick(item, $event)">
            <div v-if="iconType==='pic'" class="img-box">
              <img  v-for="(it, index) in item" :key="it.id" :src="it" :data-index="index">
            </div>
            <div v-else-if="iconType==='vid'" class="video-box">
              <video v-for="(it, index) in item" :key="it.id" :data-index="index" autoplay loop muted>
                <source :src="it">
                  您的浏览器不支持
              </video>
            </div>
          </ul>
        </div>
      </div>
      <!-- 标注描述弹窗 -->
      <div v-else-if="textPopup" class="textPopup-container">
        <div class="textPopup-main">{{discription}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Cesium from 'cesium/Cesium'
// import buildModuleUrl from "cesium/Core/buildModuleUrl"
import 'cesium/Widgets/widgets.css'
import CesiumSidebar from '@/components/CesiumSidebar/index.vue'
// import buildModuleUrl from "cesium/Core/buildModuleUrl"
import Bus from '@/utils/bus.js'
import { mapGetters } from  'vuex'
import { flyTo } from '@/utils/camera.js'
import { postRender } from '@/utils/dth.js'

export default {
  components: {
    CesiumSidebar
  },
  name: 'map3d',
  data () {
    return {
      currentDthColor: '#00c1de',
      currentDthOrder: null,
      currentDth: null, //当前单体化实体
      addDthName: null,
      addDthValue: null,
      addDthTitle: null,
      addDthColor: '#00c1de', //选择的颜色
      // tempColor: '#00c1de', //单体化选择颜色时未按确定的颜色
      // 测试数据
      dthProps: [
        // {
        //   name: '金茂大厦', value: '88层'
        // }, {
        //   name: '开啤酒瓶', value: '上海世贸中心'
        // }
      ],
      dthEdit: false,
      tilesetObj: null, //定位用
      isFly: false,
      play: true,
      // url: '/b3dm/qiushuiGC3dtile/tileset.json',//'../dachen/tileset.json'
      // url: 'http://192.168.1.169/Cesium-lab/qiushuiGC3dtile/tileset.json',
      url: '/b3dm/dachen/tileset.json',
      // sidebarTab: null,
      locItem: null,                       //操控的那一条航线
      locStopTime: null,                   //暂停时间
      time: [],
      currentLength: 0,
      timeDifferenceAll: 0,
      nodeTimeDifference: null,
      popup: false,
      slide: false,
      textPopup: false,                     //文本描述弹窗
      discription: null,                    //描述信息
      currentSlide: null,                   //幻灯片
      files: null,                          //用户上传的文件（图片，视频等）
      currentCarouselIndex: 0,
      iconType: null
      // url: require('@/b3dm/dachen/tileset.json'),
    }
  },
  computed: mapGetters(['viewer', 'startTime', 'stopTime', 'timeDifferenceA', 'flyComplete', 'billboards', 'icons', 'czml', 'czmlStream']),
  mounted () {
    // 单体化编辑弹窗
    Bus.$on('dthEdit', (b, entity, order, color) => {

      // this.tempColor = color 

      this.currentDthColor = color //对应单体化颜色的按钮颜色(包括选择颜色之后未确定)

      this.addDthColor = color //修改确定后的颜色

      this.currentDthOrder = order

      this.dthEdit = b
      
      this.currentDth = entity

      if (entity.properties && entity.properties._propertyNames.length > 0) {

        let keyArr = []

        // 属性名(key)数组
        for (let i=0; i<entity.properties._propertyNames.length; i++) {

          keyArr.push(entity.properties._propertyNames[i])
        }
        
        this.dthProps = []
        // 通过遍历key数组得到value，拼接成键值对象
        keyArr.forEach((item) => {

          let propItem = { name: item, value: entity.properties[`_${item}`]._value }

          this.dthProps.push(propItem)
        })
      } else {

        this.dthProps = []
      }
    })
    // 飞行控制台
    Bus.$on('showPlayConsole', (item, b) => {
      console.log(item)
      // 接收子组件（fxll.vue）上传的航线item数据（通过camera.js中的flyTo函数触发）,存储到该组件中，用于该组件播放按钮的实现
      this.locItem = item
      // 开始飞行,侧边栏消失,显示按钮控制台
      this.isFly = true
      // 开始飞行,按钮变暂停
      this.play = b
    })
    // 飞行完成
    Bus.$on('flyComplete', (b) => {

      // 飞行完毕按钮变播放
      this.play = !b

      // this.locFlyComplete = b
      this.$store.state.camera.flyComplete = b

      this.time = []
    })
    // 每个飞行节点飞完 
    Bus.$on('flyCompleteNode', (time) => {

      this.time.push(time)

      if (this.currentLength !== this.time.length) {

        this.currentLength = this.time.length
      }

      this.timeDifferenceAll = 0
    })
    // 标注-幻灯片弹窗底部的滑动ul
    Bus.$on('slide', (files, index, b, iconType) => {

      this.popup = b

      this.iconType = iconType
      // index = index ? index : 0

      if (iconType === 'txt') {

        this.slide = false

        this.textPopup = b

        this.discription = files

      } else {

        this.textPopup = false

        this.slide = b

        this.currentSlide = files[index]

        // 生成一个幻灯片数组【【】，【】】
        let newFileArr = []

        let group = []

        files.forEach((item, index) => {

          group.push(item)

          if ((index + 1) % 5 === 0) {

            newFileArr.push(group)

            group = []
          } else if (index === (files.length-1)) {

            newFileArr.push(group)
          }
        })

        this.files = newFileArr

        // 该组文件（ul）的索引
        let groupIndex = Math.floor(index / 5)

        this.currentCarouselIndex = groupIndex
      }
    })
    //设置静态资源目录
    // buildModuleUrl.setBaseUrl('/static/dachen/tileset.json')

    // Grant your CesiumJS app access to your ion assets
    // This is your actual default access token, you can copy/paste this directly into your app code
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NGUyM2I3Yy1mODlmLTQyOTQtYmE3NC1mNjRiZmNkZjdmMWYiLCJpZCI6MzkzOCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTUzOTMwOTMxMX0.Cqw6otbTVB9kGtsshu_iCTZYnpKUUMOcXASmZ2x36pU';

     //设置静态资源目录
    const viewer = new Cesium.Viewer('map3d', {
      // geocoder: false,
      // homeButton: false,
      // navigationHelpButton: false,
      // sceneModePicker: false, //地球平铺 网格  3d/2d选择器
      fullscreenButton: false,
      // vrButton: false,
      infoBox: false, //是否显示点击要素之后显示的信息 提示信息tip
      // scene3DOnly: false
      baseLayerPicker: false,
      geocoder: false, //是否显示地名查找控件（搜索）
      homeButton: false, //主页 地球回正
      timeline: true, //是否显示时间线控件（时间轴）
      navigationHelpButton: false, //是否显示帮助信息控件(右上角的帮助按钮)
      animation: false, //是否显示动画控件(左下方仪表)
      sceneModePicker: false, //是否显示投影方式控件
      selectionIndicator: false,
      shadows: false, //阴影
      // terrainShadows: Cesium.ShadowMode.ENABLED,
      shouldAnimate: true,
      baseLayerPicker: false, //Hide the base layer picker图层选择器
      // // 通过初始化方式加载Arcgis提供的全球底图
      // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
      //   url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
      // }),
      // imageryProvider: new Cesium.SingleTileImageryProvider({         
      //   url: 'src/img/worldimage.jpg'
      //   // url: require('@/assets/worldimage.jpg')
      // })  //当 baseLayerPicker 为false时才有效
      // imageryProvider: Cesium.createWorldImagery(), // use the Bing Maps Aerial imagery from ion (this is the default)
      // terrainProvider: Cesium.createWorldTerrain(), // use the Cesium World Terrain from ion   
      // terrainProvider: new Cesium.CesiumTerrainProvider({
      //   url: Cesium.IonResource.fromAssetId(1)
      // })                                
    })

    // 保存viewer对象
    this.$store.state.map3d.viewer = viewer
    
    //检测地形，地形以下不显示
    viewer.scene.globe.depthTestAgainstTerrain = true

    // 版权清理 去版权信息
    // viewer.cesiumWidget.creditContainer.style.display = "none"
    viewer._cesiumWidget._creditContainer.style.display = "none"
    viewer.imageryLayers.removeAll() //optional
    
    // var terrainLayer = new Cesium.CesiumTerrainProvider({
    // // url: "http://assets02.agi.com/stk-terrain/v1/tilesets/world/tiles"
    // // url: "https://assets02.agi.com/stk-terrain/world"
    //   url: "https://cesiumjs.org/data-and-assets/terrain/stk-world-terrain/"
    // // url: ''
    // //url: "../terrain_tiles/"
    // });

    // viewer.terrainProvider = terrainLayer

    // // Creates a CesiumTerrainProvider instance for the Cesium World Terrain.
    // viewer.terrainProvider = Cesium.createWorldTerrain({
    //   // requestWaterMask: true,
    //   requestVertexNormals: true
    // })
    //设置初始位置
    viewer.camera.setView({

      destination: Cesium.Cartesian3.fromDegrees(110.20, 34.55, 300000000)
    })

    viewer.terrainProvider = new Cesium.CesiumTerrainProvider({

      url: Cesium.IonResource.fromAssetId(1)
    })

    // viewer.imageryLayers.addImageryProvider(

    //   new Cesium.IonImageryProvider({ assetId: 2 })
    // )
    var tianditu01 = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        url: 'http://mt0.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}',
        // url: '',
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        minimumLevel: 1,
        maximumLevel: 20,
        credit: 'http://www.bjxbsj.cn'
    }), {
        show: true
    })

    viewer.imageryLayers.add(tianditu01)
    
    // var gaode = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
    //     url: 'http://www.google.cn/maps/vt?lyrs=s@716&x={x}&y={y}&z={z}',
    //     // url: '',
    //     tilingScheme: new Cesium.WebMercatorTilingScheme(),
    //     minimumLevel: 1,
    //     maximumLevel: 20,
    //     credit: 'http://www.bjxbsj.cn'
    //   }), {
    //     show: true
    //   }
    // )

    // viewer.imageryLayers.add(gaode)

    // let longitude = 115.85485

    // let latitude = 28.68708

    let longitude = 118.58847000000006

    let latitude = 28.82287

    let height = 0

    let heading = 0

    // viewer.camera.flyTo({
    //   destination :  Cesium.Cartesian3.fromDegrees(longitude, latitude, 1500.0), // 设置位置
    //   orientation: {
    //     heading : Cesium.Math.toRadians(20.0), // 方向
    //     pitch : Cesium.Math.toRadians(-90.0),// 倾斜角度
    //     roll : 0
    //   },
    //   duration:3, // 设置飞行持续时间，默认会根据距离来计算
    //   // complete: function () {
    //   //   // 到达位置后执行的回调函数
    //   //   console.log('到达目的地1')
    //   //   viewer.camera.flyTo({
    //   //     destination :  Cesium.Cartesian3.fromDegrees(117.47394279623406,24.58200192570716, 15000.0)
    //       // complete: function () {
    //       //   console.log('到达目的地2')
    //       //   viewer.camera.flyTo({
    //       //     destination :  Cesium.Cartesian3.fromDegrees(118.58847000000006,28.82287, 1500.0),
    //       //     complete: function () {
    //       //       console.log('到达目的地3')
    //       //     }
    //       //   })
    //       // }
    //     // })
    //   // },
    //   cancle: function () {
    //     // 如果取消飞行则会调用此函数
    //     console.log('飞行取消')
    //   },
    //   pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
    //   maximumHeight:5000, // 相机最大飞行高度
    //   flyOverLongitude: 100, // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度
    // })

    this.tilesetObj = new Cesium.Cesium3DTileset({
      // url: 'https://vectortiles.geo.admin.ch/ch.swisstopo.swisstlm3d.3d/20161217/tileset.json'
      url: this.url
    })

    var tileset = viewer.scene.primitives.add(this.tilesetObj)


    tileset.readyPromise.then(function(tileset) {

        var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
        var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position)
        var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading)))
        Cesium.Matrix4.multiply(mat, rotationX, mat)
        tileset._root.transform = mat
        // viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0))
        // viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        viewer.camera.flyToBoundingSphere(tileset.boundingSphere)
        viewer.camera.flyTo({
           destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height + 1500),
           duration: 2
        })

        // viewer.camera.flyTo({
        //   destination :  Cesium.Cartesian3.fromDegrees(longitude, latitude, 1500.0), // 设置位置
        //   orientation: {
        //     heading : Cesium.Math.toRadians(20.0), // 方向
        //     pitch : Cesium.Math.toRadians(-90.0),// 倾斜角度
        //     roll : 0
        //   },
        //   duration:3, // 设置飞行持续时间，默认会根据距离来计算
        //   // complete: function () {
        //   //   // 到达位置后执行的回调函数
        //   //   console.log('到达目的地1')
        //   //   viewer.camera.flyTo({
        //   //     destination :  Cesium.Cartesian3.fromDegrees(117.47394279623406,24.58200192570716, 15000.0)
        //       // complete: function () {
        //       //   console.log('到达目的地2')
        //       //   viewer.camera.flyTo({
        //       //     destination :  Cesium.Cartesian3.fromDegrees(118.58847000000006,28.82287, 1500.0),
        //       //     complete: function () {
        //       //       console.log('到达目的地3')
        //       //     }
        //       //   })
        //       // }
        //     // })
        //   // },
        //   cancle: function () {
        //     // 如果取消飞行则会调用此函数
        //     console.log('飞行取消')
        //   },
        //   pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
        //   maximumHeight:5000, // 相机最大飞行高度
        //   flyOverLongitude: 100, // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度
        // })
      }
    )

    // var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    // Cesium.Cartesian3.fromDegrees(115.85488160445384,28.685241262376074,17.862242773842393));
    // var model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
    //     url: 'static/QSGC.gltf',
    //     modelMatrix : modelMatrix,
    //     scale : 1.0
    // }))


    // let vehicleEntity

    // // Add a blank CzmlDataSource to hold our multi-part entity/entities.
    // let dataSourceEmt = new Cesium.CzmlDataSource()

    // viewer.dataSources.add(dataSourceEmt)

    // // shows how a single path can be broken up into several CZML streams.
    // let partsToLoad = [{
    //     url: this.czmlStream[0],
    //     range: [0, 1500],
    //     requested: false,
    //     loaded: false
    // }, {
    //     url: this.czmlStream[1],
    //     range: [1500, 3000],
    //     requested: false,
    //     loaded: false
    // }, {
    //     url: this.czmlStream[2],
    //     range: [3000, 4500],
    //     requested: false,
    //     loaded: false
    // }]


    // // Helper function to mark a part as requested, and process it into the dataSourceEmt.
    // function processPart(part) {
    //   console.log('请求加载')
    //     part.requested = true
    //     // updateStatusDisplay()
    //     dataSourceEmt.process(part.url).then(function() {
    //       console.log('加载完成')
    //         part.loaded = true
    //         // updateStatusDisplay()

    //         // Follow the vehicle with the camera.
    //         if (!viewer.trackedEntity) {
    //             console.log('摄像机跟随')
    //             viewer.trackedEntity = vehicleEntity = dataSourceEmt.entities.getById('aircraft')
    //         }
    //     })
    // }
    // // Load the first part up front.
    // processPart(partsToLoad[0])


    // // Load a new section before the clock naturally gets there.
    // // Note this can't predict when a user may fast-forward to it.
    // var preloadTimeInSeconds = 100

    // viewer.clock.onTick.addEventListener(function(clock) {
    //     // This example uses time offsets from the start to identify which parts need loading.
    //     let timeOffset = Cesium.JulianDate.secondsDifference(clock.currentTime, clock.startTime)
    //     // console.log(timeOffset)
    //     // Filter the list of parts to just the ones that need loading right now.
    //     // Then, process each part that needs loading.

    //     partsToLoad.filter(function(part) {

    //         return (!part.requested) &&
    //             (timeOffset >= part.range[0] - preloadTimeInSeconds) &&
    //             (timeOffset <= part.range[1])
    //     }).forEach(function(part) {
    //       console.log('加载完成一段')
    //         processPart(part)
    //     })
    // })

    // 从数据库获取标注数据，存到仓储，地图上添加标注

    // if (this.czml[1]) {

    //   let dataSourcePromise = Cesium.CzmlDataSource.load(this.czml)


    //   // viewer.dataSources.add(dataSourcePromise)

    //   // let promise = Cesium.CzmlDataSource.load(czml)

    //   dataSourcePromise.then(function(dataSource) {

    //     viewer.dataSources.add(dataSource)
    //     // 获取或设置摄像头当前正在跟踪的Entity实例。
    //     // viewer.trackedEntity = dataSource.entities.getById('model')
        

    //     //Get the array of entities
    //     // console.log(viewer.dataSources._dataSources[0].entities.values)

    //     let entities = dataSource.entities.values
   
    //     for (let i = 0; i < entities.length; i++) {
    //       //loop through all entities to get data
    //         let entity = entities[i]
    //         let lab_ = entity.label
    //         let bill_ = entity.billboard
    //         let model_ = entity.model
    //       if (lab_) {

    //         entity.label.scaleByDistance = new Cesium.NearFarScalar(500,1.0,50000,0.0)
    //       }

    //       if (bill_) {

    //         entity.billboard.scaleByDistance = new Cesium.NearFarScalar(500,1.0,50000,0.0)

    //         entity.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY
    //       }

    //       if (model_) {

    //         let position=Cesium.Cartesian3.fromDegrees(115.85488160445384,28.685241262376074,18.862242773842393)

    //         let pitch = 0

    //         let roll = 0

    //         let headinggltf = Math.PI*0.68

    //         let hpr = new Cesium.HeadingPitchRoll(headinggltf, pitch, roll)

    //         let orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr)

    //         entity.orientation=orientation

    //         console.log(entity)

    //         console.log(orientation)
    //       }
    //     }
    //   })

    //   viewer.zoomTo(dataSourcePromise)
    // }
    
    // if (this.billboards) {

    //   // let pinBuilder = new this.cesium.PinBuilder()

    //   this.billboards.forEach((item, index) => {

    //     item.pin = this.viewer.entities.add({
    //       name: 'Question mark',
    //       position: this.cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.height),
    //       label : {
    //         text : item.title,
    //         font : '20px Helvetica',
    //         // heightReference: this.cesium.HeightReference.CLAMP_TO_GROUND,
    //         disableDepthTestDistance: 10000,
    //         // disableDepthTestDistance : Number.POSITIVE_INFINITY, // draws the label in front of terrain
    //         scaleByDistance : new this.cesium.NearFarScalar(1.0e2, 1.0, 1.5e3, 0.5),
    //         translucencyByDistance : new this.cesium.NearFarScalar(1.0e2, 1.0, 1.5e4, 0.0),
    //         // font : '14pt sans-serif',
    //         // horizontalOrigin : this.cesium.HorizontalOrigin.LEFT,
    //         verticalOrigin : this.cesium.VerticalOrigin.BOTTOM
    //         // fillColor : this.cesium.Color.BLACK,
    //         // showBackground : true,
    //         // backgroundColor : new this.cesium.Color(1, 1, 1, 0.7),
    //         // backgroundPadding : new this.cesium.Cartesian2(8, 4)
    //       },
    //       billboard: {
    //         // image: pinBuilder.fromText('阿', this.cesium.Color.BLACK, 48).toDataURL(),
    //         image: this.icons[item.iconType],
    //         // img: pinBuilder.fromUrl(url, this.cesium.Color.BLACK, 48),
    //         // horizontalOrigin : this.cesium.HorizontalOrigin.RIGHT,
    //         verticalOrigin: this.cesium.VerticalOrigin.TOP,
    //         disableDepthTestDistance: 10000,
    //         scaleByDistance : new this.cesium.NearFarScalar(1.0e2, 1.0, 1.5e3, 0.5), //scale by viewer distance
    //         // heightReference: this.cesium.HeightReference.RELATIVE_TO_GROUND,//适应地形
    //         translucencyByDistance: new this.cesium.NearFarScalar(1.0e2, 1, 1.5e4, 0)//根据相机距离设置透明度
    //       }
    //     })

    //     //Since some of the pins are created asynchronously, wait for them all to load before zooming/
    //     this.cesium.when.all([item.pin], function (pins) {

    //       this.viewer.zoomTo(this.viewer.entities)
    //     })
    //   })
    // }

    postRender(viewer, this.addDthColor) //单体化以及属性气泡

    // 下周演示用,用完删除---------------------------------------------------------------------------------------------------------------
    let timelineContainer = document.querySelector('.cesium-viewer-timelineContainer')
    timelineContainer.style.opacity = 0
    timelineContainer.style.visibility = 'hidden'
    timelineContainer.style.width = '90%'
    timelineContainer.style.left = 50 + 'px'
  },
  destroyed () {
    
    Bus.$off(['dthEdit', 'showPlayConsole', 'flyComplete', 'flyCompleteNode', 'slide'])
  },
  methods: {
    // 飞行控制台上的开始飞行按键
    playHandle (item) {

      if (item.position.length <= 1) {

        alert('两点成一条航线')

        return false
      }

      this.play = !this.play

      let that = this

      flyTo(this.locItem, that, this.timeDifferenceAll, 1, this.flyComplete)
      
      this.$store.state.camera.startTime = Date.now()
    },
    // 飞行暂停
    stopHandle () {

      this.play = !this.play

      this.viewer.camera.cancelFlight()

      this.$store.state.camera.flyComplete = false

      // 在多次暂停开始后，保证总飞行持续时间不变
      this.locStopTime = Date.now()

      if (!this.time.length) {

        console.log('未到任何地点')

        this.$store.state.camera.timeDifferenceA = this.locStopTime - this.startTime

        this.timeDifferenceAll += this.timeDifferenceA

      } else {

        console.log('进来')

        if (this.currentLength === this.time.length) {

          console.log('进来进来')

          console.log(this.locStopTime, this.time[this.time.length - 1])

          this.nodeTimeDifference = this.locStopTime - this.time[this.time.length - 1]

          this.timeDifferenceAll = this.nodeTimeDifference

          ++ this.currentLength

          console.log(this.currentLength, this.time.length, this.nodeTimeDifference)

        } else {

          this.$store.state.camera.timeDifferenceA = this.locStopTime - this.startTime
          
          this.timeDifferenceAll += this.timeDifferenceA
        }
      }
    },
    // 飞行结束
    endHandle (item) {

      this.viewer.camera.cancelFlight()

      this.isFly = false
    },
    // 点击弹窗外消失
    maskHandle () {

      this.popup = false

      this.slide = false

      this.textPopup = false
    },
    // 幻灯片（标注的图片和视频）底部ul中的单个资源
    itemClick (item, e) {

      // const e = window.event || 0

      let index

      if (e.target.nodeName.toLowerCase() === 'img') {

        index = e.target.dataset.index

        this.currentSlide = item[index]
      } else if (e.target.nodeName.toLowerCase() === 'video') {

        index = e.target.dataset.index

        this.currentSlide = item[index]
      }
    },
    // 幻灯片（标注的图片和视频）左箭头操控
    leftHandle () {

      this.currentCarouselIndex ++

      if (this.currentCarouselIndex >= this.files.length) {

        this.currentCarouselIndex = 0
      }
    },
    // 幻灯片（标注的图片和视频）右箭头操控
    rightHandle () {

      this.currentCarouselIndex --

      if (this.currentCarouselIndex <= -1) {

       this.currentCarouselIndex = this.files.length - 1
      }
    },
    // 下周演示用,用完删除----------------------------------------------------------------------------------------------------------------
    shadowHandle (boolean) {

      let timelineC = document.querySelector('.cesium-viewer-timelineContainer')
      if (boolean) {

        this.viewer.shadows = true
        timelineC.style.opacity = 1
        timelineC.style.visibility = 'visible'
      } else {

        this.viewer.shadows = false
        timelineC.style.opacity = 0
        timelineC.style.visibility = 'hidden'
      }
    },
    pickColor (val) {

      this.currentDthColor = val.target.value
    },
    // 单体化编辑的时候的确定键
    confirm () {

      if (this.addDthName || this.addDthValue) {

        // let addDthProp = {
        //   'name': this.addDthName,
        //   'value': this.addDthValue
        // }
        // this.dthProps.push(addDthProp)
        // 单体化实体属性上存一份
        if (!this.addDthName) {

          this.addDthName = ' '
        } else if (!this.addDthValue) {

          this.addDthValue = ' '
        }
        this.currentDth.properties.addProperty(this.addDthName, this.addDthValue)
        // this.currentDth.propertyNames.push(this.addDthName)
        // this.currentDth.properties[`_${this.addDthName}`]._value = this.addDthValue
      }
      // 单体化的名称
      if (this.addDthTitle) {

        // this.currentDth.name = this.addDthTitle

        Bus.$emit('dthTitle', this.addDthTitle, this.currentDthOrder)

        this.currentDth.properties.custom = this.addDthTitle
      }

      // 单体化的颜色
      if (this.addDthColor !== this.currentDthColor) {

        this.addDthColor = this.currentDthColor

        // this.currentDth.polygon.material.color._value
        Bus.$emit('dthColor', this.addDthColor, this.currentDthOrder)
      }
      // 编辑的单体化高亮
      this.currentDth.polygon.material.color = Cesium.Color.fromCssColorString(this.addDthColor).withAlpha(0.5)

      this.addDthTitle = null

      this.addDthName = null

      this.addDthValue = null
      
      this.dthEdit = false
    },
    // 单体化编辑时候的取消键
    cancle () {

      this.addDthTitle = null

      this.addDthName = null

      this.addDthValue = null

      this.dthEdit = false
    },
    // 单体化编辑时候的删除属性键
    dthPropDel (item, index) {

      this.dthProps.splice(index, 1)

      this.currentDth.properties.removeProperty(item.name)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html, body, #map3d {
  width: 100%;
  height: 100%;
  margin: 0px;
  overflow: hidden;
}
.button {
  position: absolute;
  top: 10px;
  z-index: 1000;
  background: #00000073;
  border: 1px solid #edffffc2;
  color: white;
}
#resetbtn {
  left: 20px;
}
#style_ins {
  left: 90px;
}
#style_red {
  left: 200px;
}
#style_color {
  left: 260px;
}
.cesium-credit-image {
  display: none !important;
}
.flyLinebtn-box {
  z-index: 1000;
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  display: flex;
  justify-content: space-between;
}
.flyLinebtn-box button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: rgba(255, 255, 255, .9);
  background-color: rgba(0, 0, 0, .4);
  border: 2px solid rgba(255, 255, 255, .5);
  outline: none;
  overflow: hidden;
  transition: .2s;
}
.flyLinebtn-box button:hover {
  cursor: pointer;
  border-color: #00c1de;
  color: #00c1de;
}
/*单体化*/
.dth-container {
  z-index: 1000;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  background-color: rgba(0, 0, 0, .4);
  font-size: 13px;
  border-radius: 5px;
  border: 1px solid rgba(245, 245, 245, .5);
}
.dth-top {
  display: flex;
  padding: 25px 15px 15px;
}
#titInput {
  flex: 2;
  /*width: 100%;*/
  width: ;
  border-radius: 5px;
  padding: 5px;
  outline: none;
  border: none;
  /*box-sizing: border-box;*/
}
.color-picker-box {
  flex: 1;
  margin-left: 10px;
  position: relative;
  text-align: center;
  line-height: 30px;
  border: 1px solid #000;
}
.color-input {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border: none;
}
.dth-center {
  color: #fff;
  font-size: 14px;
  padding: 0 15px 15px;
}
.dth-center tr {
  height: 25px;
}
.dth-center .input-tr {
  height: 40px;
}
.dth-center td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  max-width: 136px;
}
.dthProp-del {
  cursor: pointer;
  transition: transform .5s;
}
.dthProp-del:hover {
  /*color: rgb(0, 140, 180);*/
  color: rgb(225, 0, 0);
  /*text-transform: scale(1.2);*/
  font-size: 15px;
}
.propInput {
  width: 90%;
  border-radius: 5px;
  padding: 5px;
  outline: none;
  border: none;
}
.dth-bottom {
  padding: 0 15px 25px;
  display: flex;
  justify-content: space-around;
}
.btn {
  width: 100px;
  height: 30px;
  cursor: pointer;
  outline: none;
  border: 1px solid transparent;
  border-radius: 5px;
  color: #fff;
  /*font-size: 13px;*/
}
.confirm {
  background-color: rgb(0, 193, 222);
}
.confirm:hover {
  background-color: rgb(0, 140, 180);
}
.cancle {
  background-color: rgb(180, 180, 180);
}
.cancle:hover {
  background-color: rgb(160, 160, 160);
}
.cesium-sidebar {
  /*transition: .1s;*/
}
/*弹窗开始*/
.popup {
  background-color: rgba(0, 0, 0, .1);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}
/*幻灯片*/
.slide-container {
  padding: 30px;
  /*width: 1000px;*/
  min-width: 1000px;
  height: 530px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
}
.slide-main {
  width: 660px;
  height: 330px;
  text-align: center;
}
.slide-main img {
  max-width: 100%;
  max-height: 100%;
}
.slide-main video {
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
.slide-bottom {
  padding: 10px 0;
  margin-top: 20px;
  width: 100%;
  height: 120px;
  background-color: #ddd;
  overflow: hidden;
  position: relative;
}
.carousel {
  position: absolute;
  top: 10px;
  left: 0;
  opacity: 0;
  visibility: hidden;
  transition: .4s;
}
.carousel img, .carousel video {
  height: 100px;
  width: 170px;
  margin-left: 15px;
  cursor: pointer;
}
.arrow-left, .arrow-right {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, .4);
  z-index: 1;
  color: #fff;
  font-size: 26px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
.arrow-left {
  left: 15px;
}
.arrow-right {
  right:15px;
}
/*文本描述弹窗*/
.textPopup-container {
  padding: 30px;
  width: 650px;
  height: 350px;
  background-color: rgba(0, 0, 0, .4);
  overflow: auto;
}
.textPopup-main {
  color: #fff;
}
</style>