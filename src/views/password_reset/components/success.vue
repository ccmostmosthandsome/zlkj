<template>
  <div class="container">
    <span>您的密码为: <i>{{pwd}}</i></span>
    <button class="btn primary" type="button" @click="confirm">
      <span>确认</span>
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 3,
      pwd: 123456
    }
  },
  methods: {
    confirm () {
      this.$emit('stepHandle', this.active)
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
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
span {
  margin-bottom: 20px;
}
</style>