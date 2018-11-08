<template>
  <div class="container">
    <!-- <div class="banner-box">
      <img class="bannerImage" :src="require('@/assets/banner.jpeg')">
    </div> -->
    <div class="bg" ref="mycanvas">
      <canvas id="mainCanvas" width="1920px" height="1440px" style="position: absolute;left: 50%;margin-left: -960px"></canvas>
    </div>
    <div class="model-container">
      <div class="model-box">
        <div class="models clearfix" @mouseover="userSummaryVisible" @mouseout="userSummaryHide">
          <div v-if="!personalModel.length" style="height:200px;color:#777;lineHeight:200px;fontSize:20px">暂无模型</div>
          <div v-else v-for="(item, index) in personalModel" class="model-item fl">
            <div class="item">
              <div class="item-top-box">
                <a class="item-top" :href="`${base}www/scene.html?guid=${item.Id}`" target="_blank">
                  <img v-lazyload="base+item.coverImg">
                </a>
              </div>
              <!-- <a class="item-top" href="../../scene.html?guid={{v.GUID}}">
                <img class="lazy" src="../public/images/load.jpg" data-original="{{v.coverImg}}">
                <img src="../public/images/load.jpg">
              </a> -->
              <div class="item-bottom">
                <div class="item-info one-txt-cut">
                  <div class="item-info-t">
                    <a class="avatar-box w10" href="javascript:void(0)">
                      <div class="user-avatar">
                        <!-- <div class="avatar" style="backgroundImg:url('{{v.Touxiang}}')"></div> -->
                        <!-- <img class="avatar" src=""> -->
                        <img class="avatar" :src="avatar" :data-index="index">
                      </div>
                    </a>
                    <b class="one-txt-cut">{{item.title}}</b>
                  </div>
                  <div class="item-info-b">
                    <div class="address-look-box w65">
                      <svg-icon icon-name="location"></svg-icon>
                      <span v-if="item.province" class="b-address one-txt-cut w50">{{item.province}}·{{item.city}}</span>
                      <span v-else class="b-address one-txt-cut w50">未知省·未知市</span>
                      <svg-icon icon-name="visit"></svg-icon>
                      <span class="b-look one-txt-cut">{{item.viewTimes}}</span>
                    </div>
                    <div class="times-box w35">
                      <span class="times-ago">{{item.addTime | datePick}}</span>
                    </div>
                  </div>
                </div>
                <div class="set"></div>
                <div class="set-box">
                  <div class="set-list">
                    <button id="edit">编 辑</button>
                    <button id="report">上 报</button>
                    <button id="change">易 主</button>
                    <button id="load">下 载</button>
                    <button id="delete">删 除</button>
                  </div>
                  <span class="arrow"></span>
                </div>
              </div>
            </div>
            <div class="user-summary">
              <i class="summary-arrow">
                <span class="arrow-shade"></span>
              </i>
              <a class="summary-left center-y" href="#">
                <div class="summary-left-avatar">
                  <!-- <img class="avatar-min" src=""> -->
                  <img class="avatar-min" :src="avatar">
                </div>
              </a>
              <div class="summary-right">
                <div class="one-txt-cut">{{item.manager}}</div> 
                <div class="one-txt-cut">{{item.company}}</div>
              </div>
            </div>
          </div>
        </div>
        <button v-show="flag" class="btn-load primary" @click="addModel">
          <span>加载更多</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
// import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth.js'
import Bus from '@/utils/bus.js'
import { init } from '@/utils/canvas.js'

export default {
  filters: {
    datePick (val) {

      if (!val) return ''

      val = val.split(' ')[0]

      return val
    }
  },
  data () {
    return {
      imgsrc: require('@/assets/bg1.jpg'),
      logo: require('@/assets/aliyun.png'),
      // base: 'http://guihuao.com/earth/',
      base: 'http://www.ardea.cn/Earth/',
      personalModel: [],
      searchModelName: this.$store.state.user.searchModelName,
      page: 1,
      sumPage: null,
      flag: false,
      account: this.$store.state.user.userInfo.userId,
      avatar: null
    }
  },
  // computed: {
  //   ...mapGetters(['searchModelName']),
  // },
  created () {

    this.requestModel(this.page)
  },
  mounted () {

    if (!this.$store.state.user.userInfo.touxiang) {

      this.avatar = require('@/assets/icon/default_handsome.jpg')
    } else {
      this.avatar = this.$store.state.user.userInfo.touxiang
    }

    this.$refs.mycanvas.style.height = document.documentElement.clientHeight + 'px'

    const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'

    window.addEventListener(resizeEvt, this.recalc, false)

    init(this.imgsrc)
    // 搜索3D模型
    Bus.$on('searchModel', (val) => {

      this.page = 1

      this.searchModel(this.page, val)
    })
  },
  destroyed () {
    // init(this.imgsrc)
    // 移除自定义事件监听器
    Bus.$off('searchModel')
  },
  methods: {
    userSummaryVisible (e) {

      let dom = e.target

      let summary = document.getElementsByClassName('user-summary')

      if (dom.dataset.index) {

        let currentSummary = summary[dom.dataset.index]

        currentSummary.style.display = 'block'

        currentSummary.onmouseenter = () => {

          currentSummary.style.display = 'block'
        }

        currentSummary.onmouseleave = () => {

          currentSummary.style.display = 'none'
        }
      }
    },
    userSummaryHide (e) {

      let dom = e.target

      let summary = document.getElementsByClassName('user-summary')

      if (dom.dataset.index) {

        summary[dom.dataset.index].style.display = 'none'
      }
    },
    addModel () {

      this.page ++

      if (this.page < this.sumPage) {

        this.requestModel(this.page)
      } else if (this.page === this.sumPage) {

        this.requestModel(this.page)
        
        this.flag = false
      }
    },
    requestModel (page) {

      this.axios({
        method: 'post',
        // url: 'User_QinxiePHP/user_listScene.php',
        url: 'selectscene.php',
        data: {
          // page2: page,
          page: page,
          userId: this.account
        }
      }).then((res) => {
        console.log(res)
        this.personalModel = this.personalModel.concat(res.data[0])
        // 可加载的模型页数
        this.sumPage = Math.ceil(res.data[1] / 12)

        if (this.page < this.sumPage) {

          this.flag = true
        }
      })
    },
    searchModel (page, val) {

      this.axios({
        method: 'post',
        // url: 'User_QinxiePHP/user_listScene.php',
        url: 'findscene.php',
        data: {
          // page2: page,
          // Phonenum: getToken(),
          // keyword: val,
          // sort: ''
          page: page,
          userId: this.account,
          keyword: val
        }
      }).then((res) => {

        console.log(res)

        if (res.status === 200) {

          this.personalModel = res.data[0]
          // 可加载的模型页数
          this.sumPage = Math.ceil(res.data[1] / 12)

          if (this.page < this.sumPage) {

            this.flag = true
          } else if (this.page === this.sumPage) {

            this.flag = false
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    recalc () {

      this.$refs.mycanvas.style.height = document.documentElement.clientHeight + 'px'
    }
  }
}
</script>
<style scoped>
.bg {
  overflow: hidden;
  background: url("~@/assets/bg2.png");
  background-position: top center;
  background-repeat: no-repeat;
  background-size: 1920px 500px;
  position: relative;
}
/*用户模型*/
.one-txt-cut {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.container {
  width: 100%;
  min-height: 480px;
  padding-top: 50px;
}
.bannerImage {
  width: 100%;
}
.model-container {
  padding-top: 50px;
  padding-bottom: 50px;
  /*background-color: #edf6f9;*/
  background-color: #eee;
}
.model-box {
  width: 90%;
  padding: 50px 0;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.model-box .before-send .loading-blue {
  width: 64px;
  height: 64px;
  /*background: url("../images/loading-blue.png") 0 0 no-repeat;*/
  animation: loadrotate 2s infinite linear;
}
@keyframes loadrotate {
  from { transform: rotateZ(0deg); }
  to { transform: rotateZ(360deg); }
}
.models {
  width: 100%;
}
.model-item {
  width: 25%;
  padding: 0 15px 30px 15px;
  position: relative;
}
.model-item .item {
  box-shadow: 0 1px 1px rgba(97, 108, 121, 0.1), 0 7px 18px 0 rgba(97, 108, 121, 0.13);
  border-radius: 5px;
  overflow: hidden;
  /*display: inline-table;*/
}
/*padding实现高度自适应----------------------------------------------------*/
.model-item .item-top-box {
  /*height: 1.7rem;*/
  /*height: 180px;*/
  padding-bottom: 55%;
  position: relative;
}
.model-item .item-top {
  /*display: block;*/
  width: 100%;
  height: 100%;
  /*height: 1.7rem;*/
  font-size: 0;
  cursor: pointer;
}
.model-item .item-top img {
  /*vertical-align: middle;*/
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /*height: inherit;*/
  transition: all .5s ease;
}
.model-item .item-top:hover img {
  transform: scale(1.07);
}
.item-bottom {
  text-align: left;
  padding: 8px;
  position: relative;
  font-size: 0;
  width: 100%;
  background-color: #fff;
}
.item-bottom .item-info {
  height: 56px;
  width: 100%;
}
.item-bottom .item-info .item-info-t {
  height: 34px;
  line-height: 34px;
}
.item-bottom .item-info b {
  font-size: 16px;
}
.item-bottom .item-info .times-ago {
  text-align: right;
}
.item-info .item-info-b {
  height: 24px;
  line-height: 24px;
  /*display: flex;
  justify-content: space-between;
  align-items: center;*/
}
.item-info .item-info-b .address-look-box {
  /*text-align: left;*/
  display: inline-block;
}
.b-address {
  display: inline-block;
}
.item-info .item-info-b .times-box {
  text-align: right;
  display: inline-block;
}
.item-bottom .item-info span{
  font-size: 12px;
  color: #888;
  font-family: "Open Sans", sans-serif;
  vertical-align: middle;
  display: inline-block;
}
.item-bottom .item-info svg {
  width: 19px;
  height: 19px;
  fill: #bbb;
  vertical-align: middle;
  padding-right: 2px;
}
.item-bottom .item-info .look {
  margin-left: 10px;
}
.item-bottom .item-info .avatar-box {
  display: inline-block;
}
.item-bottom .user-avatar {
  vertical-align: top;
  display: inline-block;
  width: 22px;
  height: 22px;
  margin-right: 10px;
  /*background: url('../images/icons/04.jpg') 0 0 no-repeat;*/
  /*background-color: #f6c946;*/
  /*background-size: 100% 100%;*/
}
.item-bottom .user-avatar .avatar {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
.item-bottom .set {
  width: 40px;
  height: 40px;
  position: absolute;
  top: -20px;
  right: 10px;
  /*background: url("../images/01.png") no-repeat 0 0;*/
  background-size: 100%;
  cursor: pointer;
  transition: all .3s ease;
  display: none;
}
.item-bottom .set:hover {
  transform: scale(1.1);
  opacity: .9;
}
.item-bottom .set-box {
  display: none;
}
.item-bottom .set-list {
  position: absolute;
  bottom: 75%;
  right: 57px;
  background-color: #fff;
  padding: 5px 13px;
  border-radius: 5px;
  border: 1px solid #999;
  width: 70px;
}
.item-bottom .set-list button {
  font-size: 14px;
  padding: 4px;
  cursor: pointer;
  text-align: center;
  color: #888;
  border: 0;
  width: 41px;
  background-color: #fff;
  outline: none;
}
.item-bottom .arrow {
  position: absolute;
  bottom: 100%;
  right: 52px;
  width: 15px;
  height: 15px;
  background-color: #fff;
  transform: rotate(45deg);
}
.item-bottom .set-list button:hover {
  /*opacity: .7;*/
  color: #000;
}
.model-item .user-summary {
  /*width: 400px;*/
  width: 100%;
  height: 100px;
  padding: 15px;
  position: absolute;
  bottom: -45px;
  left: 15px;
  z-index: 90;
  border-radius: 5px;
  border: 1px solid #eee;
  background-color: #fff;
  line-height: 30px;
  text-align: left;
  display: none;
}
.model-item .user-summary .summary-arrow {
  display: block;
  width: 18px;
  height: 18px;
  background-color: #fff;
  position: absolute;
  top: -9px;
  left: 12px;
  transform: rotate(45deg);
  border: 1px solid #eee;
}
.model-item .user-summary .arrow-shade {
  position: absolute;
  top: 7px;
  left: 0;
  width: 35px;
  height: 15px;
  margin-left: -5px;
  transform: rotate(-45deg);
  background-color: #fff;
}
.model-item .user-summary .summary-left {
  width: 60px;
  height: 60px;
  display: inline-block;
  border-radius: 5px;
  overflow: hidden;
}
.model-item .user-summary .summary-right {
  font-size: 20px;
  display: inline-block;
  /*width: 60%;*/
  margin-left: 20px;
}
.model-item .user-summary .summary-left .summary-left-avatar {
  width: 100%;
  height: 100%;
  /*background: url("../images/icons/04.jpg") 0 0 no-repeat;
  background-color: #f6c946;
  background-size: 100% 100%;*/
}
.model-item .user-summary .summary-left .summary-left-avatar .avatar-min {
  width: 100%;
  height: 100%;
}
.btn-load {
  width: 200px;
  height: 45px;
  line-height: 45px;
  border-radius: 5px;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  outline: none;
  /*display: none;*/
  margin: 20px auto 10px;
}
@media (max-width: 1700px) {
  .model-item {
    /*width: 33.33%;*/
    width: 25%
  }
  /*.model-item .item-top-box {
    height: 2.3rem;
  }*/
  /*.model-item .item-top-box .item-top {
    height: 2.3rem;
  }*/
}
@media (max-width: 1220px) {
  .model-box .model-search {
    width: 45%;
  }
  .model-item {
    width: 33.33%;
  }
  .model-item .item-top-box {
    /*height: 3.4rem;*/
  }
  /*.model-item .item-top-box .item-top {
    height: 3.4rem;
  }
*/  .item-bottom b {
    font-size: 16px;
  }
  .item-bottom span {
    font-size: 13px;
  }
}
/*头部导航变化开始*/
@media (max-width: 780px) {
  .user-info .info-box {
    width: 94%;
  }
  .user-info li:nth-child(3) span {
    padding-right: 15px;
  }
  .user-info .address .info-set {
    height: 20px;
    width: 30px;
  }
  .model-box {
    width: 94%;
  }
  .model-box .model-search {
    left: 0;
    transform: translate(0, -50%);
    width: 65%;
  }
  .model-item {
    width: 50%;
  }
  /*.model-item .item-top-box {
    height: 3.8rem;
  }
  .model-item .item-top-box .item-top {
    height: 3.8rem;
  }*/
  .item-bottom b {
    font-size: 15px;
  }
  .item-bottom .set-list li {
    font-size: 12px;
  }
}
@media (max-width: 480px) {
  .user-info .info-box {
    width: 85%;
  }
  .user-header .logo span:after {
    background-size: 70px 30px;
  }
  .user-info {
    padding: 72px 15px 25px;
  }
  .user-info .avatar {
    width: 64px;
    height: 64px;
  }
  .user-info li {
    padding: 2px 0;
    font-size: 14px;
    line-height: 14px;
  }
  .user-info li:nth-child(1) {
    font-size: 12px;
  }
  .user-info li:nth-child(2) {
    height: 29px;
  }
  .user-info li:nth-child(3) {
    font-size: 12px;
  }
  .user-info .address .info-set {
    height: 16px;
    width: 24px;
  }
  .model-box {
    /*width: 85%;*/
  }
  .model-box h3 {
    padding-bottom: 10px;
  }
  .model-box .model-yun-b {
    height: 91px;
  }
  .model-box .model-search {
    width: 100%;
    top: 0;
    transform: translate(0, 0);
  }
  .model-box .sort-box {
    padding-top: 10px;
    width: 100%;
    top: 40px;
    transform: translateY(0);
  }
  .model-item {
    width: 100%;
  }
  /*.model-item .item-top-box {
    height: 7.0rem;
  }
  .model-item .item-top-box .item-top {
    height: 7.0rem;
  }*/
  .item-bottom .item-info b {
    font-size: 15px;
  }
}
</style>