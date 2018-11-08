<template>
  <svg :class="svgClass">
    <use :xlink:href="svgName"></use>
  </svg>
</template>

<script>
export default {
  props: {
    iconClass: {
      type: String
    },
    iconName: {
      type: String,
      required: true
    }
  },
  computed: {
    svgClass () {
      if (this.iconClass) {
        return this.iconClass + ' ' + 'svg-icon'
      } else {
        return 'svg-icon'
      }
    },
    svgName () {
      return `#${this.iconName}`
    }
  }
}
</script>

<style scoped>
.svg-icon {
  vertical-align: text-bottom;
  width: 1em;
  height: 1em;
  line-height: 1em;
  fill: currentColor;
  overflow: hidden;
}
</style>
