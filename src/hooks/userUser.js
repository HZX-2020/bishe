import service from "../utils/request";
import { useStore } from "@/store";

const store = useStore();

export const useUser = async (queryData) => {
    const { code, data, message } = await service({
      method: "POST",
      url:'/sms/system/login',
      data:queryData,
    });
    if (code == 200 && data) {
      store.token = data.token || null;
    } else {
      ElMessage.error(message)
    }

};