<template>
  <div class="tab-container">
    <div class="title">
      飞行浏览
    </div>
    <div class="content">
      <div class="content-top">
        <button class="btn" @click="addFlyLine">
          <span>添加一条飞行路线</span>
        </button>
      </div>
      <div class="content-center line-container" v-for="(item, index) in flyLine" :key="index" v-if="currentLine !== item.line" ref="height">
        <div class="line-container-top">
          <div class="line-container-top-left">
            <div class="arrow-box" @click="slidedown(item)">
              <svg-icon v-if="item.slidedown" icon-name="right"></svg-icon>
              <svg-icon v-else icon-name="bottom"></svg-icon>
            </div>
            <svg-icon icon-name="route" icon-class="svg route-svg"></svg-icon>
            <input v-if="item.edit" class="edit-input" type="text" v-model="item.editTitle"></input>
            <span v-else>{{item.editTitle}}</span>
          </div>
          <div class="line-container-top-right">
            <svg-icon icon-name="video" icon-class="svg svg-point" @click.native="fly(item, timeDifferenceA)"></svg-icon>
            <svg-icon v-if="item.edit" icon-name="success" icon-class="svg svg-point" @click.native="confirmEdit(item)"></svg-icon>
            <svg-icon v-else icon-name="edit" icon-class="svg svg-point" @click.native="item.edit=!item.edit"></svg-icon>
            <svg-icon icon-name="delete" icon-class="svg-point" @click.native="delFlyLine(item)"></svg-icon>
          </div>
        </div>
        <div :class="['line-container-center', item.slidedown?'line-container-center-open':'line-container-center-close']">
          <div class="line-container-center-imagewrap">
            <!-- 这里放图片box{{item.position}} -->
            <div v-if="item.position.length" class="viewpoint-box" v-for="(it, index) in item.position" :key="index">
              <div class="head">
                <div class="head-l">
                  视点{{it.viewpointOrder}}
                </div>
                <div class="head-r">
                  <svg-icon icon-name="camera" icon-class="svg-point svg"></svg-icon>
                  <svg-icon v-if="it.edit" icon-name="success" icon-class="svg-point svg" @click.native="vpConfirmEdit(item, it)"></svg-icon>
                  <svg-icon v-else icon-name="edit" icon-class="svg-point svg" @click.native="it.edit=!it.edit"></svg-icon>
                  <svg-icon icon-name="delete" icon-class="svg-point svg" @click.native="delVp(item, it)"></svg-icon>
                </div>
              </div>
              <div class="content">
                <div class="img-box" :style="{background: img}"></div>
                播放时间&nbsp;
                <input v-if="it.edit" class="editDuration-input" type="text" v-model="it.editDuration">
                <span v-else>{{it.editDuration}}</span>&nbsp;S
              </div>
            </div>
          </div>
          <div class="line-container-center-bottom">
            <button class="btn" @click="getCameraPosition(item)">
              <span>添加当前位置为视点</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { getExtent } from '@/utils/extent' //获取当前视图范围函数
import { mapGetters } from 'vuex'
import Bus from '@/utils/bus.js' //中间仓库方便非父子组件传值
import { flyTo } from '@/utils/camera.js'

export default {
  data () {
    return {
      order: 0,                   //标记每个飞行路径Dom
      currentOrder: null,
      lineNum: 0,                 //控制是否显示飞行路径Dom
      currentLine: null,
      flyLine: [],                //飞行路径
      currentPosition: null,
      currentViewpointOrder: 0,               //视点序号
      // duration: 2,                 //播放持续时间(单位秒)
      img: 'url(' + require('@/assets/2.jpg') + ')',  //视点截图
      heading: null,
      pitch: null,
      roll: null
      // cameraMoveStartFunc: null,
      // cameraMoveEndFunc: null
    }
  },
  computed: mapGetters(['viewer', 'timeDifferenceA', 'flyComplete']),
  mounted () {

    this.heading = this.viewer.camera.heading

    this.pitch = this.viewer.camera.pitch

    this.roll = this.viewer.camera.roll
    // 移动事件    
    this.cameraEvents()
    // let aa = this.viewer.camera.position

    // console.log(this.cesium.Math.toDegrees(this.cesium.Cartographic.fromCartesian(aa).latitude), this.cesium.Math.toDegrees(this.cesium.Cartographic.fromCartesian(aa).longitude), this.cesium.Math.toDegrees(this.cesium.Cartographic.fromCartesian(aa).height))

  },
  destroyed () {

    // 解除相机移动事件绑定
    this.viewer.camera.moveStart.removeEventListener(this.cameraMoveStartFunc)

    this.viewer.camera.moveEnd.removeEventListener(this.cameraMoveEndFunc)
  },
  methods: {
    addFlyLine () {
      // 飞行路径的序号
      this.order += 1

      this.lineNum += 1

      let obj = {
        order: this.order, camera: null, slidedown: false, line: this.lineNum, play: false, duration: 2, edit: false, editTitle: `飞行路径${this.lineNum}`, position: [], viewpointOrder: 0
      }

      this.flyLine.push(obj)
    },
    slidedown (item) {

      this.order = item.order

      this.flyLine.forEach((item, index) => {

        if (item.order === this.order) {

          item.slidedown = !item.slidedown
        }
      })
    },
    fly (item, timeDifferenceA) {

      if (item.position.length <= 1) {

        alert('两点成一条航线')
        
        return false
      }

      this.order = item.order

      let that = this

      // 非父子组件之间的传值(把值传给h.vue组件中的播放、结束等控件)
      Bus.$emit('showPlayConsole', item, true)

      // flyTo(item, that)

      flyTo(item, that, timeDifferenceA, null, this.flyComplete, this.heading, this.pitch, this.roll)

      this.$store.state.camera.startTime = Date.now()

      // if (item.position.length <= 1) {

      //   alert('两点成一条航线')
      //   return false
      // }

      // // 非父子组件之间的传值(把值传给h.vue组件中的播放、结束等控件)
      // Bus.$emit('showPlayConsole', item, true)

      // let that = this

      // this.order = item.order

      // let currentKey = 0 //初始化第1个视点

      // // 存放该飞行路径所有视点的播放时间
      // let editDurationArr = []

      // item.position.forEach((i) => {

      //   editDurationArr.push(i.editDuration)
      // })

      // function init (currentKey, editDurationArr) {
      //   console.log(editDurationArr)

      //   if (currentKey >= item.position.length) return Bus.$emit('flyComplete', true)

      //   let destinationOption = {
      //     destination: that.cesium.Cartesian3.fromDegrees(item.position[currentKey].longitude, item.position[currentKey].latitude, item.position[currentKey].height),
      //     orientation: {
      //       heading: that.cesium.Math.toRadians(0.0),
      //       pitch: that.cesium.Math.toRadians(-90.0),
      //       roll: 0.0
      //     },
      //     duration: editDurationArr[currentKey],
      //     easingFunction: that.cesium.EasingFunction.LINEAR_NONE,
      //     cancle: function () {
      //       // 如果取消飞行则会调用此函数
      //       console.log('飞行取消')
      //     }
      //   }

      //   const flytoCameraKey = function() {

      //     init(currentKey, editDurationArr)
      //   }

      //   destinationOption.complete = function() {

      //     flytoCameraKey()
      //   }

      //   that.viewer.camera.flyTo(destinationOption)

      //   currentKey ++
      // }

      // init(currentKey, editDurationArr)

      // function(e, t) {
      //   "use strict";

        // function r(e) {
        //   this.scene = e, this.camera = e.camera, this.cameraKeys = [], this.looptime = 0, this.currentKey = -1, this.startTime = Date.now(), this.pauseTime = Date.now(), this._pause = !1
        // }
        // return r.prototype.init = function(e, i) {
        //     if (e >= this.cameraKeys.length - 1) return void this.stop();
        //     var n = e + 1,
        //         o = e < 0 ? 0 : this.cameraKeys[e].time;
        //     this.startTime = Date.now();
        //     var a = {
        //             destination: this.cameraKeys[n].destination,
        //             orientation: this.cameraKeys[n].orientation,
        //             duration: (this.cameraKeys[n].time - o - i) / 1e3,
        //             easingFunction: t.LINEAR_NONE
        //         },
        //         s = this;
        //     r.prototype.flytoCameraKey = function() {
        //         this.currentKey++, s.init(this.currentKey, 0)
        //     }, a.complete = function() {
        //         s.flytoCameraKey()
        //     }, this.camera.flyTo(a)
        // }, r.prototype.getAllKeys = function() {
        //     return this.cameraKeys
        // }, r.prototype.clear = function() {
        //     this.startTime = 0, this._pause = !1, this.currentKey = 0, this.scene.tweens.removeAll(), this.cameraKeys = []
        // }, r.prototype.play = function() {
        //     this._pause ? (this.init(this.currentKey, this.pauseTime - this.startTime), this._pause = !1) : this.init(this.currentKey, 0)
        // }, r.prototype.pause = function() {
        //     this._pause || (this._pause = !0, this.pauseTime = Date.now()), this.scene.tweens.removeAll()
        // }, r.prototype.stop = function() {
        //     this.startTime = 0, this._pause = !1, this.currentKey = -1, this.scene.tweens.removeAll()
        // }, r
      // }

      // this.viewer.camera.flyTo({
      //   destination : this.cesium.Cartesian3.fromDegrees(this.currentPosition.longitude, this.currentPosition.latitude, this.currentPosition.height),
      //   orientation: {
      //     heading: this.cesium.Math.toRadians(0.0), // 方向
      //     pitch: this.cesium.Math.toRadians(-90.0),// 倾斜角度
      //     roll: 0.0
      //   },
      //   duration: item.duration, // 设置飞行持续时间，默认会根据距离来计算
      //   complete: function () {
      //     // 到达位置后执行的回调函数
      //     console.log('开始飞')
      //     that.viewer.camera.flyTo({
      //       destination:  that.cesium.Cartesian3.fromDegrees(item.position[0].longitude, item.position[0].latitude, item.position[0].height),
      //       duration: item.duration,
      //       complete: function () {
      //         console.log('到达目的地1')
      //         that.viewer.camera.flyTo({
      //           destination :  that.cesium.Cartesian3.fromDegrees(item.position[1].longitude, item.position[1].latitude, item.position[1].height),
      //           duration: item.duration,
      //           complete: function () {
      //             console.log('到达目的地2')

      //             that.viewer.camera.flyTo({
      //               destination :  that.cesium.Cartesian3.fromDegrees(item.position[2].longitude, item.position[2].latitude, item.position[2].height),
      //               duration: item.duration,
      //               complete: function () {
      //                 console.log('到达目的地3')
      //               }
      //             })
      //           }
      //         })
      //       }
      //     })
      //   },
      //   cancel: function () {
      //     // 如果取消飞行则会调用此函数
      //     console.log('飞行取消')
      //   },
      //   pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
      //   maximumHeight:5000, // 相机最大飞行高度
      //   flyOverLongitude: 100, // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度
      // })
    },
    confirmEdit (item) {
      // 编辑和保存svg以及字符串和文本框的切换
      item.edit = !item.edit

      this.order = item.order

      this.flyLine.forEach((item, index) => {

        if (item.order === this.order) {

          // item.editTitle
          // 调后台接口
        }
      })
    },
    delFlyLine (item) {

      this.currentLine = item.line
      // 删除数组中数据
      this.flyLine.forEach((item, index) => {

        if (item.line === this.currentLine) {

          this.flyLine.splice(index, 1)
        }
      })
    },
    vpConfirmEdit (item, it) {

      it.edit = !it.edit

      this.currentViewpointOrder = it.viewpointOrder

      item.position.forEach((i, index) => {

        if(i.viewpointOrder === this.currentViewpointOrder) {

          let re = /^\d+$/

          if (re.test(i.editDuration)) {

            console.log('修改成功')
          }else{

            console.log('修改失败，不为数字')
            i.editDuration = 2
          }
          // item.
          // 接口
        }
      })
    },
    // 删除视点
    delVp (item, it) {

      this.currentViewpointOrder = it.viewpointOrder

      item.position.forEach((i, index) => {

        if(i.viewpointOrder === this.currentViewpointOrder) {

          item.position.splice(index, 1)

          this.currentViewpointOrder = item.position.length
          
          this.currentViewpointOrder ++
        }
      })
    },
    getCameraPosition (item) {

      // console.log(this.$store.state.map3d.viewer)
      // console.log(getExtent(this.viewer))
      this.order = item.order

      // 存放视点
      // item.position.push(getExtent(this.viewer, this.cesium))

      // let pt1 = new this.cesium.Cartesian2(0,0)
      // let pt2 = new this.cesium.Cartesian2(500,500)
       
      // let pick1 = this.viewer.scene.globe.pick(this.viewer.camera.getPickRay(pt1), this.viewer.scene)
      // let pick2 = this.viewer.scene.globe.pick(this.viewer.camera.getPickRay(pt2), this.viewer.scene)
       
      // //将三维坐标转成地理坐标
      // let geoPt1 = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(pick1)
      // let geoPt2 = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(pick2)
       
      // //地理坐标转换为经纬度坐标
      // let point1 =[geoPt1.longitude / Math.PI * 180,geoPt1.latitude / Math.PI * 180]
      // let point2 =[geoPt2.longitude / Math.PI * 180,geoPt2.latitude / Math.PI * 180]

      // 笛卡尔坐标系
      let pt = this.viewer.camera.position

      // 将笛卡尔坐标系转成经纬度（弧度的经纬度)

      let point = this.cesium.Cartographic.fromCartesian(pt)

      // 用户连续选择了相同的位置时提示并返回(由于不能飞行到后面14位那么精确，所以保留后面几位小数)
      if (item.position.length >= 1 && 
          item.position[item.position.length - 1].longitude.toFixed(11) === this.cesium.Math.toDegrees(point.longitude).toFixed(11) &&
          item.position[item.position.length - 1].latitude.toFixed(11) === this.cesium.Math.toDegrees(point.latitude).toFixed(11) &&
          item.position[item.position.length - 1].height.toFixed(6) === point.height.toFixed(6)) {

          alert('请选择不同目的地')

          return false
      }

      // 视点序号（用户选择位置正常情况下往下添加序号）
      item.viewpointOrder ++

      this.currentViewpointOrder = item.viewpointOrder

      // 弧度转成经纬度坐标

      let positionObj = {
        viewpointOrder: this.currentViewpointOrder,
        // duration: this.duration,
        editDuration: 2,
        edit: false,
        longitude: this.cesium.Math.toDegrees(point.longitude),
        latitude: this.cesium.Math.toDegrees(point.latitude),
        height: point.height,
        heading: this.heading,
        pitch: this.pitch,
        roll: this.roll
      }

      item.position.push(positionObj)

      // 进来未拖动镜头直接添加视点的情况下
      if (!this.currentPosition) {

        this.currentPosition = positionObj
      }
    },
    cameraMoveStartFunc () {

      console.log('相机开始移动')

      // 根据用户移动镜头的操作改变镜头的方向数据
      this.heading = this.viewer.camera.heading

      this.pitch = this.viewer.camera.pitch

      this.roll = this.viewer.camera.roll

      // 笛卡尔坐标系
      let pt = this.viewer.camera.position

      // 将笛卡尔坐标系转成经纬度（弧度的经纬度)

      let point = this.cesium.Cartographic.fromCartesian(pt)

      // 弧度转成经纬度坐标

      let positionObj = {
        longitude: this.cesium.Math.toDegrees(point.longitude),
        latitude: this.cesium.Math.toDegrees(point.latitude),
        height: point.height
      }

      this.currentPosition = positionObj

      // 设定相机位置和方向
      this.viewer.camera.setView({
        destination : this.cesium.Cartesian3.fromDegrees(this.currentPosition.longitude, this.currentPosition.latitude, this.currentPosition.height),
        orientation : {
          heading : this.heading, // east, default value is 0.0 (north)
          pitch : this.pitch,    // default value (looking down)
          roll : this.roll                       // default value
        }
      })
    },
    cameraMoveEndFunc () {

      console.log('相机停止移动')
    },
    cameraEvents () {
      // let that = this
      // // Sandcastle.declare(cameraEvents)

      // // 相机开始移动
      // this.cameraMoveStartFunc = function () {

      //   console.log('相机开始移动')

      //   // 笛卡尔坐标系
      //   let pt = that.viewer.camera.position

      //   // 将笛卡尔坐标系转成经纬度（弧度的经纬度)

      //   let point = that.cesium.Cartographic.fromCartesian(pt)

      //   // 弧度转成经纬度坐标

      //   let positionObj = {
      //     longitude: that.cesium.Math.toDegrees(point.longitude),
      //     latitude: that.cesium.Math.toDegrees(point.latitude),
      //     height: point.height
      //   }

      //   that.currentPosition = positionObj

      //   // 设定相机位置和方向
      //   that.viewer.camera.setView({
      //     destination : that.cesium.Cartesian3.fromDegrees(that.currentPosition.longitude, that.currentPosition.latitude, that.currentPosition.height),
      //     orientation : {
      //       heading : that.cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
      //       pitch : that.cesium.Math.toRadians(-90.0),    // default value (looking down)
      //       roll : 0.0                             // default value
      //     }
      //   })
      // }

      // // 相机停止移动
      // this.cameraMoveEndFunc = function () {

      //   console.log('相机停止移动')
      // }

      this.viewer.camera.moveStart.addEventListener(this.cameraMoveStartFunc)

      this.viewer.camera.moveEnd.addEventListener(this.cameraMoveEndFunc)
    }
  }
}
</script>

<style scoped>
/*.tab-container {
  max-height: 100%;
  overflow: auto;
}
.title {
  padding: 0 15px;
  font-size: 14px;
  line-height: 35px;
}*/
.btn {
  width: 200px;
  background-color: #00c1de;
  cursor: pointer;
  text-align: center;
  line-height: 30px;
  border-radius: 5px;
  outline: none;
  border: none;
  color: #eee;
  font-weight: 500;
  letter-spacing: 1px;
}
.btn:hover {
  background-color: rgb(0, 140, 180);
}
.content {
  /*max-height: calc(100% - 35px);
  overflow: auto;*/
}
.content-top {
  padding: 20px 0;
  text-align: center;
  background-color: rgba(0, 0, 0, .4)
}
.line-container {
  margin-bottom: 10px;
}
.line-container-top {
  padding: 10px;
  background-color: rgba(96, 96, 96, .4);
  border-top: 1px solid rgba(255, 255, 255, .4);
  border-bottom: 1px solid rgba(255, 255, 255, .4);
  display: flex;
  justify-content: space-between;
}
.arrow-box {
  display: inline-block;
  cursor: pointer;
}
.arrow-box:hover {
  color: #00c1de;
}
.line-container-top-left .svg {
  margin-left: 10px;
}
.line-container-top-left span {
  font-size: 12px;
}
.route-svg {
  margin-right: 5px;
}
.line-container-top-right .svg {
  margin-right: 10px;
}
/*.svg-point {
  cursor: pointer;
  transition: transform .2s;
}
.svg-point:hover {
  transform: scale(1.2);
  color: #00c1de;
}*/
.edit-input {
  width: 100px;
  outline: none;
  padding: 0 2px;
  border: 1px solid #00c1de;
  border-radius: 2px;
}
.edit-input:focus {
  /*border: 1px solid #00c1de;*/
}
.line-container-center {
  overflow: hidden;
  transition: height .3s;
  text-align: center;
  /*position: relative;*/
}
.line-container-center:before {
  display: inline-block;
  height: calc(100% - 50px);
  content: '';
}
.line-container-center-open {
  height: 280px;
}
.line-container-center-close {
  height: 0;
}
.line-container-center-imagewrap {
  max-height: 230px;
  overflow: auto;
  display: inline-block;
  vertical-align: top;
}
.viewpoint-box {
  margin-top: 10px;
  display: inline-block;
  width: 200px;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .4);
}
.viewpoint-box .head {
  display: flex;
  justify-content: space-between;
  background-color: rgba(96, 96, 96, .4);
  padding: 5px 0 5px 10px;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, .4);
  /*color: #444;*/
}
.viewpoint-box .head .svg {
  font-size: 16px;
  margin-right: 10px;
}
.viewpoint-box .content {
  padding: 10px;
  background-color: rgba(96, 96, 96, .4);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 15px;
}
.viewpoint-box .content .img-box {
  width: 50px;
  height: 50px;
  background-position: center center!important;
  background-repeat:  no-repeat!important;
  background-size: 100% 100%!important;
  margin-right: 15px;
}
.viewpoint-box .content span {
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 35px;
}
.editDuration-input {
  width: 25px;
  outline: none;
  padding: 0 2px;
  border: 1px solid #00c1de;
  border-radius: 2px;
}
.line-container-center-bottom {
  padding: 10px 0;
  /*vertical-align: bottom;*/
  /*display: inline-block;*/
}
</style>
