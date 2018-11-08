<template>
  <div class="wxcontainer">
    <h2>市政工程</h2>
    <p><br></p>
    <div class="content">
      <div class="inner">
        <div class="inner-inner">
          <p>实景建模技术可于用于工程测量方面，通过实景三维模型提取等高线和地形，获取原地面复测数据</p>
          <p><br></p>
          <p>利用BIM模型与实景的交线确定路堑段开口线及路堤填筑边线，方便快捷地获取精确位置信息，避免人为计算偏差引起的超填超挖。</p>
          <p><br></p>
          <p>在施工场地规划，征地拆迁评估，工程进度汇报，安全文明施工管理施工问题沟通均有着无法比拟的优势。</p>
          <img :src="require('@/assets/c2.jpeg')">
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
  max-width: 436px;
  width: 100%;
}
</style>