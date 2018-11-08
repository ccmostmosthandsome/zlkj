<template>
  <div class="tab-container">
    <div class="title">
      单体化
    </div>
    <div class="content">
      <div class="content-top">
        <button :class="['btn', {'active': btnActive}]" @click="monomerization">
          <span>创建单体化</span>
        </button>
      </div>
      <div class="content-center">
        <el-tree
          :data="treeData"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="left-box">
              <span v-if="data.isDelete!==false" class="color-box" :style="{'backgroundColor': data.color}"></span>
              <span class="text">{{ data.label }}</span>
            </span>
            <span v-if="data.isDelete!==false">
              <!-- <el-button
                type="text"
                size="mini"
                @click="append(data)">
                Append
              </el-button> -->
              <svg-icon icon-name="edit" icon-class="svg-point svg" @click.native="edit(node, data)"></svg-icon>
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
import Bus from '@/utils/bus.js'
// import { postRender } from '@/utils/dth.js'
let order = 1

export default {
  data () {

    const data = [{
      id: 1,
      label: '单体化',
      isDelete: false,
      children: []
    }]

    return {
      currentColor: null,
      currentOrder: null,
      dthDefaultColor: '#00c1de', //每个单体的初始颜色
      // dthBgc: '#00c1de',
      // dthTitle: '未命名1',
      btnActive: false,
      handler: null,
      tempEntity: null,
      // treeData: JSON.parse(JSON.stringify(data)),
      treeData: data
    }
  },
  computed: mapGetters(['viewer', 'czmlTemporaryDth']),
  mounted () {

    // 接收单体化的标题
    Bus.$on('dthTitle', (title, order) => {

      this.treeData[0].children.forEach((item) => {

        if (item.id === order) {

          item.label = title
        }
      })
    })
    // 接收单体化的颜色
    Bus.$on('dthColor', (color, order) => {

      this.treeData[0].children.forEach((item) => {

        if (item.id === order) {

          item.color = color

          // 修改单体化实体的颜色
          // console.log(item.entityId)
        }
      })
      // 之后的单体化颜色都按照最后选的开始
      this.dthDefaultColor = color
    })
  },
  destroyed () {

    if (this.handler) {

      this.handler.removeInputAction(this.cesium.ScreenSpaceEventType.LEFT_CLICK)
    }

    Bus.$off(['dthTitle', 'dthColor'])
  },
  methods: {
    monomerization () {
      // console.log('创建单体化')

      if (!this.handler) {

        const that = this

        this.btnActive = true //给按钮加类

        let tempPoints = []

        let tempLength = null

        this.handler = new this.cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)

        this.handler.setInputAction((click) => {

          let cartesian=this.viewer.scene.pickPosition(click.position);//用于测坐标

          if (cartesian) {

            tempPoints.push(cartesian)

            tempLength = tempPoints.length

            this.drawPoint(tempPoints[tempPoints.length-1])
          }
        }, this.cesium.ScreenSpaceEventType.LEFT_CLICK)


        this.handler.setInputAction(function (click) {

          // let cartesian = this.viewer.scene.pickPosition(click.position)//用于测坐标

          let cartesian = that.viewer.scene.pickPosition(click.position)

          if (cartesian) {

              // let tempLength = tempPoints.length

              if (tempLength < 3) {

                  alert('请选择3个以上的点再执行闭合操作命令')

              } else {

                // drawLine(tempPoints[0], tempPoints[tempPoints.length - 1], false, vueComponent)

                that.drawPoly(tempPoints, that.dthDefaultColor)

                that.append(that.treeData[0], that.tempEntity)

                Bus.$emit('dthEdit', true, that.tempEntity, that.currentOrder, that.currentColor)

                // // 创建czml(伪代码)
                // let czmlPoly = {
                //   "id": "danti",
                //   "name": "poly on surface",
                //   "polygon": {
                //     "positions": {
                //       "cartographicDegrees" : [1,1,1]
                //     },
                //     "material": {
                //       "solidColor": {
                //         "color": {
                //             "rgba": that.dthBgc
                //         }
                //       }
                //     },
                //     "properties": {
                //       "name": "sss",
                //       "age": "21"
                //     }
                //   }
                // }
                // 仓储
                // console.log(order)
                let objDate = {
                  id: order,
                  position: position,
                  rgba: that.dthDefaultColor
                }
                
                that.czmlTemporaryDth.push(objDate)
              }
          }

          tempPoints = []

          // that.tempEntity = null

          that.btnActive = null //还原按钮

          that.handler.removeInputAction(that.cesium.ScreenSpaceEventType.LEFT_CLICK)

          that.handler.removeInputAction(that.cesium.ScreenSpaceEventType.RIGHT_CLICK)

          that.handler = null

        }, that.cesium.ScreenSpaceEventType.RIGHT_CLICK)
      }
    },

    drawPoint (points) {

      let entity = this.viewer.entities.add({ 
        polygon: {
          hierarchy: new this.cesium.PolygonHierarchy(points),
          material: this.cesium.Color.CHARTREUSE.withAlpha(.5),
          perPositionHeight:true,
          disableDepthTestDistance : 1000//优先级
        }
      })
      
      // let s=CalPolygonArea(entity)

      // console.log(s)

      // 如果点很明显的话，可以在drawPoly函数里清除点实体
    },

    drawPoly (points, dthDefaultColor) {

      // const that = this

      let entity = this.viewer.entities.add({
        name: 'danti',
        polygon: {
          hierarchy: new this.cesium.PolygonHierarchy(points),
          material: this.cesium.Color.fromCssColorString(dthDefaultColor).withAlpha(.5),
          classificationType : this.cesium.ClassificationType.CESIUM_3D_TILE
        },
        properties: {
          // 'name':'sss',
          // 'age':'21',
          // 'gender': 'male'
        }
      })

      entity.description=' '
      // let s = CalPolygonArea(entity)

      // console.log(s)

      this.tempEntity = entity
    },
    append (data, entity) {

      // const newChild = { id: ++order, entityId: entity, label: entity.name }
      const newChild = { id: ++order, entityId: entity, label: '未命名', color: this.dthDefaultColor }

      this.currentOrder = newChild.id

      this.currentColor = newChild.color

      if (!data.children) {

        this.$set(data, 'children', [])
      }

      data.children.push(newChild)

    },
    edit (node, data) {

      // console.dir(data)

      this.currentOrder = data.id

      Bus.$emit('dthEdit', true, data.entityId, data.id, data.color)
    },
    remove (node, data) {

      const parent = node.parent
      // parent.data
      const children = parent.data.children || parent.data

      let index = children.findIndex(d => d.id === data.id)
      // 1.删除tree dom 数据
      children.splice(index, 1)

      // ele的tree控件未能检测到数据更新，所以执行一次拷贝并赋值
      let newDate = Object.assign({}, this.treeData[0])
      // 清空（不清空会叠加）如有更好的解决方案-----待改进
      this.treeData = []

      this.$set(this.treeData, 0, newDate)

      // this.treeData = JSON.parse(JSON.stringify(this.treeData))（有循环引用的问题）
      // 2.删除单体化实体
      this.viewer.entities.remove(data.entityId)

      // 3.删除临时仓储
      let storeIndex = this.czmlTemporaryDth.findIndex(d => d.id === data.id)

      this.czmlTemporaryDth.splice(storeIndex, 1)

      // var util=require('util')

      // console.log(util.inspect(data.entityId))
    }
  }
}
</script>

<style scoped>
.btn {
  width: 200px;
  background-color: rgb(0, 193, 222);
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
.active {
  background-color: rgb(0, 140, 180);
  cursor: not-allowed;
}
.content-top {
  padding: 20px 0;
  text-align: center;
  background-color: rgba(0, 0, 0, .4);
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
/*箭头隐藏占位*/
/*.el-tree >>> .el-tree-node__content .el-tree-node__expand-icon.is-leaf {
  display: hidden;
}*/
/*箭头消失不占位*/
.el-tree >>> .el-tree-node__children .el-tree-node__expand-icon.is-leaf {
  display: none;
}
.el-tree >>> .el-tree-node__children .text {
  margin-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  max-width: 155px;
  display: inline-block;
  vertical-align: middle;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.left-box {
  display: inline-block;
  line-height: 21px;
}
.color-box {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 2px;
  vertical-align: middle;
}
.svg {
  margin-right: 10px;
}
</style>