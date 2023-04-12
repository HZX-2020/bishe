import service from "../utils/request";
// 查询学生列表 分页
export function getStudentApi(pageNo = 1, pageSize = 10, className = '',name = '') {
  return service({
    method: "GET",
    url: `/sms/studentController/getStudentByOpr/${pageNo}/${pageSize}`,
    params: {
      className,
      name
    }
  });
}
// 查询所有学生列表

export function getStudentAllApi() {
  return service({
    method: "GET",
    url: `/sms/studentController/getStudentAll`,
  });
}
// 修改 保存 学生
export function saveOrUpdateStudentApi(data) {
  return service({
    method: "POST",
    url: `/sms/studentController/saveOrUpdateStudent`,
    data
  });
}
// 删除学生
export function deleteStudentApi(data) {
  return service({
    method: "DELETE",
    url: `/sms/studentController/deleteStudent`,
    data
  });
}
