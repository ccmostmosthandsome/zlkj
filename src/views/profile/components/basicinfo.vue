<template>
  <div class="container">
    <div class="basic">
      <div class="console-title">
        <h5>基本资料</h5>
      </div>
      <div class="alert">
        请完善以下信息,方便我们更好的为您服务
      </div>
      <div class="basicinfo-bd">
        <form class="form form-row-layout" action="">
          <h5>基本信息</h5>
          <div class="form-field">
            <label class="form-label from-group">
              <span>*&nbsp;</span><span>用户名:</span>
            </label>
            <div class="form-content account">{{account}}</div>
          </div>
          <h5>个人信息</h5>
          <div class="form-field">
            <label class="form-label" for="nickname">昵称:</label>
            <div class="form-content">
              <input class="form-control" type="text" id="nickname" v-model="nickname">
            </div>
          </div>
          <div class="form-field">
            <label class="form-label" for="phone">联系电话:</label>
            <div class="form-content">
              <input class="form-control" type="text" id="phone" v-model="phone">
            </div>
          </div>
          <div class="form-field">
            <label class="form-label" for="company">公司:</label>
            <div class="form-content">
              <input class="form-control" type="text" id="company" v-model="company">
            </div>
          </div>
          <div class="form-field">
            <label class="form-label" for="address">地址:</label>
            <div class="form-content">
              <input class="form-control" type="text" id="address" v-model="address">
            </div>
          </div>
          <div class="form-field submit">
            <label class="form-label"></label>
            <div>
              <button class="btn primary" type="button" @click="infoSubmit">
                <span>保存</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { getToken } from '@/utils/auth.js'

export default {
  data () {
    return {
      account: this.$store.state.user.userInfo.userId,
      phone: this.$store.state.user.userInfo.PhoneNum,
      company: this.$store.state.user.userInfo.company,
      address: this.$store.state.user.userInfo.address,
      nickname: this.$store.state.user.userInfo.username
    }
  },
  mounted () {
    // this.account = getToken()
    // 获取用户信息
    // this.getUserInfo()
  },
  methods: {
    infoSubmit () {
      this.axios({
        method: 'post',
        // url: 'User_QinxiePHP/user_saveAlterInfo.php',
        url: 'setUserinfo.php',
        data: {
          // username: '',
          // email: '',
          // company: this.company,
          // address: this.address,
          // usernum: this.account
          username: this.nickname, //昵称
          userId: this.account, //账号
          company: this.company,  //公司
          address: this.address,  //地址
          usernum: this.phone //手机号
        }
      }).then((res) => {

        console.log(res)

        if (res.data.code === 0) {

          // alert('用户信息保存失败')
          this.$message({
            message: '用户信息保存失败',
            type: 'error'
          })

        } else if (res.data.code === 1) {

          // alert('用户信息保存成功')
          this.$message({
            message: '用户信息保存成功',
            type: 'success'
          })

          this.getUserInfo()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getUserInfo () {
      this.axios({
        method: 'post',
        // url: 'User_QinxiePHP/huoquInfo.php',
        url: 'checkLogin.php',
        data: {
          // Phonenum: this.account
          token: Cookies.get('token')
        }
      }).then((res) => {

        console.log(res)
        // 状态管理
        this.setUserInfoToStore(res.data.data)
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
.container {
  padding: 0 15px;
}
.console-title {
  padding: 16px 0;
}
.console-title h5 {
  border-left: 3px solid rgb(0, 193, 222);
  text-indent: 8px;
  margin: 8px 0;
  font-size: 17px;
  font-weight: 400;
}
.alert {
  padding: 12px;
  background-color: rgb(238, 238, 238);
  color: #777;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}
.form {
  color: #555;
}
.form h5 {
  margin: 20px 0;
  font-weight: 400;
  font-size: 16px;
  color: 0;
}
.form-field {
  display: flex;
  margin-top: 20px;
}
.from-group span:nth-child(1) {
  color: rgb(255, 0, 0);
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
.account {
  padding-top: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
