<template>
  <div class="wxcontainer">
    <h2>电力工程</h2>
    <p><br></p>
    <div class="content">
      <div class="inner">
        <div class="inner-inner">
          <p>由于管理的变电站较多，分布在不同地区，并且有些地方相当偏僻，这就给人员查看变电站内部的构造造成相当大的麻烦。运用实景建模技术，只需要打开浏览器即可查看变电站内部环境，犹如身临其境在现场观看一般，能让工作人员更加容易，迅速与高效的投入工作。</p>
          <p><br></p>
          <img :src="require('@/assets/c6.jpeg')">
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
  max-width: 391px;
  width: 100%;
}
</style>