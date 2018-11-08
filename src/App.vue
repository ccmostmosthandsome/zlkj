<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <transition name="loading-fade"> -->
    <loading v-show="isLoading || isAjaxLoading"></loading>
    <!-- </transition> -->
    <transition name="fade">
      <router-view v-show="!isLoading && !isAjaxLoading"></router-view>
    </transition>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Loading from '@/components/loading'
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    Loading
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['isLoading', 'isAjaxLoading'])
  },
  mounted () {
    // 刷新页面时需再判断一次
    if (this.$route.name === 'home') {

      this.$store.state.allnav.isHome = true
    } else {

      this.$store.state.allnav.isHome = false
    }
  },
  watch: {
    $route () {
      // 全局监听路由变化，主页时显示左边的汉堡导航，否则就不显示
      if (this.$route.name === 'home') {

        this.$store.state.allnav.isHome = true
      } else {

        this.$store.state.allnav.isHome = false
      }
    }
  }
}
</script>

<style>
body::-webkit-scrollbar {
  display: none;
}
#app {
  /*width: 100%;*/
}
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
/*.loading-fade-leave-active {
  transition: all 0.05s linear;
}*/
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
