<template>
  <div class="container">
    <div class="content">
      <div :class="['profile-navbar', {shrink: profileNavbar}]">
        <div class="profile-nav-title">账号管理</div>
        <div class="profile-nav-list">
          <ul role="tree">
            <li v-for="(item, index) in tab" :key="index" :class="['profile-navbar-link', {active: item.name===currentTab}]" @click="currentTab=item.name">{{item.text}}</li>
          </ul>
        </div>
      </div>
      <div :class="['profile-navbar-collapse', {moveleft: profileNavbar}]">
        <div class="profile-navbar-collapse-inner" @click="collapseProfileNavbar">
          <div :class="['profile-navbar-collapse-bg', {bg: profileNavbar}]"></div>
          <div class="profile-navbar-collapse-svg-box">
            <svg-icon v-if="profileNavbar" icon-name="rightindent"></svg-icon>
            <svg-icon v-else icon-name="leftindent"></svg-icon>
          </div>
        </div>
      </div>
      <component :class="['profile-body', {extend: profileNavbar}]" :is="currentTab" @popAvatar="popAvatar"></component>
    </div>
    <!-- 头像编辑弹窗 -->
    <div :class="['popup', {hide: popupVisible}]">
      <div class="mask"></div>
      <div :class="['modal-dialog', {hide: popupAvatar}]">
        <div class="modal-content">
          <div class="modal-header">
            <h5>修改头像</h5>
            <button class="close" @click="cancel">×</button>
          </div>
          <div class="modal-body">
            <ul class="avatar-nav">
              <li v-for="it in avatarNavTab" :key="it.name" class="avatar-nav-toggle">
                <a :class="{avatarTabActive: avatarCurrentTab===it.name}" @click="avatarCurrentTab=it.name">{{it.text}}</a>
              </li>
            </ul>
            <!-- 本地上传和个性编辑 -->
            <component class="avatar-body" :is="avatarCurrentTab" @dataURL="dataURL" :hasfile="hasfile"></component>
          </div>
          <div class="modal-footer">
            <button class="btn primary" @click="upload">
              <span>确认</span>
            </button>
            <button class="btn secondary" @click="cancel">
              <span>取消</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import Bus from '@/utils/bus'
import { getToken } from '@/utils/auth'
import Secure from './components/secure.vue'
import Basicinfo from './components/basicinfo.vue'
import LocalEditUpload from './components/avatar/localEditUpload.vue'
import LocalUpload from './components/avatar/localUpload.vue'

export default {
  components: {
    Secure, Basicinfo, LocalEditUpload, LocalUpload
  },
  data () {
    return {
      popupVisible: true,
      popupAvatar: true,
      profileNavbar: false,
      tab: [{name: 'Secure', text: '安全设置'}, {name: 'Basicinfo', text: '基本资料'}],
      currentTab: 'Secure',
      avatarNavTab: [{name: 'LocalUpload', text: '本地头像上传'}, {name: 'LocalEditUpload', text: '个性头像编辑'}],
      avatarCurrentTab: 'LocalUpload',
      base64Code: null,
      type: null, //图片格式
      hasfile: null
    }
  },
  methods: {
    collapseProfileNavbar () {
      this.profileNavbar = !this.profileNavbar
    },
    popAvatar (boolean) {
      this.popupVisible = boolean
      this.popupAvatar = boolean
    },
    // 从localUpload组件接收base64和图片类型
    dataURL (base64Code, type) {

      this.base64Code = base64Code

      this.type = type
    },
    upload () {

      if (!this.base64Code) {

        this.$message({
          message: '请选择一个文件',
          type: 'warning'
        })

        return
      }

      this.axios({
        // url: 'User_QinxiePHP/Touxiang.php',
        url: 'saveUserImg.php',
        method: 'post',
        data: {
          // image: this.base64Code,
          // PhoneNum: getToken(),
          // imageType: this.type
          img: this.base64Code,
          userId: getToken()
        }
      }).then((response) => {

        console.log(response)
        // 成功之前等待
        if (response.data.code === 1) {
          // 等待解除          
          // Cookies.set('avatar', 'http://guihuao.com/earth/' + response.data.data.Touxiang, { expires: 7 })
          Cookies.set('avatar', 'http://192.168.1.188/Earth/' + response.data.path, { expires: 7 })

          this.$store.state.user.newAvatar = this.base64Code

          Bus.$emit('updateAvatar') //通知各组件更新头像
          this.base64Code = null //每次需要用户选择文件后才能上传
          this.hasfile = false //父传子清空输入框
        }
      }).catch((error) => {

        console.log(error)
      })

      this.popupVisible = true
      this.popupAvatar = true
    },
    cancel () {
      this.popupVisible = true
      this.popupAvatar = true
      this.base64Code = null
      this.hasfile = false //清空子组件输入框
    },
    // getUserInfo () {
    //   // 用户信息
    //   this.axios({
    //     method: 'post',
    //     url: 'User_QinxiePHP/huoquInfo.php',
    //     data: {
    //       Phonenum: getToken()
    //     }
    //   }).then((response) => {
        
    //     this.userInfo = response
    //     console.log(response)
    //   }).catch((error) => {

    //     console.log(error)
    //   })
    // }
  }
}
</script>

<style scoped>
.container {
  position: absolute;
  width: 100%;
  top: 50px;
  bottom: 0px;
  /*background-color: #000;*/
  /*z-index: 100;*/
}
.content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.profile-navbar {
  width: 200px;
  /*background-color: rgb(0, 193, 222);*/
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  transition: all .2s ease;
  /*background-color: rgb(238, 238, 238);*/
  /*background-color: rgb(0, 193, 222);*/
  /*background-color: #1c2327;*/
  background-color: #1c2327;
  color: #fff;
}
.profile-nav-title {
  height: 70px;
  line-height: 70px;
  /*background-color: #D9DEE4;*/
  /*background-color: #1c2327;*/
  text-indent: 20px;
  font-weight: bold;
  font-size: 19px;
}
.profile-nav-list {
  position: absolute;
  top: 70px;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
  /*color: #555;*/
}
.profile-navbar-link {
  padding-left: 30px;
  height: 50px;
  line-height: 50px;
  cursor: pointer;
  transition: background-color .2s ease;
}
.profile-navbar-link:hover {
  /*color: rgb(0, 140, 180);*/
  color: rgb(0, 193, 222);
  background-color: hsla(0,0%,100%,.8);
}
.profile-navbar-collapse {
  position: absolute;
  left: 180px;
  top: 50%;
  width: 20px;
  height: 50px;
  cursor: pointer;
  transition: left .2s ease;
  z-index: 3;
}
.profile-navbar-collapse-inner {
  position: relative;
  top: -50%;
}
.profile-navbar-collapse-inner:hover .profile-navbar-collapse-bg {
  border-right-width: 20px;
}
.profile-navbar-collapse-inner:hover .profile-navbar-collapse-svg-box {
  right: 0;
}
.profile-navbar-collapse-bg {
  width: 0;
  height: 50px;
  position: absolute;
  top: 0;
  right: 0;
  left: auto;
  border-bottom: 9px solid transparent;
  border-left: none;
  border-right: 13px solid #f7f7f7;
  border-top: 9px solid transparent;
  transition: all .2s ease;
}
.profile-navbar-collapse-svg-box {
  position: relative;
  right: -7px;
  left: auto;
  height: 50px;
  line-height: 50px;
  transition: all .2s ease;
}
.profile-body {
  width: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 200px;
  /*overflow: hidden;*/
  overflow-y: auto;
  transition: left .2s ease;
}
.shrink {
  left: -200px;
}
.moveleft {
  left: 0;
}
.bg {
  border-left: 14px solid #D9DEE4;
  border-right: none;
  left: 0;
}
.moveleft .profile-navbar-collapse-svg-box {
  left: 0px;
}
.moveleft .profile-navbar-collapse-inner:hover .profile-navbar-collapse-bg {
  border-left-width: 21px;
}
.moveleft .profile-navbar-collapse-inner:hover .profile-navbar-collapse-svg-box {
  left: 6px;
}
.extend {
  left: 0;
}
.active {
  /*font-weight: bold;*/
  /*color: rgb(0, 140, 180);*/
  color: rgb(0, 193, 222);
  background-color: #fff!important;
}
/*上传头像弹窗*/
.popup {
  z-index: 11;
  position: absolute;
  top: -50px;
  left: 0;
  right: 0;
  bottom: 0;
}
.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, .5);
}
.modal-dialog {
  position: relative;
  width: 600px;
  margin: 30px auto;
  transition: transform 0.3s ease-out;
}
.modal-content {
  border-radius: 5px;
  /*border: 1px solid #999;*/
  border: 1px solid rgba(0,0,0,0.3);
  box-shadow: 0px 5px 10px rgba(0,0,0,0.5);
  background-color: #fff;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /*min-height: 16px;*/
  padding: 15px;
  border-bottom: 1px solid #e5e5e5;
}
.modal-header h5 {
  font-size: 15px;
  font-weight: 500;
}
.close {
  margin-top: -7px;
  font-weight: normal;
  outline: none;
  font-size: 28px;
  border: none;
  line-height: 1;
  color: #000000;
  text-shadow: 0 1px 0 #ffffff;
  opacity: 0.2;
  cursor: pointer;
  transition: opacity .2s;
}
.close:hover {
  opacity: .5;
}
.modal-body {
  border-bottom: 1px solid #ddd;
  padding: 20px;
  position: relative;
}
.avatar-nav {
  border-bottom: 1px solid #ddd;
  display: flex;
}
.avatar-nav-toggle {
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
.avatar-nav-toggle a {
  display: block;
  padding: 10px 16px;
  background-color: #FBFAF8;
  border-bottom: 0px;
  font-size: 14px;
  background-color: #eee;
  color: #666;
  border-top: 1px solid transparent;
  transition: background-color .2s ease, color .2s ease;
}
.avatar-nav-toggle a:hover {
  background-color: #fff;
  color: rgb(0, 193, 222);
}
.avatar-nav-toggle .avatarTabActive {
  background-color: #fff;
  border-top: 2px solid rgb(0, 193, 222);
  /*margin-left: -1px;*/
  margin-bottom: -1px;
  cursor: default;
  color: rgb(0, 193, 222);
}
.avatar-body {
}
.modal-footer {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
}
.modal-footer button:nth-child(1) {
  margin-right: 20px;
}
.btn {
  padding: 0 20px;
  height: 35px;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  border: none;
}
.hide {
  display: none;
}
</style>
