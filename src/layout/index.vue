<template>
<div class="common-layout">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Menu></Menu>
        </el-aside>
        <el-main class="content">
          <Suspense>
            
            <template v-slot:default>
              
              <router-view></router-view>

            </template>
            <template v-slot:fallback>
              加载中
            </template>


          </Suspense>
          </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang='ts'>
import {ref, reactive, toRefs, onMounted} from 'vue'
import { useStore } from "../store";
import { useRouter } from "vue-router"
const store = useStore();
const router = useRouter()
if(!store?.user && !localStorage.getItem("user")){
  router.push('/login')
}
onMounted(()=> {

})

</script>

<style scoped lang='less'>

</style>