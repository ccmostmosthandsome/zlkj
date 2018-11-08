<template>
  <form class="form" action="">
    <div class="form-field">
      <label class="form-label" for="account">账号</label>
      <div class="form-content">
        <input class="form-control" type="text" id="account" v-model.trim="account">
      </div>
    </div>
    <div class="form-field">
      <label class="form-label" for="yzm">手机动态码</label>
      <div class="form-content from-getyzm-box">
        <input class="form-control input-yzm" type="text" id="yzm" v-model.trim="yzm">
        <button :class="['btn', 'btn-yzm', 'primary', {'active': activeYzm}]" type="button" @click="getyzm" ref="yzm">
          <span v-if="activeYzm">{{second}}秒后重新获取</span>
          <span v-else>获取验证码</span>
        </button>
      </div>
    </div>
    <div class="form-field">
      <label class="form-label"></label>
      <button class="btn primary" type="button" @click="next">
        <span>下一步</span>
      </button>
    </div>
  </form>
</template>

<script>
export default {
  data () {
    return {
      active: 1,
      account: null,
      yzm: '',
      activeYzm: false,
      second: 60
    }
  },
  methods: {
    next () {
      // 下一步
      if (!this.account || !this.yzm) {

        // this.$message.error('账号或验证码不能为空')
        this.$message({
          message: '账号或验证码不能为空',
          type: 'error',
          duration: 2000
        })

        // alert('账号或验证码不能为空')

        return
      } else {
        // this.$axios({
        //   methods: 'post',
        //   url: '',
        //   data: {

        //   }
        // }).then((res) => {
          // 步骤用active属性表示，从0开始

          // 把active传给父组件
          this.$emit('stepHandle', this.active)
        //   console.log(res)
        // }).catch((err) => {

        //   console.log(err)
        // })
      }
    },
    getyzm () {

      // if (!/^\w{4}$/.test(this.yzm)) {

      //   this.$message({
      //     message: '验证码格式不正确',
      //     type: 'error',
      //     duration: 2000
      //   })
      //   return
      // } else {}
      // 输入账号自动获取验证码到手机上
      if (!this.account) {

        this.$message({
          message: '请输入您的账号',
          type: 'error',
          duration: 2000
        })

        return
      }

      this.activeYzm = true

      this.$refs.yzm.disabled = true

      const timer = setInterval(() => {

        this.second--

        if (this.second <= 0) {

          this.activeYzm = false

          this.second = 60

          clearInterval(timer)

          this.$refs.yzm.disabled = false
        }
      }, 1000)

      // this.$axios({
      //   methods: 'post',
      //   url: '',
      //   data: {

      //   }
      // }).then((res) => {

      //   console.log(res)
      // }).catch((err) => {

      //   console.log(err)
      // })
    }
  }
}
</script>
<style scoped>
.btn {
  padding: 0 20px;
  height: 35px;
  border-radius: 5px;
  /*color: #fff;*/
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  border: 1px solid transparent;
}
.form {
  margin-top: 30px;
  font-size: 16px;
  /*width: 100%;*/
}
.form-field {
  display: flex;
  margin-top: 30px;
  /*display: flex;
  justify-content: center;*/
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
.form-control:hover {
  border-color: #00c1de;
}
.form-control:focus {
  border-color: #00c1de;
}
.from-getyzm-box {
  display: flex;
  justify-content: space-between;
}
.form-control {
  outline: none;
  border: 1px solid #bbb;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
}
.input-yzm {
 width: calc(100% - 130px);
}
.btn-yzm {
  width: 125px;
  padding: 0;
  height: 100%;
}
.active {
  background-color: #eee;
  color: #999;
  border-color: #eee;
  cursor: not-allowed;
}
.active:hover {
  background-color: #eee;
}

@media (max-width: 970px) {
  .form-content {
    width: 45%;
  }
}
@media (max-width: 780px) {
  .form-content {
    width: 60%;
  }
}
@media (max-width: 480px) {
  .form-content {
    width: 65%;
  }
  .form-label {
    width: 90px;
    padding: 10px 10px 0;
    font-size: 14px;
  }
  .btn-yzm {
    width: 90px;
  }
  .input-yzm {
   width: calc(100% - 95px);
  }
}
</style>