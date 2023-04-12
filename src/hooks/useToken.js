// import { getCurrentInstance } from "vue";
import service from "../utils/request";
import { useStore } from "@/store";
// import { useStorage, StorageSerializers } from "@vueuse/core";
// 使用全局方法$axios
// const { proxy }: any = getCurrentInstance(); //关键代码
// const Axios = proxy.$axios;

const store = useStore();
export const useToken = async (queryData) => {
  const { code, data, message } = await service({
    method: "POST",
    url: "/sms/system/login",
    data: queryData,
  });
  if (code == 200 && data) {
    store.token = data.token || null;
    // useStorage("token", data.token, undefined, {
    //   serializer: StorageSerializers.object,
    // });
    localStorage.setItem("token", data.token)
  } else {
    ElMessage.error(message);
  }
  return {code,data, message}
};
