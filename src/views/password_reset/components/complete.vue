<template>
  <div class="container">
    <h3>恭喜，密码设置成功</h3>
    <button class="btn primary" type="button" @click="confirm">
      <span>完成</span>
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 4
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
h3 {
  margin-bottom: 20px;
}
</style>