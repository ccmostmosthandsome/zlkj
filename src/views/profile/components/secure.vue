<template>
  <div class="container">
    <div class="secure">
      <div class="console-title console-title-border">
        <h5>安全设置</h5>
      </div>
      <div class="console-avatar console-title-border">
        <div class="avatar">
          <p>
            <img :src="avatar">
            <p class="avatar-text">
              <a class="modify-avatar" @click="modifyAvatar">修改头像</a>
            </p>
          </p>
        </div>
        <div class="summary">
          <p>
            <span>登录账号</span>
            <span>:</span>
            <span>{{account}}</span>
          </p>
          <p>
            <span>昵称</span>
            <span>:</span>
            <span>{{nickname}}</span>
          </p>
          <p>
            <span>公司</span>
            <span>:</span>
            <span>{{company}}</span>
          </p>
        </div>
      </div>
      <form class="form form-row-layout" action="">
        <h5>修改密码</h5>
        <div class="form-field">
          <label class="form-label" for="oldpwd">输入原始密码:</label>
          <div class="form-content">
            <input class="form-control" type="password" v-model="oldpwd" id="oldpwd">
          </div>
        </div>
        <div class="form-field">
          <label class="form-label" for="newpwd">输入新密码:</label>
          <div class="form-content">
            <input class="form-control" type="password" v-model.trim="newpwd" id="newpwd">
          </div>
        </div>
        <div class="form-field">
          <label class="form-label"></label>
          <div>
            <button class="btn primary" type="button" @click="pwdSubmit">
              <span>保存</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/bus'
import Cookies from 'js-cookie'
import { getToken } from '@/utils/auth.js'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      account: null,
      nickname: null,
      company: null,
      avatar: require('@/assets/icon/default_handsome.jpg'),
      oldpwd: null,
      newpwd: null
    }
  },
  computed: mapGetters(['newAvatar', 'userInfo']),
  mounted () {
    // 账号
    // this.account = getToken()
    this.account = this.userInfo.userId
    this.nickname = this.userInfo.username
    this.company = this.userInfo.company
    // 头像
    if (this.newAvatar) {

      this.avatar = this.newAvatar
    } else if (Cookies.get('avatar')) {

      this.avatar = Cookies.get('avatar')
    }

    Bus.$on('updateAvatar', () => {
      // 头像更新
      this.avatar = this.newAvatar
    })
  },
  destroyed () {
    Bus.$off(['updateAvatar'])
  },
  methods: {
    modifyAvatar () {
      // 弹出修改头像窗口
      this.$emit('popAvatar', false)
    },
    pwdSubmit () {

      // 修改密码
      if (!this.oldpwd || !this.newpwd) {

        this.$message({
          message: '密码不能为空',
          type: 'error'
        })
        return
      } else {

        if (!/\d{6,}/.test(this.newpwd)) return this.$message({
          message: '密码不能少于6位',
          type: 'error'
        })

        this.axios({
          method: 'post',
          // url: 'User_QinxiePHP/user_password.php',
          url: 'setPassword.php',
          data: {
            // password1: this.oldpwd,
            // password2: this.newpwd,
            // type: 2,
            // usernum: this.account
            userId: this.account,
            pwd: this.oldpwd,
            setpwd: this.newpwd
          }
        }).then((response) => {

        // console.log(response)

          if (response.data.code === 0) return this.$message({message: '密码修改失败',type: 'error'})
          
          this.oldpwd = ''

          this.newpwd = ''

          this.$message({
            message: '密码修改成功',
            type: 'success'
          })

        }).catch((error) => {

          console.log(error)
        })
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 0 15px;
}
.console-title {
  padding: 16px 0;
}
.console-title-border {
  border-bottom: 1px solid #ddd;
}
.console-title h5 {
  border-left: 3px solid rgb(0, 193, 222);
  text-indent: 8px;
  margin: 8px 0;
  font-size: 17px;
  font-weight: 400;
}
.console-avatar {
  display: flex;
  margin-top: 8px;
}
.avatar img {
  margin-right: 28px;
  width: 120px;
  height: 120px;
}
.avatar-text {
  margin-bottom: 10px;
  width: 120px;
  text-align: center;
  /*color: rgb(0, 193, 222);*/
  color: rgb(0, 140, 180);
  font-size: 15px;
}
.modify-avatar:hover {
  text-decoration: underline;
}
.summary {
  padding-top: 25px;
}
.summary p {
  margin-bottom: 10px;
}
.form {
  color: #555;
}
.form h5 {
  margin: 20px 0;
  font-weight: 400;
  font-size: 16px;
  color: #000;
}
.form-field {
  display: flex;
  margin-top: 20px;
}
.form-label {
  width: 130px;
  padding: 10px 15px 0;
  font-size: 15px;
  font-weight: 400;
  text-align: right;
}
.form-content {
  width: 33.3%;
}
.form-control {
  width: 100%;
  height: 35px;
  padding: 10px;
  border-radius: 5px;
  outline: none;
  border: 1px solid #ddd;
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
</style>