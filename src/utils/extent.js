// 获取当前视图范围
export function getExtent (viewer, cesium) {
  // 获取当前视图位置
  let pt1 = cesium.Cartesian2(0,0)
  let pt2 = cesium.Cartesian2(500,500)
   
  let pick1 = viewer.scene.globe.pick(viewer.camera.getPickRay(pt1), viewer.scene)
  let pick2 = viewer.scene.globe.pick(viewer.camera.getPickRay(pt2), viewer.scene)
   
  //将三维坐标转成地理坐标
  let geoPt1 = viewer.scene.globe.ellipsoid.cartesianToCartographic(pick1)
  let geoPt2 = viewer.scene.globe.ellipsoid.cartesianToCartographic(pick2)
   
  //地理坐标转换为经纬度坐标
  let point1 =[geoPt1.longitude / Math.PI * 180,geoPt1.latitude / Math.PI * 180]       
  let point2 =[geoPt2.longitude / Math.PI * 180,geoPt2.latitude / Math.PI * 180]

  return [point1, point2]
}