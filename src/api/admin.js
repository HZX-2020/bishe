import service from "../utils/request";
// 查询管理员 分页
export function getAdminApi(pageNo = 1, pageSize = 10,name = '') {
  return service({
    method: "GET",
    url: `/sms/adminController/getAdminByOpr/${pageNo}/${pageSize}`,
    params: {
      name
    }
  });
}
// 查询所有班级列表

export function getAdminAllApi() {
  return service({
    method: "GET",
    url: `/sms/adminController/getAdminAll`,
  });
}
// 修改 保存 班级
export function saveOrUpdateAdminApi(data) {
  return service({
    method: "POST",
    url: `/sms/adminController/saveOrUpdateAdmin`,
    data
  });
}
// 删除班级
export function deleteAdminApi(data) {
  return service({
    method: "DELETE",
    url: `/sms/adminController/deleteAdmin`,
    data
  });
}
