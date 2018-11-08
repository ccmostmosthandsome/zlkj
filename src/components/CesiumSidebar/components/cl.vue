<template>
  <div class="tab-container">
    <div class="title">
      测量
    </div>
    <div class="content">
    	<div class="content-center">
				<div class="content-center-top">
					<div class="distance">
						<div :class="{'active': currentHandle === 'distance'}" @click="distanceHandle">
							<svg-icon icon-name="distance" icon-class="svg svg-point"></svg-icon>
						</div>
						<span>距离</span>
					</div>
					<div class="acreage">
						<div :class="{'active': currentHandle === 'acreage'}" @click="acreageHandle">
							<svg-icon icon-name="area" icon-class="svg svg-point"></svg-icon>
						</div>
						<span>面积</span>
					</div>
					<div class="triangle">
						<div :class="{'active': currentHandle === 'triangle'}" @click="triangleHandle">
							<svg-icon icon-name="triangle" icon-class="svg svg-point"></svg-icon>
						</div>
						<span>三角</span>
					</div>
				</div>
      </div>
      <div class="content-bottom">
        <button class="btn" @click="clearMeasure">
          <span>清除测量</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { SetMode, clearDrawingBoard } from '@/utils/measure.js'
import { mapGetters } from 'vuex'

export default {
	data () {
		return {
			currentHandle: null
		}
	},
	computed: mapGetters(['viewer']),
	methods: {
		distanceHandle () {

			const that = this

			this.currentHandle = 'distance'

			SetMode('drawLine', that)
		},
		acreageHandle () {

			const that = this

			this.currentHandle = 'acreage'

			SetMode('drawPloy', that)
		},
		triangleHandle () {

			const that = this

			this.currentHandle = 'triangle'

			SetMode('sanjiao', that)
		},
		clearMeasure () {

			const that = this

			clearDrawingBoard(that)
		}
	}
}
</script>

<style scoped>
.btn {
	width: 200px;
  background-color: #00c1de;
  cursor: pointer;
  text-align: center;
  line-height: 30px;
  border-radius: 5px;
  outline: none;
  border: none;
  color: #eee;
  font-weight: 500;
  letter-spacing: 1px;
}
.btn:hover {
	background-color: rgb(0, 140, 180);
}
.content {
	text-align: center;
	padding: 0 25px;
}
.content-center-top {
	display: flex;
	justify-content: space-between;
}
.content-center-top > div {
	display: flex;
	flex-direction: column;
}
.svg {
	font-size: 30px;
	box-sizing: content-box;
	padding: 5px;
}
.content-bottom {
	/*text-align: center;*/
	padding: 20px 0;
  /*background-color: rgba(0, 0, 0, .4);*/
}
.active {
	color: #00c1de;
}
</style>