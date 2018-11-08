<template>
  <div class="tab-container">
    <div class="title">
      标注
    </div>
    <div class="content">
      <div class="content-top" @click="flag=true">
        <button class="btn">
          <span>添加标注</span>
        </button>
      </div>
      <div v-if="billboards" class="content-center">
        <div class="billboard" v-for="(item, index) in billboards" :key="index">
          <div class="content-center-top">
            <span>标注{{index + 1}}</span>
            <div class="svg-box">
              <svg-icon v-if="item.edit" icon-name="success" icon-class="svg-point svg" @click.native="confirmEdit(item)"></svg-icon>
              <svg-icon v-else icon-name="edit" icon-class="svg-point svg"  @click.native="item.edit=!item.edit"></svg-icon>
              <svg-icon icon-name="delete" icon-class="svg-point" @click.native="delBillboard(item, index)"></svg-icon>
            </div>
          </div>
          <div class="content-center-center">
            名称：<input v-if="item.edit" type="text" v-model="item.title" placeholder="请输入名称" class="title-input">
            <span v-else>{{item.title}}</span>
          </div>
          <div class="content-center-bottom">
            <div class="dynamic-component-tab">
              <button :class="['tab-btn', {'active': item.currentTab === it}]" v-for="(it, ind) in tabs" :key="it" @click="dynamicTabHandle(item, it)">
                <svg-icon :icon-name="it"></svg-icon>
              </button>
            </div>
            <component :is="item.currentTab" :contentEdit="item.edit" :_index="index"></component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/bus.js'
import { mapGetters } from 'vuex'
import Txt from './text'
import Pic from './img'
import Vid from './video'

export default {
  components: {
    Txt, Pic, Vid
  },
  data () {
    return {
      handler: null,
      cartesian: null,
      // billboards: [],
      tabs: ['txt', 'pic', 'vid'],
      flag: false,
      iconType: 'txt'                //创建时默认为文本图标
      // currentBillboard: null
    }
  },
  computed: {
    // ...mapGetters(['viewer', 'imgSrc'])
    ...mapGetters(['viewer', 'billboards', 'icons'])
  },
  mounted () {

    this.handler = new this.cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)

      // 箭头函数this指向这个场景
      this.handler.setInputAction((click) => {

        if (this.flag) {

          this.cartesian = this.viewer.scene.pickPosition(click.position)

          this.addBillBoard(this.iconType)

          this.flag = false //标注完后不能继续标注需重新点击按钮
        }

        let pick = this.viewer.scene.pick(click.position)

        if (pick && pick.id) {

          console.log(pick, pick.id, pick.primitive._index)

          this.billboards.forEach((item, index) => {

            if (item.pin === pick.id) {

              // Bus.$emit('slide', this.billboards[pick.primitive._index].imgSrc, 0, true)

              // Bus.$emit('slide', this.billboards[index].imgSrc, 0, true)
              if (item.iconType === 'txt') {

                Bus.$emit('slide', this.billboards[index].text, 0, true, 'txt')
                console.log('点击文本')
                // item.pin.description = '<div style="color:red;position:absulate;top:100px;laft:300px">描述</div>'
              } else if (item.iconType === 'pic') {

                Bus.$emit('slide', this.billboards[index].imgSrc, 0, true, 'pic')
              } else if (item.iconType === 'vid') {

                Bus.$emit('slide', this.billboards[index].videoSrc, 0, true, 'vid')
              }
            }
          })

          // Bus.$on('slide', (imgSrc, index, b) => {

          //   console.log(imgSrc, index, b)

          //   this.imgSrc = imgSrc

          //   this._index = index
          // })

          // Bus.$emit('slide', this.imgSrc, this._index, true)
        }

      }, this.cesium.ScreenSpaceEventType.LEFT_CLICK)
  },
  destroyed () {

    if (this.handler) {

      this.handler.removeInputAction(this.cesium.ScreenSpaceEventType.LEFT_CLICK)
    }
  },
  methods: {
    // bz () {

    //   // this.flag = true

    //   this.handler = new this.cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)

    //   // 箭头函数this指向这个场景
    //   this.handler.setInputAction((click) => {

    //     this.cartesian = this.viewer.scene.pickPosition(click.position)

    //     // console.log(this.cartesian)

    //     let pick = this.viewer.scene.pick(click.position)

    //     if (pick && pick.id) {

    //       console.log(pick,pick.id)

    //       // Bus.$emit('slide', null, null, true)
    //     }

    //     this.addBillBoard()

    //   }, this.cesium.ScreenSpaceEventType.LEFT_CLICK)

    // },
    addBillBoard (iconType) {

      // 将笛卡尔坐标系转成经纬度（弧度的经纬度)

      let point = this.cesium.Cartographic.fromCartesian(this.cartesian)

      let longitude = this.cesium.Math.toDegrees(point.longitude)

      let latitude = this.cesium.Math.toDegrees(point.latitude)

      // currentBillboard.order = this.$store.state.bz.billboards.length + 1

      let currentBillboard = {
        order: this.$store.state.bz.billboards.length + 1,
        title: '',
        edit: false,
        text: '',
        imgSrc: [],
        videoSrc: [],
        currentTab: 'txt',
        pin: null,
        longitude: longitude,
        latitude: latitude,
        height: point.height,
        iconType: iconType          //标注图标类型
      }
      //标注模块
      const pinBuilder = new this.cesium.PinBuilder()

      console.log(longitude, latitude, point.height)

      // const url = this.cesium.buildModuleUrl('/src/assets/2.jpg') 
      console.log(this.icons[iconType], this.icons)
      currentBillboard.pin = this.viewer.entities.add({
        name: 'Question mark',
        position: this.cesium.Cartesian3.fromDegrees(longitude, latitude, point.height),
        label : {
          text : '',
          font : '20px Helvetica',
          // heightReference: this.cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: this.cesium.VerticalOrigin.BOTTOM,
          disableDepthTestDistance: 10000,
          scaleByDistance : new this.cesium.NearFarScalar(1.0e2, 1.0, 1.5e3, 0.5),
          translucencyByDistance : new this.cesium.NearFarScalar(1.0e2, 1.0, 1.5e4, 0.0)
        },
        billboard: {
          // image: pinBuilder.fromText('阿', this.cesium.Color.BLACK, 48).toDataURL(),
          image: this.icons[iconType],
          // img: pinBuilder.fromUrl(url, this.cesium.Color.BLACK, 48),
          verticalOrigin: this.cesium.VerticalOrigin.TOP,
          disableDepthTestDistance: 10000,
          scaleByDistance : new this.cesium.NearFarScalar(1.0e2, 1.0, 1.5e3, 0.5), //scale by viewer distance
          // heightReference: this.cesium.HeightReference.RELATIVE_TO_GROUND,//适应地形
          translucencyByDistance: new this.cesium.NearFarScalar(1.0e2, 1, 1.5e4, 0)//根据相机距离设置透明度
        }
      })

      this.$store.state.bz.billboards.push(currentBillboard)

      // currentBillboard.questionPin.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
      //                                    '<tr><th>name</th><td>' + '吴凯乐' + '</td></tr>' +
      //                                    '<tr><th>age</th><td>' + '23' + '</td></tr>' +
      //                                    '</tbody></table>'


      // //Since some of the pins are created asynchronously, wait for them all to load before zooming/
      // this.cesium.when.all([currentBillboard.pin], function (pins) {

      //   viewer.zoomTo(pins)
      // })

      // this.handler.removeInputAction(this.cesium.ScreenSpaceEventType.LEFT_CLICK)                          
    },
    delBillboard (item, index) {

      // 删除标注数据
      // this.billboards.splice(index, 1)

      console.log(index, item.pin)
      this.$store.state.bz.billboards.splice(index, 1)
      // 删除标注
      this.viewer.entities.remove(item.pin)
    },
    confirmEdit (item) {

      item.edit = !item.edit

      this.viewer.entities.remove(item.pin)

      item.pin = this.viewer.entities.add({
        name: 'Question mark',
        position: this.cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.height),
        label : {
          text : item.title,
          font : '20px Helvetica',
          // heightReference: this.cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: this.cesium.VerticalOrigin.BOTTOM,
          disableDepthTestDistance: 10000,
          scaleByDistance : new this.cesium.NearFarScalar(1.0e2, 1.0, 1.5e3, 0.5),
          translucencyByDistance : new this.cesium.NearFarScalar(1.0e2, 1.0, 1.5e4, 0.0)
        },
        billboard: {
          // image: pinBuilder.fromText('阿', this.cesium.Color.BLACK, 48).toDataURL(),
          image: this.icons[item.currentTab],
          // img: pinBuilder.fromUrl(url, this.cesium.Color.BLACK, 48),
          verticalOrigin: this.cesium.VerticalOrigin.TOP,
          disableDepthTestDistance: 10000,
          scaleByDistance : new this.cesium.NearFarScalar(1.0e2, 1.0, 1.5e3, 0.5), //scale by viewer distance
          // heightReference: this.cesium.HeightReference.RELATIVE_TO_GROUND,//适应地形
          translucencyByDistance: new this.cesium.NearFarScalar(1.0e2, 1, 1.5e4, 0)//根据相机距离设置透明度
        }
      })

      item.pin.description = '<div>阿凡达；水库adf撒的发的说法阿斯蒂芬</div>'

      // 接口保存
    },
    dynamicTabHandle (item, it) {
      // 切换tab组件
      item.currentTab = it
      // 切换标注图标
      item.iconType = it
      
      this.viewer.entities.remove(item.pin)

      console.log(item.longitude, item.latitude, item.height)

      item.pin = this.viewer.entities.add({
        name: 'Question mark',
        position: this.cesium.Cartesian3.fromDegrees(item.longitude, item.latitude, item.height),
        label : {
          text : item.title,
          font : '20px Helvetica',
          // heightReference: this.cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: this.cesium.VerticalOrigin.BOTTOM,
          disableDepthTestDistance: 10000,
          scaleByDistance : new this.cesium.NearFarScalar(1.0e2, 1.0, 1.5e3, 0.5),
          translucencyByDistance : new this.cesium.NearFarScalar(1.0e2, 1.0, 1.5e4, 0.0)
        },
        billboard: {
          // image: pinBuilder.fromText('阿', this.cesium.Color.BLACK, 48).toDataURL(),
          image: this.icons[it],
          // img: pinBuilder.fromUrl(url, this.cesium.Color.BLACK, 48),
          verticalOrigin: this.cesium.VerticalOrigin.TOP,
          disableDepthTestDistance: 10000,
          scaleByDistance : new this.cesium.NearFarScalar(1.0e2, 1.0, 1.5e3, 0.5), //scale by viewer distance
          // heightReference: this.cesium.HeightReference.RELATIVE_TO_GROUND,//适应地形
          translucencyByDistance: new this.cesium.NearFarScalar(1.0e2, 1, 1.5e4, 0)//根据相机距离设置透明度
        }
      })
    }
  }
} 
</script>

<style scoped>
.active {
  background-color: #00c1de!important;
  border: none;
}
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
.content-top {
  padding: 20px 0;
  text-align: center;
  background-color: rgba(0, 0, 0, .4);
}
.content-center {
  padding: 0 10px;
}
.billboard {
  border: 1px solid rgba(255, 255, 255, .4);
  margin-bottom: 10px;
}
.content-center-top {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, .4);
  font-size: 14px;
}
.content-center-top .svg {
  margin-right: 10px;
}
/*.content-center-center {
  padding: 10px;
}*/
.title-input::-webkit-input-placeholder {
  color: #999;
}
.content-center-bottom {
  /*padding: 0 10px;*/
}
.dynamic-component-tab {
  border-top: 1px solid rgba(255, 255, 255, .4);
  border-bottom: 1px solid rgba(255, 255, 255, .4)
}
.tab-btn {
  padding: 5px 0;
  background-color: rgba(0, 0, 0, .4);
  color: #fff;
  outline: none;
  width: 33.33%;
  cursor: pointer;
  border: 0;
}
.tab-btn:hover {
  background-color: #00c1de;
}
button:nth-child(1), button:nth-child(2) {
  border-right: 1px solid rgba(255, 255, 255, .4)
}
</style>
