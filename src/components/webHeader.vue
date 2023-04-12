<template>
  <header class="header">
    <div class="container">
      <img src="https://www.nenu.edu.cn/images/L1.png" alt="" />
      <div>
        <span class="title" @click="toPage('/demo')">demo</span>
        <span class="title" @click="toggleDark">{{y}}</span>
        
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, computed, watch } from "vue";
import { useDark, useToggle, useWindowScroll } from '@vueuse/core'
import { useRouter} from 'vue-router'
const {x,y} = useWindowScroll()
let bgColor = ref('rgba(123, 200, 255, 0.4)');
const router = useRouter()
onMounted(() => {
 

});
watch(y,(newVal, oldVal)=>{
  if(newVal > 0 ){
    bgColor.value = 'rgba(0, 0, 0, 0.4)'
    
  }else{
    bgColor.value = 'rgba(123, 200, 255, 0.4)'
  }
})
function toPage(path) {
  router.push(path)
}
 const isDark = useDark()
const toggleDark = useToggle(isDark)
 
  
</script>

<style scoped lang="less">
.header {
  // position: fixed;
  position: sticky;
  left: 0;
  top: 0;
  z-index: 10;
  height: 66px;
  width: 100%;
  backdrop-filter: blur(4px);
  background: v-bind(bgColor);
  transition: background 1s;
  .container {
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
