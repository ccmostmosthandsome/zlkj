<template>
  <div v-if="isRouterAlive">
    <nav-bar :class="[{'hide': navBarVisible}, 'fixed', {'bgc': navBarBgc}]"></nav-bar>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from './components/navBar/index.vue'
import { getToken } from '@/utils/auth.js'
import { mapGetters } from 'vuex'

export default {
  provide () {
    // 刷新当前页面
    return {
      reload: this.reload
    }
  },
  components: {
    NavBar
  },
  data () {
    return {
      isRouterAlive: true,
      scrollTopArr: [],
      // navBarFixed: true,
      navBarBgc: false,
      navBarVisible: false,
      account: null
    }
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  mounted () {
    
    if (getToken()) {
      // 登录状态
      this.account = getToken()

      if (!this.isLogin) {
        // 已经登录的用户刷新页面时获取用户信息至状态管理(防止信息为空)
        // 判断是否通过登录窗口登录，是就不用获取用户信息,用户刷新为否（登录时已获取过）
        this.getUserInfo()
      }
    }

    document.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    // console.log(4132)
    // 离开该页面移除监听的事件
    document.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    reload () {

      this.isRouterAlive = false

      this.$nextTick(() => {

        this.isRouterAlive = true
      })
    },
    handleScroll (e) {
      // console.log(e.target.scrollingElement.scrollTop)
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      // console.log(scrollTop)

      let arrLength = this.scrollTopArr.length

      this.scrollTopArr.push(scrollTop)

      if (arrLength > 2) {

        this.scrollTopArr.shift()
      }
      
      // 滚动距离差
      let result = this.scrollTopArr[arrLength-1] - this.scrollTopArr[arrLength-2]
      // console.log(arrLength, this.scrollTopArr)

      if (arrLength > 2 && result < 0) {
        // 上滚
        this.navBarBgc = true

        if (this.scrollTopArr[1] < 50) {
          // 上滚至小于50px时透明
          this.navBarBgc = false
        }
        this.navBarVisible = false
      } else if (arrLength > 2 && result > 0 && this.scrollTopArr[1] > 50) {
        // 下滚
        this.navBarBgc = false
        
        this.navBarVisible = true
      }
    },
    getUserInfo () {
      this.axios({
        method: 'post',
        url: 'User_QinxiePHP/huoquInfo.php',
        data: {
          Phonenum: this.account
        }
      }).then((res) => {

        console.log(res)
        // 状态管理
        this.setUserInfoToStore(res.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    setUserInfoToStore (info) {

      this.$store.state.user.userInfo = info
    }
  }
}
</script>

<style scoped>
.bgc {
  background-color: #1c2327;
}
</style>
