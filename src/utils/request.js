import axios from 'axios'
import { useStore } from "@/store";
import { ElMessage } from 'element-plus'
const service = axios.create({
  baseURL:'/api',
  timeout: 10000,
  withCredentials: true,
})
service.interceptors.request.use( request => {
  const store = useStore()
  if(store.getToken) {
    request.headers.token = store.getToken
  }
  return request
})
// 响应拦截器
service.interceptors.response.use(res => {
  if (res.status === 200) {
     return res.data
   } else {
    ElMessage.error('服务器错误')
  }
})


export default service