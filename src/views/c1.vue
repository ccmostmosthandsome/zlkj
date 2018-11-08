<template>
  <div class="wxcontainer">
    <h2>测绘工程</h2>
    <p><br></p>
    <div class="content">
      <div class="inner">
        <div class="inner-inner">
          <p>城市化建设的不断加快，市政工程等基础设施建设越来越多，相应地对测绘保障作用的要求也越来越高。实景建模技术在大型市政工程中的运用有很高的实用价值。在项目开工初期进行实景建模，直接提取路线上的高程数据，获取原地面复测数据。利用bim模型与实景模型的交线确定路堑段开口线及路堤填筑边线，方便快捷地获取精确的位置信息。以及在施工场地的规划（预制厂，混凝土搅拌站场地布设），对外征地拆迁，工程精度汇报，安全文明施工，施工问题沟通协调均有着无法比拟的优势。</p>
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