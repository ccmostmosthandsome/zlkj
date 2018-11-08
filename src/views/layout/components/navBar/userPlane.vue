<template>
  <div class="topbar-right-plane-wrap" @click="hidehandle" @mouseenter="planeVisible=true" @mouseleave="planeVisible=false">
    <div>
      <img class="avatar" :src="avatar">
    </div>
    <div :class="['plane-wrap', {'hide': !planeVisible}]" @mousewheel.prevent>
      <!-- <i class="triangle"></i> -->
      <div class="user-plane">
        <div class="plane-header">
          <router-link to="/profile" tag="li">
            <!-- <svg-icon icon-name="personal"></svg-icon> -->
            <img class="avatar" :src="avatar">
            {{account}}
          </router-link>
        </div>
        <div class="plane-links">
          <router-link to="/" tag="li">
            <svg-icon icon-name="storage"></svg-icon>
            积分
          </router-link>
          <router-link to="/" tag="li">
            <svg-icon icon-name="financial"></svg-icon>
            充值
          </router-link>
        </div>
        <div class="plane-footer" @click="logout">
          <router-link to="/" tag="li">
            <svg-icon icon-name="exit"></svg-icon>
            退出
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/bus.js'
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
import { getToken, removeToken } from '@/utils/auth.js'

export default {
  inject: ['reload'], //注入reload方法
  data () {
    return {
      account: this.$store.state.user.userInfo.userId,
      avatar: require('@/assets/icon/default_handsome.jpg'),
      planeVisible: false
    }
  },
  computed: {
    ...mapGetters(['newAvatar'])
  },
  mounted () {

    if (this.newAvatar) {

      // 先查找状态管理
      this.avatar = this.newAvatar
    } else if (Cookies.get('avatar')) {

      // 否则取cookie
      this.avatar = Cookies.get('avatar')
    }
  },
  updated () {

    // profile路由下内部组件切换后，监听updateAvatar不起作用(待解决方案)-----------------------------
    Bus.$on('updateAvatar', () => {

      this.avatar = this.newAvatar
    })
  },
  methods: {
    hidehandle (e) {

      // console.log(e)
      if (e.target.tagName === 'LI') {
        // 用户面板消失

        this.planeVisible = false
      }
    },
    logout () {

      this.$store.state.user.isLogin = false
      // 清楚cookie
      Cookies.remove('avatar')

      removeToken()

      Cookies.remove('token')

      this.$router.push({path: '/'})

      this.reload()
    }
  }
}
</script>

<style scoped>
.topbar-right-plane-wrap {
  position: relative;
  padding: 10px 20px 10px 10px;
  cursor: pointer;
}
/*.topbar-right-plane-wrap:hover .plane-wrap {
  opacity: 1;
  visibility: visible;
}*/
.avatar {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  vertical-align: middle;
}
.plane-wrap {
  position: absolute;
  right: 0;
  top: 50px;
  /*background-color: #1c2327;*/
  background-color: #1c2327;
  transition: .2s;
}
.user-plane {
  padding: 0 12px;
}
.user-plane li {
  margin: 13px 0;
  width: 200px;
  height: 30px;
  line-height: 30px;
}
.plane-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}
.plane-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}
.user-plane li:hover {
  color: #00c1de;
  cursor: pointer;
}
</style>