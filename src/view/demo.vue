<template>
  <div class="box">
    <div id="canvas" class="canvas-container" ref="screenDom"></div>
    <div class="pages" ref="pages"></div>
  </div>
  <img :src="imgUrl" alt="">
</template>

<script setup>
import * as THREE from "three";
import { ref, reactive, toRefs, onMounted } from "vue";
import imgUrl from "@/assets/image/1.jpg?raw";
let screenDom = ref(null)
let pages = ref(null);

onMounted(() => {
  console.log(THREE);
  // 创建场景
  const scene = new THREE.Scene();
  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 10);
  scene.add(camera);

  // 添加物体-----------------------------------------
  // 创建几何体
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  // 根据几何体和材质创建物体
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  // 将几何体添加到场景中
  scene.add(cube);
  // ------------------------------------------------

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true });
 

  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setClearColor(0xd3df56, 1);
  // 将画布添加到页面中

  screenDom.value.appendChild(renderer.domElement);
   // 创建星空背景
  // const loader = new THREE.TextureLoader();
  // // const envTexture = loader.load("../assets/image/1.jpg", () => {
  // const envTexture = loader.load("https://img1.baidu.com/it/u=3935127714,297556652&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800");
  // scene.background = envTexture;
  let url = new URL('../assets/image/1.jpg', import.meta.url).href
  let envTexture = new THREE.TextureLoader().load(url,function(texture){
    // material = new THREE.MeshLambertMaterial({
    //   map: texture
    // })
     scene.background = envTexture
    scene.environment = envTexture

    console.log(texture)
  });
  console.log(envTexture)
  // envTexture.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = envTexture
    // scene.environment = envTexture

  function render() {
    requestAnimationFrame(render);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  render();
});
</script>

<style scoped lang="less">
.box {
  // background: #000;
  .canvas-container {
    width: 100%;
    height: 100vh;
    // color: #fff;
  }
  .pages {
    height: 100vh;
  }
}
</style>
