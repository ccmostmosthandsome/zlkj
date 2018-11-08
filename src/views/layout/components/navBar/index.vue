<template>
  <nav :class="['topbar', {'bgc': navbar!=='home'}]">
    <div class="topbar-left">
      <div v-if="isHome" class="all-nav" @mouseenter="sideBarVisible=true" @mouseleave="sideBarVisible=false">
        <svg-icon icon-name="hamburger"></svg-icon>
        <side-bar :sideBarVisible="sideBarVisible"></side-bar>
      </div>
      <div class="topbar-logo">
        <router-link to="/" style="display:block">
          <img class="logo" :src="logo">
        </router-link>
      </div>
    </div>
    <div class="topbar-right">
      <div v-show="navbar==='model'" class="input-box">
        <input class="search" type="text" placeholder="搜索3D模型" v-model="modelName" @change="searchModel">
        <svg-icon icon-name="search" icon-class="search-svg" @click.native="searchModel"></svg-icon>
      </div>
      <!-- <div class="topbar-right-language topbar-right-link">语言</div> -->
      <!-- <div class="topbar-right-cart topbar-right-link">购物车</div> -->
      <!-- <div class="topbar-right-console topbar-right-link">控制台</div> -->
      <!-- <div class="topbar-right-link">
        <router-link to="/upload">上传</router-link>
      </div> -->
      <!-- <div v-show="navbar!=='model'" class="topbar-right-model topbar-right-link">
        <router-link to="/model">模型</router-link>
      </div> -->
      <!-- <div class="topbar-right-photo topbar-right-link">
        <a href="http://www.ardea.cn/index1.html">全景</a>
      </div> -->
      <div v-if="!isLogin" class="topbar-right-box">
        <div class="topbar-right-login topbar-right-link">
          <router-link to="/login">登录</router-link>
        </div>
        <div class="topbar-right-register topbar-right-link primary">
          <router-link to="/register">注册</router-link>
        </div>
      </div>
      <user-plane v-else></user-plane>
    </div>
  </nav>
</template>

<script>
// import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
import SideBar from './sideBar'
import UserPlane from './userPlane'
import { getToken, removeToken } from '@/utils/auth.js'
import Bus from '@/utils/bus.js'

export default {
  components: {
    SideBar, UserPlane
  },
  data () {
    return {
      logo: require('@/assets/logo.png'),
      sideBarVisible: false,
      modelName: null
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'isHome']),
    navbar () {
      return this.$route.name
    }
  },
  mounted () {

    if (getToken()) {

      this.$store.state.user.isLogin = true
    }
  },
  methods: {
    searchModel () {

      Bus.$emit('searchModel', this.modelName)
    }
  }
}
</script>
<style scoped>
.bgc {
  /*background-color: #1c2327;*/
  background-color: #1c2327;
}
.topbar {
  position: absolute;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background .5s;
  color: #fff;
  box-sizing: content-box;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 14px;
}
.topbar:hover {
  /*background-color: #1c2327;*/
  background-color: #1c2327;
  /*background-color: #fff;*/
  /*border-bottom: none;*/
  /*transition: background .5s;*/
}
.topbar-left, .topbar-right {
  display: flex;
}
.topbar-right {
  /*padding-right: 10px;*/
  height: 100%;
  align-items: center;
}
.all-nav {
  position: relative;
  height: 50px;
  width: 50px;
  border-right: 1px solid rgba(255, 255, 255, 0.15);
  text-align: center;
  line-height: 50px;
  transition: background-color .2s;
}
.all-nav:hover {
  background-color: #00c1de;
}
.topbar-logo {
  padding-left: 20px;
  line-height: 50px;
}
.logo {
  width: 80px;
  vertical-align: middle;
}
.topbar-right-link {
  padding: 0 10px;
}
.topbar-right-link:hover {
  color: #00c1de;
  cursor: pointer;
}
.topbar-right-box {
  display: flex;
  padding-right: 10px;
  line-height: 25px;
}
.topbar-right-register {
  border-radius: 5px;
  height: 25px;
  /*line-height: 25px;*/
}
.topbar-right-register:hover {
  color: #fff;
}
.input-box {
  position: relative;
  width: 200px;
  height: 100%;
  background: hsla(0,0%,100%,.12);
  transition: width .5s;
  border: 1px solid transparent;
  box-sizing: border-box;
  /*border: 1px solid #00c1de;*/
}
.input-box:hover {
  width: 300px;
  border-color: #00c1de;
}
.input-box .search {
  width: 100%;
  height: 100%;
  padding: 0 30px 0 15px;
  outline: none;
  border: none;
  background-color: transparent;
  color: #fff;
  box-sizing: border-box;
  font-size: 16px;
}
.input-box .search::-webkit-input-placeholder {
  color: #eee;
}
.search-svg {
  width: 16px!important;
  height: 16px!important;
  position: absolute;
  top: 17px;
  right: 10px;
  color: #ddd;
}
.search-svg:hover {
  color: #fff;
  cursor: pointer;
}
@media (max-width: 480px) {
  .input-box {
    width: 120px;
  }
  .input-box:hover {
    width: 150px;
  }
  .input-box .search {
    font-size: 13px;
  }
  .topbar-right-link {
    padding: 0 5px;
  }
}
</style>
