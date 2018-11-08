import Bus from './bus.js'
import Cesium from 'cesium/Cesium'

let currentKey

let timeDifferenceAll

export function flyTo (item, that, timeDifferenceAll, n, flyComplete, heading, pitch, roll) {

  timeDifferenceAll = timeDifferenceAll ? timeDifferenceAll : 0

  n = n ? n : 0

  // n为真是屏幕中间的播放按钮
  if (n) {

    // 暂停播放按键
    if (flyComplete) {
      // console.log('飞行结束')
      // 航线飞完, 重新飞行
      currentKey = -1

      timeDifferenceAll = item.position[0].editDuration * 1000 - 1

      console.log(timeDifferenceAll)

    } else {
      console.log('没完成')

        timeDifferenceAll = timeDifferenceAll
              
      // 航线未飞完，继续当前航线飞行
      currentKey -= n
    }    
  } else {

    timeDifferenceAll = 0

    currentKey = -1
  }
  // else if (n === 2) {

    // if (!flyComplete && currentKeyStore === 0) {

    //   console.log('第一次飞行')

    //   currentKey = -1

    //   timeDifferenceAll += timeDifferenceB

    // } else if (currentKeyStore === -1) {

    //   console.log('完成飞行')

    //   currentKey = -1

    // } else {

    //   // currentKey =  currentKey ? currentKey : currentKeyStore

    //   console.log('未完成结束')

    //   timeDifferenceAll += timeDifferenceB

    //   console.log(currentKey, timeDifferenceAll, 22222222222)

    //   if (timeDifferenceAll > item.position[(currentKey-1)<0?0:currentKey-1].editDuration * 1000) {

    //     let tempB = 0

    //     item.position.forEach((i, index) => {

    //       if (index < currentKey) {

    //         tempB += i.editDuration * 1000
    //       }
    //     })

    //     timeDifferenceAll -= tempB
    //   }

    //   console.log(currentKey)    
    // }
  // }



  // 存放该飞行路径所有视点的播放时间
  let editDurationArr = []

  item.position.forEach((i) => {

    editDurationArr.push(i.editDuration)
  })

  function init (editDurationArr) {

    Bus.$emit('flyComplete', false)

    currentKey ++

    if (currentKey >= item.position.length) {

      currentKey --

      return Bus.$emit('flyComplete', true)

    }

    let destinationOption = {
      destination: Cesium.Cartesian3.fromDegrees(item.position[currentKey].longitude, item.position[currentKey].latitude, item.position[currentKey].height),
      orientation: {
        // heading: Cesium.Math.toRadians(0.0),
        // pitch: Cesium.Math.toRadians(-90.0),
        // roll: 0.0
        heading:　item.position[currentKey].heading,
        pitch: item.position[currentKey].pitch,
        roll: item.position[currentKey].roll
      },
      // duration: editDurationArr[currentKey],
      duration: editDurationArr[currentKey] - (timeDifferenceAll / 1e3),
      easingFunction: Cesium.EasingFunction.LINEAR_NONE
    }

    const flytoCameraKey = function() {

      // 飞行完一条清0
      timeDifferenceAll = 0

      Bus.$emit('flyCompleteNode', Date.now())

      init(editDurationArr)
    }

    // const time = function (timeDifference, currentKey) {

    //   console.log(timeDifference)
    // }

    destinationOption.complete = function() {

      flytoCameraKey()
    }
    destinationOption.cancel = function () {
      
      // 如果取消飞行则会调用此函数
      console.log('飞行取消')
    }

    // let resultDuration = editDurationArr[currentKey] - (timeDifferenceAll / 1e3)

    // console.log(resultDuration)

    that.viewer.camera.flyTo(destinationOption)
  }

  init(editDurationArr)

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
  //   cancle: function () {
  //     // 如果取消飞行则会调用此函数
  //     console.log('飞行取消')
  //   },
  //   pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
  //   maximumHeight:5000, // 相机最大飞行高度
  //   flyOverLongitude: 100, // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度
  // })
}


// 相机停止移动
export function cameraMoveEndEvt () {

  console.log('相机停止移动')
}
