<template>
  <div class="container">
  	<div v-if="contentEdit" class="upload-box">
  		<div class="upload-box-img" v-for="(item, index) in billboards[_index].imgSrc" :key="index">
  			<i class="del-icon" @click="delImg(index)">×</i>
  			<img :src="item">
  		</div>
  		<div class="upload">
  			<input class="input-file" type="file" accept="image/png, image/jpeg, image/gif, image/jpg" enctype="multipart/form-data" @change="upload">
  		</div>
  	</div>
  	<div v-else class="img-box" @click="slideHandle">
  		<img v-for="(item, index) in billboards[_index].imgSrc" :key="index" :src="item" :data-index="index">
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
			// imgSrc: [require('@/assets/1.jpg'), require('@/assets/2.jpg'), require('@/assets/3.jpg'), require('@/assets/4.jpg'), require('@/assets/5.jpg'), require('@/assets/6.jpg'), require('@/assets/7.jpg'), require('@/assets/8.jpg'), require('@/assets/10.jpg'), require('@/assets/11.jpg')]
		}
	},
	computed: mapGetters(['billboards']),
	methods: {

		upload (obj) {

			let img = obj.target.files[0]

			// if (!/image\/\w+/.test(img.type)) {

			//   alert('请上传图片！')

			//   return false
			// }

			if (img.size / 1024 > 2048) {

        alert('请选择2M以内的图片！')

        return false
      }

      let reader = new FileReader()

      console.log(reader)

			// 将文件读取为DataURL
			reader.readAsDataURL(obj.target.files[0])
			// 文件读取成功触发

			reader.onload = () => {

				let base64Code = reader.result

				console.log(base64Code, this)

				// this.imgSrc.push(base64Code)
				this.$store.state.bz.billboards[this._index].imgSrc.push(base64Code)

				// 发送图片数据
			}
		},
		delImg (index) {

			this.$store.state.bz.billboards[this._index].imgSrc.splice(index, 1)
			// this.imgSrc.splice(index, 1)
		},
		slideHandle (e) {

			if (e.target.nodeName.toLowerCase() === 'img') {

				const index = e.target.dataset.index

				Bus.$emit('slide', this.billboards[this._index].imgSrc, index, true, 'pic')
			}
		}
	}
}
</script>

<style scoped>
.container {
	padding: 10px;
}
.upload-box, .img-box {
	display: flex;
	flex-wrap: wrap;
	max-height: 110px;
	overflow: auto;
}
.upload-box-img {
	position: relative;
	margin-right: 10px;
	margin-bottom: 10px;
}
img {
	width: 50px;
	height: 50px;
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
	background-color: rgba(0, 0, 0, .4);
	border: 1px dashed rgba(255, 255, 255, .7);
}
.upload::before {
	content: '＋';
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 26px;
	color: rgba(255, 255, 255, .8);
	line-height: 50px;
}
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
.img-box img {
	margin-right: 10px;
	margin-bottom: 10px;
	cursor: pointer;
}
</style>