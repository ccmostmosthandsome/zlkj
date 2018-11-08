<template>
  <div class="cesiumSidebar-wrap" @click.stop id="clock">
    <div class="cesiumSidebar" @mouseleave="mouseleaveHandle">
      <div :class="['cesiumSidebar-item', {'mask-fixed': currentTab===item.tab || activeTab===item.tab}]" v-for="(item, index) in sidebarHandles" :key="index" @mouseenter="mouseenterHandle(item)" @click="itemClick(item)">
        <div v-show="currentTab !== item.tab" class="svg-box">
          <svg-icon :icon-name="item.iconName"></svg-icon>
        </div>
        <div v-show="currentTab === item.tab" :class="['text-box', {'two-active': currentTab === item.tab && item.length === 2}]">
          {{item.text}}
        </div>
        <div v-show="(item.tab==='fx'&&currentTab==='fx')" class="fx-box">
          <span @click.stop="lightAnalysis">模型光照分析</span>
        </div>
      </div>
    </div>
    <!-- v-if="currentTab !== 'all' && currentTab !== 'position' && currentTab !== 'save'" -->
    <component :is="currentTabComponent" class="tabComponent"></component>
    <!-- :class="['tabComponent', tab ? '' : 'hide'] -->
  </div>
</template>

<script>
import { Bh, Bz, Cl, Crmx, Dth, Fx, Fxll, Set, Yphz } from './components'
import { mapGetters } from 'vuex'

export default {
  components: {
    Bh, Bz, Cl, Crmx, Dth, Fx, Fxll, Set, Yphz
  },
  destroyed () {

  },
  // props: ['tab'],
  props: ['tilesetObj'],
  data () {
    return {
      fullscreen: false,
      currentTabComponent: null,
      currentTab: null,
      activeTab: null,
      sidebarHandles: [{
        iconName: "fullscreen", text: "全屏", length: 2, tab: 'all'
      }, {
        iconName: "position", text: "定位", length: 2, tab: 'position'
      }, {
        iconName: "measure", text: "测量", length: 2, tab: 'cl'
      }, {
        iconName: "billboard", text: "标注", length: 2, tab: 'bz'
      }, {
        iconName: "plotting", text: "标绘", length: 2, tab: 'bh'
      }, {
        iconName: "analysis", text: "分析", length: 2, tab: 'fx'
      }, {
        iconName: "fly", text: "飞行浏览", length: 4, tab: 'fxll'
      }, {
        // iconName: "flatten", text: "压平绘制", length: 4, tab: 'yphz'
        iconName: "flatten", text: "暂未开放", length: 4, tab: 'yphz'
      }, {
        iconName: "monomerization", text: "单体化", length: 3, tab: 'dth'
        // iconName: "monomerization", text: "暂未开放", length: 4, tab: 'dth'
      }, {
        // iconName: "import", text: "插入模型", length: 4, tab: 'crmx'
        iconName: "import", text: "暂未开放", length: 4, tab: 'crmx'
      }, {
        // iconName: "set", text: "设置", length: 2, tab: 'set'
        iconName: "set", text: "暂未开放", length: 4, tab: 'set'
      }, {
        // iconName: "save", text: "保存修改", length: 4, tab: 'save'
        iconName: "save", text: "暂未开放", length: 4, tab: 'save'
      }]
    }
  },
  computed: mapGetters(['viewer']),
  watch: {
    //当用户按esc键退出全屏时的侦听
    fullscreen (newVal) {

      if (newVal === true) {
        // 什么也不做
        return false
      } else {
        // 以防用户esc退出全屏
        // this.$set(this.sidebarHandles[0], 'iconName', "fullscreen")

        // this.$set(this.sidebarHandles[0], 'text', "全屏")
        this.sidebarHandles[0].iconName = "fullscreen"

        this.sidebarHandles[0].text = "全屏"
      } 
    }
  },
  mounted () {

    let resizeEvt= 'orientationchange' in window ? 'orientationchange' : 'resize'
    // 监听window的变化
    window.addEventListener(resizeEvt, this.getScreenInfo, false)
  },
  methods: {
    getScreenInfo () {

      this.fullscreen = this.cesium.Fullscreen.fullscreen
    },
    mouseenterHandle (item) {

      // 点击任意处使cesium功能栏消失,必须给父组件传值（更新数据）,父组件每次点击的值才能传到子组件
      // this.$emit('showTab', item.tab)

      this.currentTab = item.tab
    },
    mouseleaveHandle () {

      this.currentTab = null
    },
    itemClick (item) {
      // 下周演示用,用完删除--------------------------------------------------------------------------------------------------------------
      // 关闭光照分析演示控制
      this.$emit('light', false)

      if (this.currentTabComponent === this.currentTab) {

         this.currentTabComponent = false

         this.activeTab = this.currentTab = null

      } else {

        this.activeTab = item.tab
        // 排除没有组件的选项栏
        if (item.tab === 'all' || item.tab === 'position' || item.tab === 'save' || item.tab === 'fx') {
          // 全屏按键
          if (item.tab === 'all') {
            // 检测浏览器是否支持标准全屏API
            if (!this.cesium.Fullscreen.supportsFullscreen()) {

              // this.$message('您的浏览器不支持,建议使用谷歌或搜狐浏览器进行访问')
              alert('您的浏览器不支持全屏,建议使用谷歌或搜狐浏览器进行此操作')
            }

            if (item.iconName === 'fullscreen') {
              // 全屏
              this.cesium.Fullscreen.requestFullscreen(document.body)

              item.iconName = 'exitFullscreen'

              item.text = '恢复'
            } else {
              // 缩小
              this.cesium.Fullscreen.exitFullscreen()

              item.iconName = 'fullscreen'

              item.text = '全屏'
            }
          } else if (item.tab === 'position') {
            // 定位按键
            this.viewer.camera.flyToBoundingSphere(this.tilesetObj.boundingSphere)
            // this.viewer.camera.flyTo({
            //   destination:  this.cesium.Cartesian3.fromDegrees(118.58847000000006,28.82287, 1500.0), // 设置位置
            //   orientation: {
            //     heading: this.cesium.Math.toRadians(20.0), // 方向
            //     pitch: this.cesium.Math.toRadians(-90.0),// 倾斜角度
            //     roll: 0
            //   },
            //   duration:2 // 设置飞行持续时间，默认会根据距离来计算
            //   // easingFunction: this.cesium.EasingFunction.LINEAR_NONE
            // })
          } else if (item.tab === 'save') {
            // 保存修改

          }

        } else {

          this.currentTabComponent = item.tab
        }
      }
    },
    // 下周演示用,用完删除---------------------------------------------------------------------------------------------------------------
    lightAnalysis () {

      this.$emit('light', true)

      // new Cesium.Timeline('map3d', {
      //   startTime: new Date().getTime(),
      //   stopTime: new Date().getTime()+60,
      //   currentTime: 24*60*60
      // })

      // this.viewer.shadows = true
    }
  }
}
</script>

<style scoped>
.cesiumSidebar-wrap {
  position: absolute;
  right: 0;
  top: 0;
  background-color: rgba(0, 0, 0, .2);
  color: #fff;
  z-index: 1000;
  height: 100%;
}
.cesiumSidebar {
  display: flex;
  flex-direction: column;
  /*overflow: auto;*/
  height: 100%;
  font-size: 21px;
}
.cesiumSidebar-item {
  position: relative;
  border-left: 3px solid transparent;
  width: 63px;
  height: 63px;
  text-align: center;
  cursor: pointer;
  /*transition-property: border-left-color, background-color;
  transition-timing-function: ease;
  transition-duration: .2s;*/
  /*padding: 20px;*/
}
.cesiumSidebar-item:hover {
  border-left-color: #00c1de;
  /*color: #00c1de;*/
  background-color: rgba(0, 0, 0, .4);
}
.mask-fixed {
  border-left-color: #00c1de;
  /*color: #00c1de;*/
  background-color: rgba(0, 0, 0, .4);
}
.svg-box {
  line-height: 63px;
}
.text-box {
  box-sizing: content-box;
  margin: 0 auto;
  padding: 11px 10px;
  width: 40px;
  height: 41px;
  font-size: 14px;
  letter-spacing: 2px;
}
.two-active {
  line-height: 40px;
}
.tabComponent {
  position: absolute;
  right: calc(100% + 5px);
  top: 0;
  width: 250px;
  background-color: rgba(0, 0, 0, .4);
  z-index: 1000;
}
.fx-box {
  width: 150px;
  position: absolute;
  right: 63px;
  top: 0;
  border-top: 2px solid #00c1de;
  font-size: 14px;
  background-color: rgba(0, 0, 0, .4);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-height: 63px;
  z-index: 1001;
}
.fx-box span {
  line-height: 25px;
}
.fx-box span:hover {
  color: #00c1de;
}
/*.text-box:before {
  content:"";
  display:inline-block;
  height: 100%;
  vertical-align: middle;
}*/
</style>
