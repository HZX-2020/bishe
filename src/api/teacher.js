import service from "../utils/request";
// 查询班级 分页
export function getTeacherApi(pageNo = 1, pageSize = 10, className = '',name = '') {
  return service({
    method: "GET",
    url: `/sms/teacherController/getTeacherByOpr/${pageNo}/${pageSize}`,
    params: {
      className,
      name
    }
  });
}
// 查询所有班级列表

export function getTeacherAllApi() {
  return service({
    method: "GET",
    url: `/sms/teacherController/getTeacherAll`,
  });
}
// 修改 保存 班级
export function saveOrUpdateTeacherApi(data) {
  return service({
    method: "POST",
    url: `/sms/teacherController/saveOrUpdateTeacher`,
    data
  });
}
// 删除班级
export function deleteTeacherApi(data) {
  return service({
    method: "DELETE",
    url: `/sms/teacherController/deleteTeacher`,
    data
  });
}
