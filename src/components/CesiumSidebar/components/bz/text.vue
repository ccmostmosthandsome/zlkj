<template>
	<div class="container">
		<textarea v-if="contentEdit" class="textarea" v-model="billboards[_index].text" placeholder="请输入"></textarea>
		<div v-else class="text">{{billboards[_index].text}}</div>
	</div>
</template>

<script>
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
			// content: this.billboards[this._index].text
		}
	},
	computed: mapGetters(['billboards'])
}
</script>

<style scoped>
.container {
	padding: 10px;
}
.textarea {
	max-width: 208px;
	width: 208px;
	height: 110px;
	padding: 5px;
}
.textarea::-webkit-input-placeholder {
	color: #999;
}
.text {
	overflow: hidden;
  text-overflow:ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 12px;
}
</style>