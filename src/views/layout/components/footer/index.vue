<template>
  <div class="container">
    <span>地址｜厦门市集美区软件园3期B02栋3楼</span>&nbsp;&nbsp;
    <span>客服热线｜0592-5868838</span>
    <p class="copyright">2018@Copyright by 筑理软件科技有限公司</p>
    <p class="copyright">闽ICP备18024089号-1</p>
    <div class="top" @click="scrollToTop">
      <svg-icon icon-name="top-arrow"></svg-icon>
      <i></i>
      <span class="top-text">TOP</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    scrollToTop () {
      // 滚动至顶部
      const timer = setInterval(() => {

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

        const ispeed = Math.floor(-scrollTop/5)

        // const ispeed = -100

        // console.log(ispeed)

        if (scrollTop<=0) {
          
          clearInterval(timer)

          document.documentElement.scrollTop = document.body.scrollTop = 0
        }

        document.documentElement.scrollTop = document.body.scrollTop = scrollTop + ispeed
      }, 30)
    }
  }
}
</script>

<style scoped>
.container {
  position: relative;
  text-align: center;
  padding: 80px;
  background-color: #1c2327;
  color: #ccc;
}
.top {
  position: absolute;
  right: 50px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}
.top:hover i {
  height: 30px;
}
i {
  width: 1px;
  height: 20px;
  background-color: #bbb;
  transition: height .4s ease;
}
.top-text {
  margin-top: 5px;
}
.copyright {
  margin-top: 10px;
}
@media (max-width: 480px) {
  .container {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    padding: 50px 0;
  }
  .top {
    right: 25px;
    bottom: 60px;
  }
}
</style>