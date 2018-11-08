<template>
  <div class="wxcontainer">
    <h2>海滨大厦案例</h2>
    <p><br></p>
    <div class="content">
      <div class="inner">
        <div class="inner-inner">
          <p>用地面积：约16,000㎡，</p>
          <p><br></p>
          <p>建筑面积：80,000㎡</p>
          <p><br></p>
          <p>建筑性质：城市综合体，合商业，酒店，办公</p>
          <p><br></p>
          <p>建筑高度，高层</p>
          <p><br></p>
          <p>实景建模面积：0.2k㎡</p>
          <p><br></p>
          <p>花费时间：外业照片素材采集与内业模型生成共用时2天时间。</p>
          <p><br></p>
          <p>模型精度：7.5±2.5cm</p>
          <p><br></p>
          <p>在方案决策方面：可通过实景建模技术分析地块和周边环境情况，灵活切换不同设计方案，多次模拟，以便更快敲定设计方案。</p>
          <p><br></p>
          <p>在模拟成果方面：可对设计地块区域进行压平处理，将目标建筑设计模型等比例导入实景模型中，模拟项目建设完成后的情况。还可配置准确经纬度信息，模拟全年全天候的日照情况，进行光照分析，从而判断设计的建筑物是否符合日照要求。</p>
          <p><br></p>
          <p>在商业宣传方面：基于实景模型背景的宣传片与传统3D建模背景的宣传片相比，能提供更真实直观的体验。</p>
          <p><br></p>
          <img :src="require('@/assets/c1.jpeg')">
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
  max-width: 385px;
  width: 100%;
}
</style>