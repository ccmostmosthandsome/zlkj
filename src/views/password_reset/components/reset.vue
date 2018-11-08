<template>
  <form class="form form-row-layout" action="">
    <div class="form-field">
      <label class="form-label" for="firstpwd">输入密码</label>
      <div class="form-content">
        <input class="form-control" type="password" v-model="firstpwd" id="firstpwd">
      </div>
    </div>
    <div class="form-field">
      <label class="form-label" for="secondpwd">再输入密码</label>
      <div class="form-content">
        <input class="form-control" type="password" v-model.trim="secondpwd" id="secondpwd">
      </div>
    </div>
    <div class="form-field">
      <label class="form-label"></label>
      <div>
        <button class="btn primary" type="button" @click="next">
          <span>下一步</span>
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  data () {
    return {
      firstpwd: null,
      secondpwd: null,
      active: 2
    }
  },
  methods: {
    next () {
      if (!this.firstpwd || !this.secondpwd) {

        this.$message({
          message: '密码不能为空',
          type: 'error' 
        })
        return
      } else {
        if (this.firstpwd !== this.secondpwd) {
          this.$message({
            message: '密码不一致',
            type: 'error'
          })
        } else {
          // this.$axios({

          // }).then((res) => {
          //   console.log(res)

            this.$emit('stepHandle', this.active)
          // }).catch((error) => {
          //   console.log(error)
          // })

        }
      }
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
.form-control:hover {
  border-color: #00c1de;
}
.form-control:focus {
  border-color: #00c1de;
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
}
</style>