<template>
  <div class="container">
  	<div v-if="contentEdit" class="upload-box">
  		<div class="upload-box-video" v-for="(item, index) in billboards[_index].videoSrc" :key="index">
  			<i class="del-icon" @click="delVideo(index)">×</i>
  			<video>
  				<source :src="item">
  			</video>
  		</div>
  		<div class="upload">
  			<svg-icon icon-name="upload" icon-class="svg"></svg-icon>
  			<input class="input-file" type="file" accept="video/*" enctype="multipart/form-data" @change="upload">
  		</div>
  	</div>
  	<div v-else class="video-box" @click="slideHandle">
  		<video v-for="(item, index) in billboards[_index].videoSrc" :key="index" :data-index="index">
  			<source :src="item">
  		</video>
  	</div>
  </div>
</template>

<script>
import Bus from '@/utils/bus.js'
import { mapGetters } from 'vuex'

export default {
	props: {
		contentEdit: {
			type: Boolean,
			default: false
		},
		_index: {
			type: Number,
			default: 0
		}
	},
	data () {
		return {
			// videoSrc: [require('@/assets/1.jpg'), require('@/assets/2.jpg'), require('@/assets/3.jpg'), require('@/assets/4.jpg'), require('@/assets/5.jpg'), require('@/assets/6.jpg'), require('@/assets/7.jpg'), require('@/assets/8.jpg'), require('@/assets/10.jpg'), require('@/assets/11.jpg')]
		}
	},
	computed: mapGetters(['billboards']),
	methods: {

		upload (obj) {

			let video = obj.target.files[0]

			// if (video.size / 1024 > 2048) {

   //      alert('请选择2M以内的图片！')

   //      return false
   //    }

      let reader = new FileReader()

			// 将文件读取为DataURL
			reader.readAsDataURL(video)
			// reader.readAsArrayBuffer(video)

			// 文件读取成功触发
			reader.onload = () => {

				let data = reader.result

				console.log(data, this)

				this.$store.state.bz.billboards[this._index].videoSrc.push(data)

				// 发送图片数据
			}
		},
		delVideo (index) {

			this.$store.state.bz.billboards[this._index].videoSrc.splice(index, 1)
			// this.videoSrc.splice(index, 1)
		},
		slideHandle (e) {

			if (e.target.nodeName.toLowerCase() === 'video') {

				const index = e.target.dataset.index

				Bus.$emit('slide', this.billboards[this._index].videoSrc, index, true, 'vid')
			}
		}
	}
}
</script>

<style scoped>
.container {
	padding: 10px;
}
.upload-box, .video-box {
	display: flex;
	flex-wrap: wrap;
	max-height: 110px;
	overflow: auto;
}
.upload-box-video {
	position: relative;
	margin-right: 10px;
	margin-bottom: 10px;
}
video {
	width: 50px;
	height: 50px;
	background-color: rgba(0, 0, 0, 1);
}
.del-icon {
	position: absolute;
	top: 2px;
	right: 2px;
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background-color: red;
	cursor: pointer;
	line-height: 12px;
	z-index: 1;
}
.del-icon:hover {
	animation: mymove .4s;
}
@keyframes mymove {
	from {right: 4px;}
	25% {right: 0px;}
	50% {right: 3px;}
	75% {right: 1px;}
	to {right: 2px;}
}
.upload {
	position: relative;
	width: 50px;
	height: 50px;
	/*background-color: #00c1de;*/
	text-align: center;
	line-height: 50px;
	background-color: rgba(0, 0, 0, .4);
	border: 1px solid rgba(255, 255, 255, .7);
}
.svg {
	margin-top: 12px;
	font-size: 24px;
}
/*.upload::before {
	content: '上传视频';
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 26px;
	color: rgba(255, 255, 255, .8);
	line-height: 50px;
}*/
.input-file {
	position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  text-indent: -9999px;
  /*color: transparent;*/
  outline: none;
}
.video-box video {
	margin-right: 10px;
	margin-bottom: 10px;
	cursor: pointer;
	background-color: rgba(0, 0, 0, 1);
}
</style>