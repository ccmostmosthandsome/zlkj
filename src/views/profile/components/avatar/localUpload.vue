<template>
  <form>
    <div class="avatar-local-wrap">
      <p>从电脑里挑选一张照片,插图或徽标作为头像吧</p>
      <div class="path-box">
        <button class="btn primary fileUpload">
          <span>上传</span>
          <input class="uploadInput" type="file" @change="readFile">
        </button>
        <input class="pathInput" type="text" disabled :value="fileName" placeholder="请选择一个文件">
      </div>
      <p>支持jpg格式图片,文件需小于2M</p>
    </div>
  </form>
</template>

<script>
export default {
  data () {
    return {
      fileName: '',
      base64Code: null
    }
  },
  props: ['hasfile'],
  watch: {
    hasfile (val) {
      // 判断是否点击了取消键
      if (!val) {
        // 点击
        this.fileName = ''
      }
    }
  },
  methods: {
    readFile (e) {

      if (!e.target.files[0]) return //打开但未选择

      const file = e.target.files[0]

      if (!/image\/\w+/.test(file.type)) {

        alert('请检查图片格式')

        return
      }

      this.fileName = file.name

      this.fileRead(file)
    },
    fileRead (file) {

      const reader = new FileReader()

      // 将文件读取为 DataURL
      reader.readAsDataURL(file)

      // 文件读取成功触发
      reader.onload = () => {

        this.base64Code = reader.result

        this.$emit('dataURL', reader.result, file.type) //传父
      }
    }
  }
}
</script>

<style scoped>
form {
  font-size: 14px;
  color: #666;
}
.avatar-local-wrap {
  margin: 50px 0 40px 120px;
}
.path-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.fileUpload {
  margin: 10px 0;
  position: relative;
}
.uploadInput {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  outline: none;
  opacity: 0;
  cursor: pointer;
  /*text-indent: -999px;*/
}
.pathInput {
  padding: 5px;
  margin-left: 10px;
  border: 1px solid #ddd;
  width: 200px;
  height: 35px;
  background-color: #eee;
  color: #666;
  cursor: not-allowed;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn {
  padding: 0 20px;
  height: 35px;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  border: none;
}
</style>