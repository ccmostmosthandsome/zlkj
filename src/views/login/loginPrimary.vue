<template>
  <div class="popup" @keyup="enterLogin">
    <!-- 密码登录 -->
    <form class='loginpwd-popup center-x'>
      <!-- <input type="hidden" name="csrfmiddlewaretoken" value=""> -->
      <header class="popup-header clearfix">
        <div class="popup-title fl">密码登录</div>
        <!-- <div class="popup-actions fr">
          <a class="popup-close" href="javascript:void(0)">
            <i>×</i>
          </a>
        </div> -->
      </header>
      <div class="popup-content">
        <div class="form-column-layout" data-action="process-signup">
          <div class="fields">
            <div class="form-field username-field username">
              <label class="form-label" for="mobileid-reg">账号</label>
              <!-- <span></span> -->
              <div class="form-content">
                <input id="mobileid-reg" class="phone-input w100" type="text" name="username" value="" required="" data-error-for="username" autofocus="" pattern="^[a-zA-Z0-9._-]+$" title="Letters, numbers, -, _ and . only" v-model="regPhoneNum">
              </div>
            </div>
            <div class="form-field password">
              <div class="form-label-box">
                <label class="form-label" for="password">
                  密码
                </label>
                <a class="link" href="/password_reset">忘记密码?</a>
              </div>
              <div class="form-content">
                <input id="password" class="password-input w100" type="password" name="password" value="" required="" pattern=".{8,}" title="8 characters minimum" v-model="password">
              </div>
            </div>
            <hr class="form-separator">
            <div class="form-field form-buttons signup-field">
              <div class="form-content clearfix">
                <button type=button class="form-button secondary fl w45" @click="regcancelClick">
                  <span class="state-normal">取消</span>
                </button>
                <button type=button id="login-reg" class="form-button primary fr w45" @click="regloginClick">
                  <span class="state-normal">登录</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="popup-footer">
        <!-- <div class="bridge">
            记密码太烦? <a class="switch-nopwd" href="javascript:void(0)" @click="loginToggle">切换到免注册登录</a>
        </div> -->
      </footer>
    </form>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
// import router from '../../router'
import { getToken, setToken } from '@/utils/auth'

const phonereg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/
export default {
  data () {
    return {
      // loginVisibletrigger: true,
      phoneNum: null,
      regPhoneNum: null,
      password: null,
      // yzm: null,
      // yzmText: '获取验证码',
      time: null,
      disabled: false
    }
  },
  // created () {
  //   console.log(this.$route.params.toPath)
  // },
  methods: {
    enterLogin (e) {
      if (e.keyCode === 13) {
        this.regloginClick()
      }
    },
    // loginToggle () {
    //   this.loginVisibletrigger = !this.loginVisibletrigger
    // },
    // 免注册登录部分
    // verificationClick () {
    //   if (!phonereg.test(this.phoneNum)) {
    //     this.$message.error('请输入有效手机号')
    //     return false
    //   }
    //   // 目前跨域，或修改请求配置不能有basic路径
    //   this.axios({
    //     method: 'post',
    //     url: 'login/sendyzm.php',
    //     data: {
    //       mobile: this.phoneNum
    //     }
    //   }).then(response => {
    //     // console.log(response)
    //     if (response.status === 200) {
    //       this.$message({
    //         message: '验证码发送成功',
    //         type: 'success'
    //       })
    //       // 读秒和禁用获取验证码
    //       this.disabled = true
    //       let time = 60
    //       const id = setInterval(() => {
    //         time--
    //         this.yzmText = time + '秒后重新发送'
    //         if (time <= 0) {
    //           clearInterval(id)
    //           this.yzmText = '获取验证码'
    //           this.disabled = false
    //         }
    //         // console.log(time)
    //       }, 1000)
    //     }
    //   })
    // },
    // loginClick () {
    //   if (!this.phoneNum || !this.yzm) {
    //     this.$message.error('请输入手机号和验证码')
    //   } else {
    //     this.axios({
    //       method: 'post',
    //       url: 'login/register.php',
    //       data: {
    //         mobileid: this.phoneNum,
    //         yzm: this.yzm
    //       }
    //     }).then(response => {
    //       // console.log(response)
    //       if (response.status === 200) {
    //         if (response.data === false) {
    //           this.$message.error('手机号或验证码不正确')
    //         } else {
    //           setToken(response.data.PhoneNum)
    //           this.$store.isLogin
    //           // 跳转到用户之前要去的页面
    //           if (this.$route.params.toPath) {
    //             this.$router.push({path: this.$route.params.toPath})
    //           } else {
    //             this.$router.push({path: '/'})
    //           }
    //         }
    //       }
    //     })
    //   }
    // },
    // cancelClick () {
    //   this.phoneNum = ''
    //   this.yzm = ''
    // },
    // 密码登录部分
    regcancelClick () {
      this.regPhoneNum = ''
      this.password = ''
    },
    regloginClick () {
      if (!this.regPhoneNum || !this.password) {
        this.$message.error('用户名或密码不正确')
        return false
      }
      this.axios({
        method: 'post',
        // url: 'http://www.guihuao.com/earth/login/login.php',
        // url: 'login/login.php',
        url: 'login.php',
        data: {
          // mobile: this.regPhoneNum,
          userId: this.regPhoneNum,
          pwd: this.password
        }
      }).then(response => {
        if (response.status === 200) {
          console.log(response)
          // do something
          if (response.data.code === 0) {
            this.$message.error('用户名或密码不正确')
          } else if (response.data.code === 1) {
            // 登录成功do something
            // 设置cookie（头像，用户名）
            // Cookies.set('avatar', 'http://guihuao.com/earth/' + response.data.data[0].Touxiang, { expires: 7 })
            if (response.data.admin === '1') {

              location.href = 'http://www.ardea.cn/Earth/manager/center/index.html'

            } else{

              // 头像可以不这样设置待修改-------------------------------------------
              if (response.data.data.touxiang) {
                // null时设置默认头像
                Cookies.set('avatar', 'http://192.168.1.188/Earth/' + response.data.data.touxiang, { expires: 7 })
              }

              Cookies.set('token', response.data.token) //令牌
              // setToken(response.data.data[0].PhoneNum)
              // setToken(response.data.data.userId)
              this.$store.state.user.isLogin = true

              this.$store.state.user.userInfo = response.data.data
              // 获取用户其他信息(公司，地址等)
              // this.getUserInfo()
              // this.setUserInfoToStore(response.data.data)
              // 跳转到用户之前要去的页面
              // console.log(this.$route.params.toPath)
              if (this.$route.params.toPath) {
                this.$router.push({path: this.$route.params.toPath})
              } else {
                this.$router.push({path: '/'})
              }
            }
          }
        } else {
          this.$message({
            message: '登录失败，请重试',
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '请检查网络连接',
          type: 'warning'
        })
        console.log(error)
      })
    }
    // getUserInfo () {
    //   this.axios({
    //     method: 'post',
    //     url: 'User_QinxiePHP/huoquInfo.php',
    //     data: {
    //       Phonenum: getToken()
    //     }
    //   }).then((res) => {

    //     console.log(res)
    //     // 状态管理
    //     this.setUserInfoToStore(res.data)
    //   }).catch((err) => {
    //     console.log(err)
    //   })
    // },
    // setUserInfoToStore (info) {

    //   this.$store.state.user.userInfo = info
    // }
  }
}
</script>

<style scoped>
.link {
  color: rgb(0, 193, 222);
}
.form-separator {
  border: 1px solid #ddd;
}
.popup {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
/*密码登录*/
.popup .loginpwd-popup {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  transition: .2s;
  max-width: 500px;
  min-width: 250px;
  width: 80%;
  border-radius: 5px;
  overflow: hidden;
  /*margin: auto;*/
  margin-top: 10%;
  border: 1px solid #ccc;
}
.loginpwd-popup .popup-header {
  padding: 0 20px;
  background-color: #eee;
  text-align: left;
  height: 70px;
  line-height: 70px;
}
.loginpwd-popup .popup-content {
  background-color: #fff;
}
.popup .loginpwd-popup .popup-header .popup-title {
  font-size: 21px;
  height: 70px;
  line-height: 70px;
  letter-spacing: 4px;
  /*font-weight: 700;*/
}
/*.loginpwd-popup .popup-header .popup-actions .popup-close {
}
.loginpwd-popup .popup-header .popup-actions .popup-close i {
  font-size: 33px;
  line-height: 33px;
  color: #ccc;
}*/
.popup .loginpwd-popup .popup-content {
  padding: 20px;
  font-size: 15px;
}
.popup .loginpwd-popup .popup-content .state-normal {
  font-size: 16px;
  font-weight: 540;
}
.form-label-box {
  display: flex;
  justify-content: space-between;
}
.popup .loginpwd-popup .popup-content .form-label {
  margin-bottom: 2px;
  font-size: 15px;
  text-align: left;
  font-weight: 400;
}
.popup .loginpwd-popup .popup-content .form-content {
  padding: 10px 0 20px;
}
.popup .loginpwd-popup .popup-content .form-content input {
  padding-left: 10px;
  height: 45px;
  line-height: 45px;
  border-radius: 4px;
  overflow: hidden;
  outline: none;
  border: 1px solid #ccc;
  font-size: 16px;
}
/*.popup .loginpwd-popup .popup-content .form-content input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 25px #fff inset;
}*/
.popup .loginpwd-popup .popup-content .form-content input:hover {
  border-color: #00c1de;
}
.popup .loginpwd-popup .popup-content .form-content input:focus {
  border-color: #00c1de;
}
.popup .loginpwd-popup .popup-content .form-content input::placeholder {
  color: #e20f0f;
}
.popup .loginpwd-popup .popup-content .form-buttons {
  margin: 20px 0 0px;
}
.popup .loginpwd-popup .form-content .form-button {
  height: 45px;
  line-height: 45px;
  /*background-color: #00c1de;*/
  border: 0;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  outline: none;
}
/*.popup .loginpwd-popup .form-content .form-button:hover {
  opacity: .9;
}*/
/*.popup .loginpwd-popup .form-content .cancel {
  background-color: #e6f9fc;
  color: #00c1de;
}*/
.popup .loginpwd-popup .popup-footer {
  padding: 20px 25px;
  font-size: 15px;
  background-color: #eee;
}
.popup .loginpwd-popup .popup-footer .bridge {
  text-align: center;
  color: #999
}
</style>
