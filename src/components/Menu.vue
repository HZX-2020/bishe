<template>
  <div>
    <el-menu class="menu" :collapse="isCollapse">
      <el-menu-item v-if="userType != 2" index="1" @click="toPage">
        <el-icon><user /></el-icon>
        <template #title>
        <span>学生管理</span>
        </template>
      </el-menu-item>
      <el-menu-item v-if="userType != 2" index="2" @click="toPage">
        <el-icon><user /></el-icon>
        <template #title>
        <span>教师管理</span>
        </template>
      </el-menu-item>
      <el-menu-item v-if="userType == 1" index="3" @click="toPage">
        <el-icon><officeBuilding /></el-icon>
        <template #title>
          <span>班级管理</span>
        </template>
      </el-menu-item>
      <el-menu-item v-if="userType == 1" index="4" @click="toPage">
        <el-icon><school /></el-icon>
        <template #title>
        <span>年级管理</span>
        </template>
      </el-menu-item>
      <el-menu-item v-if="userType == 1" index="5" @click="toPage">
        <el-icon><avatar /></el-icon>
        <template #title>
        <span>管理员管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="6" @click="toPage">
        <el-icon><user /></el-icon>
        <template #title>
        <span>个人信息管理</span>
        </template>
      </el-menu-item>
    <div class="change-box" @click="change">
      <el-icon v-if="isCollapse"><Expand /></el-icon>
      <el-icon v-else><Fold /></el-icon>
    </div>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "../store";

const store = useStore();
const router = useRouter();
const isCollapse = ref(false); // 菜单展开
const userType = store.getUserType
function change() {
  isCollapse.value = !isCollapse.value;
}
const toPage = (e) => {
  console.log(e.index);

  switch (e.index) {
    case "1":
      router.push("/student");
      break;
    case "2":
      router.push("/teacher");
      break;
    case "3":
      router.push("/class");
      break;
    case "4":
      router.push("/grade");
      break;
    case "5":
      router.push("/admin");
      break;
    case "6":
      router.push("/userInfo");
      break;
  }
};
</script>

<style scoped lang="less">
.menu {
  height: calc(100vh - 60px);
}
.change-box{
  padding-left: 20px;
  font-size: 25px;
  cursor: pointer;
}
</style>
