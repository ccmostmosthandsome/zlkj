import * as THREE from 'three'

var sphere,camera,scene,renderer;

export function init (imgsrc) {
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('mainCanvas'),
    alpha: true, //缓冲区
    antialias: true //抗锯齿化
  });
  renderer.setClearColor(0x000000, 0); //Sets the clear color and opacity
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-4.9, 4.9, 7.2, -3.75, 0.1, 100);
  camera.position.set(25, 0, 25);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera);
  var texture = new THREE.TextureLoader().load(imgsrc);
  // 材质
  var material = new THREE.MeshBasicMaterial({
  //color: 0xa6d6ff,
  //wireframe: true,
      map: texture
  });
  drawSphere(scene, material);    //球体
  animate();
}
function animate () {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.0025;
  renderer.render(scene, camera);
}
function drawSphere (scene, material) {
  sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 40, 40), material);
  scene.add(sphere);
}
