<template>
  <header class="header">
    <div class="title">学校信息管理系统</div>
    <div>
      <el-tag>{{ userTypeName }}</el-tag>

      <el-dropdown @command="handleCommand" size="large">
        <span class="el-dropdown-link">
          {{ store.getUser && store.getUser.name
          }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="a" icon="user"
              >个人信息</el-dropdown-item
            >
            <el-dropdown-item command="b"
              ><el-icon><SwitchButton /></el-icon>退出系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, computed, watch } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const userTypeName = computed(() => {
  let name = "";
  const userType = String(store.getUserType)

  switch (userType) {
    case '1':
      name = "管理员";
      break;
    case '2':
      name = "学生";
      break;
    case '3':
      name = "教师";
      break;
  }
  return name;
});
const handleCommand = (command) => {
  if (command == "a") {
    router.push("/userInfo");
  } else {
    router.push("/login");
    localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("userType")
  store.$reset()
    store.$reset();
  }
};
function toPage(path) {
  router.push(path);
}
</script>

<style scoped lang="less">
.header {
  height: 58px;
  width: 100%;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .title {
    font-size: 18px;
    font-weight: bold;
  }
}
.el-dropdown-link{
  font-size: 20px;
}
</style>
