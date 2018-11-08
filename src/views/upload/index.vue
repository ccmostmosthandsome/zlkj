<template>
  <div class="container">
    上传模型
    <p>模型格式: .fbx, .obj, .dae, .blend, .stl…或.zip, .rar, .7z</p>
    <p>文件大小≤4GB</p>
    <button class="btn input-btn primary">
      选择文件
      <!-- <input id="input" class="input edited empty" name="input" multiple type="file" accept=".wrl,.obj,.ive,.3ds,.dae,.ply,.osg2,.osgt,.osgb,.osgx,.osgs,.gem,.geo,.mdl,.rgb,.lws,.dxf,.tgz,.osgterrain,.shp,.zae,.stl,.sta,.bvh,.ac,.flt,.ogr,.osga,.md2,.x,.txp,.dw,.osgtgz,.3dc,.asc,.lw,.lwo,.gdal,.bsp,.osg,.iv,.blend,.blend1,.fbx,.dat,.mc2obj,.dwf,.vpk,.zip,.7z,.rar,.gz,.kmz,.craft,.wrz,.mu,.q3d,.gltf,.glb,.iges,.igs,.abc,.las,.jpg,.jpeg,.png,.tga,.mtl,.psd,.bin" @change="upload"> -->
      <input id="f" class="file-input" type="file" name="part" ref="upload" @change="readFile">
    </button>
    <button :class="['btn', 'upload-btn', !currentFile ? 'disabled' : 'active' ]" @click="writeFile" ref="writeFile"><span>上传到服务器</span></button>
    <div v-if="currentFile" class="upload-list">
      <div class="file-content">
        <div class="file-text">
          <svg-icon :icon-name="currentType" icon-class="svg"></svg-icon>
          {{currentFile.name}}
        </div>
        <svg-icon icon-name="close" icon-class="svg-point" @click.native="cancel"></svg-icon>
      </div>
      <el-progress :percentage="percent" :status="status" :stroke-width="12"></el-progress>
    </div>
  </div>

  <!-- <div class="box">
    <i>总进度：</i>
    <div class="show-percent">
      <span class="percent"></span>
    </div>
    <div class="form-input">
      <div class="input-btn">点击选择文件上传</div>
      <input type="file" name="file" multiple="multiple" class="input-file" />
    </div>
    <ul class="file-lists">
      
    </ul>
  </div> -->
</template>

<script>
export default {
  data () {
    return {
      percent: 0,
      status: null,
      currentFile: null,
      currentType: 'file',
      supportType: ['fbx', 'obj', 'dae', 'blend', 'stl', 'zip', 'rar', '7z']
    }
  },
  mounted () {
    // 没有选文件就禁用
    this.$refs.writeFile.disabled = true
    // var _fileBtn = document.querySelector(".input-file"),file,files,_p,timer = null,filearr = [],count=0,_cstart=0,_tsize=0,_tp,_tstart = 0;
 
    // var start = 0,end = 0,_length = 4*1024*1024;//这里设置 每次向后台传多少个字节
 
    // var _fl = document.querySelector(".file-lists");
 
    // var _spercent = document.querySelector(".percent");
 
    // _fileBtn.onchange = function () {
 
    //   files = this.files;
   
    //   /**
    //    * 拿到文件对象 然后根据上传文件的个数 来创建dom节点
    //    */
   
    //   for (var i=0;i<files.length;i++) {
   
    //     var _li = document.createElement("li");
   
    //     _li.className = "file-list";
   
    //     _li.innerHTML = `<span class="file-list-name ${"list-name"+count}">${files[i].name}</span><div class="file-list-percent"><span class="list-percent-show ${"list-percent"+count}"></span></div>`;
   
    //     _fl.appendChild(_li);
   
    //     files[i].listName = ".list-name"+count;
   
    //     files[i].listpercent = ".list-percent"+count;
   
    //     _tsize += files[i].size;
   
    //     count += 1;

    //     filearr.push(files[i]);//把上传的文件 储存在数组中
    //   }
   
    //   fileinit(filearr);
    // }
   
    // function fileinit (filearr) {
   
    //   if (filearr.length >= 1) {
   
    //     file = filearr.splice(0,1)[0];//进行文件个数分割
   
    //     upLoading();
    //   }
    // }
   
    // var xhr = new XMLHttpRequest();
   
    // function upLoading () {
   
    //   if (end === file.size) {
   
    //     _cstart += file.size;
    //     start = 0;
    //     end = 0;
    //     fileinit(filearr);
    //     return false;
    //   }
    //   start=end;
    //   _tstart = start + _cstart;
    //   end=start+_length;
    //   if (end <= file.size) {
    //     xhrup();
    //   }else {
    //     if (start < file.size) {
    //       end = file.size;
    //       xhrup();
    //     }else {
    //       clearTimeout(timer);
    //     }
    //   }
    // }
   
    // function xhrup () {
   
    //   var listpercent = document.querySelector(file.listpercent);
   
    //   xhr.open("POST","/app/file.php",true);
   
    //   //"/app/file.php" 这个文件就是一个空的php文件 就是让上传的文件 有个去处 至于怎么处理 后台的事情
    //   xhr.onreadystatechange = function () {
   
    //     if (this.readyState === 4 && this.status >= 200) {
   
    //         timer = setTimeout('upLoading()',0);
    //     }
    //   }
    //   xhr.upload.onprogress = function (ev) {
   
    //     if (ev.lengthComputable) {

    //       _p = parseInt((ev.loaded + start)*100/file.size);
    //       _tp = parseInt((ev.loaded + _tstart)*100/_tsize);
   
    //       if (_p >= 100) {
    //         _p = 100;
    //       }
    //       if (_tp >= 100) {
    //         _tp = 100;
    //       }
    //       _spercent.innerHTML = _tp + "%";
    //       _spercent.style.width = _tp + "%";
    //       listpercent.innerHTML = _p + "%";
    //       listpercent.style.width = _p + "%";
    //     }
    //   }
    //   /**
    //    * 在此处分割数据
    //    *
    //    * 此处是关键 end - start = _length  如果后面不够长了 end就等于 file.length
    //    *
    //    */
    //   var _d = file.slice(start,end);
   
    //   var fd = new FormData();
   
    //   /**
    //    * 因为 ajax 传送的是 一个FormData  因此我们创建一个 
    //    *
    //    * 然后 把我们截取的 数据 放进这个对象中 作为 xhr.send(op);的参数
    //    */
   
    //   fd.append("file",_d);

    // }
  },
  methods: {
    readFile (obj) {
      console.log(obj)
      // 显示文件名和相应图标
      if (obj.target.files.length === 0) {

        this.currentFile = null
      } else {
        let chooseFile = obj.target.files[0].type.split('/')[1]
        // 判断文件格式是否符合
        if (this.supportType.indexOf(chooseFile) === -1) {
          // 不符合给出提示
          alert('文件格式不正确')

        } else {
          if (this.$refs.writeFile.disabled) {

            // 激活上传按钮（可点击）
            this.$refs.writeFile.disabled = false
          }
          
          // 符合
          this.status = null
          this.percent = 0
          this.currentType = obj.target.files[0].type.split('/')[1]
          this.currentFile = obj.target.files[0]

          if (this.currentType === 'zip') {
            // 选择zip格式
            return false
          } else {
            // 除了zip格式的其他格式
            this.currentType = 'file'
          }
        }
      }
    },
    writeFile () {
      // 确保只可点击执行一次（再次禁用）
      this.$refs.writeFile.disabled = true
      // 单文件上传
      let temp = null
      let formData = null
      let xhr = null

      // let file = document.getElementById('f')
      let file = this.$refs.upload
      // let f = file.files[0]

      if (this.currentFile.size < 1024 * 1024) {

        let temp = this.currentFile.slice(0, this.currentFile.size)
        
        formData = new FormData()
        
        formData.append(file.name, temp)

        this.axios({
          method: 'post',
          url: 'http://127.0.0.1:9999/index.php',
          data: formData
        }).then((res) => {

          this.loaded(100)
          console.log(res)
        }).catch((error) => {

          console.log(error)
        })
      } else {

        if (this.currentFile.size / (1024*1024*1024) > 4) {

          alert('请选择4G以内的模型！')

          return false
        }

        let totalSize = this.currentFile.size
        // 每次截取的大小
        let num = 1024*1024

        let start = 0
        let end = start + num

        // 发送到的地址
        let url = 'http://127.0.0.1:9999/index.php'
        // let url = 'http://127.0.0.1:50677/index.php'

        let writeFile = () => {
          // 如果已经截取完了跳出这个函数。
          if(start >= totalSize) return
          if(!this.currentFile) return //中途停止
          // 截取文件
          temp = this.currentFile.slice(start, end)

          formData = new FormData()

          formData.append(file.name, temp)

          xhr = new XMLHttpRequest()

          xhr.open('POST',url)

          const that = this

          xhr.onreadystatechange = function () {

            if (this.readyState===4 && this.status===200) {
                  console.log(xhr.responseText)
              // 改变下一次截取的位置
              start = end

              end = start + num
              //因为截取可能超过totalSize，判断最后一次截取是否大于totalSize如果大于就直接让end等于totalSize
              if(end>totalSize) {

                end = totalSize
              }
              // 可以用这个做进度条
              that.loaded((start/totalSize)*100)
              // 递归，如果文件没有截取完，继续截取
              writeFile();
            }
          }
          xhr.send(formData);
        }
        // 调用一下
        writeFile()
      }
    },
    loaded (bili) {
      // 进度条
      if (bili === 100) {

        this.status = 'success'
      }

      this.percent = parseInt(bili)
    },
    cancel () {
      // onchange监听的为input的value值，只有再内容发生改变的时候去触发（这里当删除文件后又选相同文件的情况）,将value置空即可
      if (!this.$refs.writeFile.disabled) {
        this.$refs.writeFile.disabled = true
      }
      this.$refs.upload.value = null
      this.currentFile = null
      this.status = null
      this.percent = 0
    }
  }
}
</script>

<style scoped>
.svg {
  width: 28px!important;
  height: 28px!important;
}
.container {
  padding-top: 50px;
}
.btn {
  padding: 0 20px;
  height: 35px;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  outline: none;
  border: none;
}
.input-btn {
  position: relative;
}
.file-input {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}
/*.upload-btn {
  background-color: #67c23a;
}
.upload-btn:hover {
  background-color: #67a912;
}*/
.upload-list {
  width: 90%;
  font-size: 19px;
}
.file-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.disabled {
  background-color: #999;
}
.active {
  background-color: #67c23a;
}
.active:hover {
  background-color: #67a912;
}
/**{margin: 0px;padding: 0px; box-sizing: border-box;}
    ul,li{list-style: none;}
.box{margin: 20px auto 0px;padding: 30px;text-align: center;width: 500px;overflow: hidden;}
.show-percent{width: 100%;height: 20px;border: 1px solid #000;}
.percent,.list-percent-show{display: inline-block;width: 0%;height: 18px;background-color: green;color: #fff;font-size: 12px;line-height: 18px;float: left;transition: all 0.1s}
.form-input{margin-top: 10px;position: relative;overflow: hidden;width: 100%;}
.input-btn{margin: 0 auto; padding: 6px 20px;cursor: pointer;background-color: blue;border-radius: 10px;color: #fff;}
.input-file{position: absolute;z-index: 9;display: block; opacity: 0;cursor: pointer;width: 100%;height: 30px;left: 0px;top: 0px;}
.file-lists{width: 100%;padding-top: 10px;overflow: hidden;}
.file-list{width: 100%;height: 40px;margin-bottom: 10px;overflow: hidden;}
.file-list-percent{width: 100%;height: 20px;border: 1px solid #000;overflow: hidden;}*/
</style>