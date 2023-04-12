import service from '../utils/request'

export function getUserInfoByToken() {
  return service({
    method: "GET",
    url:'/sms/system/getInfoByToken',
  });
}
// 修改密码
export function updatePwd(data) {
  return service({
    method: "POST",
    url:`/sms/system/updatePwd/${data.oldPassword}/${data.password}`,
  });
}