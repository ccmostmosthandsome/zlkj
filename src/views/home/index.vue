<template>
  <div class="container">
    <!-- <el-carousel :interval="5000" :height="`${carouselHeight}px`" arrow="never">
      <el-carousel-item v-for="item in imgCarousel" :key="item">
        <img :src="item" ref="imgHeight">
      </el-carousel-item>
    </el-carousel> -->
    <div class="btn-box">
      <button type="button" class="primary btn">
        <router-link to="/model">三维实景模型</router-link>
      </button>
      <button type="button" class="primary btn">
        <a href="http://www.ardea.cn/index1.html">
           巨幅全景照片
        </a>
      </button>
    </div>
    <div class="kv-container" ref="kv">
      <div class="kv-header">
        <p class="kv-header-text">筑卓越品质</p>
      </div>
      <div class="kv-main-content">
        <h2 class="kv-base-h" ref="slogan"></h2>
      </div>
      <div class="bottom-content">
        <dl class="sound">
          <dt>
            <span>SOUND</span>
          </dt>
          <dd :class="['volume', {'on': sound}]" @click="soundHandle">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </dd>
        </dl>
      </div>
      <div class="kv-bg-container">
        <video v-show="!prevent" class="kv-bg-video" muted autoplay loop webkit-playsinline playsinline x5-video-player-type="h5" ref="video">
          <source :src="require('@/assets/video/kv_pc_ie.mp4')" type="video/mp4" />
        </video>
        <audio class="kv-bg-audio" autoplay loop ref="audio">
          <source :src="require('@/assets/audio/top.mp3')" type="audio/mp3" />
        </audio>
      </div>
    </div>
    <div class="content">
      <!-- <div class="case-title">
        <h3>项目案例</h3>
      </div>
      <ul class="product-wrap">
        <li class="product-item" v-for="item in product" :key="item.text">
          <div class="product-item-inner">
            <div class="product-item-content">
              <img class="img" :src="item.src">
              <div class="product-tag">
                <span>{{item.text}}</span>
              </div>
              <div class="mask">
                <span class="overlay-text">{{item.mask}}</span>
              </div>
            </div>
          </div>
        </li>
      </ul> -->
      <section class="product clearfix">
        <div class="product-text-container fr" ref="productText">
          <div class="product-text">
            <h3>产品</h3>
            <p>
              提供基于实景建模（Reality Modeling）和数字工程模型技术的解决方案。可以通过基于ContextCapture的数据提取及处理，结合以MicroStation为核心的多专业应用模块，实现在全生命后期过程中数字资产的及时更新与维护。将虚拟的数字资产和物理的现实资产连接起来，实现资产的优化增值，推进基础设施的进步。
            </p>
          </div>
        </div>
        <ul class="photo-list clearfix">
          <li class="fl" ref="productImg">
            <img :src="require('@/assets/6.jpg')">
          </li>
          <li class="fr">
            <img :src="require('@/assets/7.jpg')">
          </li>
        </ul>
        <div class="product-single" ref="singleText">
          <p>
            构建资产运维管理的基础是对数字资产的输入、更新与维护过程。如何准确的获取数字资产，并在运维过程中与物理的资产同步更新，是我们做出正确决策的基础。
          </p>
        </div>
      </section>
      <section class="technology">
        <div class="technology-text-container">
          <div class="technology-text" ref="technologyText">
            <h3>筑理科技</h3>
            <p>
              提供了旨在为资产提供增值服务的BIM解决方案。通过对实际资产和数字资产关联维护管理，实现资产的全生命周期管理。通过对资产数据的维护管理，实现资产可靠性与经营分析、合理性与运维管理，以及与其他企业数据的有效整合。
            </p>
          </div>
        </div>
        <!-- <div class="technology-bg">
          <img :src="require('@/assets/technology_bg.png')">
        </div> -->
      </section>
      <!-- <div class="app-area">
        <h3>应用领域</h3>
        <ul class="app-area-list">
          <li class="app-area-item" v-for="item in areas" :key="item.text">
            <img :src="item.src">
            <span>{{item.text}}</span>
          </li>
        </ul>
      </div> -->
    </div>
    <!-- <img :src="item" v-for="item in imgOther" :key="item"> -->
    <zl-footer></zl-footer>
  </div>
</template>

<script>
import ZlFooter from '../layout/components/footer/index.vue'
// import wx from 'weixin-js-sdk'

export default {
  components: {
    ZlFooter
  },
  data () {
    return {
      slogan: '3D实景还原真实世界',
      imgCarousel: [require('@/assets/1.jpg'), require('@/assets/3.jpg'), require('@/assets/6.jpg'), require('@/assets/7.jpg')],
      // imgOther: [require('@/assets/8.jpg'), require('@/assets/9.jpg'), require('@/assets/10.jpg'), require('@/assets/11.jpg')],
      // areas: [{src: require('@/assets/01(1).png'), text: '城市规划'}, {src: require('@/assets/02(1).png'), text: '建筑设计'}, {src: require('@/assets/03(1).png'), text: '景观设计'}, {src: require('@/assets/04(1).png'), text: '市政交通'}, {src: require('@/assets/05(1).png'), text: '工程施工'}, {src: require('@/assets/06(1).png'), text: '其它'}],
      // product: [{src: require('@/assets/7.jpg'), text: '鼓浪屿', mask: '鼓浪屿-筑理科技'}, {src: require('@/assets/7.jpg'), text: '厦门大学', mask: '厦门大学-筑理科技'}, {src: require('@/assets/7.jpg'), text: '集美软件园', mask: '集美软件园-筑理科技'}, {src: require('@/assets/7.jpg'), text: '北站', mask: '北站-筑理科技'}],
      // carouselHeight: null,
      // rate: null,
      prevent: false, //移动端不支持video自动播放的情况
      sound: true
    }
  },
  mounted () {
    // console.log(document.documentElement.clientHeight)
    this.$refs.kv.style.height = document.documentElement.clientHeight + 'px'

    // this.$refs.imgHeight['0'].onload = () => {

    //   this.rate = this.$refs.imgHeight['0'].height / this.$refs.imgHeight['0'].width

    //   this.carouselHeight = this.rate * document.documentElement.clientWidth
    // }

    let resizeEvt= 'orientationchange' in window ? 'orientationchange' : 'resize'

    window.addEventListener(resizeEvt, this.recalc, false)

    this.print() //口号打印效果

    //设备检查
    if (!this.detectmob()) {
      // pc端才滚动
      document.addEventListener('scroll', this.handleScroll)
    } else {
      // 移动端
      // 微信浏览器
      document.addEventListener('WeixinJSBridgeReady',function(){
        this.$refs.video.play()
      },false)

      const promise = this.$refs.video.play()
      //检测能否自动播放？
      if (promise !== undefined) {
        
        promise.catch(error => {

          this.prevent = true
          console.log(error)
            // Auto-play was prevented
            // Show a UI element to let the user manually start playback
        }).then(() => {

          this.prevent = false
            // Auto-play started
        })
      }
    }
  },
  destroyed () {
    if (!this.detectmob()) {

      document.removeEventListener('scroll', this.handleScroll)
    }
  },
  methods: {
    recalc () {

      this.$refs.kv.style.height = document.documentElement.clientHeight + 'px'
      // this.carouselHeight = this.rate * document.documentElement.clientWidth

    },
    soundHandle () {

      if (this.sound) {

        this.sound = false
        this.$refs.audio.pause()
      } else {

        this.sound = true
        this.$refs.audio.play()
      }
    },
    print () {

      let index = 0

      const timer = setInterval(() => {

        if (index == this.slogan.length+1) {
          
          // index = 0
          clearInterval(timer)
        }

        this.$refs.slogan.innerText = this.slogan.substring(0, index++)
      }, 100) //通过定时器来让文字逐步显示
    },
    handleScroll () {

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

      this.$refs.productText.style.transform = `translate3d(0, ${-scrollTop/5 + 200}px, 0)`

      this.$refs.productImg.style.transform = `translate3d(0, ${-scrollTop/5 + 200}px, 0)`

      this.$refs.singleText.style.transform = `translate3d(0, ${-scrollTop/5 + 200}px, 0)`

      this.$refs.technologyText.style.transform = `translate3d(0, ${-scrollTop/5 + 200}px, 0)`
    },
    detectmob () {
      //判断是移动端还是PC端
      if ( navigator.userAgent.match(/Android/i)
          || navigator.userAgent.match(/webOS/i)
          || navigator.userAgent.match(/iPhone/i)
          || navigator.userAgent.match(/iPad/i)
          || navigator.userAgent.match(/iPod/i)
          || navigator.userAgent.match(/BlackBerry/i)
          || navigator.userAgent.match(/Windows Phone/i))
      {
        return true //移动端
      } else {
        return false //pc端
      }
    }
  }
}
</script>

<style scoped>
.btn-box {
  width: 500px;
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
}
.btn-box button:nth-child(1) {
  margin-right: 20px;
}
.btn-box a {
  display: block;
}
.btn {
  width: 100%;
  height: 42px;
  /*padding: 0 10px;*/
  font-size: 16px;
  line-height: 40px;
  /*border-width: 1px;*/
  border: 1px solid transparent;
  border-radius: 3px;
  outline: none;
  font-weight: 500;
  cursor: pointer;
}
.container {
  width: 100%;
}
.kv-container {
  position: relative;
  overflow: hidden;
}
.kv-header {
  width: 100%;
  padding-top: 80px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
.kv-header-text {
  color: #fff;
  text-align: center;
  font-weight: 600;
  font-feature-settings: "palt" 1;
}
.kv-main-content {
  width: 100%;
  position: absolute;
  left: 0;
  /*top: 374.5px;*/
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}
.kv-base-h {
  font-size: 70px;
  color: #fff;
  text-align: center;
}
.bottom-content {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 180px;
  padding-left: 50px;
  padding-bottom: 50px;
  color: #fff;
  z-index: 1;
}
.sound {
  display: flex;
  height: 16px;
}
dt {
  font-size: 12px;
  line-height: 12px;
  /*vertical-align: baseline;*/
}
dt span {
  vertical-align: -40%;
}
.volume {
  display: flex;
  margin-left: 9px;
  align-items: flex-end;
  cursor: pointer;
}
.line {
  background-color: #fff;
  width: 1px;
  height: 2px;
  margin-left: 3px;
  /*position: absolute;*/
  /*left: 0;*/
  /*bottom: 0;*/
  transition: all 0.2s linear;
  -moz-transition: all 0.2s linear;
  -webkit-transition: all 0.2s linear;
  -ms-transition: all 0.2s linear;
}
.volume.on .line:nth-of-type(1) {
  animation: line 0.8s ease-in-out 0.5s both infinite alternate;
}
.volume.on .line:nth-of-type(2) {
  animation: line 1.1s ease-in-out 0.5s both infinite alternate;
}
.volume.on .line:nth-of-type(3) {
  animation: line 1.0s ease-in-out 0.5s both infinite alternate;
}
.volume.on .line:nth-of-type(4) {
  animation: line 0.9s ease-in-out 0.5s both infinite alternate;
}
.volume.on .line:nth-of-type(5) {
  animation: line 1.0s ease-in-out 0.5s both infinite alternate;
}
.volume.on .line:nth-of-type(6) {
  animation: line 1.1s ease-in-out 0.5s both infinite alternate;
}
@keyframes line {
  from {height: 2}
  to {height: 16px}
}
/*.volume.on .line {
  height: 16px;
}*/
.kv-bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /*background-color: rgba(26, 60, 103, 1);*/
  background-color: #031426;
}
.kv-bg-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height: 100%;*/
  /*width: 100%;*/
  width: 1920px;
}
.content {
  padding-top: 50px;
  overflow: hidden;
  background-color: #fff;
}
/*.case-title {
  margin-top: 40px;
  padding: 50px 0;
  background-color: #eee;
}
.case-title h3 {
  text-align: center;
}
.product-wrap {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
}
.product-item {
  width: 25%;
}
.product-item-inner {
  padding: 20px;
}*/
/*padding实现自适应----------*/
/*.product-item-content {
  position: relative;
  padding-bottom: 100%;
  border-radius: 5px;
  overflow: hidden;
}
.product-item-content:hover .mask {
  opacity: 1;
  top: 0;
  visibility: visible;
  height: 100%;
}
.product-item-content:hover .product-tag {
  opacity: 0;
  visibility: hidden;
}*/
/*.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.product-tag {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  visibility: visible;
  background-color: rgba(0, 0, 0, .4);
  color: #fff;
  transition: .2s ease;
}
.mask {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 0;
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: 100%;
  background-color: rgba(0, 193, 222, .7);
  transition: .3s ease;
}
.overlay-text {
  position: absolute;
  top: 50%;
  color: #fff;
  font-weight: bold;
  font-size: 20px;
}
*/
.product {
  position: relative;
  width: 1080px;
  margin-left: auto;
  margin-right: auto;
}
.product-text-container {
  width: 350px;
  padding-top: 30px;
}
.product-text {

}
.product-text h3 {
  color: #834f38;
  padding-bottom: 10px;
  margin-bottom: 15px;
  position: relative;
}
.product-text h3::after {
  content: '';
  width: 60px;
  height: 3px;
  display: block;
  background-color: #834f38;
  position: absolute;
  bottom: 0;
  left: 0;
}
.product-text p {
  width: 350px;
  font-size: 15px;
  line-height: 2.15;
  margin-bottom: 30px;
}
.photo-list {
  width: 1200px;
  position: absolute;
  top: 0;
  left: -60px;
}
.photo-list li {
  box-shadow: 80px 80px 98px 0px rgba(164, 168, 174, 0.2);
}
.photo-list li:nth-child(1) {
  width: 670px;
}
.photo-list li:nth-child(2) {
  margin-top: 430px;
  width: 530px;
}
.product-single p {
  width: 630px;
  min-height: 275px;
  clear: both;
  float: right;
  /*padding-top: 550px;*/
  margin-top: 550px;
  font-family: 'Rajdhani',sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1em;
  line-height: 2.5;
  color: #0000fa;
  background-color: #fff;
}
.technology {
  padding-top: 250px;
  padding-bottom: 45%;
  position: relative;
  overflow: hidden;
  background: url('~@/assets/technology_bg.png') center 200px no-repeat;
  background-size: 100%;
}
.technology-text-container {
  position: relative;
}
.technology-text {
  width: 50%;
  padding: 50px 80px;
  background-color: #fff;
  /*transform: translate3d(0, 40px, 0);*/
}
.technology-text h3 {
  position: relative;
  padding-bottom: 10px;
  color: #834f38;
  margin-bottom: 15px;
}
.technology-text p {
  font-size: 15px;
  line-height: 2.15;
  margin-bottom: 30px;
}
.technology-text h3::after {
  content: '';
  width: 60px;
  height: 3px;
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #834f38;
}
/*.technology-bg {
  position: absolute;
  width: 1300px;
  width: 100%;
  top: 390px;
  left: 0;
}*/
/*.app-area {
  padding-bottom: 20px;
  text-align: center;
}
.app-area-list {
  display: flex;
  flex-wrap: wrap;
  width: 70%;
  margin: 0 auto;
}
.app-area-item {
  padding: 10px;
  width: 16.6%;
}
.app-area-item span {
  color: #888;
}*/
img {
  width: 100%;
  height: auto;
}
@media (max-width: 1640px) {
  .kv-bg-video {
    width: 1780px;
  }
}
@media (max-width: 1440px) {
  .kv-bg-video {
    width: 1520px;
  }
}
@media (max-width: 1366px) and (max-height: 1024px) {
  .kv-bg-video {
    height: 100%;
    width: auto;
  }
  .technology {
    padding-bottom: 35%;
  }
}
@media (max-width: 1024px) and (max-height: 1366px){
  .kv-bg-video {
    height: 100%;
    width: auto;
  }
  .product-item {
    width: 50%;
  }
}
@media (max-width: 825px) {
  .technology {
    padding-bottom: 300px;
    background-size: 860px;
  }
  .technology-text{
    padding: 50px 25px 20px;
  }
}
@media (max-width: 825px) and (max-height: 375px) {
  .kv-bg-video {
    height: auto;
  }
}
@media (max-width: 768px) and (max-height: 1024px) {
  .kv-bg-video {
    height: 100%;
  }
}
@media (max-width: 480px) {
  .kv-main-content {
    top: 40%;
  }
  .btn-box {
    top: 60%;
    width: 80%;
    flex-direction: column;    
  }
  .btn-box button:nth-child(1) {
    margin-bottom: 20px;
  }
  .kv-base-h {
    font-size: 33px;
  }
  .kv-bg-video {
    height: 100%;
  }
  .product-item {
    width: 100%;
  }
  /*.app-area-item {
    width: 33.3%;
  }*/
  .product {
    /*position: relative;*/
    width: 100%;
    /*margin-left: auto;*/
    /*margin-right: auto;*/
  }
  .product-text-container {
    /*width: 350px;*/
    /*padding-top: 30px;*/
    width: 100%;
    padding: 20px;
    margin-top: 240px;
  }
  .product-text h3 {
    /*color: #834f38;*/
    /*padding-bottom: 10px;*/
    /*margin-bottom: 15px;*/
    /*position: relative;*/
  }
  .product-text h3::after {
    /*content: '';
    width: 60px;
    height: 3px;
    display: block;
    background-color: #834f38;
    position: absolute;
    bottom: 0;
    left: 0;*/
  }
  .product-text p {
    width: 100%;
    /*width: 350px;*/
    font-size: 13px;
    /*line-height: 2.15;*/
    /*margin-bottom: 30px;*/
  }
  .photo-list {
    /*width: 1200px;*/
    /*position: absolute;*/
    top: 40px;
    /*left: -60px;*/
    width: 100%;
    left: 0;
  }
  .photo-list li {
    box-shadow: 40px 40px 48px 0px rgba(164, 168, 174, 0.2);
  }
  .photo-list li:nth-child(1) {
    width: 85%
  }
  .photo-list li:nth-child(2) {
    width: 85%;
    margin-top: 320px;
  }
  .product-single p {
    /*width: 630px;
    min-height: 275px;
    clear: both;
    float: right;*/
    width: 100%;
    margin-top: 220px;
    /*padding-top: 220px;*/
    padding-left: 20px;
    padding-right: 20px;
    /*font-family: 'Rajdhani',sans-serif;*/
    /*font-weight: 600;*/
    font-size: 12px;
    /*letter-spacing: 1em;*/
    /*line-height: 2.5;*/
    /*color: #0000fa;*/
  }
  .technology {
    padding-top: 100px;
    /*padding-bottom: 300px;*/
  }
  .technology-text {
    width: 70%;
    min-width: 250px;
  }
  .technology-text p {
    font-size: 13px;
  }
}
</style>
