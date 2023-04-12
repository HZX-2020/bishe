<template>
  <div class="login-container">
    <div class="title">学校信息管理系统</div>
    <div class="login-box">
      <div class="form">
        <el-form :model="form" label-width="60px">
          <el-form-item label="账号">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" show-password />
          </el-form-item>
          <el-form-item label="验证码">
            <div class="code-box">
              <el-input v-model="form.verifiCode" />
              <img @click="getCode" :src="imgSrc" alt="">

            </div>
          </el-form-item>
          <el-form-item label="角色">
            <el-radio-group v-model="form.userType">
              <el-radio :label="1">管理员</el-radio>
              <el-radio :label="2">学生</el-radio>
              <el-radio :label="3">教师</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item>
            <el-button class="btn" :loading="loading" type="primary" @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive,ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToken } from '../hooks/useToken'
import {getUserInfoByToken} from '../api/user'
import { useStore } from "../store";
import { useStorage, StorageSerializers } from "@vueuse/core";
const store = useStore();
const router = useRouter()
const form = reactive({
  username:'admin',
  password:'123',
  verifiCode:'uuh2',
  userType: 1, // 1超管 2学生 3 教师
})
const loading = ref(false)
const id = ref(0)
const imgSrc = ref('http://localhost:9001/sms/system/getVerifiCodeImage?id=' + id.value)
const onSubmit = async () => {
  // 存储在本地local Storage
  const user = useStorage("user", {}, undefined, {
  serializer: StorageSerializers.object,
});
  const userType = useStorage("userType", null, undefined, {
  serializer: StorageSerializers.object,
});
loading.value = true;
  const {code,data, message} = await useToken(form)
  if(code == 200 && data) {
    const { data:userInfo} = await getUserInfoByToken()
    
    store.setUser(userInfo.user)
    store.setUserType( userInfo.userType )
    user.value = userInfo.user
    userType.value = userInfo.userType
    router.push('/')
  }else {
    loading.value = false
  }
  
}
function getCode() {
  id.value ++ 
  imgSrc.value = 'http://localhost:9001/sms/system/getVerifiCodeImage?id=' + id.value
}
onMounted(() => {});
</script>

<style scoped lang="less">
.login-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content:center;
  background-size: 200% 200%;
  align-items: center;
  // animation: move 30s ease infinite;
        @keyframes move {
          0% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 80% 25%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 50% 25%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
        background-image: url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F2020-08-04%2F5f292909b0e29.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654268553&t=8007e9d77ac16c59478751ebb0cc9ce6");
  .title{
    font-size: 50px;
    font-weight: bold;
    letter-spacing: 4px;
    margin-bottom: 20px;
  }
  
  .login-box {
    width: 50%;
    height: 400px;
   
    display: flex;
    justify-content: center;
    backdrop-filter: blur(5px);

    .form {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 40px;
      width: 50%;
      .btn {
        margin-top: 30px;
        width: 100%;
        border: none;
        &:hover {
          color: #fff;
        }
        color: #fff;
        background: linear-gradient(
          135deg,
          hsl(320deg, 80%, 70%),
          hsl(290deg, 80%, 70%),
          hsl(270deg, 80%, 70%),
          hsl(250deg, 80%, 70%),
          hsl(230deg, 80%, 70%),
          hsl(210deg, 80%, 70%),
          hsl(190deg, 80%, 70%),
          hsl(180deg, 80%, 70%)
        );
        background-size: 200% 200%;
        overflow: hidden;
        // animation: move 10s ease-in-out infinite;
        @keyframes move {
          0% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 100% 25%;
          }
          50% {
            background-position: 10% 100%;
          }
          75% {
            background-position: 50% 25%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
      }
      .code-box{
        display: flex;
        align-items: center;
        gap: 20px;
        img{
          flex-shrink: 0;
          
        }
      }
    }
  }
}
:deep(.el-form-item__label){
  color: #fff;
}
:deep(.el-radio__label){
  color: #fff;
}
</style>
