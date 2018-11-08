<template>
  <div class="wxcontainer">
    <h2>铁路交通</h2>
    <p><br></p>
    <div class="content">
      <div class="inner">
        <div class="inner-inner">
          <p>实景建模技术的运用贯穿整个铁路建设生命周期，在项目勘测评估阶段，设计建设阶段，运维管理全生命周期各个阶段推动BIM整体解决方案。</p>
          <p><br></p>
          <p>在勘测评估阶段，运用无人机倾斜摄影实景建模技术，在极端条件区域代替人工传统测量，减少测量工作量，有效规避在勘测现场可能发生的意外风险，同时大大减少人力物力成本。</p>
          <p><br></p>
          <p>在设计施工阶段，可灵活套用多种设计方案，结合周边实际环境，进行日照、淹没等模拟分析，快速敲定设计方案。生成高精度、清晰、真实的实景模型可提前发现灾害隐患点,建立保障预案，确保施工安全。</p>
          <p><br></p>
          <p>在运维管理阶段很好弥补BIM技术环境模拟功能较弱的特点，可利用真实场景制作灾害疏散、应急联动方案，项目改建方案等。</p>
          <p><br></p>
          <img :src="require('@/assets/c3.jpeg')">
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
  max-width: 493px;
  width: 100%;
}
</style>