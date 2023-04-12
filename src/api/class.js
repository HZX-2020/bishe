import service from "../utils/request";
// 查询班级 分页
export function getClassApi(pageNo = 1, pageSize = 10, gradeName = '',name = '') {
  return service({
    method: "GET",
    url: `/sms/classController/getClassByOpr/${pageNo}/${pageSize}`,
    params: {
      gradeName,
      name
    }
  });
}
// 查询所有班级列表

export function getClassAllApi() {
  return service({
    method: "GET",
    url: `/sms/classController/getClassAll`,
  });
}
// 修改 保存 班级
export function saveOrUpdateClassApi(data) {
  return service({
    method: "POST",
    url: `/sms/classController/saveOrUpdateClass`,
    data
  });
}
// 删除班级
export function deleteClassApi(data) {
  return service({
    method: "DELETE",
    url: `/sms/classController/deleteClass`,
    data
  });
}
