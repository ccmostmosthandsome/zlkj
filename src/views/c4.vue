<template>
  <div class="wxcontainer">
    <h2>文旅项目</h2>
    <p><br></p>
    <div class="content">
      <div class="inner">
        <div class="inner-inner">
          <p>以三维实景模型为基础平台，使景区（点）和设施更为形象、生动、直观，具备搜索及定位指示功能，并能充分利用视频、平面、声音、vr虚拟现实等多种手段为旅游者提供食、宿、行、游、购、娱等综合旅游信息服务；为旅游企业提供形象展示、产品销售服务；通过门禁系统、GPS车辆定位调度、景区视频监控系统等，为旅游管理部门提供行业监管和公众服务，全面提高服务质量、旅游招商引资，提高旅游国际化水平和核心竞争力</p>
          <p><br></p>
          <img :src="require('@/assets/c4.jpeg')">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  max-width: 680px;
  padding: 1px;
  border: 1px solid rgb(230, 183, 65);
  font-size: 12px;
  font-weight: 400;
  background-color: rgb(255, 255, 245);
  margin: 0 auto;
}
.inner, .inner-inner {
  padding: 1px;
  border: 1px solid rgb(230, 183, 65);
}
.inner-inner {
  padding: 10px;
}
.img-box {
  text-align: center;
}
h2 {
  margin: 0 auto;
  max-width: 680px;
  font-size: 22px;
}
img {
  max-width: 289px;
  width: 100%;
}
</style>