<template>
  <div class="wxcontainer">
    <h2>智慧城市</h2>
    <p><br></p>
    <div class="content">
      <div class="inner">
        <div class="inner-inner">
          <p>实景建模技术能够广泛应用于城市规划、建设和管理等各个方面。倾斜影像能够使指挥决策者看到比正射影像更多的环境信息，从而更好辅助决策。相比只能看到屋顶的正射影像，倾斜影像可看到房屋侧面的窗口，它上面的每一点都有着真实、准确的坐标，影像中含有精确的物理模型可供用户按照需求进行测量和计算，比如计算通视距离、设计制高点和狙击方案等。这些事发地周围的详细信息，在应急行动中关乎人员及财产的安全，有时甚至能起到决定性的作用。</p>
          <p><br></p>
          <!-- <img :src="require('@/assets/c4.jpeg')"> -->
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
/*img {
  max-width: 385px;
  width: 100%;
}*/
</style>