<template>
  <div class="register">
    <div class="register-body">
      <div class="container">
        <div class="content">
          <div class="head">欢迎注册筑理科技</div>
          <div class="tips">
            <span class="tips-text">已有筑理科技账号？</span>
            <a class="tips-link" href="/login" target="_top">快捷登录 &gt;</a>
          </div>
          <form class="form" ref="regform">
            <div class="form-item">
              <div class="form-item-control">
                <input class="input" type="text" placeholder="设置账号名" name="username" required v-model.trim="account" @change="accountInput">
                <div v-show="!accountValidate" class="form-item-explain">请设置账号名</div>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-control">
                <input class="input" type="password" placeholder="设置你的登录密码" name="pwd" @change="pwdInput" required v-model="pwd">
                <div v-show="!pwdValidate" class="form-item-explain">{{pwdexplain}}</div>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-control">
                <input class="input" type="password" placeholder="请再次输入你的密码" @change="repwdInput" required v-model="repwd">
                <div v-show="!repwdValidate" class="form-item-explain">{{repwdexplain}}</div>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-control">
                <input class="input" type="text" placeholder="请输入手机号码" name="usernum" required v-model.trim="usernum" @change="phoneInput">
                <div v-show="!usernumValidate" class="form-item-explain">请输入正确的手机号码</div>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-control">
                <input class="input" type="text" placeholder="昵称" name="nickname" v-model.trim="nickname">
                <div class="form-item-explain"></div>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-control">
                <input class="input" type="text" placeholder="公司名称" name="company" v-model.trim="company">
                <div class="form-item-explain"></div>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-control">
                <input class="input" type="text" placeholder="公司地址" name="address" v-model.trim="address">
                <div class="form-item-explain"></div>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-control">
                <button type="button" class="btn primary" @click="register">注册</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { setToken } from '@/utils/auth'

export default {
  // filters: {
  //   trim (str) {
  //     if (!str) return ''
  //     return str.replace(/^\s+/, '').replace(/\s+$/, '')
  //   }
  // },
  data () {
    return {
      account: null,
      accountValidate: true,
      usernum: null,
      usernumValidate: true,
      pwd: null,
      pwdValidate: true,
      repwd: null,
      repwdValidate: true, //密码验证
      pwdexplain: null,
      repwdexplain: null,
      nickname: null,
      company: null,
      address: null
    }
  },
  methods: {
    accountInput () {
      this.accountValidate = true
    },
    pwdInput (e) {

      // this.pwd = e.target.value

      this.pwdValidate = true

      if (this.pwd.length < 6) {

        this.pwdValidate = false

        this.pwdexplain = '密码不能少于6位'

      }

      if (this.repwd) {

        if (this.pwd === this.repwd) {

          this.repwdValidate = true

        } else {

          this.repwdValidate = false

          this.repwdexplain = '密码不一致, 请重新输入'
        }
      }
    },
    repwdInput (e) {

      // this.repwd = e.target.value

      if (this.pwd) {

        if (this.pwd === this.repwd) {

          this.repwdValidate = true
        } else {

          this.repwdValidate = false

          this.repwdexplain = '密码不一致, 请重新输入'
        }
      }
    },
    phoneInput (e) {

      if (!/^1[34578]\d{9}$/.test(e.target.value)) {

        this.usernumValidate = false
      } else {

        this.usernumValidate = true
      }
    },
    register () {

      if (!this.account) {
        // 账号
        this.accountValidate = false

      }

      if (!this.pwd) {
        // 密码
        this.pwdValidate = false
        this.pwdexplain = '请设置你的密码'
      }

      if (!this.repwd) {

        // 验证密码
        this.repwdexplain = '请再次输入你的密码'

      } 

      if (!this.usernum) {

        this.usernumValidate = false
      }

      if (!/\d{6,}/.test(this.pwd)) return

      if (!this.account || !this.pwd || !this.repwd || !this.usernum) return

      if (this.accountValidate && this.usernumValidate && this.pwdValidate && this.repwdValidate) {

        // const fd = new FormData(this.$refs.regform)

        // console.log(fd)

        this.axios({
          method: 'post',
          url: 'register.php',
          data: {
            userId: this.account, //账号
            usernum: this.usernum,
            pwd: this.pwd,
            username: this.nickname,
            company: this.company,
            address: this.address
          }
        }).then((res) => {
          console.log(res)
          //1成功 0用户已存在
          if (res.data.code === 1) {
            
            Cookies.set('token', res.data.token) //令牌存储

            this.$router.push({path: '/'}) //跳转

            this.$store.state.user.isLogin = true

            this.$message({
              message: '恭喜你，注册成功',
              type: 'success'
            })
            console.log('注册成功已打印')
            // this.relogin()
          } else if (res.data.code === 0) {
            
            this.$message({
              message: '用户名已存在',
              type: 'error'
            })
          }
        }).catch((error) => {

          this.$message({
            message: '请检查网络连接',
            type: 'warning'
          })
          console.log(error)
        })
      }
    }
    // relogin () {
    //   console.log('已执行登录')
    //   // 注册成功后登录
    //   this.axios({
    //     method: 'post',
    //     // url: 'http://www.guihuao.com/earth/login/login.php',
    //     // url: 'login/login.php',
    //     url: 'login.php',
    //     data: {
    //       // mobile: this.regPhoneNum,
    //       userId: this.account,
    //       pwd: this.pwd
    //     }
    //   }).then(response => {
    //     if (response.status === 200) {
    //       // console.log(response)
    //       // do something
    //       if (response.data.code === 0) {
    //         this.$message.error('用户名或密码不正确')
    //       } else if (response.data.code === 1) {
    //         // 登录成功do something
    //         // 设置cookie（头像，用户名）
    //         // Cookies.set('avatar', 'http://guihuao.com/earth/' + response.data.data[0].Touxiang, { expires: 7 })
    //         if (response.data.data.touxiang) {
    //           // null时设置默认头像
    //           Cookies.set('avatar', 'http://192.168.1.188/Earth/' + response.data.data.touxiang, { expires: 7 })
    //         }

    //         // setToken(response.data.data[0].PhoneNum)
    //         setToken(response.data.data.userId)
    //         this.$store.state.user.isLogin = true
    //         // 获取用户其他信息(公司，地址等)
    //         // this.getUserInfo()
    //         this.setUserInfoToStore(response.data.data)

    //         this.$router.push({path: '/'})
    //       }
    //     } else {
    //       this.$message({
    //         message: '登录失败，请重试',
    //         type: 'warning'
    //       })
    //     }
    //   }).catch(error => {

    //     console.log(error)
    //   })
    // },
    // setUserInfoToStore () {

    //   this.$store.state.user.userInfo = info
    // }
  }
}
</script>

<style scoped>
/*.has-success {

}
.has-error {

}*/
.register {
  height: 100%;
  background-color: #eee;
}
.register-body {
  padding-top: 6vh;
}
.container {
  width: 60%;
  background-color: #fff;
  margin: 0 auto;
  position: relative;
  border-radius: 5px;
}
.content {
  /*width: 320px;*/
  width: 45%;
  margin: 0 auto;
  text-align: center;
  padding-bottom: 80px;
}
.head {
  padding-top: 40px;
  font-size: 30px;
  color: #373d41;
  letter-spacing: 1px;
  line-height: 36px;
}
.tips {
  position: absolute;
  top: 40px;
  right: 40px;
  /*left: 70%;*/
  font-size: 12px;
  color: #73777a;
  letter-spacing: .4px;
  line-height: 36px;
  /*text-align: left;*/
}
.tips-link {
  color: #00c1de;
}
.form {
  padding-top: 20px;
}
.form-item {
  height: 42px;
  margin-top: 20px;
}
.form-item-control {
  /*width: 100%;*/
  position: relative;
}
.input {
  padding: 0 10px;
  width: 100%;
  height: 42px;
  border: 1px solid #ccc;
  transition: .2s;
  font-size: 14px;
  border-radius: 3px;
}
.input:focus {
  outline: none;
  border-color: #00c1de;
}
.input:hover {
  border-color: #00c1de;
}
.form-item-explain {
  font-size: 14px;
  color: #f15533;
  line-height: 14px;
  position: absolute;
  left: calc(100% + 10px);
  top: 14px;
  width: 300px;
  text-align: left;
}
.btn {
  width: 100%;
  height: 42px;
  padding: 0 10px;
  font-size: 16px;
  line-height: 40px;
  /*border-width: 1px;*/
  border: 1px solid transparent;
  border-radius: 3px;
  outline: none;
  font-weight: 500;
  cursor: pointer;
}
@media (max-width: 1180px) {
  .tips {
    width: 100%;
    top: 80px;
    right: 50%;
    transform: translateX(50%);
  }
  .form-item-explain {
    left: 0;
    top: 45px;
  }
  .form-item {
    margin-top: 25px;
  }
}
@media (max-width: 780px) {
  .content {
    width: 80%;
  }
  .head {
    font-size: 24px;
  }
}
@media (max-width: 480px) {
  .register {
    background-color: #fff;
  }
  .register-body {
    padding: 0;
  }
  .container {
    width: 100%;
  }
}
</style>
