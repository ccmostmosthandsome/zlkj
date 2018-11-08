<template>
  <div class="container">
    <div class="header">
      <div class="pwdreset-title">密码找回</div>
      <el-steps class="step" align-center :active="active" finish-status="success">
        <el-step title="安全认证"></el-step>
        <el-step title="重置密码"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
    </div>
    <div class="body">
      <component :is="currentComponent" @stepHandle="stepHandle"></component>
    </div>
  </div>
</template>

<script>
import Validate from './components/validate'
import Reset from './components/reset'
import Success from './components/success'
import Complete from './components/complete'

export default {
  components: {
    Validate, Reset, Success, Complete
  },
  data () {
    return {
      currentComponent: 'Validate',
      active: 0
    }
  },
  watch: {
    active (val) {
      if (val === 0) {
        this.currentComponent = 'Validate'
      } else if (val === 1) {
        this.currentComponent = 'Reset'
      } else if (val === 2) {
        this.currentComponent = 'Success'
      } else if (val === 3) {
        this.currentComponent = 'Complete'
      }else if (this.active > 3) {
        this.active = 0
      }
    }
  },
  methods: {
    stepHandle (active) {
      console.log(active)
      this.active = active
    }
  }
}
</script>

<style scoped>
.container {
  padding: 50px 50px 0;
}
.header {
  padding: 40px 0;
}
.pwdreset-title {
  font-size: 22px;
  font-weight: bold;
}
.body {
  padding-top: 10px;
  padding-bottom: 40px;
  /*border-top: 1px solid #ccc;*/
  border: 1px solid #ccc;
  border-radius: 5px;
}
.step {
  padding-top: 30px;
}
/*.form {
  margin-top: 30px;
  font-size: 16px;
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
}*/
</style>