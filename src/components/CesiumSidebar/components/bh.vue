<template>
  <div class="tab-container">
    <div class="title">
      标绘
    </div>
    <div class="content">
    	<div class="content-top" @click="clickHandle($event)">
    		<!-- <svg-icon icon-name="fh" icon-class="svg"></svg-icon>
    		<svg-icon icon-name="ks" icon-class="svg"></svg-icon>
    		<svg-icon icon-name="sl" icon-class="svg"></svg-icon> -->
    		<div v-for="(item, index) in tabs" :class="['svg-box', {'active': item === current}]" :data-index="index">
    			<svg-icon :icon-name="item" icon-class='svg'></svg-icon>
    		</div>
    	</div>
    	<div class="content-center">
    		<div class="color-picker-box btn" :style="{'backgroundColor': bgcRgba}">
    			<span>选择一种颜色</span>
    			<input type="color" value="#2D9900" class="color-input" @change="pickColor" />
    		</div>
    		<el-slider v-model="opacity" :format-tooltip="formatTooltip"></el-slider>
    	</div>
    	<div class="content-bottom">
        <el-tree
          :data="treeData"
          node-key="id"
          default-expand-all
          show-checkbox
          @check-change="handleCheckChange"
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="data.isDelete!==false">
              <!-- <el-button
                type="text"
                size="mini"
                @click="append(data)">
                Append
              </el-button> -->
              <svg-icon icon-name="delete" icon-class="svg-point svg"  @click.native="remove(node, data)"></svg-icon>
              <!-- <el-button
                type="text"
                size="mini"
                @click="remove(node, data)">
                Delete
              </el-button> -->
            </span>
          </span>
        </el-tree>
    	</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { DrawDynamicQinxie, addHeightToposition, drawShape } from '@/utils/biaohui.js'
// import Cesium from 'cesium/Cesium'
let order = 4

export default {
  data () {
    // const data = [{
    //   id: 1,
    //   label: '一级 1',
    //   children: [{
    //     id: 4,
    //     label: '二级 1-1',
    //     children: [{
    //       id: 9,
    //       label: '三级 1-1-1'
    //     }, {
    //       id: 10,
    //       label: '三级 1-1-2'
    //     }]
    //   }]
    // }, {
    //   id: 2,
    //   label: '一级 2',
    //   children: [{
    //     id: 5,
    //     label: '二级 2-1'
    //   }, {
    //     id: 6,
    //     label: '二级 2-2'
    //   }]
    // }, {
    //   id: 3,
    //   label: '一级 3',
    //   children: [{
    //     id: 7,
    //     label: '二级 3-1'
    //   }, {
    //     id: 8,
    //     label: '二级 3-2'
    //   }]
    // }]
    
    const data = [{
      id: 1,
      label: '标绘',
      isDelete: false,
      children: [{
        id: 2,
        label: '线标绘',
        isDelete: false,
        children: []
      }, {
        id: 3,
        label: '面标绘',
        isDelete: false,
        children: [
          // {
          //   id: 7,
          //   label: '面标绘'
          // }, {
          //   id: 8,
          //   label: '面标绘'
          // }
        ]
      }, {
        id: 4,
        label: '体标绘',
        isDelete: false,
        children: [
          // {
          //   id: 9,
          //   label: '体标绘'
          // }, {
          //   id: 10,
          //   label: '体标绘'
          // }
        ]
      }]
    }]
  	return {
  		current: null,
  		tabs: ['line', 'surface', 'cube'],
  		bgc: '#00c1de',
      bgcRgba: 'rgba(0, 193, 222, 0.5)',
  		opacity: 50,
		  props1: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      treeData: JSON.parse(JSON.stringify(data)),
      // id: 4
  	}
  },
  computed: mapGetters(['viewer', 'czmlTemporaryBh']),
  created () {

  },
  methods: {
  	clickHandle (e) {

  		if (e.target.nodeName.toLowerCase() === 'div') {

  			console.log(e.target.dataset.index)
  			this.current = this.tabs[e.target.dataset.index]

        if (e.target.dataset.index == 0) {
          // 画线
          console.log('画线')
          this.drawLine()

        } else if (e.target.dataset.index == 1) {
          // 画面
          console.log('画面')
          this.drawPolygon()

        } else if (e.target.dataset.index == 2) {
          // 画体
          console.log('画体')
          this.drawVolumePolygon()

        } else if (e.target.dataset.index == 3) {
          // 画墙
          console.log('画墙')
          this.drawWall()
        }
  		}
  	},
  	pickColor (val) {
  		
      this.bgc = val.target.value
  	},
  	formatTooltip (val) {
      // hextoRgba
      // 滑动动态改变透明度
      this.bgcRgba = "rgba(" + parseInt("0x" + this.bgc.slice(1, 3)) + "," + parseInt("0x" + this.bgc.slice(3, 5)) + "," + parseInt("0x" + this.bgc.slice(5, 7)) + "," + Math.ceil(val / 10) / 10 + ")"

      // this.opacity = Math.ceil(val / 10)

  		return Math.ceil(val / 10)
  	},
  	loadNode1(node, resolve) {

      if (node.level === 0) {

        return resolve([{ name: '标绘' }])
      }

      if (node.level === 1) return resolve([{ name: '线标绘' }, { name: '面标绘' }, { name: '体标绘' }])


      setTimeout(() => {

        const data = [{
          name: '未命名leaf',
          leaf: true
        }, {
          name: '未命名zone',
          leaf: true
        }]

        resolve(data)
      }, 200)
    },
    drawLine () {

      let that = this

      DrawDynamicQinxie.startDrawingPolyline(that.viewer, function (cartesians) {
        //下面对处理代码
        cartesians.pop()
        let line = {
          polylineVolume: {
            positions: cartesians,
            shape : [
              new that.cesium.Cartesian2(-1, -0.5),
              new that.cesium.Cartesian2(1, -0.5),
              new that.cesium.Cartesian2(1, 0.5),
              new that.cesium.Cartesian2(-1, 0.5)
            ],
            material: that.cesium.Color.fromAlpha(that.cesium.Color.fromCssColorString(that.bgc), Math.ceil(that.opacity / 10) / 10),
            cornerType: that.cesium.CornerType.ROUNDED,
            closeBottom:false
          }
        }

        let id = that.viewer.entities.add(line) //1.画线

        that.current = null //2.还原按钮

        // 3.添加tree dom节点
        that.treeData[0].children.forEach((item, index) => {

          if (item.label === '线标绘') {

            that.append(item, id)
          }
        })

        let position_=[]

        for (let i=0;i<cartesians.length;i++) {

          let cartographic = that.cesium.Cartographic.fromCartesian(cartesians[i])

          let currentClickLon = that.cesium.Math.toDegrees(cartographic.longitude)//cartographic弧度，currentClickLon度

          let currentClickLat = that.cesium.Math.toDegrees(cartographic.latitude)

          let currentClickHei = cartographic.height
          console.log(currentClickLon)

          position_.push(currentClickLon,currentClickLat,currentClickHei)
        }

        console.log(position_, that.cesium.Color.fromCssColorString(that.bgc))

        let rgbaObj = that.cesium.Color.fromCssColorString(that.bgc)

        let rgbColor = `[${rgbaObj.red*255}, ${rgbaObj.green*255}, ${rgbaObj.blue*255}, ${rgbaObj.alpha*255}]`

        // // 创建czml
        // let czmlPolyline = {
        //   "id": "polyline1",
        //   "name": "polyline on surface",
        //   "polyline": {
        //     "positions": {
        //       "cartographicDegrees" : position_
        //     },
        //     "material": {
        //       "solidColor": {
        //         "color": {
        //             "rgba": rgbColor
        //         }
        //       }
        //     }
        //   }
        // }

        // 4.临时仓储
        let objDate = {
          id: order,
          position: position,
          rgba: rgbColor
        }

        that.czmlTemporaryBh.push(objDate)

      }, that.bgc, Math.ceil(that.opacity / 10) / 10)
    },
    drawPolygon () {

      let that = this

      DrawDynamicQinxie.startDrawingPolygon(that.viewer, function (cartesians) {
        //下面对处理代码
        cartesians.pop()
        console.log(cartesians)
        let positions_addh = addHeightToposition(cartesians,0.5)

        let color = that.cesium.Color.fromAlpha(that.cesium.Color.fromCssColorString(that.bgc), Math.ceil(that.opacity / 10) / 10)

        let GonOpts = {
          polygon: {
            hierarchy: new that.cesium.PolygonHierarchy(positions_addh),
            // material: that.cesium.Color.CHARTREUSE.withAlpha(.5),
            material: color,
            perPositionHeight: true,
            // disableDepthTestDistance: 1000//优先级
          }
        }

        let id = that.viewer.entities.add(GonOpts) //画面

        that.current = null //还原按钮

        // 添加tree dom节点
        that.treeData[0].children.forEach((item, index) => {

          if (item.label === '面标绘') {

            that.append(item, id)
          }
        })

        let position_=[]

        for (let i=0;i<cartesians.length;i++) {

          let cartographic = that.cesium.Cartographic.fromCartesian(cartesians[i])

          let currentClickLon = that.cesium.Math.toDegrees(cartographic.longitude)//cartographic弧度，currentClickLon度

          let currentClickLat = that.cesium.Math.toDegrees(cartographic.latitude)

          let currentClickHei = cartographic.height

          console.log(currentClickLon)

          position_.push(currentClickLon,currentClickLat,currentClickHei)
        }

        console.log(position_, that.cesium.Color.fromCssColorString(that.bgc))

        let rgbaObj = that.cesium.Color.fromCssColorString(that.bgc)

        let rgbColor = `[${rgbaObj.red*255}, ${rgbaObj.green*255}, ${rgbaObj.blue*255}, ${rgbaObj.alpha*255}]`
        
        // // 创建czml
        // let czmlPolygon = {
        //     "id": "polygon1",
        //     "name": "polygon on surface",
        //     "polygon": {
        //       "positions": {
        //         "cartographicDegrees" : position_
        //       },
        //       "material": {
        //         "solidColor": {
        //           "color": {
        //               "rgba": rgbColor
        //           }
        //         }
        //       },
        //       "perPositionHeight": true
        //     }
        //   }
          // 临时仓储
          let objDate = {
            id: order,
            position: position,
            rgba: rgbColor
          }
          
          that.czmlTemporaryBh.push(objDate)

      }, that.bgc, Math.ceil(that.opacity / 10) / 10)
    },
    drawVolumePolygon () {

      let that = this

      DrawDynamicQinxie.startDrawingVolumePolygon(that.viewer, function (cartesians) {
        //下面对处理代码
        cartesians.pop()
        let VGonOpts = {
          polygon: {
            hierarchy: cartesians,
            heightReference: that.cesium.HeightReference.NONE,
            // material: that.cesium.Color.CHARTREUSE.withAlpha(.5),
            material:  that.cesium.Color.fromAlpha(that.cesium.Color.fromCssColorString(that.bgc), Math.ceil(that.opacity / 10) / 10),
            extrudedHeight: 230,
            perPositionHeight: true
            // disableDepthTestDistance: 1000//优先级
          }
        }

        let id = that.viewer.entities.add(VGonOpts) //1.画立方体

        that.current = null //2.还原按钮

        // 3.添加到tree Dom 节点
        that.treeData[0].children.forEach((item, index) => {

          if (item.label === '体标绘') {

            that.append(item, id)
          }
        })

        
        let position_=[]

        for (let i=0;i<cartesians.length;i++) {

          let cartographic = that.cesium.Cartographic.fromCartesian(cartesians[i])

          let currentClickLon = that.cesium.Math.toDegrees(cartographic.longitude)//cartographic弧度，currentClickLon度

          let currentClickLat = that.cesium.Math.toDegrees(cartographic.latitude)

          let currentClickHei = cartographic.height
          console.log(currentClickLon)

          position_.push(currentClickLon,currentClickLat,currentClickHei)
        }

        console.log(position_, that.cesium.Color.fromCssColorString(that.bgc))

        let rgbaObj = that.cesium.Color.fromCssColorString(that.bgc)

        let rgbColor = `[${rgbaObj.red*255}, ${rgbaObj.green*255}, ${rgbaObj.blue*255}, ${rgbaObj.alpha*255}]`
        
        // // 创建czml
        // let czmlVolumePolygon = {
        //     "id": id,
        //     "name": "volumePolygon on surface",
        //     "polygon": {
        //       "positions": {
        //         "cartographicDegrees" : position_
        //       },
        //       "material": {
        //         "solidColor": {
        //           "color": {
        //               "rgba": rgbColor
        //           }
        //         }
        //       },
        //       "perPositionHeight": true
        //     }
        //   }
        let objDate = {
          id: order,
          position: position,
          rgba: rgbColor
        }
        // 4.临时仓储
        that.czmlTemporaryBh.push(objDate)

      }, that.bgc, Math.ceil(that.opacity / 10) / 10)
    },
    drawWall () {

      let that = this

      DrawDynamicQinxie.startDrawingWall(that.viewer, function (cartesians) {
        //下面对处理代码
        cartesians.pop()

        let positionArr = []

        let minH = []

        for (let i = 0; i < cartesians.length; i++) {

          let cartographic = that.cesium.Cartographic.fromCartesian(cartesians[i])
          let currentClickLon = that.cesium.Math.toDegrees(cartographic.longitude)//cartographic弧度，currentClickLon度
          let currentClickLat = that.cesium.Math.toDegrees(cartographic.latitude)
          let currentClickHei = cartographic.height+10
          
          positionArr.push(currentClickLon,currentClickLat,currentClickHei)

          minH.push(cartographic.height)
        }

        let line = {
          name : 'Red wall at height',
          wall: {
            positions : that.cesium.Cartesian3.fromDegreesArrayHeights(positionArr),
            minimumHeights : minH,
            // material : that.cesium.Color.RED
            material:  that.cesium.Color.fromAlpha(that.cesium.Color.fromCssColorString(that.bgc), Math.ceil(that.opacity / 10) / 10)
          }
        }

        let id = that.viewer.entities.add(line)

        that.current = null

      }, that.bgc, Math.ceil(that.opacity / 10) / 10)
    },
    append (data, entityId) {

      const newChild = { id: ++order, entityId: entityId, label: 'testtest', children: [] }

      if (!data.children) {

        this.$set(data, 'children', [])
      }

      data.children.push(newChild)
    },
    remove (node, data) {

      const parent = node.parent
      // parent.data
      const children = parent.data.children || parent.data

      console.log(children)

      let index = children.findIndex(d => d.id === data.id)
      // 1.删除tree dom 数据
      children.splice(index, 1)

      // this.treeData = JSON.parse(JSON.stringify(this.treeData))

      let newTreeData = Object.assign({}, this.treeData[0])

      // 清空（不清空会叠加）如有更好的解决方案-----待改进
      this.treeData = []

      this.$set(this.treeData, 0, newTreeData)
      // 2.删除标绘实体
      this.viewer.entities.remove(data.entityId)

      console.log(this.czmlTemporaryBh)
      // 3.删除临时仓储
      let storeIndex = this.czmlTemporaryBh.findIndex(d => d.id === data.id)

      this.czmlTemporaryBh.splice(storeIndex, 1)

      // 整个原始数据转换一下
      // 避免对象循环引用, this.treeData = JSON.parse(JSON.stringify(this.treeData))
    },
    handleCheckChange (data, checked, indeterminate) {

      console.log(2222222)

      console.log(data, checked, indeterminate)

      // if (checked) {


      // } else {

        
      // }
    }
  }
}
</script>

<style scoped>
.active {
	color: #00c1de;
}
.btn {
  width: 200px;
  background-color: transparent;
  text-align: center;
  line-height: 30px;
  border-radius: 5px;
  outline: none;
  border: none;
  color: #eee;
  font-weight: 500;
  letter-spacing: 1px;
}
.content-top {
	display: flex;
	justify-content: space-around;
}
.svg-box {
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
  position: relative;
  cursor: pointer;
}
.svg-box:hover .svg{
  color: #00c1de;
  transform: scale(1.2);
}
.svg-box .svg {
	font-size: 28px;
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: -1;
  transition: .2s;
}
.content-center {
	padding-top: 20px;
	text-align: center;
	border-top: 1px solid rgba(255, 255, 255, .4);
	border-bottom: 1px solid rgba(255, 255, 255, .4);
	background-color: rgba(0, 0, 0, .4);
}
.color-picker-box {
	position: relative;
	margin: 0 auto;
	font-size: 13px;
}
.color-picker-box span {
}
.color-input {
	opacity: 0;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	cursor: pointer;
}
.el-slider {
	width: 200px;
	margin: 0 auto;
}
.el-slider >>> .el-slider__bar {
	background-color: #00c1de;
}
.el-slider >>> .el-slider__button {
	border-color: #00c1de;
}
.el-slider >>> .el-slider__runway {
	margin: 25px 0;
}
.el-tree {
	color: #fff;
	background-color: rgba(0, 0, 0, 0);
}
.el-tree >>> .el-tree-node__content {
	height: 40px;
	background-color: rgba(0, 0, 0, 0)!important;
}
.el-tree >>> .el-tree-node__content:hover {
	background-color: rgba(0, 0, 0, .4)!important;
}
.el-tree >>> .el-checkbox__input.is-checked .el-checkbox__inner {
	background-color: #00c1de;
	border-color: #00c1de;
}
.el-tree >>> .el-checkbox__input.is-indeterminate .el-checkbox__inner {
	background-color: #00c1de;
	border-color: #00c1de;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.content-bottom .svg {
  margin-right: 10px;
}
</style>
