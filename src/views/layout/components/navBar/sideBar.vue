<template>
  <div :class="['sidebar-wrap', {'active': sideBarVisible}]" @mousewheel.prevent :style="{'height': sideBarHeight}">
    <ul class="sidebar-plane">
      <router-link class="sidebar-links" v-for="item in sidebarLinks" :key="item.text" :to="item.link" tag="li">
        {{item.text}}
        <div class="innerSidebar-wrap" v-if="item.children">
          <svg-icon icon-name="right-arrow"></svg-icon>
          <ul :class="['innerSidebar-plane']" :style="{'height': sideBarHeight}">
            <router-link class="innerSidebar-links" v-for="child in item.children" :key="child.text" tag="li" :to="child.link">
              <svg-icon v-if="child.icon" :icon-name="child.icon"></svg-icon>
              {{child.text}}
            </router-link>
          </ul>
        </div>
      </router-link>
    </ul>
    <div class="sidebar-bottom">
      咨询电话 (0592) 5868838
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sideBarVisible: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      // innerSideBarVisible: false,
      sideBarHeight: null,
      sidebarLinks: [{
        text: '关于筑理', link: '/a'
      }, {
        text: '实景建模介绍', link: '/b'
      }, {
        text: '实景模型应用', link: '', children: [{ text: '测绘工程', icon: 'plotting', link: '/c/1' }, { text: '市政工程', icon: 'sz', link: '/c/2' }, { text: '铁路交通', icon: 'tl', link: '/c/3' }, { text: '文旅项目', icon: 'wl', link: '/c/4' }, { text: '智慧城市', icon: 'zh', link: '/c/5' }, { text: '电力工程', icon: 'dl', link: '/c/6' }, { text: '水利工程', icon: 'sl', link: '/c/7' }, { text: '石化工程', icon: 'sh', link: '/c/8' }, { text: '防害减灾', icon: 'fh', link: '/c/9' }, { text: '矿山工程', icon: 'ks', link: '/c/10' }]
      }, {
        text: '实景模型展示', link: '', children: [{ text: '海滨大厦案例', link: '/d/1' }, { text: '商业用地评估案例', link: '/d/2' }, { text: '小镇路桥案例', link: '/d/3' }, { text: '旧址修复改造案例', link: '/d/4' }]
      }, {
        text: '勘测评估', link: '/e'
      }, {
        text: '设计施工', link: '/f'
      }, {
        text: '管理运维', link: '/g'
      },
      // {
      //   text: '模型展示', link: '/h'
      // }
      ]
    }
  },
  mounted () {

    this.sideBarHeight = document.documentElement.offsetHeight - 50 + 'px'

    // this.$refs.innerSideBar.forEach(dom => {
    //   dom.style.height = document.documentElement.offsetHeight - 50 + 'px'
    // })

    // this.sideBarHeight = document.documentElement.clientHeight - 50 + 'px'
    let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'

    window.addEventListener(resizeEvt, this.recalc)
  },
  methods: {
    recalc () {

      this.sideBarHeight = document.documentElement.offsetHeight - 50 + 'px'

      // this.$nextTick(() => {
      //   console.dir(this.$refs.sideBar)
      //   this.$refs.sideBar.height = this.clientHeight

      //   this.$refs.innerSideBar.forEach(dom => {

      //     dom.height = this.clientHeight
      //   })
      // })
    }
  }
}
</script>

<style scoped>
.sidebar-wrap {
  min-height: 450px;
  box-sizing: border-box;
  position: absolute;
  left: -200px;
  top: 50px;
  /*background-color: #1c2327;*/
  background-color: #1c2327;
  transition: left .2s ease .3s;
  font-size: 16px;
  border-right: 1px solid rgba(255, 255, 255, 0.15);
}
.sidebar-plane {
  padding: 10px 0 20px;
}
.sidebar-links, .innerSidebar-links {
  margin-top: 10px;
  padding: 0 20px;
  width: 200px;
  height: 30px;
  line-height: 30px;
  text-align: left;
  cursor: pointer;
  position: relative;
}
.sidebar-links:hover, .innerSidebar-links:hover {
  color: #00c1de;
}
.sidebar-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  background: #272b2e;
  /*background-color: #072e6b;*/
}
.active {
  left: 0;
}
.innerSidebar-wrap {
  position: absolute;
  top: 0;
  right: 20px;
  width: 180px;
  height: 30px;
  text-align: right;
}
.innerSidebar-wrap:hover .innerSidebar-plane {
  left: 200px;
  visibility: visible;
}
.innerSidebar-plane {
  min-height: 450px;
  padding: 10px 0 20px;
  position: fixed;
  left: 0;
  top: 50px;
  /*background-color: #1c2327;*/
  background-color: #1c2327;
  transition: .2s ease .1s;
  z-index: -1;
  visibility: hidden;
  color: #fff;
}
/*.inner-active {
  left: 200px;
  visibility: visible;
}*/
</style>