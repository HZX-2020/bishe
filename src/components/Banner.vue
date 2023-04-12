<template>
  <div class="banner-box">
    <el-carousel :interval="4000" type="card" height="400px">
      <el-carousel-item v-for="(item,index) in imgList" :key="index">
        <img :src="item.url" />
      </el-carousel-item>
    </el-carousel>
  </div>
  
</template>

<script setup>
import { ref, reactive, toRefs, onMounted } from "vue";

const imgList = ref([
    {
      url: "https://www.nenu.edu.cn/__local/6/4B/E5/0B7202D880A3BDC9C9C69BD0611_E042F518_2620F.jpg",
    },
    {
      url: "https://www.nenu.edu.cn/__local/6/73/FA/EC9A2394C05057E72CE657D42C7_85B93642_691A1.jpg",
    },
    {
      url: "https://www.nenu.edu.cn/__local/3/3E/CE/DAFCCF96D44005924AAD8DE2B76_A6CC54E8_28D6F.jpg",
    },
  ]);
</script>

<style scoped lang="less">
.banner-box {
  width: 1200px;
  height: 400px;
  margin: 20px auto;
  .el-carousel__item img {
    border-radius: 4px;
    width: 100%;
    height: 100%;
  }
}
</style>
