<template>
  <div class="loading">
    <svg-icon class="jump" icon-name="loading"></svg-icon>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data () {
    return {

    }
  }
}
</script>

<style scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)!important;
}
.jump {
  width: 100px!important;
  height: 100px!important;
  z-index: 100;
  animation: jump .8s ease-in infinite;
}
@keyframes jump {
  0% {
    transform: translateY(0) scale(1.15,.8);
  }
  20% {
    transform: translateY(-35px) scaleY(1.1);
  }
  50% {
    transform: translateY(-50px) scale(1);
  }
  80% {
    transform: translateY(-35px) scale(1);
  }
  100% {
    transform: translateY(0) scale(1.15,.8);
  }
}
</style>