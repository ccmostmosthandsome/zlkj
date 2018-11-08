<template>
  <div class="wxcontainer">
    <h2>电力工程</h2>
    <p><br></p>
    <div class="content">
      <div class="inner">
        <div class="inner-inner">
          <p>实景模型技术有助于快速而准确地处理各种仪器采集数据集，并将它们转换为3D模型，等高线，剖面和横截面。露天煤矿甚至废物场地都可以轻松管理。这个过程中的关键是安全性，效率和利益最大化。使用实景建模技术，规划你的工作流变得简单直接。</p>
          <p><br></p>
          <img :src="require('@/assets/c10.gif')">
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
  max-width: 640px;
  width: 100%;
}
</style>